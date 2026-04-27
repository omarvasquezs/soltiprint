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
        Schema::create('laser_die_cuts', function (Blueprint $table) {
            $table->id();
            $table->date('date')->nullable();
            $table->string('op')->nullable(); // OP
            $table->foreignId('commercial_advisor_id')->nullable()->constrained('users')->nullOnDelete(); // Asesor Comercial
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete(); // Cliente
            $table->foreignId('material_id')->nullable()->constrained('materials')->nullOnDelete(); // Descripcion / Producto
            $table->string('design_type')->nullable(); // Lineal, SemiDenso
            $table->decimal('cm', 10, 4)->nullable();
            $table->decimal('factor', 10, 4)->nullable();
            $table->decimal('total_amount', 12, 4)->nullable(); // Total a cobrar
            $table->string('invoice_number')->nullable(); // N Factura
            $table->string('status')->nullable(); // Situacion
            $table->text('observations')->nullable(); // Detalles / Observaciones
            
            $table->foreignId('company_id')->nullable()->constrained('companies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laser_die_cuts');
    }
};
