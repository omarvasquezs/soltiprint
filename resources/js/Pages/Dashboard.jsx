import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Users, Printer, Package, FileText, ClipboardList } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold text-gray-900">Bienvenido a Logic Print</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Modules */}
                <Link href={route('quotes')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                        <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Presupuestos</h3>
                    <p className="text-sm text-gray-500 mt-2">Crear y gestionar cotizaciones para clientes.</p>
                </Link>

                <Link href={route('work-orders')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                        <ClipboardList className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Órdenes de Trabajo</h3>
                    <p className="text-sm text-gray-500 mt-2">Seguimiento de producción y estados.</p>
                </Link>

                <Link href={route('machines')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                        <Printer className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Máquinas</h3>
                    <p className="text-sm text-gray-500 mt-2">Gestionar parque de maquinaria y costos.</p>
                </Link>

                <Link href={route('materials')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-amber-100 text-amber-600 mb-4 group-hover:bg-amber-600 group-hover:text-white transition">
                        <Package className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Materiales</h3>
                    <p className="text-sm text-gray-500 mt-2">Inventario de papeles, tintas y placas.</p>
                </Link>

                <Link href={route('customers')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Clientes</h3>
                    <p className="text-sm text-gray-500 mt-2">Base de datos de clientes y contactos.</p>
                </Link>

                <Link href={route('accounting')} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-200 flex flex-col items-center text-center group">
                    <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                        <ShoppingCart className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Contabilidad</h3>
                    <p className="text-sm text-gray-500 mt-2">Facturación, gastos y proveedores.</p>
                </Link>
            </div>
        </div>
    );
}

Dashboard.layout = page => <MainLayout children={page} />;
