import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import Dashboard from './Pages/Dashboard';
import Customers from './Pages/Customers';
import Machines from './Pages/Machines';
import Materials from './Pages/Materials';
import Quotes from './Pages/Quotes';
import WorkOrders from './Pages/WorkOrders';
import Accounting from './Pages/Accounting';
import Invoices from './Pages/Accounting/Invoices';
import Expenses from './Pages/Accounting/Expenses';
import Suppliers from './Pages/Accounting/Suppliers';
import '../css/app.css';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="machines" element={<Machines />} />
                    <Route path="materials" element={<Materials />} />
                    <Route path="quotes" element={<Quotes />} />
                    <Route path="work-orders" element={<WorkOrders />} />
                    <Route path="accounting" element={<Accounting />} />
                    <Route path="accounting/invoices" element={<Invoices />} />
                    <Route path="accounting/expenses" element={<Expenses />} />
                    <Route path="accounting/suppliers" element={<Suppliers />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
