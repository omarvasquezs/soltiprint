<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaserDieCut;
use Illuminate\Http\Request;

class LaserDieCutController extends Controller
{
    public function index()
    {
        return response()->json(LaserDieCut::with(['customer', 'material', 'commercialAdvisor'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
            'op' => 'nullable|string|max:255',
            'commercial_advisor_id' => 'nullable|exists:users,id',
            'customer_id' => 'nullable|exists:customers,id',
            'material_id' => 'nullable|exists:materials,id',
            'design_type' => 'nullable|string|max:255',
            'cm' => 'nullable|numeric',
            'factor' => 'nullable|numeric',
            'total_amount' => 'nullable|numeric',
            'invoice_number' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'observations' => 'nullable|string',
        ]);

        $item = LaserDieCut::create($validated);

        return response()->json($item, 201);
    }

    public function show(string $id)
    {
        return response()->json(LaserDieCut::with(['customer', 'material', 'commercialAdvisor'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $item = LaserDieCut::findOrFail($id);

        $validated = $request->validate([
            'date' => 'nullable|date',
            'op' => 'nullable|string|max:255',
            'commercial_advisor_id' => 'nullable|exists:users,id',
            'customer_id' => 'nullable|exists:customers,id',
            'material_id' => 'nullable|exists:materials,id',
            'design_type' => 'nullable|string|max:255',
            'cm' => 'nullable|numeric',
            'factor' => 'nullable|numeric',
            'total_amount' => 'nullable|numeric',
            'invoice_number' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'observations' => 'nullable|string',
        ]);

        $item->update($validated);

        return response()->json($item);
    }

    public function destroy(string $id)
    {
        LaserDieCut::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
