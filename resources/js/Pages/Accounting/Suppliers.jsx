import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../../Components/Modal';
import MainLayout from '@/Layouts/MainLayout';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        tax_id: '',
        phonenumber: '', // Using phonenumber to match backend field likely, need to verify
        email: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        setLoading(true);
        fetch('/api/suppliers')
            .then(response => response.json())
            .then(data => {
                setSuppliers(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching suppliers:', error);
                setLoading(false);
            });
    };

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setCurrentSupplier(supplier);
            setFormData({
                name: supplier.name || '',
                tax_id: supplier.tax_id || '',
                phonenumber: supplier.phonenumber || '', // Verify this field name from previous reads or assumptions
                email: supplier.email || '',
                address: supplier.address || ''
            });
        } else {
            setCurrentSupplier(null);
            setFormData({
                name: '',
                tax_id: '',
                phonenumber: '',
                email: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSupplier(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentSupplier ? `/api/suppliers/${currentSupplier.id}` : '/api/suppliers';
        const method = currentSupplier ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error saving supplier');
                return response.json();
            })
            .then(() => {
                fetchSuppliers();
                handleCloseModal();
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            fetch(`/api/suppliers/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error deleting supplier');
                    fetchSuppliers();
                })
                .catch(error => console.error('Error:', error));
        }
    };

    if (loading) {
        return <div className="p-4">Cargando proveedores...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Proveedor
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
                            placeholder="Buscar proveedores..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC / Tax ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefono</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{supplier.tax_id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{supplier.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{supplier.phonenumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(supplier)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {suppliers.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay proveedores registrados aun.
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">RUC / Tax ID</label>
                        <input
                            type="text"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            name="phonenumber"
                            value={formData.phonenumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
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

Suppliers.layout = page => <MainLayout children={page} />;

export default Suppliers;
