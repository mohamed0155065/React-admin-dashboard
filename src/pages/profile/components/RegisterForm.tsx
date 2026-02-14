// src/pages/RegisterForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Stack, CircularProgress, alpha, useTheme } from '@mui/material';
import { RegisterSchema, RegisterInput } from '../schema/register.schema';

export function RegisterForm() {
    const theme = useTheme();

    // Initialize react-hook-form
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema), // Zod validation
        defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' },
        mode: 'onTouched', // validate on blur
    });

    // Form submit handler
    const onSubmit = async (data: RegisterInput) => {
        try {
            // Simulate server request
            await new Promise((r) => setTimeout(r, 1500));
            console.log('Vault Secure: Profile Data Received', data);

            reset(); // reset form fields
            alert('Security Profile Updated Successfully');
        } catch (error) {
            console.error('System Error: Failed to commit profile changes', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                {/* Full Name Field */}
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Full Name"
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                            fullWidth
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#f5f5f5',
                                borderRadius: 1,
                                input: { color: theme.palette.text.primary },
                            }}
                        />
                    )}
                />

                {/* Email Field */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Email Address"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#f5f5f5',
                                borderRadius: 1,
                                input: { color: theme.palette.text.primary },
                            }}
                        />
                    )}
                />

                {/* Password Field */}
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="New Password"
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            fullWidth
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#f5f5f5',
                                borderRadius: 1,
                                input: { color: theme.palette.text.primary },
                            }}
                        />
                    )}
                />

                {/* Confirm Password Field */}
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="password"
                            label="Confirm Password"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            fullWidth
                            sx={{
                                bgcolor: theme.palette.mode === 'dark' ? '#09090b' : '#f5f5f5',
                                borderRadius: 1,
                                input: { color: theme.palette.text.primary },
                            }}
                        />
                    )}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitting}
                    sx={{
                        py: 1.8,
                        fontWeight: 800,
                        bgcolor: theme.palette.primary.main,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: `0 10px 15px -3px ${alpha(theme.palette.primary.main, 0.3)}`,
                        '&:hover': { bgcolor: theme.palette.primary.dark },
                    }}
                >
                    {isSubmitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save Changes'}
                </Button>
            </Stack>
        </form>
    );
}
