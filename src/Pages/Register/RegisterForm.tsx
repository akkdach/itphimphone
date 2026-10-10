import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    IconButton,
    InputAdornment,
    Stepper,
    Step,
    StepLabel,
    Fade,
    LinearProgress,
    Avatar,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    PersonOutline,
    LockOutlined,
    BadgeOutlined,
    HomeOutlined,
    PhoneIphoneOutlined,
    CalendarMonthOutlined,
    EmailOutlined,
    ArrowForward,
    ArrowBack,
    CheckCircleOutline,
} from '@mui/icons-material';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import JobSearchAutocomplete from '../../Component/JobSearchAutocomplete/JobSearchAutocomplete';
import logo from '../../logo.png';

type RegisterMemberRequest = {
    username: string;
    password: string;
    confirmPassword: string;
    citizenId: string;
    title: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    job: string;
};

const steps = ['ข้อมูลบัญชี', 'ข้อมูลส่วนตัว', 'ที่อยู่ & อาชีพ'];

const titleOptions = [
    { label: 'เด็กชาย (ด.ช.)', value: 'ด.ช.' },
    { label: 'เด็กหญิง (ด.ญ.)', value: 'ด.ญ.' },
    { label: 'นาย', value: 'นาย' },
    { label: 'นาง', value: 'นาง' },
    { label: 'นางสาว', value: 'นางสาว' },
];

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
        {/* Floating blob 1 */}
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
        {/* Floating blob 2 */}
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
        {/* Floating blob 3 */}
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

const selectSx = {
    borderRadius: '14px',
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#fff',
    transition: 'all 0.3s ease',
    '& fieldset': {
        borderColor: 'rgba(255,255,255,0.22)',
    },
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.16)',
    },
    '&:hover fieldset': {
        borderColor: 'rgba(255,255,255,0.4)',
    },
    '&.Mui-focused fieldset': {
        borderColor: '#c4a08a',
        boxShadow: '0 0 0 3px rgba(196,160,138,0.2)',
    },
    '& .MuiSelect-icon': {
        color: 'rgba(255,255,255,0.45)',
    },
};

