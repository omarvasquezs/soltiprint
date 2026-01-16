<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Session;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (Session::has('company_id')) {
            $builder->where('company_id', Session::get('company_id'));
        } else {
            // If no company is selected, we might want to return nothing 
            // or allow all if it's a super-admin (logic can be refined).
            // For now, if no company is in session, we return no results 
            // to be safe, unless it's running in console/seeder.
            if (!app()->runningInConsole() && auth()->check()) {
                 $builder->where('company_id', -1);
            }
        }
    }
}
