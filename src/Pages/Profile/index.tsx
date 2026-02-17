import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import MinimalAppBar from '../../Component/MinimalAppBar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/userContext';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';

type ProfileForm = {
  fullName: string;
  email: string;
  avatar: FileList;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};


let profile: ProfileForm | null = null;

try {
  const storedProfile = localStorage.getItem('profile');
  if (storedProfile) {
    profile = JSON.parse(storedProfile) as ProfileForm;
  }
} catch (error) {
  console.error('Error parsing profile:', error);
}


const ProfileScreen: React.FC = () => {
  const [member, setMember] = useState<any>({});
  const navigate = useNavigate();


  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      citizenId: "",
      title: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      job: "",
      province: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { user } = useUser();


  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    onload();
  }, [])

  const onload = async () => {
    var result = await callApi('mobile/myInfo');
    if (result.data) {
      reset({
        ...result.data?.data?.member,
        newPassword: '',
        confirmPassword: ''
      })
    }

  }


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };


  const onSubmit = async (data: any) => {
    var result = await callApi.post('mobile/myInfo', data);
    if (result.data?.success) {
      Swal.fire('บันทึกสำเร็จ', '', 'success');
    } else {
      Swal.fire('เกิดข้อผิดพลาด', result?.data?.data, 'error');
    }
  };





  const handleLogout = () => {
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <>
      <MinimalAppBar onBack={() => window.history.back()} title="โปรไฟล์ผู้ใช้" />
      <Box p={3}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            src={user?.imageUrl || '/default-avatar.png'}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
          {/* <Button variant="outlined" component="label">
            เปลี่ยนรูปโปรไฟล์
            <input
              type="file"
              hidden
              accept="image/*"
              {...register('avatar')}
              onChange={handleAvatarChange}
            />
          </Button> */}
        </Box>

        <Box component="form" onSubmit={handleSubmit((e: any) => onSubmit(e))}>
          <Stack spacing={2}>
            {/* Citizen ID */}
            <Controller
              name="citizenId"
              control={control}
              rules={{ required: "กรุณากรอกเลขบัตรประชาชน" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เลขบัตรประชาชน"
                  error={!!errors.citizenId}
                  helperText={errors.citizenId?.message}
                />
              )}
            />

            {/* Full Name */}
            <Controller
              name="fullName"
              control={control}
              rules={{ required: "กรุณากรอกชื่อ-นามสกุล" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ชื่อ-นามสกุล"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />



            {/* Phone */}
            <Controller
              name="phoneNumber"
              control={control}
              rules={{ required: "กรุณากรอกเบอร์โทร" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="เบอร์โทร"
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
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
                  type="date"
                  label="วันเกิด"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="ที่อยู่" />
              )}
            />

            {/* Job */}
            {/* <Controller
              name="job"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="อาชีพ" />
              )}
            /> */}

            {/* Province */}
            {/* <Controller
              name="province"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="จังหวัด" />
              )}
            /> */}

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                เปลี่ยนรหัสผ่าน
              </Typography>
            </Divider>
            {/* Email */}
            <Controller
              name="email"
              control={control}
              rules={{
                required: "กรุณากรอกอีเมล",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "รูปแบบอีเมลไม่ถูกต้อง"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="อีเมล"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            {/* New Password */}
            <Controller
              name="newPassword"
              control={control}
              rules={{ minLength: { value: 6, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' } }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="รหัสผ่านใหม่"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
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
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="ยืนยันรหัสผ่านใหม่"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />

            {/* Submit Button */}
            <Button variant="contained" color="primary" type="submit">
              บันทึกข้อมูล
            </Button>
          </Stack>
        </Box>


        <Divider sx={{ my: 4 }} />

        <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </Box>
    </>
  );
};

export default ProfileScreen;
