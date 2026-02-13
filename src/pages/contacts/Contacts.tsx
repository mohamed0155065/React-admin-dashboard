import React from 'react';
import { useTheme } from '@mui/material/styles';
import { DataTabel } from './DataTabel';
import { contacts } from './Rcontacts';

const Contacts = () => {
    const theme = useTheme(); // access MUI theme
    const isDark = theme.palette.mode === 'dark';

    return (
        <div>
            <h1
                style={{
                    fontWeight: 800,
                    fontSize: 30,
                    letterSpacing: -1,
                    marginBottom: 20,
                    color: isDark ? '#f8fafc' : '#0f172a'
                }}
            >
                CONTACTS
            </h1>

            <DataTabel rows={contacts} />
        </div>
    );
};

export default Contacts;
