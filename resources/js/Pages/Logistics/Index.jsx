import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Truck, Package, Activity, BarChart2, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';

const LogisticsDashboard = () => {
    return (
        <div className="space-y-6">
            <Head title="Logística" />

            <div className="flex items-center space-x-3 mb-6">
                <Truck className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Módulo de Logística</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Purchase Orders */}
                <Link href={route('logistics.purchase-orders')} className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200 group">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4 group-hover:bg-blue-200 transition">
                            <ClipboardList className="h-6 w-6" />
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900">Órdenes de Compra</h5>
                    </div>
                    <p className="font-normal text-gray-700">Gestionar pedidos a proveedores, crear nuevas órdenes y ver historial.</p>
                </Link>

                {/* Inventory */}
                <Link href={route('logistics.inventory')} className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200 group">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4 group-hover:bg-indigo-200 transition">
                            <Package className="h-6 w-6" />
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900">Inventario</h5>
                    </div>
                    <p className="font-normal text-gray-700">Ver stock actual de materiales y realizar ajustes manuales.</p>
                </Link>

                {/* Movements */}
                <Link href="/logistics/inventory?tab=movements" className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200 group">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4 group-hover:bg-purple-200 transition">
                            <Activity className="h-6 w-6" />
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900">Movimientos de Almacén</h5>
                    </div>
                    <p className="font-normal text-gray-700">Kardex detallado de entradas y salidas de materiales.</p>
                </Link>

                {/* Reports - Purchases by Supplier */}
                <Link href={route('logistics.reports.suppliers')} className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200 group">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4 group-hover:bg-green-200 transition">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900">Reporte de Proveedores</h5>
                    </div>
                    <p className="font-normal text-gray-700">Análisis de compras por proveedor y volúmenes de pedidos.</p>
                </Link>

                {/* Reports - Material Stats */}
                <Link href={route('logistics.reports')} className="block p-6 bg-white rounded-lg shadow hover:bg-gray-50 transition border border-gray-200 group">
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4 group-hover:bg-orange-200 transition">
                            <BarChart2 className="h-6 w-6" />
                        </div>
                        <h5 className="text-xl font-bold tracking-tight text-gray-900">Estadísticas de Materiales</h5>
                    </div>
                    <p className="font-normal text-gray-700">Materiales más y menos comprados, costos y tendencias.</p>
                </Link>

            </div>
        </div>
    );
};

LogisticsDashboard.layout = page => <MainLayout children={page} />;

export default LogisticsDashboard;
