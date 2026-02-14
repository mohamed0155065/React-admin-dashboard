import React, { useState } from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useInvoices } from './InvoiceContext';

/**
 * RevenueBar Component
 * - Displays monthly revenue based on invoice data
 * - Maintains hover effect and smooth animations
 */
export default function RevenueBar() {
    const { invoices } = useInvoices(); // Get invoices from context
    const theme = useTheme(); // Access MUI theme

    // Track which bar is currently hovered for animation
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    /* =========================
       Transform invoices into monthly revenue
    ========================== */
    const chartData = Object.values(
        invoices.reduce((acc: any, curr: any) => {
            const month = new Date(curr.date).toLocaleString('en-US', { month: 'short' });
            if (!acc[month]) acc[month] = { name: month, amount: 0 };
            acc[month].amount += curr.amount;
            return acc;
        }, {})
    );

    return (
        <Box sx={{ width: '100%', bgcolor: 'transparent' }}>

            {/* ===== Section Title ===== */}
            <Typography
                variant="h4"
                fontWeight={800}
                mb={4}
                color="text.primary"
                sx={{ letterSpacing: '-0.02em' }}
            >
                Monthly <span style={{ color: theme.palette.primary.main }}>Revenue</span>
            </Typography>

            {/* ===== Card Container ===== */}
            <Paper
                sx={{
                    p: { xs: 2, md: 4 },
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 4,
                    backgroundImage: 'none',
                    boxShadow:
                        theme.palette.mode === 'dark'
                            ? '0 20px 25px -5px rgba(0,0,0,0.3)'
                            : '0 10px 15px -3px rgba(0,0,0,0.05)'
                }}
            >
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>

                            {/* --- Grid --- */}
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={theme.palette.divider}
                                vertical={false}
                            />

                            {/* --- X Axis --- */}
                            <XAxis
                                dataKey="name"
                                stroke={theme.palette.text.secondary}
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tick={{ dy: 10 }}
                            />

                            {/* --- Y Axis --- */}
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                axisLine={false}
                                tickLine={false}
                                fontSize={12}
                                tickFormatter={(value) => `$${value}`}
                            />

                            {/* --- Tooltip --- */}
                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: theme.palette.primary.main }}
                            />

                            {/* --- Bars with hover animation --- */}
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
                                {chartData.map((entry: any, index: number) => {
                                    const isActive = index === activeIndex;

                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={theme.palette.primary.main}
                                            style={{
                                                transition: 'all 0.25s ease',
                                                transform: isActive ? 'scaleY(1.06)' : 'scaleY(1)',
                                                transformOrigin: 'bottom',
                                                filter: isActive
                                                    ? `drop-shadow(0 6px 10px ${alpha(theme.palette.primary.main, 0.35)})`
                                                    : 'none',
                                                cursor: 'pointer'
                                            }}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(null)}
                                        />
                                    );
                                })}
                            </Bar>

                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
}
