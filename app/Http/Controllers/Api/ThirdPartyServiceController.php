<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ThirdPartyService;
use Illuminate\Http\Request;

class ThirdPartyServiceController extends Controller
{
    public function index()
    {
        return response()->json(ThirdPartyService::with(['customer', 'material'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'op' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'customer_id' => 'nullable|exists:customers,id',
            'material_id' => 'nullable|exists:materials,id',
            'details' => 'nullable|string',
            'requested_quantity' => 'nullable|integer',
            
            'corte_in_hora_inicio' => 'nullable|date_format:H:i',
            'corte_in_hora_final' => 'nullable|date_format:H:i',
            'corte_in_tiempo_total' => 'nullable|string',
            'corte_in_s_hora' => 'nullable|numeric',
            'corte_in_s_total' => 'nullable|numeric',

            'imp_t' => 'nullable|numeric',
            'imp_r' => 'nullable|numeric',
            'imp_total' => 'nullable|numeric',
            'imp_a_facturar' => 'nullable|numeric',
            'imp_s_millar' => 'nullable|numeric',
            'imp_s_total' => 'nullable|numeric',

            'barniz' => 'nullable|string|max:255',
            'bar_total' => 'nullable|numeric',
            'bar_s' => 'nullable|numeric',
            'bar_s_millar' => 'nullable|numeric',
            'bar_s_total' => 'nullable|numeric',

            'corte_final' => 'nullable|string|max:255',
            'cortf_total' => 'nullable|numeric',
            'cortf_s_hora' => 'nullable|numeric',
            'cortf_s_total' => 'nullable|numeric',

            'troquel' => 'nullable|string|max:255',
            'troq_total' => 'nullable|numeric',
            'troq_s' => 'nullable|numeric',
            'troq_s_millar' => 'nullable|numeric',
            'troq_s_total' => 'nullable|numeric',

            'plastico' => 'nullable|string|max:255',
            'plas_total' => 'nullable|numeric',
            'plas_s' => 'nullable|numeric',
            'plas_s_millar' => 'nullable|numeric',
            'plas_s_total' => 'nullable|numeric',

            'sectorizado' => 'nullable|string|max:255',
            'sect_total' => 'nullable|numeric',
            'sect_s' => 'nullable|numeric',
            'sect_s_millar' => 'nullable|numeric',
            'sect_s_total' => 'nullable|numeric',

            'otros_acabados' => 'nullable|string|max:255',
            'otros_cantidad_s' => 'nullable|numeric',
            'otros_s_millar' => 'nullable|numeric',
            'otros_s_total' => 'nullable|numeric',

            'total_cobrar' => 'nullable|numeric',
            'estado_1' => 'nullable|string|max:255',
            'estado_2' => 'nullable|string|max:255',
            'n_factura' => 'nullable|string|max:255',
            'razon_social' => 'nullable|string|max:255',
            'fecha_observacion' => 'nullable|string',
        ]);

        $item = ThirdPartyService::create($validated);
        
        if (empty($item->op)) {
            $item->op = 'OP-TER-' . str_pad($item->id, 6, '0', STR_PAD_LEFT);
            $item->save();
        }

        return response()->json($item, 201);
    }

    public function show(string $id)
    {
        return response()->json(ThirdPartyService::with(['customer', 'material'])->findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $item = ThirdPartyService::findOrFail($id);
        $validated = $request->validate([
            'op' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'customer_id' => 'nullable|exists:customers,id',
            'material_id' => 'nullable|exists:materials,id',
            'details' => 'nullable|string',
            'requested_quantity' => 'nullable|integer',
            
            'corte_in_hora_inicio' => 'nullable|date_format:H:i',
            'corte_in_hora_final' => 'nullable|date_format:H:i',
            'corte_in_tiempo_total' => 'nullable|string',
            'corte_in_s_hora' => 'nullable|numeric',
            'corte_in_s_total' => 'nullable|numeric',

            'imp_t' => 'nullable|numeric',
            'imp_r' => 'nullable|numeric',
            'imp_total' => 'nullable|numeric',
            'imp_a_facturar' => 'nullable|numeric',
            'imp_s_millar' => 'nullable|numeric',
            'imp_s_total' => 'nullable|numeric',

            'barniz' => 'nullable|string|max:255',
            'bar_total' => 'nullable|numeric',
            'bar_s' => 'nullable|numeric',
            'bar_s_millar' => 'nullable|numeric',
            'bar_s_total' => 'nullable|numeric',

            'corte_final' => 'nullable|string|max:255',
            'cortf_total' => 'nullable|numeric',
            'cortf_s_hora' => 'nullable|numeric',
            'cortf_s_total' => 'nullable|numeric',

            'troquel' => 'nullable|string|max:255',
            'troq_total' => 'nullable|numeric',
            'troq_s' => 'nullable|numeric',
            'troq_s_millar' => 'nullable|numeric',
            'troq_s_total' => 'nullable|numeric',

            'plastico' => 'nullable|string|max:255',
            'plas_total' => 'nullable|numeric',
            'plas_s' => 'nullable|numeric',
            'plas_s_millar' => 'nullable|numeric',
            'plas_s_total' => 'nullable|numeric',

            'sectorizado' => 'nullable|string|max:255',
            'sect_total' => 'nullable|numeric',
            'sect_s' => 'nullable|numeric',
            'sect_s_millar' => 'nullable|numeric',
            'sect_s_total' => 'nullable|numeric',

            'otros_acabados' => 'nullable|string|max:255',
            'otros_cantidad_s' => 'nullable|numeric',
            'otros_s_millar' => 'nullable|numeric',
            'otros_s_total' => 'nullable|numeric',

            'total_cobrar' => 'nullable|numeric',
            'estado_1' => 'nullable|string|max:255',
            'estado_2' => 'nullable|string|max:255',
            'n_factura' => 'nullable|string|max:255',
            'razon_social' => 'nullable|string|max:255',
            'fecha_observacion' => 'nullable|string',
        ]);

        $item->update($validated);
        return response()->json($item);
    }

    public function destroy(string $id)
    {
        ThirdPartyService::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
