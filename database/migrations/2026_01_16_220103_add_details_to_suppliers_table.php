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
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('code')->nullable()->after('id');
            $table->string('country')->nullable()->default('Perú')->after('address');
            $table->string('city')->nullable()->after('country');
            $table->string('contact_name')->nullable()->after('email');
            $table->string('rating')->nullable()->default('Bueno')->after('contact_name'); // Excelente, Bueno, Regular, Malo
            $table->string('payment_terms')->nullable()->after('rating'); // Contado, Crédito 30 días, etc.
            $table->text('notes')->nullable()->after('payment_terms');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['code', 'country', 'city', 'contact_name', 'rating', 'payment_terms', 'notes']);
        });
    }
};
