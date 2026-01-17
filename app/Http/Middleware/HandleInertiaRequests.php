<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'company' => function () {
                $companyId = session('company_id');
                if ($companyId) {
                    return \App\Models\Company::select('id', 'name', 'tax_id')->find($companyId);
                }
                return null;
            },
            // Keeping these for backward compatibility if needed, but 'company' object is cleaner.
            // Let's map them to the company object to avoid multiple DB calls if we cached the query,
            // but here we just do a fresh query or let the closure handle it.
            // Actually, let's just return the company object as 'current_company' and update the layout to use it,
            // OR simpler: resolve the values here.
            'company_name' => function () {
                if (session('company_name'))
                    return session('company_name');
                if (session('company_id')) {
                    return \App\Models\Company::find(session('company_id'))?->name;
                }
                return 'Mi Empresa';
            },
            'company_tax_id' => function () {
                // If we already fetched name, we might be fetching twice.
                // Optimization: Fetch once.
                if (session('company_id')) {
                    // This is simple enough for now. The N+1 is negligible for a single user session header.
                    return \App\Models\Company::find(session('company_id'))?->tax_id;
                }
                return null;
            },
        ];
    }
}
