import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Save } from 'lucide-react';
import axios from 'axios';

export default function Index() {
    const { company } = usePage().props;
    const [settings, setSettings] = useState(company?.settings || {
        currency: { code: 'USD', symbol: '$', decimals: 2 },
        measurement_system: 'metric' // 'metric', 'us', 'hybrid'
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (section, key, value) => {
        setSettings(prev => {
            if (section) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [key]: value
                    }
                };
            }
            return { ...prev, [key]: value };
        });
    };

    const handleSave = () => {
        setSaving(true);
        axios.post('/configuration', { settings })
            .then(response => {
                alert('Configuración guardada correctamente. Por favor recarga la página para aplicar cambios globales.');
                setSaving(false);
            })
            .catch(error => {
                console.error(error);
                alert('Error al guardar la configuración.');
                setSaving(false);
            });
    };

    return (
        <MainLayout>
            <Head title="Configuración Global" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Opciones de Configuración</h1>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Sistema de Medidas</h2>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">Establece el sistema de medición a utilizar en toda la aplicación.</p>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="measurement_system"
                                        value="metric"
                                        checked={settings.measurement_system === 'metric'}
                                        onChange={(e) => handleChange(null, 'measurement_system', e.target.value)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Sistema Internacional Métrico (cm, mm, metros)</span>
                                </label>

                                <label className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="measurement_system"
                                        value="us"
                                        checked={settings.measurement_system === 'us'}
                                        onChange={(e) => handleChange(null, 'measurement_system', e.target.value)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">Sistema Imperial EE.UU. (pulgadas, pies, libras)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Moneda Principal</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código (ISO)</label>
                                <select
                                    value={settings.currency?.code || 'USD'}
                                    onChange={(e) => {
                                        const code = e.target.value;
                                        handleChange('currency', 'code', code);
                                        const symbols = { 'USD': '$', 'PEN': 'S/', 'EUR': '€' };
                                        if (symbols[code]) {
                                            handleChange('currency', 'symbol', symbols[code]);
                                        }
                                    }}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="USD">USD - Dólar Estadounidense</option>
                                    <option value="PEN">PEN - Sol Peruano</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Símbolo</label>
                                <input
                                    type="text"
                                    value={settings.currency?.symbol || '$'}
                                    onChange={(e) => handleChange('currency', 'symbol', e.target.value)}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Decimales</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="4"
                                    value={settings.currency?.decimals || 2}
                                    onChange={(e) => handleChange('currency', 'decimals', parseInt(e.target.value))}
                                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
