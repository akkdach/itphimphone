import React from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import MinimalAppBar from '../../Component/MinimalAppBar'; // adjust path as needed

type FormValues = {
    firstName: string;
    lastName: string;
    age: number;
    dob: string;
    registeredAddress: string;
    currentAddress: string;
    productName: string;
    productPrice: number;
    months: number;
    interestRate: number;
    downPaymentType: DownPaymentType;
    downPayment: number;
};
type DownPaymentType = 'amount' | 'percent';

const LoanFormThai: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>();


    const productPrice = watch('productPrice') || 0;
    // const downPayment = watch('downPayment') || 0;
    const downPaymentType = watch('downPaymentType') || 'amount';
    const rawDownPayment = watch('downPayment') || 0;
    const downPayment =
        downPaymentType === 'percent'
            ? (productPrice * rawDownPayment) / 100
            : rawDownPayment;

    const months = watch('months') || 1;
    const interestRate = watch('interestRate') || 0;

    const loanAmount = productPrice - downPayment;
    const totalInterest = (loanAmount * interestRate) / 100;
    const totalPayable = loanAmount + totalInterest;
    const monthlyPayment = totalPayable / months;







    const onSubmit = (data: FormValues) => {
        console.log('ข้อมูลฟอร์ม:', data);
    };

    return (
        <>
            <MinimalAppBar onBack={() => window.history.back()} title="ฟอร์มสมัครสินเชื่อ" />
            <Box p={3} bgcolor="background.primary">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        label="ชื่อ"
                        fullWidth
                        margin="normal"
                        {...register('firstName', { required: 'กรุณากรอกชื่อ' })}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                    <TextField
                        label="นามสกุล"
                        fullWidth
                        margin="normal"
                        {...register('lastName', { required: 'กรุณากรอกนามสกุล' })}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                    <TextField
                        label="อายุ"
                        type="number"
                        fullWidth
                        margin="normal"
                        {...register('age', { required: 'กรุณากรอกอายุ', min: 18 })}
                        error={!!errors.age}
                        helperText={errors.age?.message}
                    />
                    <TextField
                        label="วันเดือนปีเกิด"
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        {...register('dob', { required: 'กรุณากรอกวันเกิด' })}
                        error={!!errors.dob}
                        helperText={errors.dob?.message}
                    />
                    <TextField
                        label="ที่อยู่ตามทะเบียนบ้าน"
                        fullWidth
                        margin="normal"
                        multiline
                        {...register('registeredAddress', { required: 'กรุณากรอกที่อยู่' })}
                        error={!!errors.registeredAddress}
                        helperText={errors.registeredAddress?.message}
                    />
                    <TextField
                        label="ที่อยู่ปัจจุบัน"
                        fullWidth
                        margin="normal"
                        multiline
                        {...register('currentAddress', { required: 'กรุณากรอกที่อยู่ปัจจุบัน' })}
                        error={!!errors.currentAddress}
                        helperText={errors.currentAddress?.message}
                    />
                    <TextField
                        label="ชื่อสินค้า"
                        fullWidth
                        margin="normal"
                        {...register('productName', { required: 'กรุณากรอกชื่อสินค้า' })}
                        error={!!errors.productName}
                        helperText={errors.productName?.message}
                    />
                    <TextField
                        label="ราคาสินค้า"
                        type="number"
                        fullWidth
                        margin="normal"
                        {...register('productPrice', { required: 'กรุณากรอกราคา' })}
                        error={!!errors.productPrice}
                        helperText={errors.productPrice?.message}
                    />

                    <RadioGroup row defaultValue="amount" {...register('downPaymentType')}>
                        <FormControlLabel value="amount" control={<Radio />} label="จำนวนเงิน (บาท)" />
                        <FormControlLabel value="percent" control={<Radio />} label="เปอร์เซ็นต์ (%)" />
                    </RadioGroup>


                    <TextField
                        label={downPaymentType === 'percent' ? 'เงินดาวน์ (%)' : 'เงินดาวน์ (บาท)'}
                        type="number"
                        fullWidth
                        margin="normal"
                        {...register('downPayment', { required: 'กรุณากรอกเงินดาวน์' })}
                        error={!!errors.downPayment}
                        helperText={errors.downPayment?.message}
                    />

                    <TextField
                        label="จำนวนเดือนผ่อน"
                        type="number"
                        fullWidth
                        margin="normal"
                        {...register('months', { required: 'กรุณากรอกจำนวนเดือน', min: 1 })}
                        error={!!errors.months}
                        helperText={errors.months?.message}
                    />
                    <TextField
                        label="อัตราดอกเบี้ย (%)"
                        type="number"
                        fullWidth
                        margin="normal"
                        {...register('interestRate', { required: 'กรุณากรอกดอกเบี้ย' })}
                        error={!!errors.interestRate}
                        helperText={errors.interestRate?.message}
                    />
                    <TextField
                        label="ยอดเงินกู้"
                        value={loanAmount.toFixed(2)}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        label="ยอดชำระต่อเดือน"
                        value={monthlyPayment.toFixed(2)}
                        fullWidth
                        margin="normal"
                        InputProps={{ readOnly: true }}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        ส่งคำขอ
                    </Button>
                </form>
            </Box>
        </>
    );
};

export default LoanFormThai;
