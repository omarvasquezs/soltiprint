import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { Building2, Plus, ArrowRight } from 'lucide-react';

export default function CompanySelection({ companies }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        tax_id: '',
    });
    const [view, setView] = useState(companies.length > 0 ? 'select' : 'create');

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('company.store'));
    };

    const submitSelect = (companyId) => {
        // Use Link with replace to avoid history stack issues if needed, or just post.
        // But here we want to trigger the post request.
        // We can use a form or usePage().props.auth... wait, we need to import router.
        // or just use the Link component with method="post" as="button".
    };

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <Head title="Seleccionar Empresa" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <div className="mb-6 text-center">
                    <Building2 className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                        {view === 'select' ? 'Seleccionar Empresa' : 'Crear Nueva Empresa'}
                    </h2>
                </div>

                {view === 'select' ? (
                    <div className="space-y-4">
                        {companies.map((company) => (
                            <Link
                                key={company.id}
                                href={route('company.set', company.id)}
                                method="post"
                                as="button"
                                className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition text-left"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-900">{company.name}</h3>
                                    {company.tax_id && <p className="text-sm text-gray-500">{company.tax_id}</p>}
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setView('create')}
                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                Registrar Nueva Empresa
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={submitCreate}>
                        <div>
                            <label className="block font-medium text-sm text-gray-700">Nombre de la Empresa</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        <div className="mt-4">
                            <label className="block font-medium text-sm text-gray-700">RUC / Tax ID</label>
                            <input
                                type="text"
                                value={data.tax_id}
                                onChange={(e) => setData('tax_id', e.target.value)}
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            />
                            {errors.tax_id && <div className="text-red-600 text-sm mt-1">{errors.tax_id}</div>}
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {companies.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setView('select')}
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
                                >
                                    Cancelar
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            >
                                Crear Empresa
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
