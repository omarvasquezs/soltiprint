<?php

namespace App\Services;

use App\Models\Machine;
use App\Models\Material;
use App\Models\QuoteItem;

class QuoteCalculatorService
{
    /**
     * Calculate the cost for a specific item and find the best machine.
     */
    public function calculate(QuoteItem $item): array
    {
        $machines = Machine::all();
        $paper = $item->material;
        
        $bestMachine = null;
        $lowestCost = PHP_FLOAT_MAX;
        $breakdown = [];

        foreach ($machines as $machine) {
            $cost = $this->calculateMachineCost($machine, $item, $paper);
            
            if ($cost['total'] < $lowestCost) {
                $lowestCost = $cost['total'];
                $bestMachine = $machine;
                $breakdown = $cost;
            }
        }

        return [
            'recommended_machine_id' => $bestMachine?->id,
            'calculated_cost' => $lowestCost,
            'details' => $breakdown,
        ];
    }

    private function calculateMachineCost(Machine $machine, QuoteItem $item, Material $paper): array
    {
        // 1. Paper Cost
        // Simplified: quantity * (A4s in sheet?) -> user simplified logic
        // Assume item size fits nicely for demo purposes.
        // E.g. A4 (210x297) fitting in SRA3 (320x450)?
        // Let's simplified: 1 sheet per item for now if not specified logic, 
        // OR better: calculate cuts per sheet.
        // $cuts = floor($machine->max_width_mm / $item->width_mm) * floor($machine->max_height_mm / $item->height_mm);
        // For demo, let's assume 1 sheet = 1 unit to avoid complex geometry logic, 
        // unless unit is small.
        // Let's use a standard imposition factor (e.g. 2 up, 4 up) if quantity is high.
        
        // Let's keep it clean: 
        $sheetsRequired = $item->quantity; // Worst case 1-up
        $paperCost = $sheetsRequired * $paper->cost_per_unit;

        if ($machine->isDigital()) {
            // Digital Cost
            $clicks = $sheetsRequired * ($item->colors_front > 0 ? 1 : 0) 
                    + $sheetsRequired * ($item->colors_back > 0 ? 1 : 0);
                    
            $clickRate = ($item->colors_front > 1 || $item->colors_back > 1) 
                        ? $machine->click_cost_color 
                        : $machine->click_cost_bw;
            
            $printingCost = $clicks * $clickRate;
            
            return [
                'total' => $paperCost + $printingCost,
                'paper' => $paperCost,
                'printing' => $printingCost,
                'fixed' => 0,
            ];
        } 
        
        if ($machine->isOffset()) {
            // Offset Cost
            // 1. Plates: (Colors Front + Colors Back)
            $plates = $item->colors_front + $item->colors_back;
            // Access plate cost from somewhere? Let's assume a constant or fetch "Plate" material
            $plateMaterial = Material::where('type', 'plate')->first();
            $plateCost = ($plateMaterial?->cost_per_unit ?? 25.00) * $plates;

            // 2. Setup (Make-ready)
            $setupCost = $machine->setup_time * $machine->hourly_rate;

            // 3. Run
            // Speed is sheets/hour
            $runHours = $sheetsRequired / max($machine->speed_sheets_per_hour, 1);
            $runCost = $runHours * $machine->hourly_rate;

            return [
                'total' => $paperCost + $plateCost + $setupCost + $runCost,
                'paper' => $paperCost,
                'printing' => $runCost,
                'fixed' => $plateCost + $setupCost,
            ];
        }

        return ['total' => PHP_FLOAT_MAX];
    }
}
