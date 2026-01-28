import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../Components/Modal';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

const Machines = () => {
    const { company } = usePage().props;
    const settings = company?.settings || {};
    const measurementSystem = settings.measurement_system || 'metric';
    const isUS = measurementSystem === 'us';
    const unitLabel = isUS ? 'in' : 'cm';

    // Helper to Convert MM (DB) to Display Unit
    const toDisplay = (mm) => {
        if (!mm) return '';
        return isUS ? (mm / 25.4).toFixed(4).replace(/\.?0+$/, '') : (mm / 10).toFixed(2).replace(/\.?0+$/, '');
    };

    // Helper to Convert Input Unit to MM (DB)
    const toMm = (val) => {
        if (!val) return '';
        const num = parseFloat(val);
        if (isNaN(num)) return '';
        return isUS ? num * 25.4 : num * 10;
    };

    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'offset',
        hourly_rate: '',
        description: '',
        max_width: '', // Stored in mm
        max_height: '', // Stored in mm
        setup_time: '',
        speed_sheets_per_hour: '',
        click_cost_bw: '',
        click_cost_color: ''
    });

    const [displayDims, setDisplayDims] = useState({ w: '', h: '' });

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = () => {
        setLoading(true);
        axios.get('/api/machines')
            .then(response => {
                setMachines(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching machines:', error);
                setLoading(false);
            });
    };

    const handleOpenModal = (machine = null) => {
        if (machine) {
            setCurrentMachine(machine);
            setFormData({
                name: machine.name || '',
                type: machine.type || 'offset',
                hourly_rate: machine.hourly_rate || '',
                description: machine.description || '',
                max_width: machine.max_width || '', // DB column renamed
                max_height: machine.max_height || '',
                setup_time: machine.setup_time || '',
                speed_sheets_per_hour: machine.speed_sheets_per_hour || '',
                click_cost_bw: machine.click_cost_bw || '',
                click_cost_color: machine.click_cost_color || ''
            });
        } else {
            setCurrentMachine(null);
            setFormData({
                name: '',
                type: 'offset',
                hourly_rate: '',
                description: '',
                max_width: '',
                max_height: '',
                setup_time: '',
                speed_sheets_per_hour: '',
                click_cost_bw: '',
                click_cost_color: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMachine(null);
    };

    // Sync display dims when formData changes (e.g. on load/edit)
    useEffect(() => {
        if (isModalOpen) {
            setDisplayDims({
                w: toDisplay(formData.max_width),
                h: toDisplay(formData.max_height)
            });
        }
    }, [formData.max_width, formData.max_height, measurementSystem, isModalOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Custom handler for dimensions inputs
    const handleDimChange = (field, value) => {
        setDisplayDims(prev => ({ ...prev, [field]: value }));
        const mmVal = toMm(value);
        setFormData(prev => ({ ...prev, [field === 'w' ? 'max_width' : 'max_height']: mmVal }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentMachine ? `/api/machines/${currentMachine.id}` : '/api/machines';
        const method = currentMachine ? 'put' : 'post';

        axios({
            method: method,
            url: url,
            data: formData,
        })
            .then(response => {
                fetchMachines();
                handleCloseModal();
            })
            .catch(error => {
                console.error('Error saving machine:', error);
                alert('Ocurrió un error al guardar la máquina.');
            });
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta máquina?')) {
            axios.delete(`/api/machines/${id}`)
                .then(response => {
                    fetchMachines();
                })
                .catch(error => {
                    console.error('Error deleting machine:', error);
                    alert('Ocurrió un error al eliminar la máquina.');
                });
        }
    };

    if (loading) {
        return <div className="p-4">Cargando máquinas...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Máquinas</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Máquina
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
                            placeholder="Buscar máquinas..."
                        />
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dimensiones ({unitLabel})</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa Hora</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {machines.map((machine) => (
                            <tr key={machine.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{machine.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                                        {machine.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {machine.max_width || machine.max_height ?
                                            `${toDisplay(machine.max_width || machine.max_width_mm)} x ${toDisplay(machine.max_height || machine.max_height_mm)} ${unitLabel}`
                                            : '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">S/ {machine.hourly_rate}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(machine)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                        <Pencil className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(machine.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {machines.length === 0 && (
                    <div className="px-6 py-10 text-center text-gray-500">
                        No hay máquinas registradas aun.
                    </div>
                )}
            </div>

            <Modal
                show={isModalOpen}
                onClose={handleCloseModal}
                title={currentMachine ? 'Editar Máquina' : 'Nueva Máquina'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Dynamic Form Content */}
                    <div className="space-y-6">
                        {/* Machine Features - Always visible */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Características de la Máquina</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre / Modelo</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Tipo de Impresión</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    >
                                        <option value="offset">Offset (Hoja)</option>
                                        <option value="offset_continuous">Offset (Continuo)</option>
                                        <option value="digital">Impresión Digital</option>
                                        <option value="plotter">Gran Formato (Plotter)</option>
                                        <option value="reprographics">Reprografía (B/N y Color)</option>
                                        <option value="screen_print">Serigrafía / Tampografía</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Ancho Máximo ({unitLabel})</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="max_width"
                                            value={displayDims.w}
                                            onChange={(e) => handleDimChange('w', e.target.value)}
                                            placeholder={`Ej: ${isUS ? '28' : '72'}`}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Largo Máximo ({unitLabel})</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="max_height"
                                            value={displayDims.h}
                                            onChange={(e) => handleDimChange('h', e.target.value)}
                                            placeholder={`Ej: ${isUS ? '40' : '102'}`}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={2}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Cost/Performance Fields */}
                        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                            <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">Costos y Rendimiento</h3>

                            {/* Offset Specific Fields */}
                            {(formData.type === 'offset' || formData.type === 'offset_continuous' || formData.type === 'screen_print') && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tarifa por Hora (S/)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="hourly_rate"
                                            value={formData.hourly_rate}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tiempo de Puesta a Punto (horas)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="setup_time"
                                            placeholder="Ej: 0.5"
                                            value={formData.setup_time}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Velocidad (Hojas/Hora)</label>
                                        <input
                                            type="number"
                                            name="speed_sheets_per_hour"
                                            placeholder="Ej: 5000"
                                            value={formData.speed_sheets_per_hour}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Digital Specific Fields */}
                            {(formData.type === 'digital' || formData.type === 'reprographics') && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Costo Click B/N (S/)</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            name="click_cost_bw"
                                            value={formData.click_cost_bw}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Costo Click Color (S/)</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            name="click_cost_color"
                                            value={formData.click_cost_color}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Plotter Specific Fields */}
                            {formData.type === 'plotter' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Costo por m² (S/)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="cost_per_m2"
                                            // Need to map this to existing schema or add field? 
                                            // Using hourly_rate as proxy or add validation later
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>
                            )}


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

Machines.layout = page => <MainLayout children={page} />;

export default Machines;
