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
    Stepper,
    Step,
    StepLabel,
    Fade,
    LinearProgress,
    Avatar,
    InputAdornment,
} from '@mui/material';
import {
    PersonOutline,
    BadgeOutlined,
    HomeOutlined,
    PhoneIphoneOutlined,
    CalendarMonthOutlined,
    EmailOutlined,
    ArrowForward,
    ArrowBack,
    CheckCircleOutline,
    WorkOutline,
    BusinessOutlined,
    AccountBalanceOutlined,
    ContactEmergencyOutlined,
    FavoriteOutlined,
    PeopleOutlined,
    AttachMoneyOutlined,
    AccessTimeOutlined,
} from '@mui/icons-material';
import MinimalAppBar from '../../Component/MinimalAppBar';

type UserInfoForm = {
    firstName: string;
    lastName: string;
    age: number | '';
    dob: string;
    nationalId: string;
    phone: string;
    email: string;
    maritalStatus: string;
    dependents: number | '';
    currentAddress: string;
    registeredAddress: string;
    occupation: string;
    employer: string;
    employerAddress: string;
    employmentType: string;
    income: number | '';
    employmentDuration: number | '';
    bankAccount: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
};

const steps = ['ข้อมูลส่วนตัว', 'สถานะ & ที่อยู่', 'อาชีพ & การงาน', 'บุคคลฉุกเฉิน'];

const maritalOptions = [
    { label: 'โสด', value: 'โสด' },
    { label: 'สมรส', value: 'สมรส' },
    { label: 'หม้าย', value: 'หม้าย' },
    { label: 'หย่า', value: 'หย่า' },
];

