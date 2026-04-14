<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            // Work definition fields
            if (!Schema::hasColumn('quotes', 'finish_format'))
                $table->string('finish_format')->nullable();
            if (!Schema::hasColumn('quotes', 'inks'))
                $table->string('inks')->nullable();
            if (!Schema::hasColumn('quotes', 'pages'))
                $table->string('pages')->nullable();
            if (!Schema::hasColumn('quotes', 'precut'))
                $table->string('precut')->nullable();
            if (!Schema::hasColumn('quotes', 'printing_type'))
                $table->string('printing_type')->nullable();
            if (!Schema::hasColumn('quotes', 'press_format'))
                $table->string('press_format')->nullable();

            // Machine relation
            if (!Schema::hasColumn('quotes', 'machine_id')) {
                $table->foreignId('machine_id')->nullable()->constrained('machines')->nullOnDelete();
            }

            // Paper/media details
            if (!Schema::hasColumn('quotes', 'paper_type'))
                $table->string('paper_type')->nullable();
            if (!Schema::hasColumn('quotes', 'grammage'))
                $table->string('grammage')->nullable();
            if (!Schema::hasColumn('quotes', 'paper_dimensions'))
                $table->string('paper_dimensions')->nullable();
            if (!Schema::hasColumn('quotes', 'manufacturer'))
                $table->string('manufacturer')->nullable();
            if (!Schema::hasColumn('quotes', 'article_id'))
                $table->string('article_id')->nullable();

            // Financial fields
            if (!Schema::hasColumn('quotes', 'cost_materials'))
                $table->decimal('cost_materials', 10, 2)->nullable();
            if (!Schema::hasColumn('quotes', 'cost_operations'))
                $table->decimal('cost_operations', 10, 2)->nullable();
            if (!Schema::hasColumn('quotes', 'total_cost'))
                $table->decimal('total_cost', 10, 2)->nullable();
            if (!Schema::hasColumn('quotes', 'margin'))
                $table->decimal('margin', 5, 2)->nullable();
            if (!Schema::hasColumn('quotes', 'profit'))
                $table->decimal('profit', 10, 2)->nullable();
            if (!Schema::hasColumn('quotes', 'unit_price'))
                $table->decimal('unit_price', 10, 4)->nullable();

            // State and notes
            if (!Schema::hasColumn('quotes', 'state'))
                $table->string('state')->default('Draft');
            if (!Schema::hasColumn('quotes', 'notes'))
                $table->text('notes')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            // Only drop if exists to avoid errors
            $columns = [
                'finish_format',
                'inks',
                'pages',
                'precut',
                'printing_type',
                'press_format',
                'machine_id',
                'paper_type',
                'grammage',
                'paper_dimensions',
                'manufacturer',
                'article_id',
                'cost_materials',
                'cost_operations',
                'total_cost',
                'margin',
                'profit',
                'unit_price',
                'state',
                'notes'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('quotes', $column)) {
                    if ($column === 'machine_id') {
                        $table->dropForeign(['machine_id']);
                    }
                    $table->dropColumn($column);
                }
            }
        });
    }
};
