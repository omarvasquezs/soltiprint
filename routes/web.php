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

    Route::get('/customers', function () {
        return Inertia::render('Customers');
    })->name('customers');
    Route::get('/machines', function () {
        return Inertia::render('Machines');
    })->name('machines');
    Route::get('/materials', function () {
        return Inertia::render('Materials');
    })->name('materials');
    Route::get('/quotes', function () {
        return Inertia::render('Quotes');
    })->name('quotes');
    Route::get('/services/third-party', function () {
        return Inertia::render('Services/ThirdParty');
    })->name('services.third-party');
    Route::get('/services/laser-die-cuts', function () {
        return Inertia::render('Services/LaserDieCuts');
    })->name('services.laser-die-cuts');

    Route::get('/work-orders', function () {
        return Inertia::render('WorkOrders');
    })->name('work-orders');

    Route::get('/accounting', function () {
        return Inertia::render('Accounting');
    })->name('accounting');
    Route::get('/accounting/invoices', function () {
        return Inertia::render('Accounting/Invoices');
    })->name('accounting.invoices');
    Route::get('/accounting/expenses', function () {
        return Inertia::render('Accounting/Expenses');
    })->name('accounting.expenses');
    Route::get('/accounting/suppliers', function () {
        return Inertia::render('Accounting/Suppliers');
    })->name('accounting.suppliers');

    // Logistics
    Route::get('/logistics', function () {
        return Inertia::render('Logistics/Index');
    })->name('logistics.index');
    Route::get('/logistics/purchase-orders', function () {
        return Inertia::render('Logistics/PurchaseOrders/Index');
    })->name('logistics.purchase-orders');
    Route::get('/logistics/inventory', function () {
        return Inertia::render('Logistics/Inventory/Index');
    })->name('logistics.inventory');
    Route::get('/logistics/reports/suppliers', function () {
        return Inertia::render('Logistics/Reports/Suppliers');
    })->name('logistics.reports.suppliers');
    Route::get('/logistics/reports', function () {
        return Inertia::render('Logistics/Reports/Index');
    })->name('logistics.reports');

    // Configuration
    Route::get('/configuration', function () {
        return Inertia::render('Configuration/Index');
    })->name('configuration.index');
    Route::post('/configuration', [\App\Http\Controllers\ConfigurationController::class, 'update'])->name('configuration.update');

    // API Routes (moved from api.php to share session auth)
    Route::prefix('api')->group(function () {
        Route::apiResource('customers', \App\Http\Controllers\Api\CustomerController::class);
        Route::apiResource('machines', \App\Http\Controllers\Api\MachineController::class);
        Route::apiResource('materials', \App\Http\Controllers\Api\MaterialController::class);
        Route::apiResource('users', \App\Http\Controllers\Api\UserController::class)->only(['index']);

        // Quote routes
        Route::post('quotes/analyze-costs', [\App\Http\Controllers\Api\QuoteController::class, 'analyzeCosts']);
        Route::apiResource('quotes', \App\Http\Controllers\Api\QuoteController::class);
        
        // Services routes
        Route::apiResource('third-party-services', \App\Http\Controllers\Api\ThirdPartyServiceController::class);
        Route::apiResource('laser-die-cuts', \App\Http\Controllers\Api\LaserDieCutController::class);

        Route::apiResource('work-orders', \App\Http\Controllers\Api\WorkOrderController::class);

        // Accounting Module
        Route::apiResource('suppliers', \App\Http\Controllers\Api\SupplierController::class);
        Route::apiResource('invoices', \App\Http\Controllers\Api\InvoiceController::class);
        Route::apiResource('expenses', \App\Http\Controllers\Api\ExpenseController::class);
        Route::apiResource('payments', \App\Http\Controllers\Api\PaymentController::class);

        // Logistics Module
        Route::apiResource('purchase-orders', \App\Http\Controllers\Api\PurchaseOrderController::class);
        Route::post('inventory/movement', [\App\Http\Controllers\Api\InventoryController::class, 'store']);
        Route::get('inventory/movements', [\App\Http\Controllers\Api\InventoryController::class, 'index']);
        Route::get('inventory/stock', [\App\Http\Controllers\Api\InventoryController::class, 'stock']);

        // Reports
        Route::get('reports/accounting/financial-statement', [\App\Http\Controllers\Api\AccountingReportController::class, 'financialStatement']);
        Route::get('reports/logistics/purchases-by-supplier', [\App\Http\Controllers\Api\LogisticsReportController::class, 'purchasesBySupplier']);
        Route::get('reports/logistics/suppliers-detail', [\App\Http\Controllers\Api\LogisticsReportController::class, 'supplierReport']);
        Route::get('reports/logistics/material-stats', [\App\Http\Controllers\Api\LogisticsReportController::class, 'materialStats']);
        Route::get('reports/ledger', [\App\Http\Controllers\Api\AccountingReportController::class, 'ledger']);
        Route::get('reports/sales', [\App\Http\Controllers\Api\AccountingReportController::class, 'salesRegister']);
        Route::get('reports/purchases', [\App\Http\Controllers\Api\AccountingReportController::class, 'purchaseRegister']);
    });
});

require __DIR__ . '/auth.php';