const employmentTypeOptions = [
    { label: 'พนักงานประจำ', value: 'พนักงานประจำ' },
    { label: 'พนักงานสัญญาจ้าง', value: 'พนักงานสัญญาจ้าง' },
    { label: 'ธุรกิจส่วนตัว', value: 'ธุรกิจส่วนตัว' },
    { label: 'ฟรีแลนซ์', value: 'ฟรีแลนซ์' },
    { label: 'ข้าราชการ', value: 'ข้าราชการ' },
    { label: 'รัฐวิสาหกิจ', value: 'รัฐวิสาหกิจ' },
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
const UserInfoScreen: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
        clearErrors,
    } = useForm<UserInfoForm>({
        defaultValues: {
            firstName: '',
            lastName: '',
            age: '',
            dob: '',
            nationalId: '',
            phone: '',
            email: '',
            maritalStatus: '',
            dependents: '',
            currentAddress: '',
            registeredAddress: '',
            occupation: '',
            employer: '',
            employerAddress: '',
            employmentType: '',
            income: '',
            employmentDuration: '',
            bankAccount: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelation: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    });

    // Field groups per step for validation
    const stepFields: (keyof UserInfoForm)[][] = [
        ['firstName', 'lastName', 'age', 'dob', 'nationalId', 'phone', 'email'],
        ['maritalStatus', 'dependents', 'currentAddress', 'registeredAddress'],
        ['occupation', 'employer', 'employerAddress', 'employmentType', 'income', 'employmentDuration', 'bankAccount'],
        ['emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelation'],
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

    const onSubmit = async (data: UserInfoForm) => {
        setIsSubmitting(true);
        try {
            console.log('ข้อมูลผู้ใช้:', data);
            // TODO: Connect to API here
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = useMemo(() => ((activeStep + 1) / steps.length) * 100, [activeStep]);

    // ─── Step 1: Personal Info ───────────────────────────────────────────
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
                        <PersonOutline />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        กรอกข้อมูลส่วนบุคคลของท่าน
                    </Typography>
                </Box>

                {/* First Name + Last Name Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="firstName"
                        control={control}
                        rules={{ required: 'กรุณากรอกชื่อ' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-firstname"
                                label="ชื่อ"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                fullWidth
                                sx={inputSx}
                            />
                        )}
                    />
                    <Controller
                        name="lastName"
                        control={control}
                        rules={{ required: 'กรุณากรอกนามสกุล' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-lastname"
                                label="นามสกุล"
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                                fullWidth
                                sx={inputSx}
                            />
                        )}
                    />
                </Box>

                {/* Age + Date of Birth Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="age"
                        control={control}
                        rules={{ required: 'กรุณากรอกอายุ', min: { value: 18, message: 'อายุต้อง 18 ปีขึ้นไป' } }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-age"
                                type="number"
                                label="อายุ"
                                error={!!errors.age}
                                helperText={errors.age?.message}
                                sx={{ ...inputSx, flex: '0 0 100px' }}
                            />
                        )}
                    />
                    <Controller
                        name="dob"
                        control={control}
                        rules={{ required: 'กรุณากรอกวันเกิด' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-dob"
                                type="date"
                                label="วันเดือนปีเกิด"
                                error={!!errors.dob}
                                helperText={errors.dob?.message}
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

                {/* National ID */}
                <Controller
                    name="nationalId"
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
                            id="userinfo-national-id"
                            label="เลขบัตรประชาชน"
                            placeholder="X-XXXX-XXXXX-XX-X"
                            inputProps={{ maxLength: 13, inputMode: 'numeric' }}
                            error={!!errors.nationalId}
                            helperText={errors.nationalId?.message}
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

                {/* Phone */}
                <Controller
                    name="phone"
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
                            id="userinfo-phone"
                            label="เบอร์โทรศัพท์"
                            placeholder="08XXXXXXXX"
                            inputProps={{ maxLength: 10, inputMode: 'tel' }}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
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
                            id="userinfo-email"
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
            </Box>
        </Fade>
    );

    // ─── Step 2: Status & Address ────────────────────────────────────────
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
                        <HomeOutlined />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        สถานะครอบครัวและที่อยู่
                    </Typography>
                </Box>

                {/* Marital Status + Dependents Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="maritalStatus"
                        control={control}
                        rules={{ required: 'กรุณาระบุสถานะสมรส' }}
                        render={({ field }) => (
                            <FormControl error={!!errors.maritalStatus} sx={{ flex: 1 }}>
                                <InputLabel
                                    sx={{
                                        color: 'rgba(255,255,255,0.5)',
                                        '&.Mui-focused': { color: '#c4a08a' },
                                    }}
                                >
                                    สถานะสมรส
                                </InputLabel>
                                <Select {...field} label="สถานะสมรส" sx={selectSx}>
                                    {maritalOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.maritalStatus && (
                                    <FormHelperText sx={{ color: '#ff6b6b' }}>
                                        {errors.maritalStatus.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="dependents"
                        control={control}
                        rules={{ required: 'กรุณาระบุจำนวน' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-dependents"
                                type="number"
                                label="ผู้อยู่ในดูแล"
                                error={!!errors.dependents}
                                helperText={errors.dependents?.message}
                                sx={{ ...inputSx, flex: '0 0 120px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PeopleOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>

                {/* Current Address */}
                <Controller
                    name="currentAddress"
                    control={control}
                    rules={{ required: 'กรุณากรอกที่อยู่ปัจจุบัน' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-current-address"
                            label="ที่อยู่ปัจจุบัน"
                            placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
                            multiline
                            rows={3}
                            error={!!errors.currentAddress}
                            helperText={errors.currentAddress?.message}
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

                {/* Registered Address */}
                <Controller
                    name="registeredAddress"
                    control={control}
                    rules={{ required: 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-registered-address"
                            label="ที่อยู่ตามทะเบียนบ้าน"
                            placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด"
                            multiline
                            rows={3}
                            error={!!errors.registeredAddress}
                            helperText={errors.registeredAddress?.message}
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
            </Box>
        </Fade>
    );

    // ─── Step 3: Career & Employment ─────────────────────────────────────
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
                        <WorkOutline />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ข้อมูลอาชีพและการทำงาน
                    </Typography>
                </Box>

                {/* Occupation + Employment Type Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="occupation"
                        control={control}
                        rules={{ required: 'กรุณาระบุอาชีพ' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-occupation"
                                label="อาชีพ"
                                error={!!errors.occupation}
                                helperText={errors.occupation?.message}
                                fullWidth
                                sx={inputSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WorkOutline />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="employmentType"
                        control={control}
                        rules={{ required: 'กรุณาเลือกประเภท' }}
                        render={({ field }) => (
                            <FormControl error={!!errors.employmentType} sx={{ flex: 1 }}>
                                <InputLabel
                                    sx={{
                                        color: 'rgba(255,255,255,0.5)',
                                        '&.Mui-focused': { color: '#c4a08a' },
                                    }}
                                >
                                    ประเภทจ้างงาน
                                </InputLabel>
                                <Select {...field} label="ประเภทจ้างงาน" sx={selectSx}>
                                    {employmentTypeOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.employmentType && (
                                    <FormHelperText sx={{ color: '#ff6b6b' }}>
                                        {errors.employmentType.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                </Box>

                {/* Employer */}
                <Controller
                    name="employer"
                    control={control}
                    rules={{ required: 'กรุณาระบุชื่อบริษัท' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-employer"
                            label="ชื่อบริษัท / สถานที่ทำงาน"
                            error={!!errors.employer}
                            helperText={errors.employer?.message}
                            fullWidth
                            sx={inputSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />

                {/* Employer Address */}
                <Controller
                    name="employerAddress"
                    control={control}
                    rules={{ required: 'กรุณาระบุที่อยู่บริษัท' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-employer-address"
                            label="ที่อยู่บริษัท"
                            multiline
                            rows={2}
                            error={!!errors.employerAddress}
                            helperText={errors.employerAddress?.message}
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

                {/* Income + Duration Row */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Controller
                        name="income"
                        control={control}
                        rules={{ required: 'กรุณาระบุรายได้' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-income"
                                type="number"
                                label="รายได้ / เดือน"
                                error={!!errors.income}
                                helperText={errors.income?.message}
                                fullWidth
                                sx={inputSx}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="employmentDuration"
                        control={control}
                        rules={{ required: 'กรุณาระบุ' }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                id="userinfo-employment-duration"
                                type="number"
                                label="ระยะเวลา (ปี)"
                                error={!!errors.employmentDuration}
                                helperText={errors.employmentDuration?.message}
                                sx={{ ...inputSx, flex: '0 0 130px' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTimeOutlined />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>

                {/* Bank Account */}
                <Controller
                    name="bankAccount"
                    control={control}
                    rules={{ required: 'กรุณาระบุเลขบัญชีธนาคาร' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-bank-account"
                            label="เลขบัญชีธนาคาร"
                            error={!!errors.bankAccount}
                            helperText={errors.bankAccount?.message}
                            fullWidth
                            sx={inputSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalanceOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </Box>
        </Fade>
    );

    // ─── Step 4: Emergency Contact ───────────────────────────────────────
    const renderStep4 = () => (
        <Fade in timeout={500}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    <Avatar
                        sx={{
                            mx: 'auto',
                            mb: 1.5,
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #cf3e3e 0%, #8a3b3b 100%)',
                            boxShadow: '0 4px 20px rgba(207,62,62,0.3)',
                        }}
                    >
                        <ContactEmergencyOutlined />
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        ข้อมูลติดต่อกรณีฉุกเฉิน
                    </Typography>
                </Box>

                {/* Emergency Contact Name */}
                <Controller
                    name="emergencyContactName"
                    control={control}
                    rules={{ required: 'กรุณาระบุชื่อบุคคลฉุกเฉิน' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-emergency-name"
                            label="ชื่อ-สกุล บุคคลฉุกเฉิน"
                            error={!!errors.emergencyContactName}
                            helperText={errors.emergencyContactName?.message}
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

                {/* Emergency Contact Phone */}
                <Controller
                    name="emergencyContactPhone"
                    control={control}
                    rules={{
                        required: 'กรุณาระบุเบอร์โทรบุคคลฉุกเฉิน',
                        pattern: {
                            value: /^0\d{8,9}$/,
                            message: 'กรุณากรอกเบอร์โทร 10 หลัก',
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-emergency-phone"
                            label="เบอร์โทรบุคคลฉุกเฉิน"
                            placeholder="08XXXXXXXX"
                            inputProps={{ maxLength: 10, inputMode: 'tel' }}
                            error={!!errors.emergencyContactPhone}
                            helperText={errors.emergencyContactPhone?.message}
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

                {/* Emergency Contact Relation */}
                <Controller
                    name="emergencyContactRelation"
                    control={control}
                    rules={{ required: 'กรุณาระบุความสัมพันธ์' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="userinfo-emergency-relation"
                            label="ความสัมพันธ์"
                            placeholder="เช่น พ่อ, แม่, คู่สมรส"
                            error={!!errors.emergencyContactRelation}
                            helperText={errors.emergencyContactRelation?.message}
                            fullWidth
                            sx={inputSx}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FavoriteOutlined />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
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
            case 3:
                return renderStep4();
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

            {/* ─── AppBar ─────────────────────────────────────────────── */}
            <Box sx={{ position: 'relative', zIndex: 2, width: '100%' }}>
                <MinimalAppBar
                    onBack={() => window.history.back()}
                    title="ฟอร์มข้อมูลผู้ใช้"
                />
            </Box>

            {/* ─── Content Container ─────────────────────────────────── */}
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 480,
                    px: 2,
                    pt: 2,
                }}
            >
                {/* ─── Header ─────────────────────────────────────────── */}
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: '#fff',
                            mb: 0.5,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        ข้อมูลผู้ใช้
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}
                    >
                        กรอกข้อมูลให้ครบถ้วนเพื่อยื่นเรื่อง
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
                            fontSize: '0.68rem',
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
                            {isSubmitting ? 'กำลังดำเนินการ...' : 'บันทึกข้อมูล'}
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default UserInfoScreen;
