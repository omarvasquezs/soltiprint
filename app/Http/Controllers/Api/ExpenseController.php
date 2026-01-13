<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return response()->json(Expense::with(['supplier', 'payments'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'series' => 'required|string|max:10',
            'number' => 'required|string|max:20',
            'issue_date' => 'required|date',
            'description' => 'required|string|max:255',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'category' => 'in:Material,Service,Asset',
        ]);

        $expense = Expense::create($validated);

        return response()->json($expense->load('supplier'), 201);
    }

    public function show(Expense $expense)
    {
        return response()->json($expense->load(['supplier', 'payments']));
    }

    public function update(Request $request, Expense $expense)
    {
        // Expenses are usually not editable after creation in strict systems, but we allow simple edits
        $validated = $request->validate([
            'description' => 'string|max:255',
            'category' => 'in:Material,Service,Asset',
        ]);

        $expense->update($validated);

        return response()->json($expense->load('supplier'));
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(null, 204);
    }
}
