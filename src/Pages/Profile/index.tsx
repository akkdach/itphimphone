import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    Fade,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    LockOutlined,
    BadgeOutlined,
    PhoneIphoneOutlined,
    CalendarMonthOutlined,
    EmailOutlined,
    HomeOutlined,
    SaveOutlined,
    LogoutOutlined,
    EditOutlined,
} from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import MinimalAppBar from '../../Component/MinimalAppBar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/userContext';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';

type ProfileForm = {
    citizenId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    newPassword: string;
    confirmPassword: string;
};

// ─── Animated Background Blobs ─────────────────────────────────────────────
const AnimatedBackground = () => (
    <Box
        sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #3d2525 0%, #4a3030 30%, #6e5353 60%, #1b413c 100%)',
        }}
    >
        <Box
            sx={{
                position: 'absolute',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(110,83,83,0.5) 0%, transparent 70%)',
                top: '-10%',
                right: '-10%',
                animation: 'floatBlob1 8s ease-in-out infinite',
                '@keyframes floatBlob1': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(-30px, 30px) scale(1.1)' },
                },
            }}
        />
        <Box
            sx={{
                position: 'absolute',
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(27,65,60,0.6) 0%, transparent 70%)',
                bottom: '5%',
                left: '-5%',
                animation: 'floatBlob2 10s ease-in-out infinite',
                '@keyframes floatBlob2': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(40px, -20px) scale(1.15)' },
                },
            }}
        />
        <Box
            sx={{
                position: 'absolute',
                width: 180,
                height: 180,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(110,83,83,0.4) 0%, transparent 70%)',
                top: '40%',
                left: '60%',
                animation: 'floatBlob3 12s ease-in-out infinite',
                '@keyframes floatBlob3': {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '50%': { transform: 'translate(-20px, 40px) scale(1.2)' },
                },
            }}
        />
    </Box>
);

// ─── Glassmorphism styles ───────────────────────────────────────────────────
const glassCard = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        backgroundColor: 'rgba(255,255,255,0.12)',
        color: '#fff',
        transition: 'all 0.3s ease',
        '& fieldset': {
            borderColor: 'rgba(255,255,255,0.22)',
            transition: 'border-color 0.3s ease',
        },
        '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.16)',
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.4)',
        },
        '&.Mui-focused': {
            backgroundColor: 'rgba(255,255,255,0.18)',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#c4a08a',
            boxShadow: '0 0 0 3px rgba(196,160,138,0.2)',
        },
        '&.Mui-error fieldset': {
            borderColor: 'rgba(207,62,62,0.7)',
        },
    },
    '& .MuiInputLabel-root': {
        color: 'rgba(255,255,255,0.55)',
        fontWeight: 400,
        '&.Mui-focused': {
            color: '#c4a08a',
        },
        '&.Mui-error': {
            color: '#ff8a80',
        },
    },
    '& .MuiFormHelperText-root': {
        color: '#ff8a80',
        fontWeight: 400,
        mt: 0.5,
    },
    '& .MuiInputAdornment-root': {
        color: 'rgba(255,255,255,0.45)',
    },
    '& input:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 1000px rgba(80,50,50,1) inset !important',
        WebkitTextFillColor: '#fff !important',
        caretColor: '#fff',
    },
};

