import React from 'react';
import { Box, Typography, Paper, Container, Stack, alpha, useTheme } from '@mui/material';
import { RegisterForm } from './RegisterForm';
import ShieldIcon from '@mui/icons-material/Shield';

export default function RegisterPage() {
    const theme = useTheme(); // Get current MUI theme (light/dark mode)

    return (
        // Main container: center the form both vertically and horizontally
        <Box sx={{
            bgcolor: 'transparent', // Inherit background from App.tsx
            height: '100%',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            py: { xs: 2, md: 0 }, // Add vertical padding on small screens
        }}>
            {/* Container with max width to prevent overly wide form */}
            <Container maxWidth="sm">
                {/* Paper: card-like container for the registration form */}
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        borderRadius: 5,
                        border: '1px solid',
                        borderColor: 'divider', // Theme-aware border
                        bgcolor: 'background.paper', // Theme-aware background
                        backgroundImage: 'none',
                        overflow: 'hidden',
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            : '0 25px 50px -12px rgba(0,0,0,0.05)',
                        p: { xs: 3, sm: 6 }, // Padding inside the card
                        maxHeight: 'calc(100vh - 100px)', // Prevent overflow on tall screens
                        overflowY: 'auto', // Scroll if content exceeds max height
                        // Custom scrollbar styling
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            borderRadius: '10px',
                        },
                    }}
                >
                    {/* Icon + Header */}
                    <Stack alignItems="center" spacing={2} mb={4}>
                        {/* Shield icon in a colored circle */}
                        <Box sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            borderRadius: 3,
                            color: 'primary.main',
                            display: 'flex',
                            transition: 'all 0.3s ease'
                        }}>
                            <ShieldIcon fontSize="large" />
                        </Box>

                        {/* Title + Subtitle */}
                        <Box textAlign="center">
                            <Typography variant="h4" fontWeight={900} letterSpacing="-0.03em" color="text.primary">
                                Profile Security
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                Update your system credentials and personal information.
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Registration form component */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <RegisterForm />
                    </Box>

                    {/* Footer / session info */}
                    <Typography
                        variant="caption"
                        display="block"
                        textAlign="center"
                        sx={{ mt: 4, color: 'text.disabled', fontWeight: 600, letterSpacing: 1 }}
                    >
                        ENCRYPTED SESSION ID: 0x882A-BF12
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
