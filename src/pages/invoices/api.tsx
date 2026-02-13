import axios from 'axios';

const API_BASE_URL = 'https://6952db36a319a928023a2686.mockapi.io';

const appClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export const invoiceService = {
    getAllInvoices: async () => {
        const response = await appClient.get('/ivoces');
        return response.data;
    },
    addInvoice: async (data: any) => {
        const response = await appClient.post('/ivoces', data);
        return response.data;
    }
};