<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Machine extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
        'setup_time' => 'decimal:2',
        'click_cost_bw' => 'decimal:4',
        'click_cost_color' => 'decimal:4',
    ];

    public function isOffset(): bool
    {
        return $this->type === 'offset';
    }

    public function isDigital(): bool
    {
        return $this->type === 'digital';
    }
}
