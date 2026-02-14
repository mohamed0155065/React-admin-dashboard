import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useInvoices } from './InvoiceContext';

// Constant for chart accent color
const PURPLE_COLOR = '#8b5cf6';

/**
 * GrowthLine Component
 * - Renders a financial growth chart using invoices
 * - Fully preserves existing functionality and styling
 */
export default function GrowthLine() {
    const { invoices } = useInvoices(); // get invoices from context
    const theme = useTheme(); // access MUI theme

    // Transform invoice data for chart
    const chartData = [...invoices]
        .map((inv: any) => ({
            date: new Date(inv.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
            timestamp: new Date(inv.date).getTime(),
            amount: inv.amount
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    return (
        <Box sx={{ width: '100%', bgcolor: 'transparent', color: 'text.primary' }}>
            {/* Chart Title */}
            <Typography
                variant="h4"
                fontWeight={800}
                mb={4}
                sx={{ letterSpacing: '-0.02em' }}
            >
                Financial <span style={{ color: PURPLE_COLOR }}>Growth</span>
            </Typography>

            {/* Chart Container */}
            <Paper
                sx={{
                    p: { xs: 2, md: 4 },
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 25px -5px rgba(0,0,0,0.3)'
                        : '0 10px 15px -3px rgba(0,0,0,0.05)'
                }}
            >
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            {/* Gradient fill */}
                            <defs>
                                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PURPLE_COLOR} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={PURPLE_COLOR} stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            {/* Grid */}
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />

                            {/* X Axis */}
                            <XAxis
                                dataKey="date"
                                stroke={theme.palette.text.secondary}
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ dy: 10 }}
                            />

                            {/* Y Axis hidden */}
                            <YAxis hide />

                            {/* Tooltip */}
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: PURPLE_COLOR }}
                            />

                            {/* Area Line */}
                            <Area
                                type="monotone"
                                dataKey="amount"
                                stroke={PURPLE_COLOR}
                                strokeWidth={3}
                                fill="url(#colorArea)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
}
