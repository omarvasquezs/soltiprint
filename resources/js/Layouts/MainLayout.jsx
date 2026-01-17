import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users, Printer, Package, FileText, ClipboardList, BookOpen, Menu, X, DollarSign, LogOut, Building2, Truck, ChevronDown, ChevronRight, BarChart2 } from 'lucide-react';

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { url, props } = usePage();
    const { auth } = props;

    // Company logic
    const companyName = props.company_name || props.company?.name || 'Mi Empresa';
    const companyTaxId = props.company_tax_id || props.company?.tax_id;

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
            <aside className={`bg-gray-800 text-white w-64 space-y-6 py-4 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 flex flex-col shadow-lg`}>
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center justify-center w-full mt-2 mb-4">
                        {/* Increased logo size as requested */}
                        <img src="/soltiprint_logo_optimizado.jpeg" alt="Logic Print" className="h-24 w-auto rounded-lg" />
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-300 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-gray-700 mb-2">
                    <div className="flex items-center mb-2">
                        <div className="bg-blue-600 rounded-lg p-1.5 mr-3">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div className="overflow-hidden">
                            <span className="font-bold text-sm truncate block text-gray-100">{companyName}</span>
                            {companyTaxId && <span className="text-xs text-gray-400 block">{companyTaxId}</span>}
                        </div>
                    </div>
                    <Link href={route('company.selection')} className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-1">
                        <span className="hover:underline">Cambiar Empresa</span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-2">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.children ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${isActive(item.href || '#') ? 'text-white bg-gray-700' : 'text-gray-400'}`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="h-5 w-5 mr-3" />
                                            {item.name}
                                        </div>
                                        {openMenus[item.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </button>
                                    {openMenus[item.name] && (
                                        <div className="pl-12 space-y-1 mt-1">
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
                                    className={`flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${isActive(item.href) ? 'bg-gray-700 text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    <item.icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="bg-gray-800 shadow-md z-20 h-16 flex items-center justify-between px-6 text-white border-b border-gray-700">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-300 hover:text-white focus:outline-none mr-4">
                            <Menu className="h-6 w-6" />
                        </button>
                        <h2 className="text-xl font-semibold tracking-tight hidden md:block">
                            {/* Dynamically show title based on route or just a welcome message if preferred.
                                For now, keeping it simple or empty as requested style implies clean bar.
                                Let's put the Company Name here or just leave blank space for cleaner look
                                as the sidebar already has the company info.
                                The user image shows "Bienvenido a Logic Print" in the content area,
                                so header can be just for user controls.
                            */}
                        </h2>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-3 text-sm focus:outline-none hover:bg-gray-700 p-2 rounded-lg transition duration-150"
                            >
                                <div className="text-right hidden md:block">
                                    <p className="font-medium text-white">{auth?.user?.name || 'Usuario'}</p>
                                    <p className="text-xs text-gray-400">{auth?.user?.email}</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-gray-600">
                                    {auth?.user?.name ? auth.user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Content */}
                            {userMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setUserMenuOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5 animate-fade-in-down">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm text-gray-500">Sesión iniciada como</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{auth?.user?.name}</p>
                                        </div>

                                        <Link
                                            href={route('profile.edit')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                                            Perfil
                                        </Link>

                                        <Link
                                            method="post"
                                            href={route('logout')}
                                            as="button"
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Cerrar Sesión
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>
            )}
        </div>
    );
}
