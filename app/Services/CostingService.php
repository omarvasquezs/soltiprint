<?php

namespace App\Services;

use App\Models\Machine;
use App\Models\Material;

class CostingService
{
    /**
     * Analyze costs for different machines based on quote specifications
     */
    public function analyzeCosts(array $quoteData): array
    {
        $format = $quoteData['format'] ?? '';
        $inks = $quoteData['inks'] ?? '';
        $paperType = $quoteData['paperType'] ?? '';
        $grammage = $quoteData['grammage'] ?? '';
        $copies = (int) ($quoteData['copies'] ?? 1000);

        // Get compatible machines based on format
        $machines = $this->getCompatibleMachines($format);

        $results = [];
        $lowestCost = null;

        foreach ($machines as $machine) {
            $cost = $this->calculateMachineCost($machine, $quoteData);

            if ($lowestCost === null) {
                $lowestCost = $cost;
            }

            $overcost = null;
            if ($cost > $lowestCost) {
                $overcostPercent = (($cost - $lowestCost) / $lowestCost) * 100;
                $overcost = sprintf('+%.2f%%', $overcostPercent);
            }

            // Determine press format based on machine and job
            $pressFormat = $this->determinePressFormat($machine, $format, $copies);

            $results[] = [
                'machine_id' => $machine->id,
                'machine_name' => $machine->name,
                'cost' => round($cost, 2),
                'overcost' => $overcost,
                'press_format' => $pressFormat,
                'paper_size' => $this->getPaperSize($paperType, $grammage),
                'media_id' => $this->getMediaId($paperType, $grammage),
            ];
        }

        // Sort by cost (cheapest first)
        usort($results, fn($a, $b) => $a['cost'] <=> $b['cost']);

        return $results;
    }

    private function getCompatibleMachines(string $format): array
    {
        // For now, return all machines
        $machines = Machine::orderBy('name')->get();

        if ($machines->isEmpty()) {
            // Return mock machines if none configured
            return $this->getMockMachines();
        }

        return $machines->toArray();
    }

    private function calculateMachineCost(Machine|array $machine, array $quoteData): float
    {
        $machineData = is_array($machine) ? $machine : $machine->toArray();

        $copies = (int) ($quoteData['copies'] ?? 1000);
        $pages = (int) ($quoteData['pages'] ?: 1);

        // Use actual DB fields
        $hourlyRate = $machineData['hourly_rate'] ?? 50.00;
        $speedSheetsPerHour = $machineData['speed_sheets_per_hour'] ?? 5000;

        $totalSheets = $copies * $pages;
        $hours = $speedSheetsPerHour > 0 ? ($totalSheets / $speedSheetsPerHour) : 0.1;
        $machineCost = $hours * $hourlyRate;

        // Add material cost estimate
        $materialCost = $this->estimateMaterialCost($quoteData, $copies);

        return $machineCost + $materialCost;
    }

    private function estimateMaterialCost(array $quoteData, int $copies): float
    {
        // Simplified material cost: paper + ink
        $paperType = $quoteData['paperType'] ?? 'BOND';
        $grammage = $quoteData['grammage'] ?? '125';

        // Rough estimate: $0.05 per sheet for standard paper
        $costPerSheet = 0.05;

        if ((int) $grammage > 150) {
            $costPerSheet *= 1.5; // Heavier paper costs more
        }

        return $costPerSheet * $copies;
    }

    private function determinePressFormat(Machine|array $machine, string $finishFormat, int $copies): string
    {
        $machineData = is_array($machine) ? $machine : $machine->toArray();

        // Simple ups calculation - in reality would be more complex
        $ups = rand(2, 8); // Number of finished pieces per press sheet
        $sheetsNeeded = ceil($copies / $ups);

        // Determine press size based on machine dimensions
        $machineW = isset($machineData['max_width_mm']) ? $machineData['max_width_mm'] / 10 : 64;
        $machineH = isset($machineData['max_height_mm']) ? $machineData['max_height_mm'] / 10 : 90;

        if ($machineW <= 36) {
            $pressSize = '32x45';
        } elseif ($machineW <= 52) {
            $pressSize = '45x64';
        } elseif ($machineW <= 70) {
            $pressSize = '65x90';
        } else {
            $pressSize = intval($machineW) . 'x' . intval($machineH);
        }

        return "{$pressSize} ({$sheetsNeeded} x {$ups})";
    }

    private function getPaperSize(string $paperType, string $grammage): string
    {
        // Return common paper sizes based on type
        $paperUpper = strtoupper($paperType);

        if (str_contains($paperUpper, 'BOND') || str_contains($paperUpper, 'OFFSET')) {
            return '45x64';
        } elseif (str_contains($paperUpper, 'COATED') || str_contains($paperUpper, 'COUCHE')) {
            return '65x90';
        } elseif (str_contains($paperUpper, 'BRISTOL') || str_contains($paperUpper, 'CARD')) {
            return '70x100';
        }

        return '45x64'; // Default
    }

    private function getMediaId(string $paperType, string $grammage): string
    {
        // Generate media ID like "BOND125-45"
        $prefix = strtoupper(substr(preg_replace('/[^a-zA-Z]/', '', $paperType), 0, 6));
        $gramNum = preg_replace('/[^0-9]/', '', $grammage);
        $size = explode('x', $this->getPaperSize($paperType, $grammage))[0];

        return "{$prefix}{$gramNum}-{$size}";
    }

    private function getMockMachines(): array
    {
        return [
            (object) [
                'id' => 1,
                'name' => 'HEIDE1C36',
                'cost_per_hour' => 45,
                'speed_pph' => 6000,
                'status' => 'active',
            ],
            (object) [
                'id' => 2,
                'name' => 'HEIDE1C52',
                'cost_per_hour' => 50,
                'speed_pph' => 5500,
                'status' => 'active',
            ],
            (object) [
                'id' => 3,
                'name' => 'INDIGO-50',
                'cost_per_hour' => 60,
                'speed_pph' => 4000,
                'status' => 'active',
            ],
        ];
    }
}
