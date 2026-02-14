import React, { useMemo, useState, useEffect } from 'react';
import {
    Box, Typography, Stack, Paper, alpha, Grid,
    useTheme, useMediaQuery
} from '@mui/material';
// Icons for stat cards
import { TrendingUp, AccountBalanceWallet, CheckCircle, QueryStats } from '@mui/icons-material';
// Custom hook to get invoices
import { useInvoices } from '../Charts/InvoiceContext';
// Dashboard widgets (charts)
import { RevenueWidget, GrowthWidget } from '../Home/DashboardWidgets';

// --------------------------
// HomePage: main dashboard page
// --------------------------
interface StatCardProps {
    label: string;
    val: string | number;
    icon: React.ElementType;
    color: string;
    trend: string;
}

export default function HomePage() {
    const { invoices = [] } = useInvoices(); // get invoices from context
    const [mounted, setMounted] = useState(false); // used to ensure charts render client-side
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isDark = theme.palette.mode === 'dark';

    useEffect(() => { setMounted(true); }, []); // set mounted=true after client render

    // --------------------------
    // Calculate summary stats from invoices
    // --------------------------
    const stats = useMemo(() => {
        return invoices.reduce((acc: any, curr: any) => {
            const amt = Number(curr.amount) || 0;
            acc.total += amt;               // total revenue
            if (curr.status === 'Pending') acc.pending += amt; // pending revenue
            if (curr.status === 'Paid') acc.paidCount += 1;    // count of paid invoices
            return acc;
        }, { total: 0, pending: 0, paidCount: 0, count: invoices.length });
    }, [invoices]);

    // --------------------------
    // Prepare bar chart data (monthly revenue)
    // --------------------------
    const barData = useMemo(() => {
        const grouped = invoices.reduce((acc: any, curr: any) => {
            const m = new Date(curr.date).toLocaleString('en-US', { month: 'short' });
            if (!acc[m]) acc[m] = { name: m, amount: 0 };
            acc[m].amount += Number(curr.amount) || 0;
            return acc;
        }, {});
        return Object.values(grouped);
    }, [invoices]);

    // --------------------------
    // Prepare area chart data (recent growth trend)
    // --------------------------
    const areaData = useMemo(() => {
        return invoices.map((inv: any) => ({
            date: new Date(inv.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
            amount: Number(inv.amount) || 0
        })).slice(-10); // last 10 records
    }, [invoices]);

    if (!mounted) return null; // prevent SSR issues

    return (
        <Box sx={{
            p: { xs: 2, md: 5 },
            bgcolor: 'background.default',  // theme-aware
            minHeight: '100vh',
            color: 'text.primary',          // theme-aware
            transition: 'background-color 0.3s ease, color 0.3s ease',
        }}>
            {/* Page header */}
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

            {/* --------------------------
                Stat cards row
            -------------------------- */}
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

            {/* --------------------------
                Charts row
            -------------------------- */}
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

// --------------------------
// StatCard component: individual card for stats
// --------------------------
const StatCard = ({ label, val, icon: Icon, color, trend }: StatCardProps) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    return (
        <Paper sx={{
            p: 2.5,
            bgcolor: 'background.paper',          // theme-aware
            border: '1px solid',
            borderColor: 'divider',               // theme-aware
            borderRadius: 4,
            backgroundImage: 'none',
            transition: 'transform 0.2s ease, border-color 0.2s ease, background-color 0.3s ease',
            '&:hover': { transform: 'translateY(-4px)', borderColor: color }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    {/* Label */}
                    <Typography variant="caption" sx={{
                        color: 'text.secondary',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        {label}
                    </Typography>

                    {/* Value */}
                    <Typography variant="h5" sx={{
                        fontWeight: 800,
                        color: 'text.primary',
                        mt: 0.5
                    }}>
                        {String(val)}
                    </Typography>

                    {/* Trend */}
                    <Typography variant="caption" sx={{
                        color: trend.includes('+') ? '#10b981' : 'text.disabled',
                        fontWeight: 600,
                        mt: 1,
                        display: 'block'
                    }}>
                        {trend} <span style={{ color: theme.palette.text.disabled, fontWeight: 400 }}>from last month</span>
                    </Typography>
                </Box>

                {/* Icon box */}
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
