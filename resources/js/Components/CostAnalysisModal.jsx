import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const CostAnalysisModal = ({ isOpen, onClose, wizardData, onMachineSelected }) => {
    const [loading, setLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState([]);
    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [analysisId, setAnalysisId] = useState(null);

    useEffect(() => {
        if (isOpen && wizardData) {
            performCostAnalysis();
        }
    }, [isOpen, wizardData]);

    const performCostAnalysis = async () => {
        setLoading(true);
        try {
            const response = await window.axios.post('/api/quotes/analyze-costs', wizardData);
            setAnalysisData(response.data.machines || []);
            setAnalysisId(response.data.analysis_id || Math.floor(Math.random() * 10000));

            // Auto-select cheapest machine
            if (response.data.machines && response.data.machines.length > 0) {
                setSelectedMachineId(response.data.machines[0].machine_id);
            }
        } catch (error) {
            console.error('Cost analysis error:', error);
            alert('Error al analizar costos. Usando datos simulados.');

            // Fallback to mock data
            const mockData = [
                { machine_id: 1, machine_name: 'HEIDE1C36', cost: 134.73, overcost: null, press_format: '32x45 (1000 x 2)', paper_size: '45x64', media_id: 'BOND-G-45' },
                { machine_id: 2, machine_name: 'HEIDE1C52', cost: 141.66, overcost: '+5.14%', press_format: '45x64 (500 x 4)', paper_size: '45x64', media_id: 'BOND-G-45' },
                { machine_id: 3, machine_name: 'HEIDE2C52', cost: 149.97, overcost: '+11.3%', press_format: '45x64 (500 x 4)', paper_size: '45x64', media_id: 'BOND-G-45' },
            ];
            setAnalysisData(mockData);
            setAnalysisId(5973);
            setSelectedMachineId(1);
        } finally {
            setLoading(false);
        }
    };

    const handleOk = () => {
        if (!selectedMachineId) {
            alert('Por favor seleccione una máquina.');
            return;
        }

        const selectedMachine = analysisData.find(m => m.machine_id === selectedMachineId);
        onMachineSelected({
            ...wizardData,
            selectedMachine,
            analysisId
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Proposal for printing machine</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <Search className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
                                <p className="text-gray-600">Analyzing costs...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Title Section */}
                            <div className="mb-6">
                                <div className="flex items-center mb-2">
                                    <Search className="h-8 w-8 text-gray-600 mr-3" />
                                    <h3 className="text-2xl font-serif text-gray-700">
                                        Cost analysis completed [{analysisId}].
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm mt-2">
                                    Allows you to identify the printing machine and print format that offer the lowest cost for the current job.
                                    It's recommended to use this option after changing the number of copies, inks, finished format, page number, etc.
                                </p>
                            </div>

                            {/* Cost Analysis Table */}
                            <div className="border rounded-lg overflow-hidden mb-6">
                                <div className="bg-blue-50 border-b px-4 py-2">
                                    <h4 className="font-semibold text-gray-700">Cost analysis</h4>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Machine</th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">Cost (Overcost)</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Press format</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Paper or media</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Media ID</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {analysisData.map((item) => (
                                                <tr
                                                    key={item.machine_id}
                                                    className={`hover:bg-blue-50 cursor-pointer ${selectedMachineId === item.machine_id ? 'bg-blue-100' : ''
                                                        }`}
                                                    onClick={() => setSelectedMachineId(item.machine_id)}
                                                >
                                                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.machine_name}</td>
                                                    <td className="px-4 py-2 text-sm text-right">
                                                        {item.cost.toFixed(2)}
                                                        {item.overcost && (
                                                            <span className="text-red-600 ml-2">({item.overcost})</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">{item.press_format}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">{item.paper_size}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">{item.media_id}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Warning Message */}
                            <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-6 text-sm text-amber-800 italic">
                                Usually the overcost does not add value to the client, so if a machine with overcost is chosen,
                                the chances of the budget being rejected increase.
                            </div>

                            {/* Machine Selection */}
                            <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="bg-blue-50 border-b px-4 py-2 -m-4 mb-4">
                                    <h4 className="font-semibold text-gray-700">Printing machine proposal</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    To choose another machine, select it from the dropdown list. You can also double click on a machine from the top list.
                                </p>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={selectedMachineId || ''}
                                        onChange={(e) => setSelectedMachineId(parseInt(e.target.value))}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                                    >
                                        {analysisData.map((item) => (
                                            <option key={item.machine_id} value={item.machine_id}>
                                                {item.machine_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 p-4 border-t bg-gray-50">
                    <button
                        onClick={handleOk}
                        disabled={loading || !selectedMachineId}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                    >
                        OK
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CostAnalysisModal;
