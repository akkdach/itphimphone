import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import MinimalAppBar from '../../Component/MinimalAppBar';
import JobSearchAutocomplete from '../../Component/JobSearchAutocomplete/JobSearchAutocomplete';

type RegisterMemberRequest = {

    username: string;
    password: string;
    citizenId: string;
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date | null;
    address: string;
    job:string
};



const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues
    } = useForm<RegisterMemberRequest>({
        defaultValues: {
            title: '',
            username: '',
            password: '',
            citizenId: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: null,
            address: '',
            job:''
        },
    });

    const onSubmit = async (data: RegisterMemberRequest) => {
        var result = await callApi.post('/auth/registermember', data)
        if (result?.data.success) {
            Swal.fire('บันทึกสำเร็จ', '', 'success')
            const resultProfile = await callApi.get('/user/info');
                
                if (resultProfile.data?.data) {
                    localStorage.setItem('profile', JSON.stringify(resultProfile.data?.data));
                    window.location.replace('/');
                } else {
                    Swal.fire('Error', 'User not found.')
                }
            
        } else {
            Swal.fire('เกิดข้อผิดพลาด', '', 'error')
        }
    };



    const options = [
        { label: "เด็กชาย (ด.ช.)", value: "ด.ช." },
        { label: "เด็กหญิง (ด.ญ.)", value: "ด.ญ." },
        { label: "นาย", value: "นาย" },
        { label: "นาง", value: "นาง" },
        { label: "นางสาว", value: "นางสาว" },
    ];

  const handleJobChange = (value: string) => {
    setValue('job',value);
  }

    return (<>
        <MinimalAppBar title='ลงทะเบียนสมาชิก' onBack={function (): void {
            throw new Error('Function not implemented.');
        }} />

        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >


            {/* Email */}
            <Controller
                name="email"
                control={control}
                rules={{
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="อีเมลล์"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        fullWidth
                    />
                )}
            />
            {/* Password */}
            <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="รหัสผ่าน"
                        type="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        fullWidth
                    />
                )}
            />

            {/* Citizen ID */}
            <Controller
                name="citizenId"
                control={control}
                rules={{ required: 'Citizen ID is required', minLength: { value: 13, message: 'Must be 13 digits' } }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="หมายเลขบัตรประจำตัวประชาชน"
                        error={!!errors.citizenId}
                        helperText={errors.citizenId?.message}
                        fullWidth
                    />
                )}
            />

            {/* Title */}

            <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                    <FormControl fullWidth error={!!errors.title}>
                        <InputLabel>คำนำหน้าชื่อ</InputLabel>
                        <Select {...field} label="คำนำหน้าชื่อ">
                            {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.title && (
                            <FormHelperText>{errors.title.message}</FormHelperText>
                        )}
                    </FormControl>
                )}
            />


            {/* Full Name */}
            <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="ชื่อ สกุล"
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                        fullWidth
                    />
                )}
            />
            <JobSearchAutocomplete value={getValues('job')} onChange={handleJobChange} />
            {/* Phone Number */}
            <Controller
                name="phoneNumber"
                control={control}
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="หมายเลขโทรศัพท์มือถือ"
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                        fullWidth
                    />
                )}
            />

            {/* Date of Birth */}
            <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: 'Date of birth is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        type='date'
                        label="วัน/เดือน/ปี เกิด"
                        error={!!errors.dateOfBirth}
                        helperText={errors.dateOfBirth?.message}
                        fullWidth
                    />
                )}
            />

            {/* Address */}
            <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="ที่อยู่"
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        fullWidth
                    />
                )}
            />

            <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)} fullWidth>
                บันทึก
            </Button>
        </Box>
    </>
    );
};

export default RegisterForm;