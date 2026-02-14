import React, { useEffect, useMemo, useState } from 'react';
import {
    Box, Typography, IconButton, Tooltip, Paper,
    alpha, Stack, useTheme, useMediaQuery
} from '@mui/material';
// DataGrid components from MUI
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

// Webhook URL to fetch data
const WEBHOOK_URL = 'https://n8n-production-b3b68.up.railway.app/webhook/f1715ca1-a8ae-45bc-8f82-54f4b8fd2564';

export default function Groups() {
    // State to store rows fetched from API
    const [rows, setRows] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // MUI theme and responsive breakpoint
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Function to fetch users from API
    const fetchUsers = async () => {
        try {
            setLoading(true); // start loading spinner
            const res = await fetch(WEBHOOK_URL, {
                method: 'GET',
                headers: { 'ngrok-skip-browser-warning': '69420' },
            });
            let data = await res.json();

            // Ensure data is array
            if (!Array.isArray(data)) data = [data];

            // Filter out entries without name
            const filtered = data.filter((item: any) => item.name && item.name.trim() !== '');

            // Map data into table rows
            const mapped = filtered.map((item: any, index: number) => ({
                _rowId: index + 1,                 // internal ID for DataGrid
                displayId: index + 1,              // visible ID column
                name: item.name.trim(),            // user full name
                email: item.email || '—',          // fallback if email missing
                phone: item.Phone || '—',          // fallback if phone missing
                access: item.Access || 'User',     // default role
            }));

            setRows(mapped); // update state
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false); // stop loading spinner
        }
    };

    // Fetch users once component mounts
    useEffect(() => { fetchUsers(); }, []);

    // Define columns for DataGrid
    const columns: GridColDef[] = useMemo(() => [
        {
            field: 'displayId',
            headerName: 'ID',
            width: 70,
            renderCell: (p) => (
                <Typography sx={{ color: 'text.secondary', fontWeight: 700, fontSize: '0.8rem' }}>
                    {p.value} {/* Show row ID */}
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
                    {p.value} {/* User's full name */}
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
                    {p.value} {/* Clickable email */}
                </Typography>
            )
        },
        {
            field: 'phone',
            headerName: 'PHONE',
            width: 150,
            renderCell: (p) => (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                    {p.value} {/* User phone */}
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
                const color = isAdmin ? '#10b981' : '#3b82f6'; // green for admin, blue for user
                return (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
                        width: 100, py: 0.5,
                        bgcolor: alpha(color, 0.1),
                        color,
                        borderRadius: '6px',
                        border: `1px solid ${alpha(color, 0.2)}`,
                        fontSize: '0.7rem',
                        fontWeight: 800
                    }}>
                        {/* Icon based on role */}
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
            bgcolor: 'background.default', // theme-aware background
            minHeight: '100vh',
            color: 'text.primary',         // theme-aware text color
            transition: 'background-color 0.3s ease',
        }}>
            {/* Header section */}
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
                {/* Refresh button */}
                <Tooltip title="Sync with Server">
                    <IconButton onClick={fetchUsers} sx={{
                        bgcolor: 'background.paper',
                        color: '#3b82f6',
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { bgcolor: 'action.hover' }
                    }}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* DataGrid container */}
            <Paper sx={{
                height: 'calc(100vh - 220px)',
                width: '100%',
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                backgroundImage: 'none',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 25px -5px rgba(0,0,0,0.5)'
                    : '0 20px 25px -5px rgba(0,0,0,0.1)',
            }}>
                <DataGrid
                    rows={rows}                    // data rows
                    columns={columns}              // table columns
                    loading={loading}              // show loading spinner
                    getRowId={(row) => row._rowId} // unique row ID
                    slots={{ toolbar: GridToolbar }} // show default toolbar
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true, // quick search box
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
