<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use App\Models\Traits\BelongsToTenant;

class LaserDieCut extends Model
{
    use HasFactory, BelongsToTenant;

    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
        'cm' => 'decimal:4',
        'factor' => 'decimal:4',
        'total_amount' => 'decimal:4',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function commercialAdvisor()
    {
        return $this->belongsTo(User::class, 'commercial_advisor_id');
    }
}
