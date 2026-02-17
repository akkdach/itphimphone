import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import MinimalAppBar from '../../Component/MinimalAppBar'; // adjust path as needed

type SettingsForm = {
  fullName: string;
  email: string;
  phone: string;
  defaultMonths: number;
  defaultInterestRate: number;
  downPaymentType: 'amount' | 'percent';
};

const SettingScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SettingsForm>({
    defaultValues: {
      downPaymentType: 'amount',
    },
  });

  const downPaymentType = watch('downPaymentType');

  const onSubmit = (data: SettingsForm) => {
    console.log('Settings saved:', data);
    // You can add API call here
  };

  return (
    <>
      <MinimalAppBar onBack={() => window.history.back()} title="ตั้งค่า" />
      <Box p={3} bgcolor="background.default">
        <Typography variant="h6" gutterBottom>
          ข้อมูลผู้ใช้
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="ชื่อ-นามสกุล"
            fullWidth
            margin="normal"
            {...register('fullName', { required: 'กรุณากรอกชื่อ' })}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />

          <TextField
            label="อีเมล"
            fullWidth
            margin="normal"
            {...register('email', {
              required: 'กรุณากรอกอีเมล',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'รูปแบบอีเมลไม่ถูกต้อง',
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="เบอร์โทรศัพท์"
            fullWidth
            margin="normal"
            {...register('phone', {
              required: 'กรุณากรอกเบอร์โทร',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'กรุณากรอกเบอร์โทร 10 หลัก',
              },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          />

          <Typography variant="h6" mt={4} gutterBottom>
            การตั้งค่าการผ่อนชำระ
          </Typography>

          <TextField
            label="จำนวนเดือนผ่อนเริ่มต้น"
            type="number"
            fullWidth
            margin="normal"
            {...register('defaultMonths', {
              required: 'กรุณากรอกจำนวนเดือน',
              min: { value: 1, message: 'ต้องมากกว่า 0' },
            })}
            error={!!errors.defaultMonths}
            helperText={errors.defaultMonths?.message}
          />

          <TextField
            label="อัตราดอกเบี้ยเริ่มต้น (%)"
            type="number"
            fullWidth
            margin="normal"
            {...register('defaultInterestRate', {
              required: 'กรุณากรอกดอกเบี้ย',
              min: { value: 0, message: 'ต้องไม่ติดลบ' },
            })}
            error={!!errors.defaultInterestRate}
            helperText={errors.defaultInterestRate?.message}
          />

          <Typography variant="subtitle1" mt={2}>
            รูปแบบการกรอกเงินดาวน์
          </Typography>

          <RadioGroup row defaultValue="amount" {...register('downPaymentType')}>
            <FormControlLabel value="amount" control={<Radio />} label="จำนวนเงิน (บาท)" />
            <FormControlLabel value="percent" control={<Radio />} label="เปอร์เซ็นต์ (%)" />
          </RadioGroup>

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            บันทึกการตั้งค่า
          </Button>
        </form>
      </Box>
    </>
  );
};

export default SettingScreen;
