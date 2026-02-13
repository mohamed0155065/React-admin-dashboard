//============================ Invoice Status =========================
export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

//=========================== Invoice Item (سطر واحد في الفاتورة) ========================
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

//=========================== Invoice (الفاتورة الكاملة) ========================
export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    currency: string;
    date: string;
    dueDate: string;
    status: InvoiceStatus;
    items?: InvoiceItem[];
}
