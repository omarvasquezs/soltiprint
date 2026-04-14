<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    public function index()
    {
        return response()->json(Material::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:paper,ink,plate,chemical,other',
            'cost_per_unit' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50', // e.g., 'sheet', 'kg', 'liter'
            'stock_quantity' => 'nullable|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'grammage' => 'nullable|integer|min:0',
            'width_mm' => 'nullable|integer|min:0',
            'height_mm' => 'nullable|integer|min:0',
        ]);

        $material = Material::create($validated);

        return response()->json($material, 201);
    }

    public function show(Material $material)
    {
        return response()->json($material);
    }

    public function update(Request $request, Material $material)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:paper,ink,plate,chemical,other',
            'cost_per_unit' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'stock_quantity' => 'nullable|integer|min:0',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'grammage' => 'nullable|integer|min:0',
            'width_mm' => 'nullable|integer|min:0',
            'height_mm' => 'nullable|integer|min:0',
        ]);

        $material->update($validated);

        return response()->json($material);
    }

    public function destroy(Material $material)
    {
        $material->delete();
        return response()->json(null, 204);
    }
}
