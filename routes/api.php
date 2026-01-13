<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CustomerController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('customers', CustomerController::class);
Route::apiResource('machines', \App\Http\Controllers\Api\MachineController::class);
Route::apiResource('materials', \App\Http\Controllers\Api\MaterialController::class);
Route::apiResource('quotes', \App\Http\Controllers\Api\QuoteController::class);
Route::apiResource('work-orders', \App\Http\Controllers\Api\WorkOrderController::class);

// Accounting Module
Route::apiResource('suppliers', \App\Http\Controllers\Api\SupplierController::class);
Route::apiResource('invoices', \App\Http\Controllers\Api\InvoiceController::class);
Route::apiResource('expenses', \App\Http\Controllers\Api\ExpenseController::class);
Route::post('payments', [\App\Http\Controllers\Api\PaymentController::class, 'store']); // Only creating payments for now

// Accounting Reports
Route::get('reports/financial', [\App\Http\Controllers\Api\AccountingReportController::class, 'financialStatement']);
Route::get('reports/ledger', [\App\Http\Controllers\Api\AccountingReportController::class, 'ledger']);
Route::get('reports/sales', [\App\Http\Controllers\Api\AccountingReportController::class, 'salesRegister']);
Route::get('reports/purchases', [\App\Http\Controllers\Api\AccountingReportController::class, 'purchaseRegister']);
