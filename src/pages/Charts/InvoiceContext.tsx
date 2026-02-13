import React, { createContext, useContext, useState, useEffect } from 'react';
import { invoiceService } from '../invoices/api';

const InvoicesContext = createContext<any>(null);

export const InvoicesProvider = ({ children }: { children: React.ReactNode }) => {
    const [invoices, setInvoices] = useState([]);

    const loadInvoices = async () => {
        try {
            const data = await invoiceService.getAllInvoices();
            setInvoices(Array.isArray(data) ? data : []);
        } catch (error) {
            setInvoices([]);
        }
    };

    useEffect(() => { loadInvoices(); }, []);

    return (
        <InvoicesContext.Provider value={{ invoices, loadInvoices }}>
            {children}
        </InvoicesContext.Provider>
    );
};

export const useInvoices = () => useContext(InvoicesContext);