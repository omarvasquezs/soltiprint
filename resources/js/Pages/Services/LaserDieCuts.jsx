import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function LaserDieCuts() {
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        date: '',
        op: '',
        commercial_advisor_id: '',
        customer_id: '',
        material_id: '',
        design_type: '',
        cm: '',
        factor: '',
        total_amount: '',
        invoice_number: '',
        status: '',
        observations: ''
    });

    useEffect(() => {
        fetchServices();
        fetchDependencies();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/laser-die-cuts');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching laser die cuts:', error);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [custRes, matRes, usersRes] = await Promise.all([
                axios.get('/api/customers'),
                axios.get('/api/materials'),
                axios.get('/api/users') // Assuming a users endpoint exists, otherwise we'll fetch from a generic one if needed.
            ]);
            setCustomers(custRes.data);
            setMaterials(matRes.data);
            // Since we might not have a generic users endpoint exposed yet, let's just leave it empty if it fails.
            if(usersRes && usersRes.data) setUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setCurrentService(service);
            setFormData({
                date: service.date || '',
                op: service.op || '',
                commercial_advisor_id: service.commercial_advisor_id || '',
                customer_id: service.customer_id || '',
                material_id: service.material_id || '',
                design_type: service.design_type || '',
                cm: service.cm || '',
                factor: service.factor || '',
                total_amount: service.total_amount ? parseFloat(service.total_amount).toFixed(2) : '',
                invoice_number: service.invoice_number || '',
                status: service.status || '',
                observations: service.observations || ''
            });
        } else {
            setCurrentService(null);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                op: '',
                commercial_advisor_id: '',
                customer_id: '',
                material_id: '',
                design_type: 'Lineal',
                cm: '',
                factor: '0.36',
                total_amount: '',
                invoice_number: '',
                status: 'Pendiente',
                observations: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            
            // Auto-calculate Total if cm and factor are present
            if (name === 'cm' || name === 'factor') {
                const cmVal = parseFloat(name === 'cm' ? value : prev.cm);
                const factorVal = parseFloat(name === 'factor' ? value : prev.factor);
                if (!isNaN(cmVal) && !isNaN(factorVal)) {
                    newData.total_amount = (cmVal * factorVal).toFixed(2);
                }
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentService) {
                await axios.put(`/api/laser-die-cuts/${currentService.id}`, formData);
            } else {
                await axios.post('/api/laser-die-cuts', formData);
            }
            fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving laser die cut:', error);
            alert('Error al guardar el servicio. Verifica los datos.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                await axios.delete(`/api/laser-die-cuts/${id}`);
                fetchServices();
            } catch (error) {
                console.error('Error deleting laser die cut:', error);
            }
        }
    };

    const filteredServices = services.filter(service => 
        (service.op?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <MainLayout>
            <Head title="Servicio Troqueles Láser" />
            
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Servicio Troqueles Láser</h1>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Registro
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar por OP, Cliente o Factura..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">OP</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto/Descripción</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Diseño</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (S/)</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredServices.map(service => (
                                    <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.date}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{service.op}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.customer?.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.material?.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.design_type}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800 text-right font-medium text-emerald-600">
                                            {service.total_amount ? `S/ ${parseFloat(service.total_amount).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                service.status === 'Facturado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {service.status || 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <button 
                                                onClick={() => handleOpenModal(service)}
                                                className="text-blue-600 hover:text-blue-800 mx-2"
                                                title="Editar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(service.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Eliminar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredServices.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-gray-500">
                                            No se encontraron registros de troqueles láser.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentService ? 'Editar Registro Láser' : 'Nuevo Registro Láser'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" required />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">OP (N° Orden)</label>
                                    <input type="text" name="op" value={formData.op} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" placeholder="Dejar vacío para generar OP automático" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                    <select name="customer_id" value={formData.customer_id} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <option value="">Seleccione un cliente</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto / Descripción</label>
                                    <select name="material_id" value={formData.material_id} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <option value="">Seleccione o escriba...</option>
                                        {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Asesor Comercial</label>
                                    {users.length > 0 ? (
                                        <select name="commercial_advisor_id" value={formData.commercial_advisor_id} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                            <option value="">Seleccione un asesor</option>
                                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" disabled placeholder="No hay usuarios disponibles" className="w-full rounded-lg border-gray-200 bg-gray-100" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diseño</label>
                                    <select name="design_type" value={formData.design_type} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <option value="Lineal">Lineal</option>
                                        <option value="SemiDenso">SemiDenso</option>
                                        <option value="Denso">Denso</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CM (Centímetros)</label>
                                    <input type="number" step="0.01" name="cm" value={formData.cm} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Factor</label>
                                    <input type="number" step="0.01" name="factor" value={formData.factor} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">N° Factura</label>
                                    <input type="text" name="invoice_number" value={formData.invoice_number} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Situación / Estado</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Facturado">Facturado</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total a Cobrar (S/)</label>
                                    <input type="number" step="0.01" name="total_amount" value={formData.total_amount} onChange={handleInputChange} className="w-full rounded-lg border-blue-500 focus:ring-blue-500 bg-blue-50 font-bold text-lg" />
                                    <p className="text-xs text-gray-500 mt-1">Se calcula automáticamente: CM × Factor</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Detalles / Observaciones</label>
                                    <textarea name="observations" rows="3" value={formData.observations} onChange={handleInputChange} className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"></textarea>
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
                                    Guardar Registro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
