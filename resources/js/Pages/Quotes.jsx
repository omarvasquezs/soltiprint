import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Plus, Search, FileText } from 'lucide-react';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/quotes')
            .then(response => response.json())
            .then(data => {
                setQuotes(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching quotes:', error);
                setLoading(false);
            });
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'bg-gray-100 text-gray-800';
            case 'sent': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-4">Cargando presupuestos...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Presupuesto
                </button>
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
                            placeholder="Buscar presupuestos..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Referencia / Título
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{quote.title}</div>
                                    <div className="text-xs text-gray-500">{quote.reference}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{quote.customer.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${getStatusColor(quote.status)}`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900">S/ {quote.final_price}</div>
                                    <div className="text-xs text-gray-500">Costo: S/ {quote.total_cost}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4" title="Editar">
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900 mr-4" title="Ver Detalles">
                                        <FileText className="h-5 w-5" />
                                    </button>
                                    <button className="text-red-600 hover:text-red-900" title="Eliminar">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {quotes.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay presupuestos registrados aun.
                    </div>
                )}
            </div>
        </div>
    );
};

Quotes.layout = page => <MainLayout children={page} />;

export default Quotes;
