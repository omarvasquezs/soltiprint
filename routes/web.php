<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CompanyController;
use App\Http\Middleware\CheckCompany;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/company/selection', [CompanyController::class, 'select'])->name('company.selection');
    Route::post('/company/create', [CompanyController::class, 'store'])->name('company.store');
    Route::post('/company/set/{company}', [CompanyController::class, 'setCompany'])->name('company.set');
});

Route::middleware(['auth', 'verified', CheckCompany::class])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

   Route::get('/customers', function () { return Inertia::render('Customers'); })->name('customers');
   Route::get('/machines', function () { return Inertia::render('Machines'); })->name('machines');
   Route::get('/materials', function () { return Inertia::render('Materials'); })->name('materials');
   Route::get('/quotes', function () { return Inertia::render('Quotes'); })->name('quotes');
   Route::get('/work-orders', function () { return Inertia::render('WorkOrders'); })->name('work-orders');

    Route::get('/accounting', function () { return Inertia::render('Accounting'); })->name('accounting');
    Route::get('/accounting/invoices', function () { return Inertia::render('Accounting/Invoices'); })->name('accounting.invoices');
    Route::get('/accounting/expenses', function () { return Inertia::render('Accounting/Expenses'); })->name('accounting.expenses');
    Route::get('/accounting/suppliers', function () { return Inertia::render('Accounting/Suppliers'); })->name('accounting.suppliers');

    // Logistics
    Route::get('/logistics', function () { return Inertia::render('Logistics/Index'); })->name('logistics.index');
    Route::get('/logistics/purchase-orders', function () { return Inertia::render('Logistics/PurchaseOrders/Index'); })->name('logistics.purchase-orders');
    Route::get('/logistics/inventory', function () { return Inertia::render('Logistics/Inventory/Index'); })->name('logistics.inventory');
    Route::get('/logistics/reports/suppliers', function () { return Inertia::render('Logistics/Reports/Suppliers'); })->name('logistics.reports.suppliers');
    Route::get('/logistics/reports', function () { return Inertia::render('Logistics/Reports/Index'); })->name('logistics.reports');
});

require __DIR__.'/auth.php';
