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
        // This migration is no longer needed as we used a pivot table in create_companies_table
        // But for future extensibility we can leave the file stub or delete it.
        // I will just leave it empty for now to avoid errors, or use it if we need user-specific flags.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