// ─── Main Component ─────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProfileForm>({
        defaultValues: {
            citizenId: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    useEffect(() => {
        onload();
    }, []);

    const onload = async () => {
        var result = await callApi('mobile/myInfo');
        if (result.data) {
            const member = result.data?.data?.member;
            // แปลง dateOfBirth จาก ISO 8601 ("2026-06-06T00:00:00Z") เป็น "YYYY-MM-DD" สำหรับ input type="date"
            const dateOfBirth = member?.dateOfBirth
                ? member.dateOfBirth.substring(0, 10)
                : '';
            reset({
                ...member,
                dateOfBirth,
                newPassword: '',
                confirmPassword: '',
            });
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            var result = await callApi.post('mobile/myInfo', data);
            if (result.data?.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกสำเร็จ',
                    text: 'ข้อมูลโปรไฟล์ถูกอัปเดตแล้ว',
                    confirmButtonColor: '#6e5353',
                    background: '#3d2525',
                    color: '#fff',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: result?.data?.data || 'กรุณาลองใหม่อีกครั้ง',
                    confirmButtonColor: '#6e5353',
                    background: '#3d2525',
                    color: '#fff',
                });
            }
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
                confirmButtonColor: '#6e5353',
                background: '#3d2525',
                color: '#fff',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        Swal.fire({
            title: 'ออกจากระบบ?',
            text: 'คุณต้องการออกจากระบบหรือไม่',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#cf3e3e',
            cancelButtonColor: 'rgba(255,255,255,0.15)',
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            background: '#3d2525',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('profile');
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                overflow: 'auto',
                pb: 4,
            }}
        >
            <AnimatedBackground />

            {/* ─── AppBar ─────────────────────────────────────────────── */}
            <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                <MinimalAppBar
                    onBack={() => window.history.back()}
                    title="โปรไฟล์ผู้ใช้"
                />
            </Box>

            {/* ─── Content Container ─────────────────────────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 440,
                    px: 2,
                    pt: 2,
                }}
            >
                {/* ─── Avatar Section ─────────────────────────────────── */}
                <Fade in timeout={600}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                mb: 2,
                            }}
                        >
                            <Avatar
                                src={user?.imageUrl || '/default-avatar.png'}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '3px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: -4,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6e5353 0%, #8a6b6b 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '2px solid rgba(61,37,37,0.8)',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                }}
                            >
                                <EditOutlined sx={{ fontSize: 16, color: '#fff' }} />
                            </Box>
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                color: '#fff',
                                mb: 0.5,
                                letterSpacing: '-0.02em',
                            }}
                        >
                            โปรไฟล์ผู้ใช้
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}
                        >
                            จัดการข้อมูลส่วนตัวของคุณ
                        </Typography>
                    </Box>
                </Fade>

                {/* ─── Personal Info Card ─────────────────────────────── */}
                <Fade in timeout={800}>
                    <Box
                        sx={{
                            ...glassCard,
                            p: { xs: 2.5, sm: 3.5 },
                            mb: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    background: 'linear-gradient(135deg, #6e5353 0%, #8a6b6b 100%)',
                                }}
                            >
                                <PersonOutline sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Typography
                                variant="subtitle1"
                                sx={{ color: '#fff', fontWeight: 600 }}
                            >
                                ข้อมูลส่วนตัว
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            {/* Citizen ID */}
                            <Controller
                                name="citizenId"
                                control={control}
                                rules={{ required: 'กรุณากรอกเลขบัตรประชาชน' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-citizen-id"
                                        label="เลขบัตรประชาชน"
                                        error={!!errors.citizenId}
                                        helperText={errors.citizenId?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <BadgeOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Full Name */}
                            <Controller
                                name="fullName"
                                control={control}
                                rules={{ required: 'กรุณากรอกชื่อ-นามสกุล' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-fullname"
                                        label="ชื่อ-นามสกุล"
                                        error={!!errors.fullName}
                                        helperText={errors.fullName?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutline />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Phone */}
                            <Controller
                                name="phoneNumber"
                                control={control}
                                rules={{ required: 'กรุณากรอกเบอร์โทร' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-phone"
                                        label="เบอร์โทร"
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIphoneOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Date of Birth */}
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-dob"
                                        type="date"
                                        label="วันเกิด"
                                        fullWidth
                                        sx={inputSx}
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Address */}
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-address"
                                        label="ที่อยู่"
                                        multiline
                                        rows={2}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                                    <HomeOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                    </Box>
                </Fade>

                {/* ─── Password Change Card ───────────────────────────── */}
                <Fade in timeout={1000}>
                    <Box
                        sx={{
                            ...glassCard,
                            p: { xs: 2.5, sm: 3.5 },
                            mb: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    background: 'linear-gradient(135deg, #1b413c 0%, #2d6b5e 100%)',
                                }}
                            >
                                <LockOutlined sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Typography
                                variant="subtitle1"
                                sx={{ color: '#fff', fontWeight: 600 }}
                            >
                                เปลี่ยนรหัสผ่าน
                            </Typography>
                        </Box>

                        <Stack spacing={2.5}>
                            {/* Email */}
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'กรุณากรอกอีเมล',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'รูปแบบอีเมลไม่ถูกต้อง',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-email"
                                        label="อีเมล"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailOutlined />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* New Password */}
                            <Controller
                                name="newPassword"
                                control={control}
                                rules={{
                                    minLength: {
                                        value: 6,
                                        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        label="รหัสผ่านใหม่"
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlined />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                        sx={{ color: 'rgba(255,255,255,0.4)' }}
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {/* Confirm Password */}
                            <Controller
                                name="confirmPassword"
                                control={control}
                                rules={{
                                    validate: (val: string, formValues) => {
                                        if (formValues.newPassword && val !== formValues.newPassword) {
                                            return 'รหัสผ่านไม่ตรงกัน';
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="profile-confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        label="ยืนยันรหัสผ่านใหม่"
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword?.message}
                                        fullWidth
                                        sx={inputSx}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlined />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        edge="end"
                                                        sx={{ color: 'rgba(255,255,255,0.4)' }}
                                                    >
                                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                    </Box>
                </Fade>

                {/* ─── Action Buttons ─────────────────────────────────── */}
                <Fade in timeout={1200}>
                    <Box sx={{ mb: 3 }}>
                        {/* Save Button */}
                        <Button
                            onClick={handleSubmit((e: any) => onSubmit(e))}
                            variant="contained"
                            disabled={isSubmitting}
                            fullWidth
                            startIcon={!isSubmitting && <SaveOutlined />}
                            sx={{
                                borderRadius: '14px',
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #159e75 0%, #1b413c 100%)',
                                boxShadow: '0 4px 20px rgba(21,158,117,0.35)',
                                transition: 'all 0.3s ease',
                                mb: 2,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1b413c 0%, #2d8c6b 100%)',
                                    boxShadow: '0 6px 28px rgba(21,158,117,0.5)',
                                    transform: 'translateY(-1px)',
                                },
                                '&.Mui-disabled': {
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.3)',
                                },
                            }}
                        >
                            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                        </Button>

                        {/* Divider */}
                        <Divider
                            sx={{
                                my: 2,
                                borderColor: 'rgba(255,255,255,0.08)',
                                '&::before, &::after': {
                                    borderColor: 'rgba(255,255,255,0.08)',
                                },
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{ color: 'rgba(255,255,255,0.3)', px: 1 }}
                            >
                                อื่นๆ
                            </Typography>
                        </Divider>

                        {/* Logout Button */}
                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            fullWidth
                            startIcon={<LogoutOutlined />}
                            sx={{
                                borderRadius: '14px',
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: '#ff6b6b',
                                borderColor: 'rgba(255,107,107,0.25)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    borderColor: 'rgba(255,107,107,0.5)',
                                    backgroundColor: 'rgba(255,107,107,0.08)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            ออกจากระบบ
                        </Button>
                    </Box>
                </Fade>
            </Box>
        </Box>
    );
};

export default ProfileScreen;
