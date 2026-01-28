<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConfigurationController extends Controller
{
    public function update(Request $request)
    {
        $company = Auth::user()->companies()->first(); // Assuming single company context for now context logic

        // If using middleware 'check.company', we could use:
        // $company = $request->attributes->get('company');
        // But let's stick to Auth user logic for now or session. 
        // Better yet, use the session 'company_id' if available. 

        $currentCompanyId = session('company_id');
        if ($currentCompanyId) {
            $company = \App\Models\Company::find($currentCompanyId);
        }

        if (!$company) {
            return response()->json(['message' => 'No active company found'], 404);
        }

        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.currency' => 'required|array',
            'settings.currency.code' => 'required|string',
            'settings.currency.symbol' => 'required|string',
            'settings.currency.decimals' => 'required|integer|min:0|max:4',
            'settings.measurement_system' => 'required|in:metric,us',
        ]);

        $company->settings = array_merge($company->settings ?? [], $validated['settings']);
        $company->save();

        return response()->json([
            'message' => 'Configuration updated successfully',
            'settings' => $company->settings
        ]);
    }
}
