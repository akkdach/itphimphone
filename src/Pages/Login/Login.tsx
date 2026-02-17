// Login.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Autocomplete,
    Select,
    MenuItem,
} from '@mui/material';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';
import { AxiosResponse } from 'axios';
import { Label } from '@mui/icons-material';
import logo from '../../logo.png'
import LineLoginButton from '../../Component/LineLoginButton';
type FormData = {
    username: string;
    password: string;
    company_id: string;
};

interface LoginResponse {
    token: string;
}

export default function LoginPage() {

    useEffect(() => {
    }, [])


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    // useEffect(()=>{
    //     const username = localStorage.getItem('username');
    //     const password = localStorage.getItem('password');
    //     setValue('username',username ?? '')
    //     setValue('password',password ?? '')
    // },[])

    const onSubmit = async (data: FormData) => {
        const result: AxiosResponse<LoginResponse> = await callApi.post('/mobile/login', data);
        if (result.data.token) {
            setTimeout(async () => {
                localStorage.setItem('token', result.data.token);
                const resultProfile = await callApi.get('/user/info');

                if (resultProfile.data?.data) {
                    localStorage.setItem('profile', JSON.stringify(resultProfile.data?.data));
                    window.location.replace('/');
                } else {
                    Swal.fire('Error', 'User not found.')
                }
            }, 1000);

        } else {
            Swal.fire('Error', 'Username Or Password Incorect!')
        }
    };



    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: '100%',
                    maxWidth: 400,
                    borderRadius: 2,
                    textAlign: 'center',
                }}
            >
                {/* Logo Section */}
                <Box sx={{ mb: 2 }}>
                    <img
                        src={logo} // เปลี่ยนเป็น path ของโลโก้คุณ
                        alt="Company Logo"
                        style={{ width: 100, height: 'auto' }}
                    />
                </Box>

                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <TextField
                        label="E-Mail"
                        fullWidth
                        type="email"
                        margin="normal"
                        {...register('username', {
                            required: 'E-Mail is required',
                        })}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                    />

                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Minimum length is 6 characters',
                            },
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />


                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign In
                    </Button>
                    <hr />
                    <LineLoginButton />
                </form>
            </Paper>
        </Box>
    );

}
