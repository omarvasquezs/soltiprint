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
            'type' => 'required|in:offset,digital,plotter,other',
            'hourly_rate' => 'required|numeric|min:0',
            'setup_time' => 'nullable|numeric|min:0', // in minutes
            'click_cost_bw' => 'nullable|numeric|min:0',
            'click_cost_color' => 'nullable|numeric|min:0',
            'max_width_mm' => 'nullable|integer|min:0',
            'max_height_mm' => 'nullable|integer|min:0',
        ]);

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
            'type' => 'required|in:offset,digital,plotter,other',
            'hourly_rate' => 'required|numeric|min:0',
            'setup_time' => 'nullable|numeric|min:0',
            'click_cost_bw' => 'nullable|numeric|min:0',
            'click_cost_color' => 'nullable|numeric|min:0',
            'max_width_mm' => 'nullable|integer|min:0',
            'max_height_mm' => 'nullable|integer|min:0',
        ]);

        $machine->update($validated);

        return response()->json($machine);
    }

    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(null, 204);
    }
}
