import React, { useMemo, useState, useEffect } from 'react';
import {
    Box, Typography, Stack, Paper, alpha, Grid,
    useTheme, useMediaQuery
} from '@mui/material';
import { TrendingUp, AccountBalanceWallet, CheckCircle, QueryStats } from '@mui/icons-material';
import { useInvoices } from '../Charts/InvoiceContext';
import { RevenueWidget, GrowthWidget } from '../Home/DashboardWidgets';

interface StatCardProps {
    label: string;
    val: string | number;
    icon: React.ElementType;
    color: string;
    trend: string;
}

export default function HomePage() {
    const { invoices = [] } = useInvoices();
    const [mounted, setMounted] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDark = theme.palette.mode === 'dark';

    useEffect(() => { setMounted(true); }, []);

    const stats = useMemo(() => {
        return invoices.reduce((acc: any, curr: any) => {
            const amt = Number(curr.amount) || 0;
            acc.total += amt;
            if (curr.status === 'Pending') acc.pending += amt;
            if (curr.status === 'Paid') acc.paidCount += 1;
            return acc;
        }, { total: 0, pending: 0, paidCount: 0, count: invoices.length });
    }, [invoices]);

    const barData = useMemo(() => {
        const grouped = invoices.reduce((acc: any, curr: any) => {
            const m = new Date(curr.date).toLocaleString('en-US', { month: 'short' });
            if (!acc[m]) acc[m] = { name: m, amount: 0 };
            acc[m].amount += Number(curr.amount) || 0;
            return acc;
        }, {});
        return Object.values(grouped);
    }, [invoices]);

    const areaData = useMemo(() => {
        return invoices.map((inv: any) => ({
            date: new Date(inv.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
            amount: Number(inv.amount) || 0
        })).slice(-10);
    }, [invoices]);

    if (!mounted) return null;

    return (
        <Box sx={{
            p: { xs: 2, md: 5 },
            bgcolor: 'background.default',        // ← من الـ theme مش hardcoded
            minHeight: '100vh',
            color: 'text.primary',                // ← من الـ theme مش hardcoded
            transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
            <Box mb={5}>
                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={900}
                    sx={{ letterSpacing: "-0.03em", color: 'text.primary' }}
                >
                    System <span style={{ color: '#3b82f6' }}>Overview</span>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Real-time financial performance and activity logs.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Revenue" val={`$${stats.total.toLocaleString()}`} icon={TrendingUp} color="#3b82f6" trend="+12%" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Pending Balance" val={`$${stats.pending.toLocaleString()}`} icon={AccountBalanceWallet} color="#f59e0b" trend="+3%" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Settled Invoices" val={stats.paidCount} icon={CheckCircle} color="#10b981" trend="+8%" />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard label="Total Records" val={stats.count} icon={QueryStats} color="#94a3b8" trend="Stable" />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <RevenueWidget data={barData} />
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                    <GrowthWidget data={areaData} />
                </Grid>
            </Grid>
        </Box>
    );
}

const StatCard = ({ label, val, icon: Icon, color, trend }: StatCardProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper sx={{
            p: 2.5,
            bgcolor: 'background.paper',          // ← من الـ theme
            border: '1px solid',
            borderColor: 'divider',               // ← من الـ theme
            borderRadius: 4,
            backgroundImage: 'none',
            transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', borderColor: color }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="caption" sx={{
                        color: 'text.secondary',   // ← من الـ theme
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        {label}
                    </Typography>
                    <Typography variant="h5" sx={{
                        fontWeight: 800,
                        color: 'text.primary',     // ← من الـ theme
                        mt: 0.5
                    }}>
                        {String(val)}
                    </Typography>
                    <Typography variant="caption" sx={{
                        color: trend.includes('+') ? '#10b981' : 'text.disabled',
                        fontWeight: 600,
                        mt: 1,
                        display: 'block'
                    }}>
                        {trend} <span style={{ color: theme.palette.text.disabled, fontWeight: 400 }}>from last month</span>
                    </Typography>
                </Box>
                <Box sx={{
                    p: 1.2,
                    bgcolor: alpha(color, 0.1),
                    borderRadius: 2.5,
                    color: color,
                    display: 'flex',
                    border: `1px solid ${alpha(color, 0.2)}`
                }}>
                    <Icon fontSize="small" />
                </Box>
            </Stack>
        </Paper>
    );
};
