<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'paper', 'ink', 'plate'
            
            // Cost
            $table->decimal('cost_per_unit', 10, 4); 
            $table->string('unit'); // 'sheet', 'kg', 'liter', 'unit'
            
            // Paper details
            $table->integer('grammage')->nullable(); // gsm
            $table->integer('width_mm')->nullable();
            $table->integer('height_mm')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
