<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use App\Models\Customer;
use App\Services\CostingService;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    protected $costingService;

    public function __construct(CostingService $costingService)
    {
        $this->costingService = $costingService;
    }
    public function index()
    {
        return response()->json(Quote::with('customer')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'title' => 'nullable|string',
            'copies' => 'nullable|integer',
            'state' => 'nullable|string',
            'total_amount' => 'nullable|numeric',
        ]);

        // Get customer for reference
        $customer = Customer::find($validated['customer_id']);

        // Generate auto-reference like "Quote 5024: Artiz Design"
        $nextNumber = Quote::max('id') + 1;
        $reference = "Quote {$nextNumber}: " . ($customer ? $customer->name : 'Unknown');

        $quote = Quote::create([
            'customer_id' => $validated['customer_id'],
            'reference' => $reference,
            'title' => $validated['title'] ?? 'GENERAL',
            'state' => $validated['state'] ?? 'Draft',
            'copies' => $validated['copies'] ?? 0,
            'total_amount' => $validated['total_amount'] ?? 0,
            'status' => 'draft', // keep for backwards compat

            // Work definition fields
            'finish_format' => $request->input('finish_format'),
            'inks' => $request->input('inks'),
            'pages' => $request->input('pages'),
            'precut' => $request->input('precut'),
            'printing_type' => $request->input('printing_type'),
            'press_format' => $request->input('press_format'),
            'machine_id' => $request->input('machine_id'),

            // Paper details
            'paper_type' => $request->input('paper_type'),
            'grammage' => $request->input('grammage'),
            'paper_dimensions' => $request->input('paper_dimensions'),
            'manufacturer' => $request->input('manufacturer'),
            'article_id' => $request->input('article_id'),

            // Financial fields
            'cost_materials' => $request->input('cost_materials'),
            'cost_operations' => $request->input('cost_operations'),
            'total_cost' => $request->input('total_cost'),
            'margin' => $request->input('margin'),
            'profit' => $request->input('profit'),
            'unit_price' => $request->input('unit_price'),

            'notes' => $request->input('notes'),
        ]);

        return response()->json($quote->load('customer'), 201);
    }

    public function analyzeCosts(Request $request)
    {
        $quoteData = $request->all();

        try {
            $machines = $this->costingService->analyzeCosts($quoteData);

            return response()->json([
                'analysis_id' => rand(1000, 9999),
                'machines' => $machines,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Cost analysis failed',
                'message' => $e->getMessage()
            ], 500);
        }
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
