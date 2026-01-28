<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    public function index()
    {
        return response()->json(Machine::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:offset,offset_continuous,digital,plotter,reprographics,screen_print',
            'hourly_rate' => 'required|numeric|min:0',
            'setup_time' => 'nullable|numeric|min:0', // in hours
            'speed_sheets_per_hour' => 'nullable|integer|min:0',
            'click_cost_bw' => 'nullable|numeric|min:0',
            'click_cost_color' => 'nullable|numeric|min:0',
            'max_width' => 'nullable|integer|min:0',
            'max_height' => 'nullable|integer|min:0',
            // 'description' => 'nullable|string', // Column missing in DB
        ]);

        // Default nullable numeric fields to 0 as DB columns are NOT NULL
        $validated['setup_time'] = $validated['setup_time'] ?? 0;
        $validated['speed_sheets_per_hour'] = $validated['speed_sheets_per_hour'] ?? 0;
        $validated['click_cost_bw'] = $validated['click_cost_bw'] ?? 0;
        $validated['click_cost_color'] = $validated['click_cost_color'] ?? 0;

        $machine = Machine::create($validated);

        return response()->json($machine, 201);
    }

    public function show(Machine $machine)
    {
        return response()->json($machine);
    }

    public function update(Request $request, Machine $machine)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:offset,offset_continuous,digital,plotter,reprographics,screen_print',
            'hourly_rate' => 'required|numeric|min:0',
            'setup_time' => 'nullable|numeric|min:0',
            'speed_sheets_per_hour' => 'nullable|integer|min:0',
            'click_cost_bw' => 'nullable|numeric|min:0',
            'click_cost_color' => 'nullable|numeric|min:0',
            'max_width' => 'nullable|integer|min:0',
            'max_height' => 'nullable|integer|min:0',
            // 'description' => 'nullable|string',
        ]);

        // Default nullable numeric fields to 0
        $validated['setup_time'] = $validated['setup_time'] ?? 0;
        $validated['speed_sheets_per_hour'] = $validated['speed_sheets_per_hour'] ?? 0;
        $validated['click_cost_bw'] = $validated['click_cost_bw'] ?? 0;
        $validated['click_cost_color'] = $validated['click_cost_color'] ?? 0;

        $machine->update($validated);

        return response()->json($machine);
    }

    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(null, 204);
    }
}
