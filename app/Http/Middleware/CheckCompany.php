<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$request->session()->has('company_id')) {
            // Check if user has any companies
            if ($user->companies()->count() === 0) {
                // Redirect to create company page/modal if we had one, 
                // or just the selection page which handles creation too.
                 return redirect()->route('company.selection');
            }
            
            // If they have one company, maybe auto-select? 
            // For now, force selection to be explicit or let selection page handle auto-redirect.
             return redirect()->route('company.selection');
        }

        return $next($request);
    }
}
