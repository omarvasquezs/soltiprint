import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Printer, Package, FileText, Settings, Briefcase, Calculator } from 'lucide-react';
import clsx from 'clsx';

const MainLayout = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Escritorio', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Clientes', href: '/customers', icon: Users },
        { name: 'Máquinas', href: '/machines', icon: Printer },
        { name: 'Materiales', href: '/materials', icon: Package },
        { name: 'Presupuestos', href: '/quotes', icon: FileText },
        { name: 'Órdenes de Trabajo', href: '/work-orders', icon: Settings },
        { name: 'Contabilidad', href: '/accounting', icon: Calculator },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0 bg-blue-600 flex flex-col">
                {/* Sidebar Header / Logo */}
                <div className="flex items-center justify-center h-32 bg-blue-700 px-4 py-4 border-b border-blue-500">
                     <div className="bg-white p-2 rounded-lg overflow-hidden">
                        <img 
                            src="/soltiprint_logo_optimizado.jpeg" 
                            alt="SoltiPrint" 
                            className="h-20 w-auto object-contain" 
                        />
                     </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={clsx(
                                    isActive
                                        ? 'bg-blue-800 text-white'
                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white',
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                )}
                            >
                                <item.icon
                                    className={clsx(
                                        isActive ? 'text-white' : 'text-blue-300 group-hover:text-white',
                                        'mr-3 flex-shrink-0 h-6 w-6'
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
