import React, { useState } from 'react';
import { Printer, BookOpen, Layers, Image as ImageIcon, Copy, FileQuestion } from 'lucide-react';

const QuoteWizard = ({ onClose, customers = [] }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        workType: 'general',
        format: 'A4',
        customFormat: '',
        componentName: 'Impresión',
        pages: '',
        checkbookType: 'carbonless',
        customerId: '',
        copies: '',
        product: 'GENERAL',
        customerSearch: '',
    });

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else {
            console.log('Next step with data:', formData);
            alert("Funcionalidad del siguiente paso en desarrollo.");
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const workTypes = [
        { id: 'general', label: 'Imprenta general', description: 'Cartas, sobres, tarjetas, papelería comercial, afiches, etiquetas. Packaging. Serigrafía e impresión de objetos.', icon: Printer },
        { id: 'paginated', label: 'Revistas, libros y paginados | Multicomponentes', description: 'Revistas, libros, catálogos, folletos, calendarios. Todo tipo de formas con más de 6 páginas.', icon: BookOpen },
        { id: 'sets', label: 'Talonarios o juegos de hojas', description: 'Libros autocopiativos y no autocopiativos. Juegos de facturas y otros impresos.', icon: Layers },
        { id: 'plotter', label: 'Gran formato (Plotter)', description: '', icon: ImageIcon },
        { id: 'copies', label: 'Copias B/N y Color', description: '', icon: Copy },
        { id: 'free', label: 'Concepto libre', description: '', icon: FileQuestion },
    ];

    const products = [
        'BAGS', 'BIGGER-CARDS', 'CARDS-BUSI', 'DESIGN', 'DIPTYCHS', 'ENVELOPES',
        'FOLDERS', 'FORMS', 'GENERAL', 'INVITATIONS', 'INVOICES', 'LETTERS',
        'MAILINGS', 'MENUS', 'OTHERS', 'POCK-CALEN', 'POSTCARDS', 'POSTERS',
        'STAMPS', 'STICKERS', 'TRIPTYCHS'
    ];

    const formats = [
        { value: 'A6', label: 'A6 14.85x10.5' },
        { value: 'B6', label: 'B6 17.5x12.5' },
        { value: 'A5', label: 'A5 21x14.85' },
        { value: 'B5', label: 'B5 25x17.5' },
        { value: 'A4', label: 'A4 29.7x21' },
        { value: 'B4', label: 'B4 35x25' },
        { value: 'A3', label: 'A3 42x29.7' },
        { value: 'B3', label: 'B3 50x35' },
        { value: 'A2', label: 'A2 59.4x42' },
        { value: 'B2', label: 'B2 70x50' },
        { value: 'A1', label: 'A1 84x59.4' },
        { value: 'B1', label: 'B1 100x70' },
        { value: 'A0', label: 'A0 118.8x84' },
        { value: 'B0', label: 'B0 141.4x100' },
        { value: 'custom', label: '<Otro (escríbalo)>' },
    ];

    const generatePageOptions = () => {
        const options = [];
        // Small even numbers
        for (let i = 2; i <= 12; i += 2) options.push(i);
        // Multiples of 4 and some common page counts
        const others = [16, 20, 24, 28, 30, 32, 36, 40, 48, 50, 56, 64, 80, 96, 100, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 352, 384, 400, 500];
        return [...options, ...others].sort((a, b) => a - b);
    };

    const getStepTitle = () => {
        if (step === 1) return 'Preparar nuevo presupuesto';
        if (step === 2) {
            if (formData.workType === 'paginated') return 'Componente impreso';
            if (formData.workType === 'sets') return 'Talonarios o juegos de hojas';
            if (formData.workType === 'free') return 'Cliente y cantidad de copias';
            return 'Formato del trabajo final';
        }
        return '';
    };

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
                <h2 className="text-2xl font-serif text-gray-700 italic mb-2">
                    {getStepTitle()}
                </h2>

                <div className="flex-grow">
                    {step === 1 && (
                        <>
                            <p className="text-gray-600 mb-6">Este asistente le ayudará a preparar el presupuesto.</p>
                            <h3 className="font-bold text-gray-800 mb-3">Indique el tipo de trabajo:</h3>
                            <div className="space-y-3">
                                {workTypes.map((type) => (
                                    <label key={type.id} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors select-none">
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
                        </>
                    )}

                    {step === 2 && (formData.workType === 'general' || formData.workType === 'plotter' || formData.workType === 'copies') && (
                        <>
                            <p className="text-gray-600 mb-6">Indique el formato del trabajo terminado (cortado, pero sin plegar).</p>

                            <div className="mb-4">
                                <label className="block font-bold text-gray-800 mb-2">Formato final (abierto):</label>
                                <div className="flex items-center space-x-4">
                                    <select
                                        value={formData.format}
                                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                        className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    >
                                        <option disabled value="">&lt;Unidades&gt;</option>
                                        {formats.map(f => (
                                            <option key={f.value} value={f.value}>{f.label}</option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-gray-500 font-bold">(Recuerde que todas las medidas están en centímetros.)</span>
                                </div>
                            </div>

                            {formData.format === 'custom' && (
                                <div className="ml-0 mt-2 p-4 bg-gray-50 rounded-md border border-gray-200 inline-block">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Especifique dimensiones (cm):</label>
                                    <input
                                        type="text"
                                        value={formData.customFormat}
                                        onChange={(e) => setFormData({ ...formData, customFormat: e.target.value })}
                                        placeholder="Ej: 16x11"
                                        className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    />
                                </div>
                            )}

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
                                <FileQuestion className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0 mt-1" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-semibold mb-1">Ayuda:</p>
                                    <p>Puede escribir las dimensiones directamente en el cuadro si selecciona &lt;Otro&gt;. Por ejemplo: 16x11.</p>
                                    <p className="mt-2">Las medidas deben estar al principio (ancho x alto).</p>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && formData.workType === 'paginated' && (
                        <>
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <p className="text-gray-600 mb-2">Los trabajos paginados pueden tener varios componentes impresos (segmentos). Por ejemplo: portada, interior, inserto, etc.</p>
                                <p className="text-gray-600">Asigne un nombre a este componente impreso e indique el número de páginas.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block font-bold text-gray-800 mb-1">Nombre del Componente:</label>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <input
                                            type="text"
                                            value={formData.componentName}
                                            onChange={(e) => setFormData({ ...formData, componentName: e.target.value })}
                                            className="block w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                        <p className="text-sm text-gray-500 italic">Por ejemplo: Portada, Interior, Inserto... Si solo hay un componente puede dejar el nombre 'Impresión'.</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-gray-800 mb-1">Páginas del componente:</label>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <div className="relative w-full sm:w-64">
                                            <input
                                                type="number"
                                                list="pageOptions"
                                                value={formData.pages}
                                                onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                                placeholder="Seleccione o escriba..."
                                            />
                                            <datalist id="pageOptions">
                                                {generatePageOptions().map(num => (
                                                    <option key={num} value={num} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <p className="text-sm text-gray-500 italic">Si el número deseado no está en la lista, escríbalo directamente en el cuadro.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-teal-700 mb-2">Casos especiales:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-600">
                                    <div>
                                        <p className="font-semibold italic mb-1">Cuadernos con tapa impresa:</p>
                                        <p>Coloque el interior como el primer componente. Una vez que se muestre el presupuesto / OT, haga clic en el enlace "Más opciones" y cambie el tipo de papel a "Impresión de libros autocopiativos".</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold italic mb-1">Otros impresos NO paginados:</p>
                                        <p>Para todos los demás trabajos con componentes impresos NO paginados, seleccione "2" en el campo "Páginas del componente".</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && formData.workType === 'sets' && (
                        <>
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <p className="text-gray-600 mb-2">Indique el tipo de talonario.</p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="checkbookType"
                                        value="carbonless"
                                        checked={formData.checkbookType === 'carbonless'}
                                        onChange={(e) => setFormData({ ...formData, checkbookType: e.target.value })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-900 font-medium">Talonario autocopiativo (juegos de hojas)</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="checkbookType"
                                        value="simple"
                                        checked={formData.checkbookType === 'simple'}
                                        onChange={(e) => setFormData({ ...formData, checkbookType: e.target.value })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-900 font-medium">Talonario no autocopiativo (Simple)</span>
                                </label>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-teal-700 mb-2">Blocs de notas, cuadernos y otros talonarios con tapa impresa:</h4>
                                <div className="text-sm text-teal-600">
                                    <p>Para preparar estos presupuestos / OT use la opción de impresos paginados, colocando el interior como el primer componente. Una vez mostrado el presupuesto / OT haga clic en el enlace "Más opciones" y cambie el tipo de impresión a "Impresión de libros no autocopiativos".</p>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    {/* Placeholder for icon */}
                                    <div className="hidden sm:block">
                                        <BookOpen className="h-16 w-16 text-teal-200 rotate-12" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && formData.workType === 'free' && (
                        <>
                            <div className="space-y-6">
                                {/* Customer Selection */}
                                <div>
                                    <label className="block font-bold text-gray-800 mb-1">Cliente:</label>
                                    <div className="relative max-w-lg">
                                        <input
                                            type="text"
                                            list="customerOptions"
                                            value={formData.customerSearch}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const matchedCustomer = customers.find(c => c.name === val);
                                                setFormData({
                                                    ...formData,
                                                    customerSearch: val,
                                                    customerId: matchedCustomer ? matchedCustomer.id : ''
                                                });
                                            }}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            placeholder="Escriba para buscar cliente..."
                                        />
                                        <datalist id="customerOptions">
                                            {customers.map(c => (
                                                <option key={c.id} value={c.name} />
                                            ))}
                                        </datalist>
                                        <div className="mt-1 text-xs text-gray-500">
                                            Puede indicar el código (ID) o escribir parte del nombre del cliente para filtrar.
                                        </div>
                                    </div>
                                </div>

                                {/* Copies */}
                                <div>
                                    <label className="block font-bold text-gray-800 mb-1">Ejemplares (Copias):</label>
                                    <div className="relative max-w-xs">
                                        <input
                                            type="number"
                                            list="copiesOptions"
                                            value={formData.copies}
                                            onChange={(e) => setFormData({ ...formData, copies: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        />
                                        <datalist id="copiesOptions">
                                            {[1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000].map(n => (
                                                <option key={n} value={n} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                {/* Product */}
                                <div>
                                    <label className="block font-bold text-gray-800 mb-1">Producto:</label>
                                    <select
                                        value={formData.product}
                                        onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                        className="block max-w-lg w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                    >
                                        {products.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Opcionalmente, seleccione el tipo de producto. Recuerde que puede configurar su lista de productos desde la pantalla de inicio.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-8 flex justify-end space-x-3 pt-4 border-t">
                    <button
                        onClick={step === 1 ? onClose : handleBack}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        {step === 1 ? 'Cancelar' : '<< Anterior'}
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center"
                    >
                        {step === 2 && formData.workType === 'free' ? 'Terminar' : 'Siguiente >>'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteWizard;
