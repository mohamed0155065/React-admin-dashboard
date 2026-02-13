import React from 'react';
import { Box, Paper, Typography, useTheme, alpha } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInvoices } from './InvoiceContext';

// أبقيت على ألوان الحالات لأنها تعبر عن المعنى (نجاح، تحذير، خطر) 
// لكن يمكن دمجها مع التيم لاحقاً إذا أردت
const STATUS_COLORS = { Paid: '#10b981', Pending: '#f59e0b', Overdue: '#ef4444' };

export default function StatusPie() {
    const { invoices } = useInvoices();
    const theme = useTheme();

    const chartData = Object.values(invoices.reduce((acc: any, curr: any) => {
        if (!acc[curr.status]) acc[curr.status] = { name: curr.status, value: 0 };
        acc[curr.status].value += 1;
        return acc;
    }, {}));

    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'transparent',
            // إزالة الـ minHeight والـ padding الكبير لمنع الـ scroll
        }}>
            <Typography
                variant="h4"
                fontWeight={800}
                mb={4}
                color="text.primary"
                sx={{ letterSpacing: '-0.02em' }}
            >
                Invoice <span style={{ color: '#10b981' }}>Status</span>
            </Typography>

            <Paper sx={{
                p: { xs: 2, md: 4 },
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
                backgroundImage: 'none',
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 25px -5px rgba(0,0,0,0.3)'
                    : '0 10px 15px -3px rgba(0,0,0,0.05)'
            }}>
                <Box sx={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                innerRadius={100}
                                outerRadius={140}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry: any) => (
                                    <Cell
                                        key={entry.name}
                                        fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || theme.palette.primary.main}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: theme.palette.background.paper,
                                    border: `1px solid ${theme.palette.divider}`,
                                    borderRadius: '8px',
                                    color: theme.palette.text.primary
                                }}
                                itemStyle={{ color: theme.palette.text.primary }}
                            />
                            <Legend
                                iconType="circle"
                                formatter={(value) => (
                                    <span style={{ color: theme.palette.text.secondary, fontWeight: 600, fontSize: '14px' }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Box>
    );
}