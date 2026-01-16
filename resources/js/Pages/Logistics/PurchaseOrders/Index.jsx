import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react'; // Ensure correct import
import MainLayout from '@/Layouts/MainLayout';
import Modal from '@/Components/Modal'; // Adjust path if needed
import { Plus, Search, Eye, FileText, Truck } from 'lucide-react';
import axios from 'axios';

const PurchaseOrders = () => {
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isdataModalOpen, setIsModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        items: [] // { material_id, quantity, unit_price }
    });

    // Item Line State (for adding to form)
    const [currentItem, setCurrentItem] = useState({
        material_id: '',
        quantity: '',
        unit_price: ''
    });

    useEffect(() => {
        fetchData();
        fetchDependencies();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/purchase-orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [suppliersRes, materialsRes] = await Promise.all([
                axios.get('/api/suppliers'),
                axios.get('/api/materials')
            ]);
            setSuppliers(suppliersRes.data);
            setMaterials(materialsRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const handleAddItem = () => {
        if (!currentItem.material_id || !currentItem.quantity || !currentItem.unit_price) return;

        setFormData({
            ...formData,
            items: [...formData.items, { ...currentItem }]
        });
        setCurrentItem({ material_id: '', quantity: '', unit_price: '' });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...formData.items];
        newItems.splice(index, 1);
        setFormData({ ...formData, items: newItems });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.post('/api/purchase-orders', formData);
            setIsModalOpen(false);
            fetchData();
            // Reset form
            setFormData({
                supplier_id: '',
                date: new Date().toISOString().split('T')[0],
                notes: '',
                items: []
            });
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error creating order. Please check inputs.');
        } finally {
            setProcessing(false);
        }
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    return (
        <div className="space-y-6">
            <Head title="Órdenes de Compra - Logística" />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Truck className="mr-2 h-6 w-6 text-blue-600" />
                    Órdenes de Compra
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Orden
                </button>
            </div>

            {/* List */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center">Cargando...</td></tr>
                        ) : orders.length === 0 ? (
                            <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay órdenes registradas.</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.supplier?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'received' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status === 'ordered' ? 'Ordenado' : order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">S/ {parseFloat(order.total_amount).toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={isdataModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Nueva Orden de Compra</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                                <select
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.supplier_id}
                                    onChange={e => setFormData({ ...formData, supplier_id: e.target.value })}
                                >
                                    <option value="">Seleccionar Proveedor...</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fecha</label>
                                <input
                                    type="date"
                                    required
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Items</h3>
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                                <div className="grid grid-cols-12 gap-2">
                                    <div className="col-span-5">
                                        <select
                                            className="block w-full text-sm border-gray-300 rounded-md"
                                            value={currentItem.material_id}
                                            onChange={e => setCurrentItem({ ...currentItem, material_id: e.target.value })}
                                        >
                                            <option value="">Material...</option>
                                            {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            placeholder="Cant."
                                            className="block w-full text-sm border-gray-300 rounded-md"
                                            value={currentItem.quantity}
                                            onChange={e => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            placeholder="Precio Unit."
                                            className="block w-full text-sm border-gray-300 rounded-md"
                                            value={currentItem.unit_price}
                                            onChange={e => setCurrentItem({ ...currentItem, unit_price: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={handleAddItem}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="mt-2 space-y-1">
                                    {formData.items.map((item, idx) => {
                                        const mat = materials.find(m => m.id == item.material_id);
                                        return (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded border">
                                                <span>{mat?.name} (x{item.quantity})</span>
                                                <div className="flex items-center space-x-2">
                                                    <span>S/ {(item.quantity * item.unit_price).toFixed(2)}</span>
                                                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">x</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {formData.items.length === 0 && <p className="text-xs text-center text-gray-500">No items added.</p>}
                                </div>

                                {formData.items.length > 0 && (
                                    <div className="text-right font-bold text-sm mt-2">
                                        Total: S/ {calculateTotal().toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Notas</label>
                            <textarea
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                rows="2"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing || formData.items.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Crear Orden'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

PurchaseOrders.layout = page => <MainLayout children={page} />;

export default PurchaseOrders;
