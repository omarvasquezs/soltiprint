import React from 'react';
import { Users, FileText, Settings, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Escritorio</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {/* Shortcuts */}
                <Link to="/customers" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Users className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Clientes</h3>
                            <p className="mt-1 text-sm text-gray-500">Permite añadir nuevos clientes y gestionarlos.</p>
                        </div>
                    </div>
                </Link>

                <Link to="/quotes" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <FileText className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Presupuestos</h3>
                            <p className="mt-1 text-sm text-gray-500">Permite preparar nuevos presupuestos y consultarlos.</p>
                        </div>
                    </div>
                </Link>

                <Link to="/work-orders" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Settings className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Órdenes de trabajo</h3>
                            <p className="mt-1 text-sm text-gray-500">Permite gestionar produccion y OTs.</p>
                        </div>
                    </div>
                </Link>

                <Link to="/materials" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50 transition">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Layers className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <h3 className="text-lg font-medium text-gray-900">Papeles y materiales</h3>
                            <p className="mt-1 text-sm text-gray-500">Gestionar stock de papeles y tintas.</p>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">OTs en producción</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">23</dd>
                        <dd className="mt-1 text-sm text-yellow-600">S/ 35.064,67</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">OTs completadas sin entregar</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">3</dd>
                        <dd className="mt-1 text-sm text-green-600">S/ 3.902,25</dd>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Recibos vencidos sin cobrar</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">2</dd>
                        <dd className="mt-1 text-sm text-red-600">S/ 663,99</dd>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
