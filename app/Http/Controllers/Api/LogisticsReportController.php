<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogisticsReportController extends Controller
{
    public function purchasesBySupplier()
    {
        return PurchaseOrder::select('supplier_id', DB::raw('SUM(total_amount) as total_purchased'), DB::raw('COUNT(*) as order_count'))
            ->groupBy('supplier_id')
            ->with('supplier')
            ->orderByDesc('total_purchased')
            ->get();
    }

    public function supplierReport(Request $request)
    {
        $query = \App\Models\Supplier::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('tax_id', 'like', "%{$search}%");
            });
        }

        // Eager load stats using subqueries or relationships if defined, 
        // but for now let's just use withCount and aggregate manually or via a closure if needed.
        // Or better, assume we want basic details + potential aggregate info.
        
        $suppliers = $query->withCount('purchaseOrders as order_count')
            ->withSum('purchaseOrders as total_purchased', 'total_amount')
            ->withMax('purchaseOrders as last_purchase_date', 'date')
            ->get();
            
        return $suppliers;
    }

    public function materialStats()
    {
        // Most purchased materials
        return PurchaseOrderItem::select('material_id', DB::raw('SUM(quantity) as total_quantity'), DB::raw('SUM(total_price) as total_spent'))
            ->groupBy('material_id')
            ->with('material')
            ->orderByDesc('total_quantity')
            ->get();
    }
}
