import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const STEP_GENERAL = 1;
const STEP_PREPRESS = 2;
const STEP_FINISHING = 3;
const STEP_BILLING = 4;

export default function ThirdPartyServices() {
    const [services, setServices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Stepper state
    const [currentStep, setCurrentStep] = useState(STEP_GENERAL);

    const [formData, setFormData] = useState({
        // 1. Datos Generales
        op: '', date: '', customer_id: '', material_id: '', details: '', requested_quantity: '',
        // 2. Corte Inicial
        corte_in: '', corte_in_tiempo_total: '', corte_in_s_hora: '', corte_in_s_total: '',
        // 3. Impresión
        impresion: '', imp_total: '', imp_a_facturar: '', imp_s_millar: '', imp_s_total: '',
        // 4. Barniz
        barniz: '', bar_total: '', bar_s: '', bar_s_millar: '', bar_s_total: '',
        // 5. Corte Final
        corte_final: '', cortf_total: '', cortf_s_hora: '', cortf_s_total: '',
        // 6. Troquel
        troquel: '', troq_total: '', troq_s: '', troq_s_millar: '', troq_s_total: '',
        // 7. Plástico
        plastico: '', plas_total: '', plas_s: '', plas_s_millar: '', plas_s_total: '',
        // 8. Sectorizado
        sectorizado: '', sect_total: '', sect_s: '', sect_s_millar: '', sect_s_total: '',
        // 9. Otros
        otros_acabados: '', otros_cantidad_s: '', otros_s_millar: '', otros_s_total: '',
        // 10. Liquidación
        total_cobrar: '', estado_1: '', estado_2: '', n_factura: '', razon_social: '', fecha_observacion: ''
    });

    useEffect(() => {
        fetchServices();
        fetchDependencies();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/third-party-services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching third party services:', error);
        }
    };

    const fetchDependencies = async () => {
        try {
            const [custRes, matRes] = await Promise.all([
                axios.get('/api/customers'),
                axios.get('/api/materials')
            ]);
            setCustomers(custRes.data);
            setMaterials(matRes.data);
        } catch (error) {
            console.error('Error fetching dependencies:', error);
        }
    };

    const handleOpenModal = (service = null) => {
        setCurrentStep(STEP_GENERAL);
        if (service) {
            setCurrentService(service);
            // Map existing data, filling nulls with empty strings
            const newFormData = {};
            Object.keys(formData).forEach(key => {
                newFormData[key] = service[key] ?? '';
            });
            setFormData(newFormData);
        } else {
            setCurrentService(null);
            const emptyForm = {};
            Object.keys(formData).forEach(key => emptyForm[key] = '');
            emptyForm.date = new Date().toISOString().split('T')[0];
            setFormData(emptyForm);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentService(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateTotals = () => {
        // Example simple logic to sum all "s_total" fields to suggest total_cobrar
        const fieldsToSum = [
            'corte_in_s_total', 'imp_s_total', 'bar_s_total', 'cortf_s_total',
            'troq_s_total', 'plas_s_total', 'sect_s_total', 'otros_s_total'
        ];
        let total = 0;
        fieldsToSum.forEach(f => {
            const val = parseFloat(formData[f]);
            if (!isNaN(val)) total += val;
        });
        setFormData(prev => ({ ...prev, total_cobrar: total.toFixed(2) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentService) {
                await axios.put(`/api/third-party-services/${currentService.id}`, formData);
            } else {
                await axios.post('/api/third-party-services', formData);
            }
            fetchServices();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving third party service:', error);
            alert('Error al guardar el servicio. Verifica los datos.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este registro?')) {
            try {
                await axios.delete(`/api/third-party-services/${id}`);
                fetchServices();
            } catch (error) {
                console.error('Error deleting third party service:', error);
            }
        }
    };

    const filteredServices = services.filter(service => 
        (service.op?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.n_factura?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Stepper UI Component Helpers
    const steps = [
        { id: STEP_GENERAL, name: 'Datos Generales', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { id: STEP_PREPRESS, name: 'Corte e Impresión', icon: 'M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z' },
        { id: STEP_FINISHING, name: 'Acabados', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
        { id: STEP_BILLING, name: 'Liquidación', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    ];

    return (
        <MainLayout>
            <Head title="Servicio a Terceros" />
            
            <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Servicio a Terceros</h1>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Solicitud
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
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">OP / Fecha</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalles</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total (S/)</th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredServices.map(service => (
                                    <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="text-sm font-bold text-gray-800">{service.op || '-'}</div>
                                            <div className="text-xs text-gray-500">{service.date}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.customer?.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-800">{service.material?.name}</td>
                                        <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate" title={service.details}>
                                            {service.details || '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right font-bold text-indigo-600">
                                            {service.total_cobrar ? `S/ ${parseFloat(service.total_cobrar).toFixed(2)}` : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                service.estado_1?.toLowerCase().includes('facturad') ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {service.estado_1 || 'Registrado'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <button 
                                                onClick={() => handleOpenModal(service)}
                                                className="text-indigo-600 hover:text-indigo-800 mx-2"
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
                                        <td colSpan="7" className="py-8 text-center text-gray-500">
                                            No se encontraron servicios a terceros registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ARTISTIC STEPPER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {currentService ? `Editando OP: ${formData.op}` : 'Nuevo Servicio a Terceros'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Stepper Navigation */}
                        <div className="bg-white px-6 py-4 border-b border-gray-200">
                            <nav aria-label="Progress">
                                <ol role="list" className="flex items-center justify-between">
                                    {steps.map((step, stepIdx) => (
                                        <li key={step.name} className={`relative flex-1 ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                                <div className={`h-1 w-full rounded ${step.id < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setCurrentStep(step.id)}
                                                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                                                    step.id < currentStep ? 'border-indigo-600 bg-indigo-600 hover:bg-indigo-700' : 
                                                    step.id === currentStep ? 'border-indigo-600 bg-white' : 
                                                    'border-gray-300 bg-white hover:border-gray-400'
                                                }`}
                                            >
                                                <svg className={`h-5 w-5 ${step.id < currentStep ? 'text-white' : step.id === currentStep ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step.icon} />
                                                </svg>
                                                <span className={`absolute -bottom-6 w-max text-xs font-medium ${step.id === currentStep ? 'text-indigo-600' : 'text-gray-500'}`}>
                                                    {step.name}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>

                        {/* Form Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                            
                            {currentStep === STEP_GENERAL && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Información Principal</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Orden de Producción (OP)</label>
                                            <input type="text" name="op" value={formData.op} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Ej. OP-1045" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                            <select name="customer_id" value={formData.customer_id} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                                <option value="">Seleccione un cliente</option>
                                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                                            <select name="material_id" value={formData.material_id} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                                                <option value="">Seleccione o escriba...</option>
                                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Solicitada</label>
                                            <input type="number" name="requested_quantity" value={formData.requested_quantity} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Ej. 1000" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Detalles del Servicio</label>
                                            <textarea name="details" rows="3" value={formData.details} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" placeholder="Descripción extendida del trabajo..."></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === STEP_PREPRESS && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                                    <section>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 text-indigo-800">A. Corte Inicial</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Corte In.</label>
                                                <input type="number" step="0.01" name="corte_in" value={formData.corte_in} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Tiempo Total</label>
                                                <input type="number" step="0.01" name="corte_in_tiempo_total" value={formData.corte_in_tiempo_total} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">S/ Hora</label>
                                                <input type="number" step="0.01" name="corte_in_s_hora" value={formData.corte_in_s_hora} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">S/ TOTAL</label>
                                                <input type="number" step="0.01" name="corte_in_s_total" value={formData.corte_in_s_total} onChange={handleInputChange} className="w-full rounded border-indigo-300 bg-indigo-50 font-bold text-sm" />
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4 text-indigo-800">B. Impresión</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Impresión</label>
                                                <input type="number" step="0.01" name="impresion" value={formData.impresion} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Imp. Total</label>
                                                <input type="number" step="0.01" name="imp_total" value={formData.imp_total} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">A Facturar</label>
                                                <input type="number" step="0.01" name="imp_a_facturar" value={formData.imp_a_facturar} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">S/ Millar</label>
                                                <input type="number" step="0.01" name="imp_s_millar" value={formData.imp_s_millar} onChange={handleInputChange} className="w-full rounded border-gray-300 text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 mb-1">S/ TOTAL</label>
                                                <input type="number" step="0.01" name="imp_s_total" value={formData.imp_s_total} onChange={handleInputChange} className="w-full rounded border-indigo-300 bg-indigo-50 font-bold text-sm" />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {currentStep === STEP_FINISHING && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    {/* Utility to render finishings */}
                                    {[
                                        { title: 'Barniz', pfx: 'bar', db_pfx: 'bar', text_f: 'barniz' },
                                        { title: 'Corte Final', pfx: 'cortf', db_pfx: 'cortf', text_f: 'corte_final', is_hour: true },
                                        { title: 'Troquel', pfx: 'troq', db_pfx: 'troq', text_f: 'troquel' },
                                        { title: 'Plástico', pfx: 'plas', db_pfx: 'plas', text_f: 'plastico' },
                                        { title: 'Sectorizado', pfx: 'sect', db_pfx: 'sect', text_f: 'sectorizado' },
                                        { title: 'Otros Acabados', pfx: 'otros', db_pfx: 'otros', text_f: 'otros_acabados', alt_qty: 'otros_cantidad_s' },
                                    ].map(f => (
                                        <div key={f.title} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">{f.title}</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                <div className="md:col-span-2">
                                                    <input type="text" placeholder="Descripción" name={f.text_f} value={formData[f.text_f]} onChange={handleInputChange} className="w-full rounded border-gray-200 text-sm" />
                                                </div>
                                                <div>
                                                    <input type="number" step="0.01" placeholder={f.alt_qty ? "Cant." : "Total/Cant."} name={f.alt_qty || `${f.db_pfx}_total`} value={formData[f.alt_qty || `${f.db_pfx}_total`]} onChange={handleInputChange} className="w-full rounded border-gray-200 text-sm" />
                                                </div>
                                                <div>
                                                    <input type="number" step="0.01" placeholder={f.is_hour ? "S/ Hora" : "S/ Millar"} name={f.is_hour ? `${f.db_pfx}_s_hora` : `${f.db_pfx}_s_millar`} value={formData[f.is_hour ? `${f.db_pfx}_s_hora` : `${f.db_pfx}_s_millar`]} onChange={handleInputChange} className="w-full rounded border-gray-200 text-sm" />
                                                </div>
                                                <div>
                                                    <input type="number" step="0.01" placeholder="S/ Total" name={`${f.db_pfx}_s_total`} value={formData[`${f.db_pfx}_s_total`]} onChange={handleInputChange} className="w-full rounded border-indigo-200 bg-indigo-50 font-bold text-sm" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {currentStep === STEP_BILLING && (
                                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-indigo-900">Liquidación Final</h3>
                                            <p className="text-sm text-indigo-700 mt-1">Verifique el importe a cobrar</p>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <button type="button" onClick={calculateTotals} className="text-xs text-indigo-600 hover:underline">Autocalcular Sumas</button>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">S/</span>
                                                <input type="number" step="0.01" name="total_cobrar" value={formData.total_cobrar} onChange={handleInputChange} className="pl-8 pr-4 py-3 rounded-lg border-indigo-300 shadow-sm text-xl font-black text-gray-900 w-48 text-right focus:border-indigo-500 focus:ring-indigo-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de OP</label>
                                            <select name="estado_1" value={formData.estado_1} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500">
                                                <option value="">Seleccionar...</option>
                                                <option value="Pendiente">Pendiente</option>
                                                <option value="En Proceso">En Proceso</option>
                                                <option value="Finalizado">Finalizado</option>
                                                <option value="Entregado">Entregado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado de Pago</label>
                                            <select name="estado_2" value={formData.estado_2} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500">
                                                <option value="">Seleccionar...</option>
                                                <option value="Por Cobrar">Por Cobrar</option>
                                                <option value="Facturado">Facturado</option>
                                                <option value="Pagado">Pagado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">N° Factura</label>
                                            <input type="text" name="n_factura" value={formData.n_factura} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500" placeholder="Ej. F001-00045" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social Factura</label>
                                            <input type="text" name="razon_social" value={formData.razon_social} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Cobro / Observaciones Finales</label>
                                            <textarea name="fecha_observacion" rows="2" value={formData.fecha_observacion} onChange={handleInputChange} className="w-full rounded-lg border-gray-300 focus:border-indigo-500"></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer / Actions */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center rounded-b-2xl">
                            <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                                Cancelar
                            </button>
                            <div className="flex gap-3">
                                {currentStep > STEP_GENERAL && (
                                    <button type="button" onClick={() => setCurrentStep(prev => prev - 1)} className="px-5 py-2.5 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">
                                        Anterior
                                    </button>
                                )}
                                {currentStep < STEP_BILLING ? (
                                    <button type="button" onClick={() => setCurrentStep(prev => prev + 1)} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm">
                                        Siguiente Paso
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        Guardar Servicio Completo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
