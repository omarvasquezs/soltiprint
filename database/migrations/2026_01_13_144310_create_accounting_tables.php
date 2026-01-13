<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Suppliers Table
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('tax_id')->nullable(); // RUC
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->timestamps();
        });

        // Invoices Table (Ingresos Facturados / Ventas)
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('quote_id')->nullable()->constrained()->nullOnDelete();
            $table->string('document_type')->default('FACTURA'); // FACTURA, BOLETA, NOTA_CREDITO
            $table->string('series');
            $table->string('number');
            $table->date('issue_date');
            $table->date('due_date')->nullable();
            $table->string('currency')->default('PEN');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2); // IGV
            $table->decimal('total', 10, 2);
            $table->string('status')->default('pending'); // pending, paid, cancelled
            $table->timestamps();
        });

        // Expenses Table (Registro de Compras)
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained();
            $table->string('document_type')->default('FACTURA');
            $table->string('series');
            $table->string('number');
            $table->date('issue_date');
            $table->string('description');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('tax', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('category')->default('Material'); // Material, Service, Asset
            $table->string('status')->default('pending'); // pending, paid
            $table->timestamps();
        });

        // Payments Table (Conciliación)
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->morphs('payable'); // invoice_id or expense_id
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->string('method'); // Cash, Transfer, Yape/Plin
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('suppliers');
    }
};
