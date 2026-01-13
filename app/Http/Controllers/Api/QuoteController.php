<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        return response()->json(Quote::with('customer')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'title' => 'required|string|max:255',
            'margin_percent' => 'numeric|min:0',
            // Simple total cost input for now, ideally calculated from items
            'total_cost' => 'numeric|min:0', 
        ]);

        // Auto-calculate final price
        $margin = $validated['margin_percent'] ?? 30;
        $cost = $validated['total_cost'] ?? 0;
        $finalPrice = $cost * (1 + ($margin / 100));

        $quote = Quote::create([
            'customer_id' => $validated['customer_id'],
            'title' => $validated['title'],
            'status' => 'draft',
            'total_cost' => $cost,
            'margin_percent' => $margin,
            'final_price' => $finalPrice,
            'reference' => 'Q-' . time(), // Simple reference generation
        ]);

        return response()->json($quote->load('customer'), 201);
    }

    public function show(Quote $quote)
    {
        return response()->json($quote->load(['customer', 'items']));
    }

    public function update(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'status' => 'in:draft,sent,accepted,rejected',
            'total_cost' => 'numeric|min:0',
            'margin_percent' => 'numeric|min:0',
        ]);

        if (isset($validated['total_cost']) || isset($validated['margin_percent'])) {
            $cost = $validated['total_cost'] ?? $quote->total_cost;
            $margin = $validated['margin_percent'] ?? $quote->margin_percent;
            $validated['final_price'] = $cost * (1 + ($margin / 100));
        }

        $quote->update($validated);

        return response()->json($quote->load('customer'));
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();
        return response()->json(null, 204);
    }
}
