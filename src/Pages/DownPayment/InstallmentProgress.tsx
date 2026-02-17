import React from 'react';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';

type Props = {
    totalAmount: number;
    paidAmount: number;
};

const InstallmentProgress: React.FC<Props> = ({ totalAmount, paidAmount }) => {
    const percentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;
    const remainingAmount = totalAmount - paidAmount;

    return (
        <Box
            sx={{
                p: 2,
                // borderRadius: 2,
                // boxShadow: 2,
                // backgroundColor: '#ffffff',
                maxWidth: 320,
                mx: 'auto', // center horizontally
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" gutterBottom color="">
                สถานะการผ่อนชำระ
            </Typography>

            <Box position="relative" display="inline-flex" mb={2}>
                <Box position="relative" display="inline-flex">
                    {/* วงกลมพื้นหลัง (ขอบสีขาว) */}
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={120} // ใหญ่กว่าวงกลมจริง
                        thickness={5}
                        sx={{ color: '#89c3dfff', position: 'absolute', top: 0, left: 0 }}
                    />

                    {/* วงกลมจริง */}
                    <CircularProgress
                        variant="determinate"
                        value={percentage}
                        size={120}
                        thickness={5}
                        sx={{ color: '#0f7aacff' }}
                    />
                </Box>
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ color: '' }}
                    >
                        {`${Math.round(percentage)}%`}
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={1} width="100%">
                <Typography variant="body2" color="">
                    ยอดรวม: {totalAmount.toLocaleString()} บาท
                </Typography>
                <Typography variant="body2" color="">
                    ชำระแล้ว: {paidAmount.toLocaleString()} บาท
                </Typography>
                <Typography variant="body2" color="">
                    คงเหลือ: {remainingAmount.toLocaleString()} บาท
                </Typography>
            </Stack>
        </Box>
    );
};

export default InstallmentProgress;