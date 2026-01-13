import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../../Components/Modal';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [formData, setFormData] = useState({
        customer_id: '',
        document_type: 'factura',
        series: 'F001',
        number: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
        currency: 'PEN',
        subtotal: 0,
        tax: 0,
        total: 0,
        status: 'pending'
    });

    useEffect(() => {
        fetchInvoices();
        fetchCustomers();
    }, []);

    const fetchInvoices = () => {
        setLoading(true);
        fetch('/api/invoices')
            .then(response => response.json())
            .then(data => {
                setInvoices(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching invoices:', error);
                setLoading(false);
            });
    };

    const fetchCustomers = () => {
        fetch('/api/customers')
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error('Error fetching customers:', err));
    };

    const handleOpenModal = (invoice = null) => {
        if (invoice) {
            setCurrentInvoice(invoice);
            setFormData({
                customer_id: invoice.customer_id || '',
                document_type: invoice.document_type || 'factura',
                series: invoice.series || '',
                number: invoice.number || '',
                issue_date: invoice.issue_date || new Date().toISOString().split('T')[0],
                due_date: invoice.due_date || new Date().toISOString().split('T')[0],
                currency: invoice.currency || 'PEN',
                subtotal: invoice.subtotal || 0,
                tax: invoice.tax || 0,
                total: invoice.total || 0,
                status: invoice.status || 'pending'
            });
        } else {
            setCurrentInvoice(null);
            setFormData({
                customer_id: '',
                document_type: 'factura',
                series: 'F001',
                number: '',
                issue_date: new Date().toISOString().split('T')[0],
                due_date: new Date().toISOString().split('T')[0],
                currency: 'PEN',
                subtotal: 0,
                tax: 0,
                total: 0,
                status: 'pending'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentInvoice(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentInvoice ? `/api/invoices/${currentInvoice.id}` : '/api/invoices';
        const method = currentInvoice ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error saving invoice');
                return response.json();
            })
            .then(() => {
                fetchInvoices();
                handleCloseModal();
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta factura?')) {
            fetch(`/api/invoices/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error deleting invoice');
                    fetchInvoices();
                })
                .catch(error => console.error('Error:', error));
        }
    };

    if (loading) {
        return <div className="p-4">Cargando facturas...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Registro de Ventas (Facturación)</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Factura
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
                            placeholder="Buscar facturas..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((inv) => (
                            <tr key={inv.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {inv.issue_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {inv.document_type.toUpperCase()} {inv.series}-{inv.number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.customer?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                    S/ {inv.total}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase 
                                        ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {inv.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(inv)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inv.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {invoices.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay facturas registradas.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentInvoice ? 'Editar Factura' : 'Nueva Factura'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cliente</label>
                        <select
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="">Seleccionar Cliente</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo Doc.</label>
                            <select
                                name="document_type"
                                value={formData.document_type}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="factura">Factura</option>
                                <option value="boleta">Boleta</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha Emisión</label>
                            <input
                                type="date"
                                name="issue_date"
                                value={formData.issue_date}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Serie</label>
                            <input
                                type="text"
                                name="series"
                                value={formData.series}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número</label>
                            <input
                                type="text"
                                name="number"
                                value={formData.number}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vencimiento</label>
                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estado</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="pending">Pendiente</option>
                                <option value="paid">Pagado</option>
                                <option value="cancelled">Anulado</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subtotal</label>
                            <input
                                type="number"
                                step="0.01"
                                name="subtotal"
                                value={formData.subtotal}
                                onChange={(e) => {
                                    const sub = parseFloat(e.target.value) || 0;
                                    const tax = sub * 0.18;
                                    setFormData(prev => ({ ...prev, subtotal: sub, tax: Number(tax.toFixed(2)), total: Number((sub + tax).toFixed(2)) }));
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">IGV</label>
                            <input
                                type="number"
                                step="0.01"
                                name="tax"
                                value={formData.tax}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total</label>
                            <input
                                type="number"
                                step="0.01"
                                name="total"
                                value={formData.total}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={handleCloseModal}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Invoices;
