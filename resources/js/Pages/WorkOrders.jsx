import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Plus, Search, Settings } from 'lucide-react';

const WorkOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/work-orders')
            .then(response => response.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching work orders:', error);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-gray-100 text-gray-800';
            case 'prepress': return 'bg-indigo-100 text-indigo-800';
            case 'printing': return 'bg-blue-100 text-blue-800';
            case 'finishing': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4">Cargando órdenes de trabajo...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Órdenes de Trabajo</h1>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="relative rounded-md shadow-sm max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                            placeholder="Buscar órdenes..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID / Ref Presupuesto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">#{order.id}</div>
                                    <div className="text-xs text-gray-500">Ref: {order.quote.reference}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.quote.customer.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.quote.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4" title="Actualizar Estado">
                                        <Settings className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay órdenes de trabajo activas.
                    </div>
                )}
            </div>
        </div>
    );
};

WorkOrders.layout = page => <MainLayout children={page} />;

export default WorkOrders;
