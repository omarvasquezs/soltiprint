<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payable_type' => 'required|in:invoice,expense',
            'payable_id' => 'required|integer',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'method' => 'required|string',
            'reference_number' => 'nullable|string',
        ]);

        $model = $validated['payable_type'] === 'invoice' ? Invoice::class : Expense::class;
        $payable = $model::findOrFail($validated['payable_id']);

        $payment = $payable->payments()->create([
            'amount' => $validated['amount'],
            'payment_date' => $validated['payment_date'],
            'method' => $validated['method'],
            'reference_number' => $validated['reference_number'],
        ]);

        // Auto-update status if fully paid (simplified logic)
        $totalPaid = $payable->payments()->sum('amount');
        if ($totalPaid >= $payable->total) {
            $payable->update(['status' => 'paid']);
        }

        return response()->json($payment, 201);
    }
}
