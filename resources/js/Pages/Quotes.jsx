import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Plus, Search, FileText } from 'lucide-react';

import Modal from '../Components/Modal';
import QuoteWizard from '../Components/QuoteWizard';
import QuoteDetailsModal from '../Components/QuoteDetailsModal';
import { Head } from '@inertiajs/react';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [machines, setMachines] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(null);

    const handleOpenModal = (quote = null) => {
        setCurrentQuote(quote);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (quote) => {
        setCurrentQuote(quote);
        setIsViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentQuote(null);
    };

    useEffect(() => {
        Promise.all([
            fetch('/api/quotes').then(res => res.json()),
            fetch('/api/customers').then(res => res.json()),
            fetch('/api/machines').then(res => res.json()),
            fetch('/api/materials').then(res => res.json())
        ])
            .then(([quotesData, customersData, machinesData, materialsData]) => {
                setQuotes(quotesData);
                setCustomers(customersData);
                setMachines(machinesData);
                setMaterials(materialsData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
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
            <Head title="Presupuestos" />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Presupuestos</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
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
                                    <div className="text-sm font-bold text-gray-900">
                                        S/ {quote.total_amount ? parseFloat(quote.total_amount).toFixed(2) : '0.00'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Costo: S/ {quote.total_cost ? parseFloat(quote.total_cost).toFixed(2) : '0.00'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                        title="Editar"
                                        onClick={() => handleOpenModal(quote)}
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="text-gray-600 hover:text-gray-900 mr-4"
                                        title="Ver Detalles"
                                        onClick={() => handleOpenViewModal(quote)}
                                    >
                                        <FileText className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        title="Eliminar"
                                        onClick={() => {
                                            if (window.confirm("¿Está seguro de eliminar este presupuesto?")) {
                                                fetch(`/api/quotes/${quote.id}`, { method: 'DELETE' })
                                                    .then(() => setQuotes(quotes.filter(q => q.id !== quote.id)));
                                            }
                                        }}
                                    >
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

            <Modal
                show={isModalOpen}
                onClose={handleCloseModal}
                maxWidth="7xl"
            >
                <QuoteWizard
                    onClose={handleCloseModal}
                    customers={customers}
                    machines={machines}
                    materials={materials}
                />
            </Modal>

            {isViewModalOpen && currentQuote && (
                <QuoteDetailsModal
                    isOpen={isViewModalOpen}
                    onClose={() => {
                        setIsViewModalOpen(false);
                        setCurrentQuote(null);
                    }}
                    quoteData={currentQuote}
                    isReadOnly={true}
                />
            )}
        </div >
    );
};

Quotes.layout = page => <MainLayout children={page} />;

export default Quotes;
