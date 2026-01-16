<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    public function index()
    {
        // PurchaseOrder::all() automatically scoped by tenant
        return PurchaseOrder::with('supplier')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|exists:materials,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $lastOrder = PurchaseOrder::latest('id')->first();
            $nextId = $lastOrder ? $lastOrder->id + 1 : 1;
            $code = 'OC-' . date('Y') . '-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            $order = PurchaseOrder::create([
                'supplier_id' => $validated['supplier_id'],
                'user_id' => $request->user()->id,
                'code' => $code,
                'date' => $validated['date'],
                'status' => 'ordered', // Directly ordered for simplicity
                'notes' => $validated['notes'] ?? null,
                'total_amount' => 0,
            ]);

            $total = 0;
            foreach ($validated['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_price'];
                $total += $lineTotal;

                PurchaseOrderItem::create([
                    'purchase_order_id' => $order->id,
                    'material_id' => $item['material_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $lineTotal,
                ]);

                // Create Inventory Movement (Purchase Received)
                InventoryMovement::create([
                    'material_id' => $item['material_id'],
                    'user_id' => $request->user()->id,
                    'type' => 'purchase_received',
                    'quantity' => $item['quantity'],
                    'reference_type' => PurchaseOrder::class,
                    'reference_id' => $order->id,
                    'description' => 'Purchase Order ' . $code,
                ]);
            }

            $order->update(['total_amount' => $total]);

            return $order;
        });
    }

    public function show($id)
    {
        return PurchaseOrder::with(['items.material', 'supplier'])->findOrFail($id);
    }
}
