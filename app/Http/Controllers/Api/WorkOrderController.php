<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    public function index()
    {
        return response()->json(WorkOrder::with(['quote.customer'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'quote_id' => 'required|exists:quotes,id|unique:work_orders,quote_id',
        ]);

        $workOrder = WorkOrder::create([
            'quote_id' => $validated['quote_id'],
            'status' => 'pending',
            'start_date' => now(),
        ]);

        return response()->json($workOrder->load('quote.customer'), 201);
    }

    public function show(WorkOrder $workOrder)
    {
        return response()->json($workOrder->load(['quote.customer', 'quote.items']));
    }

    public function update(Request $request, WorkOrder $workOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,prepress,printing,finishing,completed',
            'completion_date' => 'nullable|date',
        ]);

        $workOrder->update($validated);

        return response()->json($workOrder->load('quote'));
    }

    public function destroy(WorkOrder $workOrder)
    {
        $workOrder->delete();
        return response()->json(null, 204);
    }
}
