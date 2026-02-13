import React from 'react';
import { Box, Typography, Button, Stack, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            bgcolor: '#09090b', // Zinc Dark background
            color: '#f8fafc',
            p: 3,
            textAlign: 'center'
        }}>
            {/* Massive Error Code */}
            <Typography
                variant="h1"
                sx={{
                    fontSize: { xs: 120, md: 180 },
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    color: alpha('#3b82f6', 0.8), // Soft Blue Glow
                    textShadow: '0 0 30px rgba(59, 130, 246, 0.2)'
                }}
            >
                404
            </Typography>

            {/* Error Message */}
            <Stack spacing={1} sx={{ mt: 2, mb: 4 }}>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{ letterSpacing: '-0.02em' }}
                >
                    Page Not Found
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: '#71717a', maxWidth: 450 }}
                >
                    The path you are looking for does not exist or has been moved to a different directory in the system ledger.
                </Typography>
            </Stack>

            {/* Return Action */}
            <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => navigate('/')}
                sx={{
                    bgcolor: '#3b82f6',
                    fontWeight: 800,
                    px: 5,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                        bgcolor: '#2563eb',
                        transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                }}
            >
                Back to Dashboard
            </Button>

            {/* Subtle Brand/System Identifier */}
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    bottom: 40,
                    color: '#27272a',
                    fontWeight: 700,
                    letterSpacing: 2
                }}
            >
                SYSTEM ERROR LOG : 0x404
            </Typography>
        </Box>
    );
}