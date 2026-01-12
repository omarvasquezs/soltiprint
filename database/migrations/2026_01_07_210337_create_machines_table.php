<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('machines', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->string('type'); // 'offset', 'digital'
            
            // Offset costs
            $table->decimal('hourly_rate', 10, 2)->default(0);
            $table->decimal('setup_time', 8, 2)->default(0); // in hours
            $table->integer('speed_sheets_per_hour')->default(0);

            // Digital costs
            $table->decimal('click_cost_bw', 10, 4)->default(0);
            $table->decimal('click_cost_color', 10, 4)->default(0);

            // Physical constraints
            $table->integer('max_width_mm')->nullable();
            $table->integer('max_height_mm')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('machines');
    }
};
