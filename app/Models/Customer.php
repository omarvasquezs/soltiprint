<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Traits\BelongsToTenant;

class Customer extends Model
{
    use HasFactory, BelongsToTenant;

    protected $guarded = [];

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
