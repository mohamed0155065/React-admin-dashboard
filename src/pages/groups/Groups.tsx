import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, IconButton, Tooltip, Paper,
    alpha, Stack, useTheme, useMediaQuery
} from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

const WEBHOOK_URL = 'https://n8n-production-b3b68.up.railway.app/webhook/f1715ca1-a8ae-45bc-8f82-54f4b8fd2564';

export default function Groups() {
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch(WEBHOOK_URL, {
                method: 'GET',
                headers: { 'ngrok-skip-browser-warning': '69420' },
            });
            let data = await res.json();
            if (!Array.isArray(data)) data = [data];

            const filtered = data.filter((item: any) => item.name && item.name.trim() !== '');

            const mapped = filtered.map((item: any, index: number) => ({
                _rowId: index + 1,
                displayId: index + 1,
                name: item.name.trim(),        // ← زي ما بييجي من الـ API
                email: item.email || '—',      // ← زي ما بييجي من الـ API
                phone: item.Phone || '—',      // ← زي ما بييجي من الـ API
                access: item.Access || 'User', // ← زي ما بييجي من الـ API
            }));

            setRows(mapped);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'displayId',
            headerName: 'ID',
            width: 70,
            renderCell: (p) => (
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.8rem' }}>
                    {p.value}
                </Typography>
            )
        },
        {
            field: 'name',
            headerName: 'FULL NAME',
            flex: 1,
            minWidth: 180,
            renderCell: (p) => (
                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.85rem' }}>
                    {p.value}
                </Typography>
            )
        },
        {
            field: 'email',
            headerName: 'EMAIL ADDRESS',
            flex: 1.2,
            minWidth: 220,
            renderCell: (p) => (
                <Typography sx={{
                    color: '#3b82f6', fontSize: '0.85rem',
                    cursor: 'pointer', '&:hover': { textDecoration: 'underline' }
                }}>
                    {p.value}
                </Typography>
            )
        },
        {
            field: 'phone',
            headerName: 'PHONE',
            width: 150,
            renderCell: (p) => (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {p.value}
                </Typography>
            )
        },
        {
            field: 'access',
            headerName: 'ACCESS LEVEL',
            width: 160,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ value }) => {
                const role = value?.toLowerCase();
                const isAdmin = role === 'admin' || role === 'manager';
                const color = isAdmin ? '#10b981' : '#3b82f6';
                return (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                        width: 100,          // ← عرض ثابت لكل الـ badges
                        py: 0.5,
                        bgcolor: alpha(color, 0.1),
                        color,
                        borderRadius: '6px',
                        border: `1px solid ${alpha(color, 0.2)}`,
                        fontSize: '0.7rem',
                        fontWeight: 800
                    }}>
                        {isAdmin
                            ? <SecurityIcon sx={{ fontSize: 14 }} />
                            : <PersonIcon sx={{ fontSize: 14 }} />
                        }
                        {value}
                    </Box>
                );
            }
        },
    ], [theme]);

    return (
        <Box sx={{
            p: { xs: 2, sm: 3, md: 5 },
            bgcolor: 'background.default',     // ← theme-aware
            minHeight: '100vh',
            color: 'text.primary',             // ← theme-aware
            transition: 'background-color 0.3s ease',
        }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'flex-end' }}
                spacing={2}
                mb={4}
            >
                <Box>
                    <Typography variant={isMobile ? "h5" : "h4"} fontWeight={900} letterSpacing="-0.03em">
                        TEAM <span style={{ color: '#3b82f6' }}>MEMBERS</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Manage corporate roles, permissions, and directory.
                    </Typography>
                </Box>
                <Tooltip title="Sync with Server">
                    <IconButton onClick={fetchUsers} sx={{
                        bgcolor: 'background.paper',   // ← theme-aware
                        color: '#3b82f6',
                        border: '1px solid',
                        borderColor: 'divider',        // ← theme-aware
                        '&:hover': { bgcolor: 'action.hover' }
                    }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            <Paper sx={{
                height: 'calc(100vh - 220px)', width: '100%',
                bgcolor: 'background.paper',           // ← theme-aware
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',                // ← theme-aware
                overflow: 'hidden',
                backgroundImage: 'none',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 25px -5px rgba(0,0,0,0.5)'
                    : '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    loading={loading}
                    getRowId={(row) => row._rowId}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 },
                            sx: {
                                p: 2,
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '& .MuiButton-root': { color: '#3b82f6', fontWeight: 700, fontSize: '0.75rem' },
                                '& .MuiInputBase-root': { color: 'text.primary', fontSize: '0.85rem' }
                            }
                        }
                    }}
                    sx={{
                        border: 'none',
                        color: 'text.primary',
                        '& .MuiDataGrid-columnHeaders': {
                            bgcolor: 'background.paper',
                            borderBottom: '2px solid',
                            borderColor: 'divider',
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 800, fontSize: '0.7rem',
                                color: 'text.secondary', letterSpacing: '0.05em'
                            }
                        },
                        '& .MuiDataGrid-cell': {
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .MuiDataGrid-row:hover': { bgcolor: alpha('#3b82f6', 0.04) },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'background.paper',
                            color: 'text.secondary',
                        },
                        '& .MuiTablePagination-root': { color: 'text.secondary' },
                        '& .MuiCheckbox-root': { color: '#3b82f6 !important' },
                    }}
                    disableRowSelectionOnClick
                />
            </Paper>
        </Box>
    );
}
