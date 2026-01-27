import React, { useState, useRef, useEffect } from 'react';
import { Printer, BookOpen, Layers, Image as ImageIcon, Copy, FileQuestion, ChevronDown } from 'lucide-react';

const QuoteWizard = ({
    onClose,
    customers = [],
    machines = [],
    materials = []
}) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        workType: 'general',
        format: '',
        customFormat: '',
        componentName: 'Impresión',
        pages: '',
        checkbookType: 'carbonless',
        customerId: '',
        copies: '',
        product: 'GENERAL',
        customerSearch: '',
        inks: '',
        paperType: '',
        grammage: '<Search>',
        paperDimensions: '<Propose>',
        pressFormat: '<Propose>',
        printingMachine: '<Propose>',
        pressFormat: '<Propose>',
        printingMachine: '<Propose>',
    });

    const [isPaperDropdownOpen, setIsPaperDropdownOpen] = useState(false);
    const paperDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (paperDropdownRef.current && !paperDropdownRef.current.contains(event.target)) {
                setIsPaperDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            if (formData.workType === 'general') {
                setStep(3);
            } else if (formData.workType === 'free') {
                // Finalize for Free Concept
                console.log('Finalizing Free Concept:', formData);
                alert("Presupuesto de concepto libre creado (simulado).");
                onClose();
            } else {
                console.log('Next step with data:', formData);
                alert("Funcionalidad del siguiente paso en desarrollo.");
            }
        } else if (step === 3) {
            if (formData.workType === 'general') {
                setStep(4);
            }
        } else if (step === 4) {
            if (formData.workType === 'general') {
                setStep(5);
            }
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

    const inkOptions = [
        '1+0', '1+1', '2+0', '2+1', '2+2', '4+0', '4+1', '4+2', '4+4', '5+5', '6+6', '7+7'
    ];

    const paperTypes = [
        'BOND', 'Text', 'Acid Free', 'Archival', 'ArtBoard Gloss', 'ArtBoard Matt',
        'ArtPaper Matt', 'Bible', 'Book', 'Bristol',
        'Carbonless Blue Botton', 'Carbonless Blue Middle', 'Carbonless Fuchsia Botton',
        'Carbonless Fuchsia Middle', 'Carbonless Green Botton', 'Carbonless Green Middle',
        'Carbonless White Botton', 'Carbonless White Middle', 'Carbonless White Top',
        'Carbonless Yellow Botton', 'Carbonless Yellow Middle', 'Catalog', 'Coated',
        'Cover', 'Generic', 'Index', 'Ledger', 'Mimeo', 'Newsprint', 'Photocopy paper A3',
        'Rag', 'Splendorgel', 'Tag', 'CANVAS ROLL - 5 METERS WIDTH', 'ROLL BOND',
        'ROLL LABELS 10x13.5 IN 3 COLUMNS', 'ROLL VINILE 3 m wide'
    ];

    const grammages = [
        '<Search>', '0', '40', '48', '60', '65', '70', '75', '80', '90', '100',
        '125', '140', '150', '200', '250', '500', '550', '750', '<->'
    ];

    const paperDimensionsList = [
        '<Propose>', '32x44', '45x64', '65x90', '70x105', '105X130'
    ];

    const pressFormatOptions = [
        '<Propose>', '25x35', '32x44', '45x64', '65x90', '70x102', '102x130'
    ];

    const printingMachineOptions = [
        '<Propose>', 'HEIDE2C72', 'HEIDE4C72', 'NON-PRINT'
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

    // Standard papers library based on Logic Print behavior (Extracted from user screenshots)
    const STANDARD_PAPERS = {
        'Acid Free': { grammages: [75, 90, 115, 120], sizes: ['61x86', '70x100'] },
        'Archival': { grammages: [80, 100, 120], sizes: ['70x100'] },
        'ArtBoard Gloss': { grammages: [200, 250, 300, 350], sizes: ['70x100', '72x102'] },
        'ArtBoard Matt': { grammages: [200, 250, 300, 350], sizes: ['70x100', '72x102'] },
        'ArtPaper Matt': { grammages: [90, 115, 130, 150, 170], sizes: ['61x86', '70x100'] },
        'Bible': { grammages: [35, 40, 45, 50], sizes: ['70x100'] },
        'BOND': { grammages: [60, 70, 75, 80, 90, 100, 115, 120], sizes: ['61x86', '70x100', '72x102'] },
        'Book': { grammages: [60, 70, 80, 90], sizes: ['61x86', '70x100'] },
        'Bristol': { grammages: [180, 220, 240, 260], sizes: ['70x100', '72x102'] },
        'Carbonless Blue Botton': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Blue Middle': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Fuchsia Botton': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Fuchsia Middle': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Green Botton': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Green Middle': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless White Botton': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless White Middle': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless White Top': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Yellow Botton': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Carbonless Yellow Middle': { grammages: [50, 56, 60], sizes: ['61x86', '72x102'] },
        'Catalog': { grammages: [115, 130, 150, 170], sizes: ['70x100'] },
        'Coated': { grammages: [90, 115, 130, 150], sizes: ['61x86', '70x100'] },
        'Cover': { grammages: [200, 250, 300], sizes: ['70x100'] },
        'Folcote': { grammages: [210, 225, 240, 260, 280, 300, 320, 350], sizes: ['72x102'] },
        'Generic': { grammages: [0, 60, 80, 200], sizes: ['70x100'] },
        'Index': { grammages: [90, 120, 150, 180], sizes: ['70x100'] },
        'Ledger': { grammages: [90, 120, 150], sizes: ['70x100'] },
        'Mimeo': { grammages: [70, 75, 80], sizes: ['61x86', '70x100'] },
        'Newsprint': { grammages: [45, 48, 52], sizes: ['61x86', '70x100'] },
        'Photocopy paper A3': { grammages: [75, 80], sizes: ['29.7x42'] },
        'Rag': { grammages: [80, 90, 100], sizes: ['70x100'] },
        'Splendorgel': { grammages: [100, 120, 140, 160, 230, 270, 300], sizes: ['72x102'] },
        'Tag': { grammages: [150, 180, 200, 240], sizes: ['70x100'] },
        'Text': { grammages: [75, 90, 115, 125], sizes: ['61x86', '70x100'] },
        // Rolls
        'CANVAS ROLL - 5 METERS WIDTH': { grammages: [300, 350], sizes: ['500x1000'] },
        'ROLL BOND': { grammages: [75, 80, 90], sizes: ['61x1000', '90x1000'] },
        'ROLL LABELS 10x13.5 IN 3 COLUMNS': { grammages: [80, 90], sizes: ['25.4x1000'] },
        'ROLL VINILE 3 m wide': { grammages: [100, 120, 150], sizes: ['300x1000'] },
    };

    // Filter customers based on search input
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(formData.customerSearch.toLowerCase())
    );

    // Dynamic filtering for Step 4 (Paper)
    const availablePapers = Array.from(new Set([
        ...Object.keys(STANDARD_PAPERS),
        ...materials.filter(m => m.type === 'paper').map(m => m.name)
    ])).sort();

    const getGrammagesForPaper = (paperName) => {
        const dbGrammages = materials
            .filter(m => m.type === 'paper' && m.name === paperName)
            .map(m => m.grammage)
            .filter(Boolean);

        const stdGrammages = STANDARD_PAPERS[paperName]?.grammages || [];
        const uniqueGrammages = Array.from(new Set([...dbGrammages, ...stdGrammages]));

        return ['<Unidades>', '<Buscar>', '<->', ...uniqueGrammages.sort((a, b) => a - b)];
    };

    const getDimensionsForPaper = (paperName) => {
        const dbDims = materials
            .filter(m => m.type === 'paper' && m.name === paperName)
            .map(m => `${m.width_mm / 10}x${m.height_mm / 10}`)
            .filter(d => d !== '0x0');

        const stdDims = STANDARD_PAPERS[paperName]?.sizes || [];
        const uniqueDims = Array.from(new Set([...dbDims, ...stdDims]));

        return ['<Unidades>', '<Propose>', ...uniqueDims];
    };

    // Dynamic filtering for Step 5 (Print)
    const getMachinesForFormat = (formatStr) => {
        if (!formatStr || formatStr === '<Propose>') return machines;

        // Parse format like "70x100" (cm) to mm
        const parts = formatStr.split('x').map(p => parseFloat(p) * 10);
        if (parts.length !== 2) return machines;

        const [w, h] = parts;
        return machines.filter(m => {
            if (!m.max_width_mm || !m.max_height_mm) return true; // Show machines without constraints
            // Check both orientations
            return (m.max_width_mm >= w && m.max_height_mm >= h) || (m.max_width_mm >= h && m.max_height_mm >= w);
        });
    };

    const isNextDisabled = () => {
        if (step === 2 && (formData.workType === 'general' || formData.workType === 'plotter' || formData.workType === 'copies')) {
            return !formData.format || (formData.format === 'custom' && !formData.customFormat);
        }
        if (step === 3 && formData.workType === 'general') {
            return !formData.inks;
        }
        if (step === 4 && formData.workType === 'general') {
            return !formData.paperType;
        }
        if (step === 5 && formData.workType === 'general') {
            return !formData.pressFormat || formData.pressFormat === '<Propose>' ||
                !formData.printingMachine || formData.printingMachine === '<Propose>';
        }
        return false;
    };

    const getStepTitle = () => {
        if (step === 1) return 'Preparar nuevo presupuesto';
        if (step === 2) {
            if (formData.workType === 'paginated') return 'Componente impreso';
            if (formData.workType === 'sets') return 'Talonarios o juegos de hojas';
            if (formData.workType === 'free') return 'Cliente y cantidad de copias';
            return 'Formato del trabajo final';
        }
        if (step === 3) {
            if (formData.workType === 'general') return 'Número de tintas';
        }
        if (step === 4) {
            if (formData.workType === 'general') return 'Papel o soporte de impresión';
        }
        if (step === 5) {
            if (formData.workType === 'general') return 'Impresión';
        }
        return '';
    };

    return (
        <div className="flex h-[80vh]">
            {/* Left Image Sidebar */}
            <div className="hidden md:flex w-1/3 bg-gray-100 items-center justify-center p-4 border-r">
                <div className="text-gray-400 text-center">
                    <Printer className="h-24 w-24 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Asistente de Presupuestos</span>
                </div>
            </div>

            {/* Right Content */}
            <div className="w-full md:w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-serif text-gray-700 italic">
                        {getStepTitle()}
                    </h2>

                </div>

                <div className="flex-grow overflow-y-auto pr-2">
                    {step === 1 && (
                        <>
                            <p className="text-gray-600 mb-6 font-serif italic text-lg">Este asistente le ayudará a preparar el presupuesto.</p>
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

                            <div className="mt-8">
                                <p className="text-gray-500 text-sm mb-2">Si el formato deseado no está en la lista, escríbalo directamente en el cuadro. Por ejemplo: 16x11.</p>
                                <p className="text-gray-500 text-sm italic mb-2">Opcionalmente, puede añadir el nombre del formato (al principio).</p>
                                <p className="text-gray-500 text-sm italic">Los formatos más usados en sus trabajos se añaden automáticamente a la lista.</p>
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

                    {step === 3 && formData.workType === 'general' && (
                        <>
                            <p className="text-gray-600 mb-6">Indique el número de tintas (frente + dorso).</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block font-bold text-gray-800 mb-2">Tintas:</label>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative w-full sm:w-64">
                                            <input
                                                type="text"
                                                list="inkOptions"
                                                value={formData.inks}
                                                onChange={(e) => setFormData({ ...formData, inks: e.target.value })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 text-blue-600 font-bold"
                                                placeholder="Ej: 4+0"
                                            />
                                            <datalist id="inkOptions">
                                                {inkOptions.map(opt => (
                                                    <option key={opt} value={opt} />
                                                ))}
                                            </datalist>
                                        </div>
                                        <span className="text-gray-900 font-bold">(Frente + dorso)</span>
                                    </div>
                                </div>

                                <div className="text-gray-600 text-sm space-y-2">
                                    <p>Por ejemplo, "4+1" indica 4 tintas en el frente y 1 en el dorso.</p>
                                    <p className="italic text-gray-500">Si las tintas deseadas no están en la lista, escríbalo directamente en el cuadro. Por ejemplo: "5+4"</p>
                                </div>

                                <div className="mt-8 flex items-center space-x-6">
                                    <div className="h-24 w-24 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden border">
                                        {/* Color wheel representation */}
                                        <div className="grid grid-cols-2 h-full w-full rotate-45 scale-150">
                                            <div className="bg-cyan-400"></div>
                                            <div className="bg-magenta-500"></div>
                                            <div className="bg-yellow-300"></div>
                                            <div className="bg-black"></div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-3">
                                        <p className="font-bold">Puede introducir posteriormente el Pantone u otros detalles en la descripción ampliada del trabajo.</p>
                                        <p className="italic text-gray-400">Si lo desea, podrá modificar el número de tintas y otros datos más adelante.</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 4 && formData.workType === 'general' && (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-grow">
                                    <p className="text-gray-600 mb-2">Indique el papel o soporte de impresión.</p>
                                </div>
                                <div className="hidden lg:block ml-4">
                                    {/* Placeholder for scroll image */}
                                    <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 rotate-12 shadow-sm">
                                        <div className="h-12 w-12 bg-amber-100 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-3xl">
                                {/* Paper Type */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                    <label className="lg:col-span-3 font-bold text-gray-800 text-sm lg:text-base">Papel o soporte:</label>
                                    <div className="lg:col-span-4 relative" ref={paperDropdownRef}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={formData.paperType}
                                                placeholder="Escriba o seleccione un papel..."
                                                onChange={(e) => {
                                                    const newVal = e.target.value;
                                                    setFormData({
                                                        ...formData,
                                                        paperType: newVal,
                                                        grammage: '<Search>',
                                                        paperDimensions: '<Propose>'
                                                    });
                                                    setIsPaperDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsPaperDropdownOpen(true)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsPaperDropdownOpen(!isPaperDropdownOpen)}
                                                className="absolute inset-y-0 right-0 px-2 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {isPaperDropdownOpen && (
                                            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {(() => {
                                                    const isExactMatch = availablePapers.includes(formData.paperType);
                                                    const filtered = isExactMatch
                                                        ? availablePapers
                                                        : availablePapers.filter(p =>
                                                            !formData.paperType ||
                                                            p.toLowerCase().includes(formData.paperType.toLowerCase())
                                                        );

                                                    if (filtered.length === 0) {
                                                        return (
                                                            <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500 italic">
                                                                No se encontraron resultados
                                                            </li>
                                                        );
                                                    }

                                                    return filtered.map(p => (
                                                        <li
                                                            key={p}
                                                            className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-blue-100 text-gray-900 ${formData.paperType === p ? 'bg-blue-50 font-medium' : ''}`}
                                                            onClick={() => {
                                                                setFormData({
                                                                    ...formData,
                                                                    paperType: p,
                                                                    grammage: '<Search>',
                                                                    paperDimensions: '<Propose>'
                                                                });
                                                                setIsPaperDropdownOpen(false);
                                                            }}
                                                        >
                                                            {p}
                                                        </li>
                                                    ));
                                                })()}
                                            </ul>
                                        )}
                                        {/* Simplified Logic for List Rendering: Always show filtered list, BUT if user clicks chevron, toggle open. 
                                            The issue is standard behavior: if I type 'B', I see 'Bond'. If I click chevron, I want to see 'Acid Free', 'Bond', etc?
                                            Let's implement: If I am editing, filter. If I am just viewing (exact match), show all?
                                            Better: Show all availablePapers if Filtered list is empty? No.
                                            Let's just show filtered list. If user wants to see all, they delete text. 
                                            Wait, "hasta que no borre el contenido". 
                                            How about a "Clear" button?
                                            Or: If the input matches a valid option EXACTLY, show ALL options? 
                                            Let's try: If (exact match) -> Show All. Else -> Show Filtered.
                                        */}
                                    </div>
                                    <div className="lg:col-span-5 text-sm text-gray-500 italic">
                                        Elija de la lista, o escriba, el tipo de papel o soporte. <br />
                                        (Para impresión en continuo elija un soporte bobina, al final de la lista desplegable)
                                    </div>
                                </div>

                                {/* Grammage */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                    <label className="lg:col-span-3 font-bold text-gray-800 text-sm lg:text-base">Gramaje:</label>
                                    <div className="lg:col-span-4">
                                        <select
                                            value={formData.grammage}
                                            onChange={(e) => setFormData({ ...formData, grammage: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        >
                                            {getGrammagesForPaper(formData.paperType).map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="lg:col-span-5 text-sm text-gray-500 italic">
                                        Para buscar el gramaje introducido en la ficha del Artículo, seleccione el valor "&lt;Buscar&gt;". Si es un soporte donde el gramaje no es importante, seleccione el valor "&lt;-&gt;".
                                    </div>
                                </div>

                                {/* Dimensions */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                    <label className="lg:col-span-3 font-bold text-gray-800 text-sm lg:text-base">Dimensiones:</label>
                                    <div className="lg:col-span-4">
                                        <select
                                            value={formData.paperDimensions}
                                            onChange={(e) => setFormData({ ...formData, paperDimensions: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        >
                                            {getDimensionsForPaper(formData.paperType).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="lg:col-span-5 text-sm text-gray-500 italic">
                                        Elija de la lista las dimensiones originales del papel o soporte (sin cortar). Opcionalmente, puede dejar que el software proponga (recomendado).
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 5 && formData.workType === 'general' && (
                        <>
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex-grow">
                                    <p className="text-gray-600 mb-2">Indique el formato de máquina a la entrada de máquina. (Opcionalmente, el software puede proponerlo)</p>
                                </div>
                                <div className="hidden lg:block ml-4">
                                    {/* Placeholder for old press image */}
                                    <div className="h-24 w-24 bg-sepia-100 rounded-lg flex items-center justify-center border border-sepia-200 shadow-sm opacity-80">
                                        <Printer className="h-16 w-16 text-amber-900 opacity-60" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8 max-w-3xl">
                                {/* Press Format */}
                                <div>
                                    <label className="block font-bold text-gray-800 mb-2">Formato de máquina:</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                        <select
                                            value={formData.pressFormat}
                                            onChange={(e) => setFormData({ ...formData, pressFormat: e.target.value })}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                        >
                                            {pressFormatOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <p className="text-sm text-gray-500 italic">Si las dimensiones deseadas no están en la lista, escríbalo directamente en el cuadro.</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-6">
                                    <p className="text-gray-600 mb-4">Introduzca la máquina para imprimir el trabajo. (Opcionalmente, puede dejar que el software proponga.)</p>

                                    {/* Printing Machine */}
                                    <div>
                                        <label className="block font-bold text-gray-800 mb-2">Máquina de impresión:</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                            <select
                                                value={formData.printingMachine}
                                                onChange={(e) => setFormData({ ...formData, printingMachine: e.target.value })}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                                            >
                                                <option value="<Propose>">&lt;Propose&gt;</option>
                                                {getMachinesForFormat(formData.pressFormat).map(m => (
                                                    <option key={m.id} value={m.name}>{m.name}</option>
                                                ))}
                                            </select>
                                            <p className="text-sm text-gray-500 italic">Muestra las máquinas configuradas actualmente. Si no ha introducido los datos de sus máquinas, se mostrarán algunas por defecto.</p>
                                        </div>
                                    </div>
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
                        disabled={isNextDisabled()}
                        className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${isNextDisabled()
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {step === 2 && formData.workType === 'free' ? 'Terminar' : (step === 3 && formData.workType === 'general' ? 'Siguiente >>' : (step === 4 && formData.workType === 'general' ? 'Siguiente >>' : (step === 5 && formData.workType === 'general' ? 'Siguiente >>' : 'Siguiente >>')))}
                    </button>
                </div>
            </div>
        </div >
    );
};

export default QuoteWizard;
