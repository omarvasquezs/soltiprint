<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        return response()->json(Invoice::with(['customer', 'payments'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'quote_id' => 'nullable|exists:quotes,id',
            'series' => 'required|string|max:10',
            'number' => 'required|string|max:20',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'status' => 'in:pending,paid,cancelled',
        ]);

        $invoice = Invoice::create($validated);

        return response()->json($invoice->load('customer'), 201);
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice->load(['customer', 'payments']));
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'status' => 'in:pending,paid,cancelled',
            'due_date' => 'nullable|date',
        ]);

        $invoice->update($validated);

        return response()->json($invoice->load('customer'));
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return response()->json(null, 204);
    }
}
