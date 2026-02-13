import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { invoiceService } from './api';
import { Invoice, InvoiceStatus } from './types';
import {
    Box, Paper, Alert, Snackbar, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, TextField, MenuItem,
    IconButton, Stack, Typography, CircularProgress, alpha, Tooltip
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar, GridRenderCellParams } from '@mui/x-data-grid';
import {
    Add as AddIcon,
    Refresh as RefreshIcon,
    DeleteOutline as DeleteIcon,
    TrendingUp,
    QueryStats,
    CheckCircle,
    MailOutline,
    CalendarMonth,
    AccountBalanceWallet,
    Brightness4,
    Brightness7
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material';

interface InvoiceFormData {
    customerName: string;
    customerEmail: string;
    amount: string;
    status: InvoiceStatus;
}

const INITIAL_FORM_STATE: InvoiceFormData = {
    customerName: '',
    customerEmail: '',
    amount: '',
    status: 'Pending',
};

const STORAGE_KEY = 'invoices_vault_db';
const THEME_KEY = 'themeMode';

export default function InvoicesPage() {
    const addBtnRef = useRef<HTMLButtonElement>(null);
    const [rows, setRows] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState({ pageSize: 10, page: 0 });
    const [formData, setFormData] = useState<InvoiceFormData>(INITIAL_FORM_STATE);

    const [mode, setMode] = useState<'light' | 'dark'>(
        (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark'
    );

    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode,
                background: {
                    default: mode === 'dark' ? '#09090b' : '#f8fafc',
                    paper: mode === 'dark' ? '#18181b' : '#fff',
                },
                primary: { main: '#3b82f6' },
                divider: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
            },
            typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
        })
        , [mode]);

    const toggleMode = () => {
        setMode(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem(THEME_KEY, newMode);
            return newMode;
        });
    };

    const reindexInvoices = (invoices: Invoice[]): Invoice[] =>
        invoices.map((invoice, index) => ({ ...invoice, invoiceNumber: `INV-${index + 1}` }));

    const saveToLocalStorage = (invoices: Invoice[]) =>
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && JSON.parse(saved).length > 0) {
                setRows(JSON.parse(saved));
            } else {
                const data = await invoiceService.getAllInvoices();
                const standardizedData: Invoice[] = (Array.isArray(data) ? data : []).map((item: any) => {
                    const rowId = item.id || crypto.randomUUID();
                    return {
                        id: rowId,
                        invoiceNumber: item.invoiceNumber || `INV-${String(rowId).substring(0, 6).toUpperCase()}`,
                        customerName: item.customerName || 'Global Client',
                        customerEmail: item.customerEmail || 'billing@enterprise.com',
                        amount: Number(item.amount) || 0,
                        currency: item.currency || 'USD',
                        date: item.date || new Date().toISOString(),
                        dueDate: item.dueDate || new Date().toISOString(),
                        status: item.status || 'Pending',
                    };
                });
                const indexed = reindexInvoices(standardizedData);
                setRows(indexed);
                saveToLocalStorage(indexed);
            }
        } catch {
            setError('Failed to sync with central database.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData(INITIAL_FORM_STATE);
    };

    const handleAddInvoice = async () => {
        if (!formData.customerName || !formData.amount) {
            setError('Validation Error: Please fill in all required fields.');
            return;
        }
        try {
            setIsSubmitting(true);
            const added = await invoiceService.addInvoice({
                ...formData,
                amount: Number(formData.amount),
                date: new Date().toISOString(),
                dueDate: new Date().toISOString(),
                currency: 'USD',
            });
            const newId = added.id || crypto.randomUUID();
            const newInvoice = { ...added, id: newId };
            const updated = reindexInvoices([newInvoice, ...rows]);
            setRows(updated);
            saveToLocalStorage(updated);
            setSuccessMsg('Transaction successfully committed to ledger.');
            handleCloseDialog();
        } catch {
            setError('System Error: Failed to save record.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id: string | number) => {
        const filtered = rows.filter(r => r.id !== id);
        const updated = reindexInvoices(filtered);
        setRows(updated);
        saveToLocalStorage(updated);
        setSuccessMsg('Record archived successfully.');
    };

    const stats = useMemo(() => {
        return rows.reduce((acc, curr) => {
            acc.total += curr.amount;
            if (curr.status === 'Pending') acc.pending += curr.amount;
            if (curr.status === 'Paid') acc.paidCount += 1;
            return acc;
        }, { total: 0, pending: 0, paidCount: 0, count: rows.length });
    }, [rows]);

    const columns: GridColDef[] = [
        {
            field: 'invoiceNumber',
            headerName: 'REFERENCE',
            width: 140,
            renderCell: (p: GridRenderCellParams) => (
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#60a5fa', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                    {p.value}
                </Typography>
            ),
        },
        {
            field: 'customerName',
            headerName: 'CLIENT / ENTITY',
            flex: 1,
            renderCell: (p: GridRenderCellParams) => (
                <Stack spacing={0} justifyContent="center" sx={{ height: '100%' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: mode === 'dark' ? '#f8fafc' : '#000' }}>
                        {p.row.customerName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MailOutline sx={{ fontSize: 14 }} /> {p.row.customerEmail}
                    </Typography>
                </Stack>
            ),
        },
        {
            field: 'date',
            headerName: 'DATE',
            width: 150,
            renderCell: (p: GridRenderCellParams) => (
                <Stack direction="row" alignItems="center" gap={1} sx={{ color: '#94a3b8' }}>
                    <CalendarMonth sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {new Date(p.value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Typography>
                </Stack>
            )
        },
        {
            field: 'amount',
            headerName: 'TOTAL',
            width: 160,
            renderCell: (p: GridRenderCellParams) => (
                <Typography sx={{ fontWeight: 700, color: '#10b981' }}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p.value)}
                </Typography>
            ),
        },
        {
            field: 'status',
            headerName: 'STATUS',
            width: 130,
            renderCell: (p: GridRenderCellParams) => {
                const status = p.value as string;
                const config: any = {
                    Paid: { bg: alpha('#10b981', 0.1), color: '#10b981' },
                    Pending: { bg: alpha('#f59e0b', 0.1), color: '#f59e0b' },
                    Overdue: { bg: alpha('#ef4444', 0.1), color: '#ef4444' }
                };
                const style = config[status] || config.Pending;
                return (
                    <Chip label={status.toUpperCase()} size="small"
                        sx={{ bgcolor: style.bg, color: style.color, fontWeight: 800, fontSize: '0.65rem', borderRadius: '6px', border: `1px solid ${alpha(style.color, 0.2)}` }}
                    />
                );
            },
        },
        {
            field: 'actions',
            headerName: '',
            width: 80,
            sortable: false,
            renderCell: (p: GridRenderCellParams) => (
                <Tooltip title="Delete Record">
                    <IconButton size="small" onClick={() => handleDelete(p.row.id)} sx={{ color: '#475569', '&:hover': { color: '#ef4444', bgcolor: alpha('#ef4444', 0.1) } }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            ),
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                height: 'calc(100vh - 120px)',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}>

                {/* Header */}
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={3} mb={4}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -1, color: mode === 'dark' ? '#f8fafc' : '#000' }}>
                            Invoices
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                            Manage corporate billing and financial operations.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Button variant="text" startIcon={<RefreshIcon />} onClick={loadData} sx={{ color: '#94a3b8', textTransform: 'none', fontWeight: 600 }}>
                            Refresh Ledger
                        </Button>
                        <Button ref={addBtnRef} variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}
                            sx={{ bgcolor: '#3b82f6', textTransform: 'none', fontWeight: 600, px: 3, boxShadow: '0 4px 12px ' + alpha('#3b82f6', 0.3), '&:hover': { bgcolor: '#2563eb' } }}>
                            New Invoice
                        </Button>
                        <IconButton onClick={toggleMode} sx={{ color: '#94a3b8' }}>
                            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Stack>
                </Stack>

                {/* Stats */}
                <Box sx={{
                    display: 'grid', gap: 3, mb: 4,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }
                }}>
                    {[
                        { label: 'Total Revenue', val: stats.total, icon: <TrendingUp />, color: '#3b82f6', isPrice: true },
                        { label: 'Pending Balance', val: stats.pending, icon: <AccountBalanceWallet />, color: '#f59e0b', isPrice: true },
                        { label: 'Completed', val: stats.paidCount, icon: <CheckCircle />, color: '#10b981', isPrice: false },
                        { label: 'Total Logs', val: stats.count, icon: <QueryStats />, color: '#94a3b8', isPrice: false },
                    ].map((s, i) => (
                        <Paper key={i} sx={{ p: 2.5, bgcolor: 'background.paper', border: '1px solid', borderColor: mode === 'dark' ? '#27272a' : '#e2e8f0', borderRadius: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: mode === 'dark' ? '#f8fafc' : '#000', mt: 0.5 }}>
                                        {s.isPrice ? `$${s.val.toLocaleString()}` : s.val}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 1, bgcolor: alpha(s.color, 0.1), borderRadius: 2, color: s.color }}>
                                    {React.cloneElement(s.icon as React.ReactElement, { fontSize: 'small' })}
                                </Box>
                            </Stack>
                        </Paper>
                    ))}
                </Box>

                {/* DataGrid - This Paper expands and stops the global scroll */}
                <Paper sx={{
                    flex: 1,
                    minHeight: 0,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? '#27272a' : '#e2e8f0',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: mode === 'dark' ? '0 20px 25px -5px rgba(0,0,0,0.4)' : 'none'
                }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        loading={loading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[10, 20]}
                        slots={{ toolbar: GridToolbar }}
                        disableRowSelectionOnClick
                        sx={{
                            border: 'none',
                            color: mode === 'dark' ? '#e2e8f0' : '#000',
                            '& .MuiDataGrid-columnHeaders': {
                                bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: mode === 'dark' ? '#27272a' : '#e2e8f0',
                                '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.7rem', color: '#94a3b8' }
                            },
                            '& .MuiDataGrid-cell': { borderBottom: '1px solid', borderColor: mode === 'dark' ? '#27272a' : '#e2e8f0' },
                            '& .MuiDataGrid-row:hover': { bgcolor: alpha('#ffffff', 0.02), cursor: 'pointer' },
                        }}
                    />
                </Paper>

                {/* Dialog & Snackbars */}
                <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="xs">
                    <DialogTitle sx={{ fontWeight: 800 }}>Create Transaction</DialogTitle>
                    <DialogContent dividers>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField label="Customer Name" fullWidth variant="filled" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
                            <TextField label="Email Address" fullWidth variant="filled" value={formData.customerEmail} onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })} />
                            <TextField label="Amount (USD)" type="number" fullWidth variant="filled" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
                            <TextField select label="Initial Status" fullWidth variant="filled" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as InvoiceStatus })}>
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button variant="contained" onClick={handleAddInvoice} disabled={isSubmitting}>
                            {isSubmitting ? <CircularProgress size={24} /> : 'Generate'}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
                    <Alert severity="error" variant="filled">{error}</Alert>
                </Snackbar>
                <Snackbar open={!!successMsg} autoHideDuration={4000} onClose={() => setSuccessMsg(null)}>
                    <Alert severity="success" variant="filled">{successMsg}</Alert>
                </Snackbar>

            </Box>
        </ThemeProvider>
    );
}