<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryMovement;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index()
    {
        // Return latest movements
        return InventoryMovement::with(['material', 'user'])->latest()->limit(100)->get();
    }

    public function stock()
    {
        // Return calculated stock per material
        // We can group by material_id and sum quantity
        
        $stock = InventoryMovement::select('material_id', DB::raw('SUM(quantity) as current_stock'))
            ->groupBy('material_id')
            ->with('material')
            ->get();
            
        return $stock;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'type' => 'required|in:manual_in,manual_out',
            'quantity' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        $quantity = $validated['quantity'];
        if ($validated['type'] === 'manual_out') {
            $quantity = -$quantity;
        }

        $movement = InventoryMovement::create([
            'material_id' => $validated['material_id'],
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'quantity' => $quantity,
            'description' => $validated['description'],
        ]);

        return $movement;
    }
}
