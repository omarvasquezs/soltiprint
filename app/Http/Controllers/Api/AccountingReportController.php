<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountingReportController extends Controller
{
    // Estado Financiero (Summarized)
    public function financialStatement()
    {
        $totalSales = Invoice::sum('total');
        $totalExpenses = Expense::sum('total');
        
        $paidSales = Invoice::where('status', 'paid')->sum('total');
        $paidExpenses = Expense::where('status', 'paid')->sum('total');

        return response()->json([
            'income' => [
                'invoiced' => $totalSales,
                'collected' => $paidSales,
            ],
            'expenses' => [
                'billed' => $totalExpenses,
                'paid' => $paidExpenses,
            ],
            'net_profit' => $totalSales - $totalExpenses,
            'cash_flow' => $paidSales - $paidExpenses,
        ]);
    }

    // Libro Diario (Chronological Ledger of all movements)
    public function ledger()
    {
        // Union of Invoices and Expenses for a timeline
        $sales = Invoice::select(
            'id', 
            DB::raw("'income' as type"), 
            'issue_date as date', 
            'series', 
            'number', 
            DB::raw("CONCAT('Venta: ', series, '-', number) as description"),
            'total as amount'
        )->get();

        $purchases = Expense::select(
            'id', 
            DB::raw("'expense' as type"), 
            'issue_date as date', 
            'series', 
            'number', 
            DB::raw("CONCAT('Compra: ', description) as description"),
            'total as amount'
        )->get();

        $ledger = $sales->concat($purchases)->sortByDesc('date')->values();

        return response()->json($ledger);
    }

    // Registro de Ventas (SUNAT Format approximation)
    public function salesRegister()
    {
        $sales = Invoice::with('customer')
            ->orderBy('issue_date')
            ->get()
            ->map(function($invoice) {
                return [
                    'date' => $invoice->issue_date->format('d/m/Y'),
                    'document_type' => $invoice->document_type,
                    'serial' => $invoice->series,
                    'number' => $invoice->number,
                    'customer_id_type' => '6', // RUC usually
                    'customer_id' => $invoice->customer->tax_id,
                    'customer_name' => $invoice->customer->name,
                    'subtotal' => $invoice->subtotal,
                    'igv' => $invoice->tax,
                    'total' => $invoice->total,
                ];
            });

        return response()->json($sales);
    }

    // Registro de Compras (SUNAT Format approximation)
    public function purchaseRegister()
    {
        $purchases = Expense::with('supplier')
            ->orderBy('issue_date')
            ->get()
            ->map(function($expense) {
                return [
                    'date' => $expense->issue_date->format('d/m/Y'),
                    'document_type' => $expense->document_type, // '01' Factura usually
                    'serial' => $expense->series,
                    'number' => $expense->number,
                    'supplier_id_type' => '6',
                    'supplier_id' => $expense->supplier->tax_id,
                    'supplier_name' => $expense->supplier->name,
                    'subtotal' => $expense->subtotal,
                    'igv' => $expense->tax,
                    'total' => $expense->total,
                ];
            });

        return response()->json($purchases);
    }
}
