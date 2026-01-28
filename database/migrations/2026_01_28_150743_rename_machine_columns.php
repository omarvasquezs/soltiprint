<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('machines', function (Blueprint $table) {
            $table->renameColumn('max_width_mm', 'max_width');
            $table->renameColumn('max_height_mm', 'max_height');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('machines', function (Blueprint $table) {
            $table->renameColumn('max_width', 'max_width_mm');
            $table->renameColumn('max_height', 'max_height_mm');
        });
    }
};
