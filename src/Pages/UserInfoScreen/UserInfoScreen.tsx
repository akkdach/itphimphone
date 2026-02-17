import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import MinimalAppBar from '../../Component/MinimalAppBar'; // Adjust path as needed

type UserInfoForm = {
  firstName: string;
  lastName: string;
  age: number;
  dob: string;
  nationalId: string;
  phone: string;
  email: string;
  maritalStatus: string;
  dependents: number;
  currentAddress: string;
  registeredAddress: string;
  occupation: string;
  employer: string;
  employerAddress: string;
  employmentType: string;
  income: number;
  employmentDuration: number;
  bankAccount: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
};

const UserInfoScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoForm>();

  const onSubmit = (data: UserInfoForm) => {
    console.log('ข้อมูลผู้ใช้:', data);
    // You can connect to API here
  };

  return (
    <>
      <MinimalAppBar onBack={() => window.history.back()} title="ฟอร์มข้อมูลผู้ใช้" />
      <Box p={3} bgcolor="background.default">
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
            label="เลขบัตรประชาชน"
            fullWidth
            margin="normal"
            {...register('nationalId', {
              required: 'กรุณากรอกเลขบัตรประชาชน',
              pattern: {
                value: /^[0-9]{13}$/,
                message: 'เลขบัตรประชาชนต้องมี 13 หลัก',
              },
            })}
            error={!!errors.nationalId}
            helperText={errors.nationalId?.message}
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
            label="สถานะสมรส"
            fullWidth
            margin="normal"
            {...register('maritalStatus', { required: 'กรุณาระบุสถานะสมรส' })}
            error={!!errors.maritalStatus}
            helperText={errors.maritalStatus?.message}
          />

          <TextField
            label="จำนวนผู้ที่อยู่ในความดูแล"
            type="number"
            fullWidth
            margin="normal"
            {...register('dependents', { required: 'กรุณาระบุจำนวนผู้ที่อยู่ในความดูแล' })}
            error={!!errors.dependents}
            helperText={errors.dependents?.message}
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
            label="ที่อยู่ตามทะเบียนบ้าน"
            fullWidth
            margin="normal"
            multiline
            {...register('registeredAddress', { required: 'กรุณากรอกที่อยู่ตามทะเบียนบ้าน' })}
            error={!!errors.registeredAddress}
            helperText={errors.registeredAddress?.message}
          />

          <TextField
            label="อาชีพ"
            fullWidth
            margin="normal"
            {...register('occupation', { required: 'กรุณาระบุอาชีพ' })}
            error={!!errors.occupation}
            helperText={errors.occupation?.message}
          />

          <TextField
            label="ชื่อบริษัท"
            fullWidth
            margin="normal"
            {...register('employer', { required: 'กรุณาระบุชื่อบริษัท' })}
            error={!!errors.employer}
            helperText={errors.employer?.message}
          />

          <TextField
            label="ที่อยู่บริษัท"
            fullWidth
            margin="normal"
            multiline
            {...register('employerAddress', { required: 'กรุณาระบุที่อยู่บริษัท' })}
            error={!!errors.employerAddress}
            helperText={errors.employerAddress?.message}
          />

          <TextField
            label="ประเภทการจ้างงาน"
            fullWidth
            margin="normal"
            {...register('employmentType', { required: 'กรุณาระบุประเภทการจ้างงาน' })}
            error={!!errors.employmentType}
            helperText={errors.employmentType?.message}
          />

          <TextField
            label="รายได้ต่อเดือน"
            type="number"
            fullWidth
            margin="normal"
            {...register('income', { required: 'กรุณาระบุรายได้ต่อเดือน' })}
            error={!!errors.income}
            helperText={errors.income?.message}
          />

          <TextField
            label="ระยะเวลาทำงาน (ปี)"
            type="number"
            fullWidth
            margin="normal"
            {...register('employmentDuration', { required: 'กรุณาระบุระยะเวลาทำงาน' })}
            error={!!errors.employmentDuration}
            helperText={errors.employmentDuration?.message}
          />

          <TextField
            label="เลขบัญชีธนาคาร"
            fullWidth
            margin="normal"
            {...register('bankAccount', { required: 'กรุณาระบุเลขบัญชีธนาคาร' })}
            error={!!errors.bankAccount}
            helperText={errors.bankAccount?.message}
          />

          <TextField
            label="ชื่อบุคคลฉุกเฉิน"
            fullWidth
            margin="normal"
            {...register('emergencyContactName', { required: 'กรุณาระบุชื่อบุคคลฉุกเฉิน' })}
            error={!!errors.emergencyContactName}
            helperText={errors.emergencyContactName?.message}
          />

          <TextField
            label="เบอร์โทรบุคคลฉุกเฉิน"
            fullWidth
            margin="normal"
            {...register('emergencyContactPhone', {
              required: 'กรุณาระบุเบอร์โทรบุคคลฉุกเฉิน',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'กรุณากรอกเบอร์โทร 10 หลัก',
              },
            })}
            error={!!errors.emergencyContactPhone}
            helperText={errors.emergencyContactPhone?.message}
          />

          <TextField
            label="ความสัมพันธ์กับบุคคลฉุกเฉิน"
            fullWidth
            margin="normal"
            {...register('emergencyContactRelation', { required: 'กรุณาระบุความสัมพันธ์' })}
            error={!!errors.emergencyContactRelation}
            helperText={errors.emergencyContactRelation?.message}
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            บันทึกข้อมูล
          </Button>
        </form>
      </Box>
    </>
  );
};

export default UserInfoScreen;
