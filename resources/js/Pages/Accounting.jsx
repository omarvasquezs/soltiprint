import React, { useState, useEffect } from 'react';
import {
    Calculator, FileText, ShoppingCart, Users, CreditCard, BarChart2
} from 'lucide-react';

const Accounting = () => {
    const [financials, setFinancials] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/reports/financial')
            .then(res => res.json())
            .then(data => {
                setFinancials(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching financials", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-6">Cargando reporte financiero...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Módulo de Contabilidad</h1>
            <h2 className="text-lg font-semibold text-gray-700">Estados Financieros</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Montos facturados</p>
                            <p className="text-xl font-bold text-gray-900">
                                S/ {parseFloat(financials.income.invoiced).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Cobrado (Cash)</p>
                            <p className="text-xl font-bold text-gray-900">
                                S/ {parseFloat(financials.income.collected).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Gastos (Compras)</p>
                            <p className="text-xl font-bold text-gray-900">
                                S/ {parseFloat(financials.expenses.billed).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                            <BarChart2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Utilidad Neta</p>
                            <p className="text-xl font-bold text-gray-900">
                                S/ {parseFloat(financials.net_profit).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                <a href="/accounting/expenses" className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 flex items-center">
                        <ShoppingCart className="mr-2" /> Registro de Compras
                    </h5>
                    <p className="font-normal text-gray-700">Registrar gastos, compras de material y facturas de proveedores.</p>
                </a>

                <a href="/accounting/suppliers" className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200">
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 flex items-center">
                        <Users className="mr-2" /> Proveedores
                    </h5>
                    <p className="font-normal text-gray-700">Gestionar base de datos de proveedores y acreedores.</p>
                </a>
            </div>
        </div>
    );
};

export default Accounting;
