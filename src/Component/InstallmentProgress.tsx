import React from 'react';
import { Box, Typography, CircularProgress, Stack, useTheme } from '@mui/material';

type Props = {
    totalAmount: number;
    paidAmount: number;
};

const InstallmentProgress: React.FC<Props> = ({ totalAmount, paidAmount }) => {
    const theme = useTheme();
    // Prevent division by zero
    const percentage = totalAmount > 0 ? Math.min(100, Math.max(0, (paidAmount / totalAmount) * 100)) : 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    return (
        <Box
            sx={{
                p: 2,
                maxWidth: 320,
                mx: 'auto',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="text.primary">
                สถานะการผ่อนชำระ
            </Typography>

            <Box position="relative" display="inline-flex" mb={2}>
                <Box position="relative" display="inline-flex">
                    {/* Background Circle */}
                    <CircularProgress
                        variant="determinate"
                        value={100}
                        size={140}
                        thickness={6}
                        sx={{ color: theme.palette.grey[200] }}
                    />

                    {/* Progress Circle */}
                    <CircularProgress
                        variant="determinate"
                        value={percentage}
                        size={140}
                        thickness={6}
                        sx={{
                            color: theme.palette.primary.main,
                            position: 'absolute',
                            left: 0,
                            strokeLinecap: 'round',
                        }}
                    />
                </Box>

                {/* Percentage Text */}
                <Box
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    position="absolute"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                >
                    <Typography
                        variant="h4"
                        component="div"
                        fontWeight="bold"
                        color="text.primary"
                    >
                        {`${Math.round(percentage)}%`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        ชำระแล้ว
                    </Typography>
                </Box>
            </Box>

            <Stack spacing={1} width="100%">
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">ยอดรวมทั้งหมด &nbsp;</Typography>
                    <Typography variant="body2" fontWeight="medium" color="text.primary">
                        {totalAmount.toLocaleString()} บาท
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">ชำระแล้ว &nbsp;</Typography>
                    <Typography variant="body2" fontWeight="medium" color="success.main">
                        {paidAmount.toLocaleString()} บาท
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">คงเหลือ &nbsp;</Typography>
                    <Typography variant="body2" fontWeight="medium" color="error.main">
                        {remainingAmount.toLocaleString()} บาท
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};

export default InstallmentProgress;
