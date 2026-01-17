<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    public function select(Request $request)
    {
        $user = $request->user();
        $companies = $user->companies;

        return Inertia::render('Auth/CompanySelection', [
            'companies' => $companies
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'tax_id' => 'nullable|string|max:20',
        ]);

        $user = $request->user();

        $company = DB::transaction(function () use ($user, $request) {
            $company = Company::create([
                'name' => $request->name,
                'tax_id' => $request->tax_id,
            ]);

            $user->companies()->attach($company->id, ['role' => 'owner']);

            return $company;
        });

        // Auto select the new company
        session(['company_id' => $company->id]);
        session(['company_name' => $company->name]);

        return redirect()->route('dashboard');
    }

    public function setCompany(Request $request, Company $company)
    {
        $user = $request->user();

        // Verify user belongs to this company
        if (!$user->companies()->where('companies.id', $company->id)->exists()) {
            abort(403, 'Unauthorized');
        }

        session(['company_id' => $company->id]);
        session(['company_name' => $company->name]); // Store name for easy access in layout

        return redirect()->route('dashboard');
    }
}
