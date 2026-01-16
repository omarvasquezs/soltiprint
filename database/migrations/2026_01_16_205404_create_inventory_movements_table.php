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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('material_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type'); // manual_in, manual_out, purchase_received, production_consumed
            $table->decimal('quantity', 10, 2); // Can be negative for consumption, or always positive and type defines sign. Let's use signed? Or type-based. Usage: signed is easier for sum().
            // Wait, usually it's better to store unsigned and let logic handle it, OR usage signed.
            // Let's store signed quantity. + for in, - for out.
            $table->nullableMorphs('reference'); // reference_id, reference_type (Order, WorkOrder, etc)
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
