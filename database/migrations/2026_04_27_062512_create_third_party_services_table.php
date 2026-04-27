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
        Schema::create('third_party_services', function (Blueprint $table) {
            $table->id();
            
            // 1. Datos Generales
            $table->string('op')->nullable(); // OP
            $table->date('date')->nullable(); // FECHA
            $table->foreignId('customer_id')->nullable()->constrained('customers')->nullOnDelete(); // CLIENTE
            $table->foreignId('material_id')->nullable()->constrained('materials')->nullOnDelete(); // PRODUCTO
            $table->text('details')->nullable(); // DETALLES
            $table->integer('requested_quantity')->nullable(); // CANTIDAD SOLICITADA

            // 2. Corte Inicial
            $table->time('corte_in_hora_inicio')->nullable(); 
            $table->time('corte_in_hora_final')->nullable(); 
            $table->string('corte_in_tiempo_total')->nullable();
            $table->decimal('corte_in_s_hora', 10, 4)->nullable();
            $table->decimal('corte_in_s_total', 12, 4)->nullable();

            // 3. Impresión
            $table->decimal('imp_t', 12, 4)->nullable();
            $table->decimal('imp_r', 12, 4)->nullable();
            $table->decimal('imp_total', 12, 4)->nullable();
            $table->decimal('imp_a_facturar', 12, 4)->nullable();
            $table->decimal('imp_s_millar', 10, 4)->nullable();
            $table->decimal('imp_s_total', 12, 4)->nullable();

            // 4. Barniz
            $table->string('barniz')->nullable();
            $table->decimal('bar_total', 12, 4)->nullable();
            $table->decimal('bar_s', 12, 4)->nullable();
            $table->decimal('bar_s_millar', 10, 4)->nullable();
            $table->decimal('bar_s_total', 12, 4)->nullable();

            // 5. Corte Final
            $table->string('corte_final')->nullable();
            $table->decimal('cortf_total', 12, 4)->nullable();
            $table->decimal('cortf_s_hora', 10, 4)->nullable();
            $table->decimal('cortf_s_total', 12, 4)->nullable();

            // 6. Troquel
            $table->string('troquel')->nullable();
            $table->decimal('troq_total', 12, 4)->nullable();
            $table->decimal('troq_s', 12, 4)->nullable();
            $table->decimal('troq_s_millar', 10, 4)->nullable();
            $table->decimal('troq_s_total', 12, 4)->nullable();

            // 7. Plástico
            $table->string('plastico')->nullable();
            $table->decimal('plas_total', 12, 4)->nullable();
            $table->decimal('plas_s', 12, 4)->nullable();
            $table->decimal('plas_s_millar', 10, 4)->nullable();
            $table->decimal('plas_s_total', 12, 4)->nullable();

            // 8. Sectorizado
            $table->string('sectorizado')->nullable();
            $table->decimal('sect_total', 12, 4)->nullable();
            $table->decimal('sect_s', 12, 4)->nullable();
            $table->decimal('sect_s_millar', 10, 4)->nullable();
            $table->decimal('sect_s_total', 12, 4)->nullable();

            // 9. Otros Acabados
            $table->string('otros_acabados')->nullable();
            $table->decimal('otros_cantidad_s', 12, 4)->nullable();
            $table->decimal('otros_s_millar', 10, 4)->nullable();
            $table->decimal('otros_s_total', 12, 4)->nullable();

            // 10. Liquidación y Facturación
            $table->decimal('total_cobrar', 12, 4)->nullable();
            $table->string('estado_1')->nullable(); // ESTADO (primero)
            $table->string('estado_2')->nullable(); // ESTADO (segundo)
            $table->string('n_factura')->nullable();
            $table->string('razon_social')->nullable();
            $table->text('fecha_observacion')->nullable();

            $table->foreignId('company_id')->nullable()->constrained('companies')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('third_party_services');
    }
};
