import React, { useState } from 'react';
import { Printer, BookOpen, Layers, Image as ImageIcon, Copy, FileQuestion } from 'lucide-react';

const QuoteWizard = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        workType: 'general',
    });

    const handleNext = () => {
        // Placeholder for next step logic
        console.log('Next step with data:', formData);
        // setStep(step + 1); 
        // For now, just close or log, as step 2 is TBD
        alert("Funcionalidad del siguiente paso en desarrollo.");
    };

    const workTypes = [
        { id: 'general', label: 'Imprenta general', description: 'Cartas, sobres, tarjetas, papelería comercial, afiches, etiquetas. Packaging. Serigrafía e impresión de objetos.', icon: Printer },
        { id: 'paginated', label: 'Revistas, libros y paginados | Multicomponentes', description: 'Revistas, libros, catálogos, folletos, calendarios. Todo tipo de formas con más de 6 páginas.', icon: BookOpen },
        { id: 'sets', label: 'Talonarios o juegos de hojas', description: 'Libros autocopiativos y no autocopiativos. Juegos de facturas y otros impresos.', icon: Layers },
        { id: 'plotter', label: 'Gran formato (Plotter)', description: '', icon: ImageIcon },
        { id: 'copies', label: 'Copias B/N y Color', description: '', icon: Copy },
        { id: 'free', label: 'Concepto libre', description: '', icon: FileQuestion },
    ];

    return (
        <div className="flex h-full">
            {/* Left Image Sidebar */}
            <div className="hidden md:flex w-1/3 bg-gray-100 items-center justify-center p-4 border-r">
                <div className="text-gray-400 text-center">
                    <Printer className="h-24 w-24 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Asistente de Presupuestos</span>
                </div>
            </div>

            {/* Right Content */}
            <div className="w-full md:w-2/3 p-6 flex flex-col">
                <h2 className="text-2xl font-serif text-gray-700 italic mb-2">Preparar nuevo presupuesto</h2>
                <p className="text-gray-600 mb-6">Este asistente le ayudará a preparar el presupuesto.</p>

                <div className="flex-grow">
                    <h3 className="font-bold text-gray-800 mb-3">Indique el tipo de trabajo:</h3>
                    <div className="space-y-3">
                        {workTypes.map((type) => (
                            <label key={type.id} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">
                                <input
                                    type="radio"
                                    name="workType"
                                    value={type.id}
                                    checked={formData.workType === type.id}
                                    onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <div>
                                    <span className="block font-medium text-gray-900">{type.label}</span>
                                    {type.description && (
                                        <span className="block text-sm text-gray-500">{type.description}</span>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
                    >
                        Siguiente &gt;&gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteWizard;
