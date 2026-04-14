import React, { useState, useEffect } from 'react';
import { X, FileText, Calculator } from 'lucide-react';

const QuoteDetailsModal = ({ isOpen, onClose, quoteData, onSave }) => {
    const [details, setDetails] = useState({
        customer_id: '',
        customer_name: '',
        description: 'GENERAL',
        state: 'Draft',
        copies: 0,

        // Definition of work
        finish_format: '',
        inks: '',
        pages: '',
        press_format: '',
        machine_name: '',
        machine_id: null,
        paper_type: '',
        grammage: '',
        paper_dimensions: '',
        manufacturer: '',
        article_id: '',

        // Costs
        cost_materials: 0,
        cost_operations: 0,
        total_cost: 0,
        margin: 40,
        profit: 0,
        unit_price: 0,
        total_amount: 0,

        notes: ''
    });

    useEffect(() => {
        if (isOpen && quoteData) {
            // Populate details from wizard + selected machine
            const machine = quoteData.selectedMachine || {};

            setDetails({
                customer_id: quoteData.customerId || '',
                customer_name: quoteData.customerSearch || '',
                description: quoteData.product || 'GENERAL',
                state: 'Draft',
                copies: parseInt(quoteData.copies) || 0,

                finish_format: quoteData.format || '',
                inks: quoteData.inks || '',
                pages: quoteData.pages || '',
                press_format: quoteData.pressFormat || machine.press_format || '',
                machine_name: machine.machine_name || quoteData.printingMachine || '',
                machine_id: machine.machine_id || null,
                paper_type: quoteData.paperType || '',
                grammage: quoteData.grammage || '',
                paper_dimensions: quoteData.paperDimensions || machine.paper_size || '',
                manufacturer: 'Domtar Paper',
                article_id: machine.media_id || '',

                cost_materials: parseFloat(machine.cost || 0) * 0.5,
                cost_operations: parseFloat(machine.cost || 0) * 0.5,
                total_cost: parseFloat(machine.cost || 0),
                margin: 40,
                profit: 0,
                unit_price: 0,
                total_amount: 0,

                notes: ''
            });

            // Trigger initial calculation
            setTimeout(() => handleRecalculate(), 100);
        }
    }, [isOpen, quoteData]);

    // Auto-recalculate when cost, margin, or copies change
    useEffect(() => {
        if (details.total_cost > 0) {
            handleRecalculate();
        }
    }, [details.total_cost, details.margin, details.copies]);

    const handleRecalculate = () => {
        const totalCost = parseFloat(details.total_cost) || 0;
        const margin = parseFloat(details.margin) || 0;
        const copies = parseInt(details.copies) || 1;

        const profit = totalCost * (margin / 100);
        const totalAmount = totalCost + profit;
        const unitPrice = copies > 0 ? totalAmount / copies : 0;

        setDetails(prev => ({
            ...prev,
            profit: profit.toFixed(2),
            total_amount: totalAmount.toFixed(2),
            unit_price: unitPrice.toFixed(4)
        }));
    };

    const handleSave = async () => {
        if (!details.customer_id) {
            alert('Por favor seleccione un cliente.');
            return;
        }

        try {
            await onSave(details);
        } catch (error) {
            console.error('Error saving quote:', error);
            alert('Error al guardar el presupuesto.');
        }
    };

    if (!isOpen) return null;

    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Quote details No {quoteData?.analysisId || '----'} - Created: {today}
                            </h2>
                            <p className="text-xs text-gray-500">Last edited: Soltiprint ERP</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column: Definition of Work */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer and Description */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Customer & Job</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                        <input
                                            type="text"
                                            value={details.customer_name}
                                            readOnly
                                            className="w-full border-gray-300 rounded-md shadow-sm bg-gray-50 p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={details.description}
                                            onChange={(e) => setDetails({ ...details, description: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <select
                                            value={details.state}
                                            onChange={(e) => setDetails({ ...details, state: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="Issued">Issued</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Copies</label>
                                        <input
                                            type="number"
                                            value={details.copies}
                                            onChange={(e) => setDetails({ ...details, copies: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Definition of Work */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Definition of work</h3>

                                {/* Printing Section */}
                                <div className="mb-4">
                                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Printing</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Finish format (open):</label>
                                            <input
                                                type="text"
                                                value={details.finish_format}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Inks:</label>
                                            <input
                                                type="text"
                                                value={details.inks}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Pages:</label>
                                            <input
                                                type="text"
                                                value={details.pages || '1'}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Press format:</label>
                                            <input
                                                type="text"
                                                value={details.press_format}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-600 mb-1">Machine:</label>
                                            <input
                                                type="text"
                                                value={details.machine_name}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Paper Section */}
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-700 mb-2">Type of paper or media</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-600 mb-1">Paper or support:</label>
                                            <input
                                                type="text"
                                                value={details.paper_type}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Grammage:</label>
                                            <input
                                                type="text"
                                                value={details.grammage}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Manufacturer:</label>
                                            <input
                                                type="text"
                                                value={details.manufacturer}
                                                onChange={(e) => setDetails({ ...details, manufacturer: e.target.value })}
                                                className="w-full border-gray-300 rounded shadow-sm p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Article ID:</label>
                                            <input
                                                type="text"
                                                value={details.article_id}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Dimensions:</label>
                                            <input
                                                type="text"
                                                value={details.paper_dimensions}
                                                readOnly
                                                className="w-full border-gray-300 rounded shadow-sm bg-gray-50 p-1.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Notes</h3>
                                <textarea
                                    value={details.notes}
                                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                                    rows={3}
                                    className="w-full border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                    placeholder="Additional notes or specifications..."
                                />
                            </div>
                        </div>

                        {/* Right Column: Work Costs */}
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 bg-blue-50">
                                <h3 className="font-semibold text-gray-700 mb-4 border-b border-blue-200 pb-2">Work costs</h3>

                                {/* Cost Breakdown */}
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Material</span>
                                        <span className="text-sm font-semibold">{parseFloat(details.cost_materials || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                                        <span className="text-sm font-medium text-gray-700">Operations</span>
                                        <span className="text-sm font-semibold">{parseFloat(details.cost_operations || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-800">Cost of materials:</span>
                                        <span className="text-sm font-bold">{parseFloat(details.cost_materials || 0).toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Calculation Controls */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Total cost:</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={details.total_cost}
                                                onChange={(e) => setDetails({ ...details, total_cost: e.target.value })}
                                                className="w-full border-gray-300 rounded shadow-sm p-1.5 text-sm font-semibold"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Margin (%):</label>
                                            <input
                                                type="number"
                                                step="1"
                                                value={details.margin}
                                                onChange={(e) => setDetails({ ...details, margin: e.target.value })}
                                                className="w-full border-gray-300 rounded shadow-sm p-1.5 text-sm font-semibold"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleRecalculate}
                                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium"
                                    >
                                        <Calculator className="h-4 w-4" />
                                        Recalculate (F5)
                                    </button>
                                </div>

                                {/* Totals */}
                                <div className="mt-4 pt-4 border-t border-blue-200 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Profit:</span>
                                        <span className="text-sm font-semibold">{details.profit}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">U/P:</span>
                                        <span className="text-sm font-semibold">{details.unit_price}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                                        <span className="text-base font-bold text-gray-800">Total amount:</span>
                                        <span className="text-lg font-bold text-blue-700">{details.total_amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 p-4 border-t bg-gray-50">
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                        OK
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetailsModal;