// ─── Main Component ─────────────────────────────────────────────────────────
const RegisterForm: React.FC = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        watch,
        trigger,
        clearErrors,
    } = useForm<RegisterMemberRequest>({
        defaultValues: {
            title: '',
            username: '',
            password: '',
            confirmPassword: '',
            citizenId: '',
            fullName: '',
            email: '',
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            job: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    const watchJob = watch('job');

    // Field groups per step for validation
    const stepFields: (keyof RegisterMemberRequest)[][] = [
        ['email', 'password', 'confirmPassword'],
        ['citizenId', 'title', 'fullName', 'phoneNumber', 'dateOfBirth'],
        ['address', 'job'],
    ];

    const handleNext = async () => {
        const isValid = await trigger(stepFields[activeStep]);
        if (isValid) {
            clearErrors();
            setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleJobChange = (value: string) => {
        setValue('job', value, { shouldValidate: true });
    };

    const onSubmit = async (data: RegisterMemberRequest) => {
        setIsSubmitting(true);
        try {
            // Sync email → username for API
            const payload = {
                ...data,
                username: data.email,
            };
            // Remove confirmPassword before sending
            const { confirmPassword, ...apiPayload } = payload;

            const result = await callApi.post('/auth/registermember', apiPayload);
            if (result?.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'สมัครสมาชิกสำเร็จ!',
                    text: 'ยินดีต้อนรับเข้าสู่ระบบ',
                    confirmButtonColor: '#6e5353',
                    background: '#3d2525',
                    color: '#fff',
                });
                const resultProfile = await callApi.get('/user/info');
                if (resultProfile.data?.data) {
                    localStorage.setItem('profile', JSON.stringify(resultProfile.data?.data));
                    window.location.replace('/');
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'ข้อผิดพลาด',
                        text: 'ไม่พบข้อมูลผู้ใช้',
                        confirmButtonColor: '#6e5353',
                        background: '#3d2525',
                        color: '#fff',
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: result?.data?.message || 'กรุณาลองใหม่อีกครั้ง',
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

    // ─── Progress calculation ───────────────────────────────────────────
    const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

    // ─── Step 1: Account Info ───────────────────────────────────────────
    const renderStep1 = () => (
        <Fade in timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar
                        sx={{
                            mx: 'auto',
                            mb: 1.5,
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #6e5353 0%, #8a6b6b 100%)',
                            boxShadow: '0 4px 20px rgba(110,83,83,0.3)',
                        }}
                    >
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        สร้างบัญชีเพื่อเข้าใช้งานระบบ
                    </Typography>
                </Box>

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
                            id="register-email"
                            label="อีเมล"
                            placeholder="example@email.com"
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

                {/* Password */}
                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: 'กรุณากรอกรหัสผ่าน',
                        minLength: { value: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-password"
                            label="รหัสผ่าน"
                            type={showPassword ? 'text' : 'password'}
                            error={!!errors.password}
                            helperText={errors.password?.message}
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            sx={{ color: 'rgba(255,255,255,0.4)' }}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                        required: 'กรุณายืนยันรหัสผ่าน',
                        validate: (value) =>
                            value === getValues('password') || 'รหัสผ่านไม่ตรงกัน',
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-confirm-password"
                            label="ยืนยันรหัสผ่าน"
                            type={showConfirmPassword ? 'text' : 'password'}
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
            </Box>
        </Fade>
    );

    // ─── Step 2: Personal Info ──────────────────────────────────────────
    const renderStep2 = () => (
        <Fade in timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar
                        sx={{
                            mx: 'auto',
                            mb: 1.5,
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #1b413c 0%, #2d6b5e 100%)',
                            boxShadow: '0 4px 20px rgba(27,65,60,0.3)',
                        }}
                    >
                        <PersonOutline />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        กรอกข้อมูลส่วนบุคคลของท่าน
                    </Typography>
                </Box>

                {/* Citizen ID */}
                <Controller
                    name="citizenId"
                    control={control}
                    rules={{
                        required: 'กรุณากรอกเลขบัตรประชาชน',
                        pattern: {
                            value: /^\d{13}$/,
                            message: 'เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-citizen-id"
                            label="เลขบัตรประชาชน"
                            placeholder="X-XXXX-XXXXX-XX-X"
                            inputProps={{ maxLength: 13, inputMode: 'numeric' }}
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

                {/* Title + Full Name Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'กรุณาเลือกคำนำหน้า' }}
                        render={({ field }) => (
                            <FormControl
                                id="register-title-control"
                                error={!!errors.title}
                                sx={{ minWidth: 120, flex: '0 0 auto' }}
                            >
                                <InputLabel
                                    sx={{
                                        color: 'rgba(255,255,255,0.5)',
                                        '&.Mui-focused': { color: '#c4a08a' },
                                    }}
                                >
                                    คำนำหน้า
                                </InputLabel>
                                <Select {...field} label="คำนำหน้า" sx={selectSx}>
                                    {titleOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.title && (
                                    <FormHelperText sx={{ color: '#ff6b6b' }}>
                                        {errors.title.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="fullName"
                        control={control}
                        rules={{ required: 'กรุณากรอกชื่อ-สกุล' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="register-fullname"
                                label="ชื่อ-สกุล"
                                error={!!errors.fullName}
                                helperText={errors.fullName?.message}
                                fullWidth
                                sx={inputSx}
                            />
                        )}
                    />
                </Box>

                {/* Phone */}
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                        required: 'กรุณากรอกเบอร์โทรศัพท์',
                        pattern: {
                            value: /^0\d{8,9}$/,
                            message: 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-phone"
                            label="เบอร์โทรศัพท์"
                            placeholder="08XXXXXXXX"
                            inputProps={{ maxLength: 10, inputMode: 'tel' }}
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
                    rules={{ required: 'กรุณากรอกวันเกิด' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-dob"
                            type="date"
                            label="วัน/เดือน/ปี เกิด"
                            error={!!errors.dateOfBirth}
                            helperText={errors.dateOfBirth?.message}
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
            </Box>
        </Fade>
    );

    // ─── Step 3: Address & Job ──────────────────────────────────────────
    const renderStep3 = () => (
        <Fade in timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar
                        sx={{
                            mx: 'auto',
                            mb: 1.5,
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #8a6b6b 0%, #c4a08a 100%)',
                            boxShadow: '0 4px 20px rgba(138,107,107,0.3)',
                        }}
                    >
                        <HomeOutlined />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ข้อมูลที่อยู่และอาชีพ
                    </Typography>
                </Box>

                {/* Address */}
                <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'กรุณากรอกที่อยู่' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="register-address"
                            label="ที่อยู่"
                            placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
                            multiline
                            rows={3}
                            error={!!errors.address}
                            helperText={errors.address?.message}
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

                {/* Job */}
                <Box
                    sx={{
                        '& .MuiAutocomplete-root': {
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '14px',
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                color: '#fff',
                                transition: 'all 0.3s ease',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
                                '&:hover': { backgroundColor: 'rgba(255,255,255,0.16)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                '&.Mui-focused': { backgroundColor: 'rgba(255,255,255,0.18)' },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#c4a08a',
                                    boxShadow: '0 0 0 3px rgba(196,160,138,0.2)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                color: 'rgba(255,255,255,0.55)',
                                '&.Mui-focused': { color: '#c4a08a' },
                            },
                            '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
                                color: 'rgba(255,255,255,0.45)',
                            },
                        },
                    }}
                >
                    <JobSearchAutocomplete value={watchJob} onChange={handleJobChange} />
                </Box>
            </Box>
        </Fade>
    );

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return renderStep1();
            case 1:
                return renderStep2();
            case 2:
                return renderStep3();
            default:
                return null;
        }
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

            {/* ─── Content Container ─────────────────────────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 440,
                    px: 2,
                    pt: { xs: 3, sm: 5 },
                }}
            >
                {/* ─── Header ─────────────────────────────────────────── */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            width: 72,
                            height: 72,
                            mx: 'auto',
                            mb: 2,
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            border: '2px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
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
                        สมัครสมาชิก
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}
                    >
                        กรอกข้อมูลเพื่อเริ่มต้นใช้งาน
                    </Typography>
                </Box>

                {/* ─── Progress Bar ───────────────────────────────────── */}
                <Box sx={{ mb: 1.5 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                background: 'linear-gradient(90deg, #6e5353 0%, #1b413c 100%)',
                                transition: 'transform 0.5s ease',
                            },
                        }}
                    />
                </Box>

                {/* ─── Stepper ────────────────────────────────────────── */}
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                        mb: 3,
                        '& .MuiStepLabel-label': {
                            color: 'rgba(255,255,255,0.35)',
                            fontSize: '0.72rem',
                            fontWeight: 500,
                            mt: 0.5,
                            '&.Mui-active': { color: '#c4a08a', fontWeight: 600 },
                            '&.Mui-completed': { color: 'rgba(255,255,255,0.6)' },
                        },
                        '& .MuiStepIcon-root': {
                            color: 'rgba(255,255,255,0.12)',
                            '&.Mui-active': { color: '#6e5353' },
                            '&.Mui-completed': { color: '#159e75' },
                        },
                        '& .MuiStepConnector-line': {
                            borderColor: 'rgba(255,255,255,0.1)',
                        },
                    }}
                >
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* ─── Glass Form Card ───────────────────────────────── */}
                <Box
                    key={activeStep}
                    sx={{
                        ...glassCard,
                        p: { xs: 2.5, sm: 3.5 },
                        pb: { xs: 3.5, sm: 4.5 },
                        mb: 4,
                        transition: 'all 0.3s ease',
                    }}
                >
                    {renderStepContent()}
                </Box>

                {/* ─── Navigation Buttons ─────────────────────────────── */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        mb: 3,
                    }}
                >
                    {activeStep > 0 && (
                        <Button
                            onClick={handleBack}
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            sx={{
                                flex: 1,
                                borderRadius: '14px',
                                py: 1.5,
                                color: 'rgba(255,255,255,0.7)',
                                borderColor: 'rgba(255,255,255,0.15)',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.35)',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                },
                            }}
                        >
                            ย้อนกลับ
                        </Button>
                    )}

                    {activeStep < steps.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            variant="contained"
                            endIcon={<ArrowForward />}
                            sx={{
                                flex: activeStep > 0 ? 1 : '1 1 100%',
                                borderRadius: '14px',
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #6e5353 0%, #5a4040 100%)',
                                boxShadow: '0 4px 20px rgba(110,83,83,0.35)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a4040 0%, #8a6b6b 100%)',
                                    boxShadow: '0 6px 28px rgba(110,83,83,0.5)',
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            ถัดไป
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            variant="contained"
                            disabled={isSubmitting}
                            endIcon={!isSubmitting && <CheckCircleOutline />}
                            sx={{
                                flex: 1,
                                borderRadius: '14px',
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #159e75 0%, #1b413c 100%)',
                                boxShadow: '0 4px 20px rgba(21,158,117,0.35)',
                                transition: 'all 0.3s ease',
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
                            {isSubmitting ? 'กำลังดำเนินการ...' : 'สมัครสมาชิก'}
                        </Button>
                    )}
                </Box>

                {/* ─── Login Link ─────────────────────────────────────── */}
                <Box sx={{ textAlign: 'center', pb: 3 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                        มีบัญชีอยู่แล้ว?{' '}
                        <Typography
                            component="span"
                            variant="body2"
                            onClick={() => navigate(-1)}
                            sx={{
                                color: '#c4a08a',
                                cursor: 'pointer',
                                fontWeight: 600,
                                transition: 'color 0.2s ease',
                                '&:hover': { color: '#e0c8b0' },
                            }}
                        >
                            เข้าสู่ระบบ
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterForm;