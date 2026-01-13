import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Modal from '../Components/Modal';

const Machines = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMachine, setCurrentMachine] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'offset',
        hourly_rate: '',
        description: ''
    });

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = () => {
        setLoading(true);
        fetch('/api/machines')
            .then(response => response.json())
            .then(data => {
                setMachines(data);
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
            });
        } else {
            setCurrentMachine(null);
            setFormData({
                name: '',
                type: 'offset',
                hourly_rate: '',
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentMachine(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = currentMachine ? `/api/machines/${currentMachine.id}` : '/api/machines';
        const method = currentMachine ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) throw new Error('Error saving machine');
                return response.json();
            })
            .then(() => {
                fetchMachines();
                handleCloseModal();
            })
            .catch(error => console.error('Error:', error));
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta máquina?')) {
            fetch(`/api/machines/${id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error deleting machine');
                    fetchMachines();
                })
                .catch(error => console.error('Error:', error));
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
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={currentMachine ? 'Editar Máquina' : 'Nueva Máquina'}
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
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        >
                            <option value="offset">Offset</option>
                            <option value="digital">Digital</option>
                            <option value="plotter">Plotter</option>
                            <option value="guillotine">Guillotina</option>
                            <option value="other">Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tarifa por Hora (S/)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="hourly_rate"
                            value={formData.hourly_rate}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            name="description"
                            value={formData.description}
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

export default Machines;
