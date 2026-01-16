import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

const Reports = () => {
    const [supplierStats, setSupplierStats] = useState([]);
    const [materialStats, setMaterialStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersRes, materialsRes] = await Promise.all([
                    axios.get('/api/reports/logistics/purchases-by-supplier'),
                    axios.get('/api/reports/logistics/material-stats')
                ]);
                setSupplierStats(suppliersRes.data);
                setMaterialStats(materialsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <Head title="Reportes Logísticos" />

            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart2 className="mr-2 h-6 w-6 text-purple-600" />
                Reportes de Logística
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Purchases by Supplier */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                        Compras por Proveedor
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Órdenes</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total Comprado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="3" className="px-4 py-2 text-center text-gray-500">Cargando...</td></tr>
                                ) : supplierStats.length === 0 ? (
                                    <tr><td colSpan="3" className="px-4 py-2 text-center text-gray-500">Sin datos</td></tr>
                                ) : (
                                    supplierStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{stat.supplier?.name}</td>
                                            <td className="px-4 py-2 text-sm text-center text-gray-500">{stat.order_count}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900 font-medium">S/ {parseFloat(stat.total_purchased).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Most Purchased Materials */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <TrendingDown className="h-5 w-5 mr-2 text-blue-500" />
                        Materiales Más Comprados
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cantidad Total</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Monto Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr><td colSpan="3" className="px-4 py-2 text-center text-gray-500">Cargando...</td></tr>
                                ) : materialStats.length === 0 ? (
                                    <tr><td colSpan="3" className="px-4 py-2 text-center text-gray-500">Sin datos</td></tr>
                                ) : (
                                    materialStats.map((stat, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{stat.material?.name}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900">{parseFloat(stat.total_quantity).toFixed(2)}</td>
                                            <td className="px-4 py-2 text-sm text-right text-gray-900 font-medium">S/ {parseFloat(stat.total_spent).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

Reports.layout = page => <MainLayout children={page} />;

export default Reports;
