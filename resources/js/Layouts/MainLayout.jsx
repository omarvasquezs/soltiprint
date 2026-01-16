import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, Printer, Package, FileText, ClipboardList, BookOpen, Menu, X, DollarSign, LogOut, Building2, Truck, ChevronDown, ChevronRight, BarChart2 } from 'lucide-react';

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { url, props } = usePage();
    const { auth } = props;

    // Attempt to get company name from session (shared via Inertia middleware usually) 
    // or we might need to share it explicitly. 
    // For now, let's assume it's in auth.user or check if we can pass it via handleInertiaRequests.
    // Ideally, we should add it to HandleInertiaRequests middleware.
    // For this iteration, let's assume it's available or we fetch.
    // A quick hack is reading it from props if we shared it, but we haven't modified HandleInertiaRequests yet.
    // Let's modify HandleInertiaRequests or just use a placeholder if missing.
    const companyName = props.company_name || 'Mi Empresa';
    const companyTaxId = props.company_tax_id;

    const isActive = (path) => {
        if (path === '/') return url === '/';
        return url.startsWith(path) && (path === '/accounting' ? url !== '/accounting/invoices' : true);
    };

    const [openMenus, setOpenMenus] = useState({});

    const toggleMenu = (name) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Contabilidad', href: '/accounting', icon: BookOpen },
        { name: 'Facturación', href: '/accounting/invoices', icon: DollarSign },
        { name: 'Clientes', href: '/customers', icon: Users },
        { name: 'Máquinas', href: '/machines', icon: Printer },
        { name: 'Materiales', href: '/materials', icon: Package },
        { name: 'Presupuestos', href: '/quotes', icon: FileText },
        { name: 'Órdenes de Trabajo', href: '/work-orders', icon: ClipboardList },
        { name: 'Logística', href: '/logistics', icon: Truck },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20 flex flex-col`}>
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center justify-center w-full mt-4 mb-2">
                        <img src="/soltiprint_logo_optimizado.jpeg" alt="Logic Print" className="h-16 w-auto rounded" />
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="px-4 py-2 border-b border-gray-700">
                    <div className="flex items-center mb-2">
                        <div className="bg-blue-600 rounded-lg p-1 mr-2">
                            <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <span className="font-bold text-sm truncate block">{companyName}</span>
                            {companyTaxId && <span className="text-xs text-gray-400 block">{companyTaxId}</span>}
                        </div>
                    </div>
                    <Link href={route('company.selection')} className="text-xs text-blue-400 hover:text-blue-300">
                        Cambiar Empresa
                    </Link>
                </div>

                <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 uppercase">Usuario</p>
                    <p className="font-semibold text-sm">{auth?.user?.name || 'Invitado'}</p>
                </div>

                <nav className="flex-1 space-y-2 mt-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${isActive(item.href || '#') ? 'text-white' : 'text-gray-400'}`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="h-5 w-5 mr-2" />
                                            {item.name}
                                        </div>
                                        {openMenus[item.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>
                                    {openMenus[item.name] && (
                                        <div className="pl-11 space-y-1">
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.name}
                                                    href={child.href}
                                                    className={`block py-2 px-2 rounded text-sm transition duration-200 hover:text-white ${url.startsWith(child.href.split('?')[0]) && (child.href.includes('?') ? url.includes(child.href.split('?')[1]) : true) ? 'text-white font-medium' : 'text-gray-500'}`}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${isActive(item.href) ? 'bg-gray-700 text-white' : 'text-gray-400'}`}
                                >
                                    <item.icon className="h-5 w-5 mr-2" />
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="mt-auto px-4 pb-4">
                    <Link
                        method="post"
                        href={route('logout')}
                        as="button"
                        className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-red-700 hover:text-white text-gray-400 w-full text-left"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-500 focus:outline-none">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-10 md:hidden"></div>
            )}
        </div>
    );
}
