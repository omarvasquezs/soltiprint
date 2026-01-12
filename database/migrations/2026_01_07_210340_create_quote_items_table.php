<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            
            // Specs
            $table->string('name')->default('Item 1');
            $table->integer('quantity');
            $table->integer('width_mm');
            $table->integer('height_mm');
            
            $table->integer('colors_front')->default(4); // CMYK
            $table->integer('colors_back')->default(0);
            
            // Paper selection
            $table->foreignId('material_id')->constrained('materials'); // The paper
            
            // Calculation Result
            $table->foreignId('recommended_machine_id')->nullable()->constrained('machines');
            $table->integer('sheets_required')->default(0);
            $table->integer('plates_required')->default(0); // For offset
            $table->decimal('calculated_cost', 10, 2)->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_items');
    }
};
