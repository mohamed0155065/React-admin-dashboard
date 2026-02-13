import React from 'react';
import { Chip } from '@mui/material';
import { InvoiceStatus } from './types';

interface StatusBadgeProps {
    status: InvoiceStatus;
}
// we recieve the state prop
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    // إعدادات الألوان والنصوص لكل حالة
    const config = {
        Paid: { color: 'success', label: 'Success' },
        Pending: { color: 'warning', label: 'Pending' },
        Overdue: { color: 'error', label: 'Overdue' },
        Draft: { color: 'default', label: 'Draft' },
    };
    // we will send this to config object 
    const { color, label } = config[status] || config.Draft;
    // for exampl if we recieve a peinding prop we will search  about it in config
    return (
        <Chip
            label={label}
            color={color as any} // لتجنب تحذيرات TypeScript
            size="small"
            variant="outlined" // شكل شفاف مع حد خارجي
            sx={{ fontWeight: 600, borderRadius: 6 }}
        />
    );
};
