import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

export const RevenueWidget = ({ data = [] }: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Paper sx={{ p: 3, bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 4, height: '100%', backgroundImage: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2} color="#f8fafc">Monthly Revenue</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                {mounted && data.length > 0 ? (
                    <ResponsiveContainer width="99%" height={300}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            {/* FIX: added cursor={false} to remove column hover background */}
                            <Tooltip cursor={false} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : <Typography color="#52525b">Loading...</Typography>}
            </Box>
        </Paper>
    );
};

export const GrowthWidget = ({ data = [] }: any) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    return (
        <Paper sx={{ p: 3, bgcolor: '#18181b', border: '1px solid #27272a', borderRadius: 4, height: '100%', backgroundImage: 'none' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2} color="#f8fafc">Growth Trend</Typography>
            <Box sx={{ width: '100%', height: 300 }}>
                {mounted && data.length > 0 ? (
                    <ResponsiveContainer width="99%" height={300}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="areaH" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                            <Area type="monotone" dataKey="amount" stroke="#8b5cf6" fill="url(#areaH)" isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : <Typography color="#52525b">Loading...</Typography>}
            </Box>
        </Paper>
    );
};