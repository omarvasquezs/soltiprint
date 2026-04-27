<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Machine;
use App\Models\Material;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin User
        User::firstOrCreate(
            ['email' => 'admin@logicprint.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
            ]
        );

        // 2. Machines
        // Offset Machine: High setup cost, low unit cost, fast.
        Machine::firstOrCreate(
            ['name' => 'Heidelberg Speedmaster XL 75'],
            [
                'type' => 'offset',
                'hourly_rate' => 120.00, // €120/hour
                'setup_time' => 0.5, // 30 mins setup
                'speed_sheets_per_hour' => 15000,
                'max_width_mm' => 750,
                'max_height_mm' => 530,
            ]
        );

        // Digital Machine: No setup, high unit cost (click), slow.
        Machine::firstOrCreate(
            ['name' => 'Konica Minolta AccurioPress'],
            [
                'type' => 'digital',
                'click_cost_bw' => 0.015,
                'click_cost_color' => 0.045,
                'max_width_mm' => 330,
                'max_height_mm' => 480,
            ]
        );

        // 3. Materials
        Material::firstOrCreate(
            ['name' => 'Coated Glossy 135g'],
            [
                'type' => 'paper',
                'cost_per_unit' => 0.02, // per sheet (SRA3 approx)
                'unit' => 'sheet',
                'grammage' => 135,
            ]
        );

        Material::firstOrCreate(
            ['name' => 'Uncoated Offset 90g'],
            [
                'type' => 'paper',
                'cost_per_unit' => 0.01,
                'unit' => 'sheet',
                'grammage' => 90,
            ]
        );

        Material::firstOrCreate(
            ['name' => 'CTP Plate'],
            [
                'type' => 'plate',
                'cost_per_unit' => 15.00,
                'unit' => 'unit',
            ]
        );

        // 4. Customer
        Customer::firstOrCreate(
            ['email' => 'contact@acme.com'],
            [
                'name' => 'Acme Corp',
                'vat_number' => 'B12345678',
                'address' => '123 Business Rd, Madrid',
            ]
        );
    }
}
