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
            'company_name' => session('company_name'),
            'company_tax_id' => function () {
                // Fetch company tax_id if company_id is present
                // Since storing everything in session might be tedious, 
                // we can just fetch the current company if ID is set.
                // But for now, let's assume we store tax_id in session too or fetch it.
                // Optimally, we fetch the current company model once.
                
                if (session('company_id')) {
                    return \App\Models\Company::find(session('company_id'))?->tax_id;
                }
                return null;
            },
        ];
    }
}
