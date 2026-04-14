import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../Components/Modal';
import axios from 'axios';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'paper',
        unit: 'millar',
        cost_per_unit: '',
        stock_quantity: 0,
        supplier_id: '',
        grammage: '',
        width_mm: '',
        height_mm: ''
    });
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetchMaterials();
        fetchSuppliers();
    }, []);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/materials');
            setMaterials(response.data);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('/api/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const handleOpenModal = (material = null) => {
        if (material) {
            setCurrentMaterial(material);
            setFormData({
                name: material.name || '',
                type: material.type || 'paper',
                unit: material.unit || 'millar',
                cost_per_unit: material.cost_per_unit ? parseFloat(material.cost_per_unit).toFixed(2) : '',
                stock_quantity: material.stock_quantity || 0,
                supplier_id: material.supplier_id || '',
                grammage: material.grammage || '',
                width_mm: material.width_mm || '',
                height_mm: material.height_mm || ''
            });
        } else {
            setCurrentMaterial(null);
            setFormData({
                name: '',
                type: 'paper',
                unit: 'millar',
                cost_per_unit: '',
                stock_quantity: 0,
                supplier_id: '',
                grammage: '',
                width_mm: '',
                height_mm: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMaterial(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = currentMaterial ? `/api/materials/${currentMaterial.id}` : '/api/materials';
        const method = currentMaterial ? 'put' : 'post';

        try {
            await axios[method](url, formData);
            fetchMaterials();
            handleCloseModal();
        } catch (error) {
            console.error('Error:', error.response?.data || error);
            alert(error.response?.data?.message || 'Error guardando el material. Revisa consola.');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este material?')) {
            try {
                await axios.delete(`/api/materials/${id}`);
                fetchMaterials();
            } catch (error) {
                console.error('Error:', error);
                alert('Error eliminando material');
            }
        }
    };

    if (loading) {
        return <div className="p-4">Cargando materiales...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Materiales</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Material
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
                            placeholder="Buscar materiales..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Unitario</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {materials.map((material) => (
                            <tr key={material.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 uppercase">
                                        {material.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">S/ {parseFloat(material.cost_per_unit).toFixed(2)} / {material.unit}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{material.stock_quantity}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(material)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(material.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {materials.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay materiales registrados aun.
                    </div>
                )}
            </div>

            <Modal
                show={isModalOpen}
                onClose={handleCloseModal}
                title={currentMaterial ? 'Editar Material' : 'Nuevo Material'}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="paper">Papel</option>
                                <option value="ink">Tinta</option>
                                <option value="plate">Placa</option>
                                <option value="chemical">Químico</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unidad</label>
                            <select
                                name="unit"
                                value={formData.unit}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="unit">Unidad</option>
                                <option value="kg">Kg</option>
                                <option value="liter">Litro</option>
                                <option value="millar">Millar</option>
                                <option value="ream">Resma</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Costo Unitario (S/)</label>
                            <input
                                type="number"
                                step="0.001"
                                name="cost_per_unit"
                                value={formData.cost_per_unit}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                    </div>

                    {formData.type === 'paper' && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gramaje (gsm)</label>
                                <input
                                    type="number"
                                    name="grammage"
                                    value={formData.grammage}
                                    onChange={handleChange}
                                    placeholder="Ej: 80"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ancho (mm)</label>
                                <input
                                    type="number"
                                    name="width_mm"
                                    value={formData.width_mm}
                                    onChange={handleChange}
                                    placeholder="Ej: 700"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Largo (mm)</label>
                                <input
                                    type="number"
                                    name="height_mm"
                                    value={formData.height_mm}
                                    onChange={handleChange}
                                    placeholder="Ej: 1000"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                />
                            </div>
                        </div>
                    )}

                    {suppliers.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proveedor Defecto</label>
                            <select
                                name="supplier_id"
                                value={formData.supplier_id}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            >
                                <option value="">Seleccionar Proveedor</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

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

Materials.layout = page => <MainLayout children={page} />;

export default Materials;
