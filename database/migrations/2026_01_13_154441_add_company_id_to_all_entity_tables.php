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
        $tables = [
            'suppliers',
            'customers',
            'machines',
            'materials',
            'quotes',
            'work_orders',
            'invoices',
            'expenses',
            'payments'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                // Determine if we should cascade delete or set null.
                // Usually for tenants, we want cascade or restrict.
                $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'suppliers',
            'customers',
            'machines',
            'materials',
            'quotes',
            'work_orders',
            'invoices',
            'expenses',
            'payments'
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropForeign(['company_id']);
                $table->dropColumn('company_id');
            });
        }
    }
};
