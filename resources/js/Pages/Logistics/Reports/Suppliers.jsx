import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Modal from '@/Components/Modal';
import { Search, Filter, Truck, Download, ArrowLeft, Plus, Save, X } from 'lucide-react';
import axios from 'axios';
import { useForm } from '@inertiajs/react';

const SupplierReport = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async (search = '') => {
        setLoading(true);
        try {
            const params = search ? { search } : {};
            const response = await axios.get('/api/reports/logistics/suppliers-detail', { params });
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching supplier report:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSuppliers(searchTerm);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        tax_id: '',
        code: '',
        address: '',
        country: 'Perú',
        city: '',
        phone: '',
        email: '',
        contact_name: '',
        rating: 'Bueno',
        payment_terms: 'Contado',
        notes: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // We use axios manually here to stay on the page without full reload redirect, 
        // or we can use Inertia's post but we need to handle success.
        // Given this is a "Report" page but also managing suppliers, let's use axios for the modal action to avoid full page reloads and keep state.
        // Actually, Inertia useForm is cleaner for validation errors. Let's use it but handle success manually if possible or just let it reload.
        // Since we are not using Inertia listener effectively for this custom fetch, let's use axios for the submit to keep it consistent with fetchSuppliers.

        try {
            await axios.post('/api/suppliers', data);
            setIsModalOpen(false);
            reset();
            fetchSuppliers(searchTerm);
        } catch (error) {
            console.error('Error creating supplier:', error);
            // Handle validation errors if needed, usually passed in response.
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Reporte Completo de Proveedores" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center">
                    <Link href="/logistics" className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Truck className="mr-2 h-6 w-6 text-blue-600" />
                            Reporte de Proveedores
                        </h1>
                        <p className="text-sm text-gray-500">Listado detallado y administración de proveedores</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center shadow-sm"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Proveedor
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Buscar Proveedor</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nombre o RUC..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center shadow-sm"
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrar Resultados
                    </button>
                    <button
                        type="button"
                        onClick={() => { setSearchTerm(''); fetchSuppliers(''); }}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                    >
                        Limpiar
                    </button>
                </form>
            </div>

            {/* Data Grid */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre del Proveedor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    RUC / Tax ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dirección
                                </th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Órdenes
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Comprado
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Compra
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        Cargando datos...
                                    </td>
                                </tr>
                            ) : suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        No se encontraron proveedores que coincidan con la búsqueda.
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr key={supplier.id} className="hover:bg-blue-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{supplier.name}</div>
                                            <div className="text-xs text-gray-500">{supplier.contact_name || 'Sin contacto'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {supplier.tax_id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={supplier.address}>
                                            {supplier.address || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${supplier.order_count > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {supplier.order_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                            S/ {supplier.total_purchased ? parseFloat(supplier.total_purchased).toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {supplier.last_purchase_date ? new Date(supplier.last_purchase_date).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Mostrando {suppliers.length} registros</span>
                </div>
            </div>

            {/* Modal de Nuevo Proveedor */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <Truck className="mr-2 h-5 w-5 text-blue-600" />
                            Mantenimiento de Proveedores
                        </h3>
                        {/* <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                            <X className="h-6 w-6" />
                        </button> */}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Columna Izquierda */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Razón Social</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase"
                                        required
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">RUC / Tax ID</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.tax_id}
                                            onChange={e => setData('tax_id', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Código</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="Auto"
                                            value={data.code}
                                            onChange={e => setData('code', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.city}
                                            onChange={e => setData('city', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">País</label>
                                        <select
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.country}
                                            onChange={e => setData('country', e.target.value)}
                                        >
                                            <option value="Perú">Perú</option>
                                            <option value="Extranjero">Extranjero</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contacto Principal</label>
                                    <input
                                        type="text"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={data.contact_name}
                                        onChange={e => setData('contact_name', e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Calificación (Nivel)</label>
                                        <select
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.rating}
                                            onChange={e => setData('rating', e.target.value)}
                                        >
                                            <option value="Excelente">Excelente</option>
                                            <option value="Bueno">Bueno</option>
                                            <option value="Regular">Regular</option>
                                            <option value="Malo">Malo</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Forma de Pago</label>
                                        <select
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            value={data.payment_terms}
                                            onChange={e => setData('payment_terms', e.target.value)}
                                        >
                                            <option value="Contado">Contado</option>
                                            <option value="Crédito 15 días">Crédito 15 días</option>
                                            <option value="Crédito 30 días">Crédito 30 días</option>
                                            <option value="Crédito 60 días">Crédito 60 días</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                                    <textarea
                                        rows="4"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="pt-4 flex items-center justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar Proveedor
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

SupplierReport.layout = page => <MainLayout children={page} />;

export default SupplierReport;
