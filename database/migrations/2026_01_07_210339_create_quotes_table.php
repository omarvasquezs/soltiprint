<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique()->nullable();
            $table->string('title'); // e.g., "5000 Flyers A5"
            $table->string('status')->default('draft'); // draft, sent, accepted, rejected
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->decimal('margin_percent', 5, 2)->default(30); // Profit margin
            $table->decimal('final_price', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
