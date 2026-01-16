import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import Modal from '@/Components/Modal';
import { Package, Plus, Minus, History, Activity } from 'lucide-react';
import axios from 'axios';

const Inventory = () => {
    const { url } = usePage(); // To parse query params if needed, or stick to manual
    // Simple query param parsing
    const params = new URLSearchParams(window.location.search);
    const initialTab = params.get('tab') === 'movements' ? 'movements' : 'stock';

    const [stock, setStock] = useState([]);
    const [movements, setMovements] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [activeTab, setActiveTab] = useState(initialTab); // stock | movements
    const [isdataModalOpen, setIsModalOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Form State for Manual Adjustment
    const [formData, setFormData] = useState({
        material_id: '',
        type: 'manual_in', // manual_in | manual_out
        quantity: '',
        description: ''
    });

    useEffect(() => {
        fetchStock();
        fetchMovements();
        fetchMaterials();
    }, []);

    const fetchStock = async () => {
        try {
            const response = await axios.get('/api/inventory/stock');
            setStock(response.data);
        } catch (error) {
            console.error('Error fetching stock:', error);
        }
    };

    const fetchMovements = async () => {
        try {
            const response = await axios.get('/api/inventory/movements');
            setMovements(response.data);
        } catch (error) {
            console.error('Error fetching movements:', error);
        }
    };

    const fetchMaterials = async () => {
        try {
            const response = await axios.get('/api/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            await axios.post('/api/inventory/movement', formData);
            setIsModalOpen(false);
            fetchStock();
            fetchMovements();
            setFormData({ material_id: '', type: 'manual_in', quantity: '', description: '' });
        } catch (error) {
            console.error('Error creating movement:', error);
            alert('Error creating movement. Check inputs.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Inventario - Logística" />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="mr-2 h-6 w-6 text-indigo-600" />
                    Inventario
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-indigo-700 transition"
                >
                    <Activity className="h-5 w-5 mr-2" />
                    Ajuste Manual
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('stock')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'stock'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Stock Actual
                    </button>
                    <button
                        onClick={() => setActiveTab('movements')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'movements'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Movimientos (Kardex)
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                {activeTab === 'stock' ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stock.length === 0 ? (
                                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500">No hay datos de stock.</td></tr>
                            ) : (
                                stock.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.material?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.material?.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{item.current_stock} {item.material?.unit}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {movements.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay movimientos.</td></tr>
                            ) : (
                                movements.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(mov.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{mov.material?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${mov.type.includes('_in') || mov.type === 'purchase_received' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {mov.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${mov.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {mov.quantity > 0 ? '+' : ''}{parseFloat(mov.quantity).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mov.description || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{mov.user?.name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            <Modal show={isdataModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Ajuste Manual de Inventario</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Material</label>
                            <select
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.material_id}
                                onChange={e => setFormData({ ...formData, material_id: e.target.value })}
                            >
                                <option value="">Seleccionar Material...</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
                            <select
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="manual_in">Entrada Manual (+)</option>
                                <option value="manual_out">Salida Manual (-)</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Descripción / Motivo</label>
                            <textarea
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                rows="2"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar Ajuste'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

Inventory.layout = page => <MainLayout children={page} />;

export default Inventory;
