import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Card,
    CardContent,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import {
    CheckCircle,
    AccessTime,
    Receipt,
    CalendarToday,
    TrendingUp,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

dayjs.locale('th');

interface PaymentHistoryItem {
    id: number;
    docNo: string;
    paymentDate: string;
    amount: number;
    status: number;
}

interface PaymentHistoryCardProps {
    payments: PaymentHistoryItem[] | { data: PaymentHistoryItem[] } | any;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({ payments }) => {
    const theme = useTheme();

    // Ensure payments is always an array
    const paymentList = Array.isArray(payments)
        ? payments
        : (payments?.data && Array.isArray(payments.data))
            ? payments.data
            : [];

    const getStatusConfig = (status: number) => {
        switch (status) {
            case 1:
                return {
                    label: 'ชำระแล้ว',
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                    icon: <CheckCircle fontSize="small" />,
                };
            case 0:
                return {
                    label: 'รอดำเนินการ',
                    color: theme.palette.warning.main,
                    bgColor: alpha(theme.palette.warning.main, 0.1),
                    icon: <AccessTime fontSize="small" />,
                };
            default:
                return {
                    label: 'ไม่ทราบสถานะ',
                    color: theme.palette.grey[500],
                    bgColor: alpha(theme.palette.grey[500], 0.1),
                    icon: <AccessTime fontSize="small" />,
                };
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD MMM YYYY');
    };

    const formatTime = (dateString: string) => {
        return dayjs(dateString).format('HH:mm');
    };

    const totalAmount = paymentList.reduce((sum: number, payment: PaymentHistoryItem) => sum + payment.amount, 0);
    const completedPayments = paymentList.filter((p: PaymentHistoryItem) => p.status === 1).length;

    return (
        <Box>
            {/* Summary Cards */}
            <Stack direction="row" spacing={2} mb={3}>
                <Card
                    elevation={0}
                    sx={{
                        flex: 1,
                        background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${alpha(
                            theme.palette.success.main,
                            0.7
                        )} 100%)`,
                        color: 'white',
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <TrendingUp />
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                ยอดรวมทั้งหมด
                            </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight="bold">
                            {formatCurrency(totalAmount)}
                        </Typography>
                    </CardContent>
                </Card>

                <Card
                    elevation={0}
                    sx={{
                        flex: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(
                            theme.palette.primary.main,
                            0.7
                        )} 100%)`,
                        color: 'white',
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <CheckCircle />
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                ชำระแล้ว
                            </Typography>
                        </Box>
                        <Typography variant="h5" fontWeight="bold">
                            {completedPayments}/{paymentList.length}
                        </Typography>
                    </CardContent>
                </Card>
            </Stack>

            {/* Payment History List */}
            <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary" mb={2}>
                ประวัติการชำระเงิน
            </Typography>

            <Stack spacing={2}>
                {paymentList.map((payment: PaymentHistoryItem, index: number) => {
                    const statusConfig = getStatusConfig(payment.status);
                    const isEven = index % 2 === 0;

                    return (
                        <Card
                            key={payment.id}
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: theme.shadows[4],
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    height: 4,
                                    background: `linear-gradient(90deg, ${isEven ? theme.palette.primary.main : theme.palette.secondary.main
                                        } 0%, ${isEven
                                            ? alpha(theme.palette.primary.main, 0.5)
                                            : alpha(theme.palette.secondary.main, 0.5)
                                        } 100%)`,
                                }}
                            />
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                    {/* Left Section */}
                                    <Box flex={1}>
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Receipt
                                                fontSize="small"
                                                sx={{
                                                    color: isEven
                                                        ? theme.palette.primary.main
                                                        : theme.palette.secondary.main,
                                                }}
                                            />
                                            <Typography variant="body2" fontWeight="600" color="text.primary">
                                                {payment.docNo}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" alignItems="center" gap={1}>
                                            <CalendarToday
                                                fontSize="small"
                                                sx={{ color: theme.palette.text.secondary, fontSize: 14 }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(payment.paymentDate)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                                เวลา {formatTime(payment.paymentDate)} น.
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Right Section */}
                                    <Box textAlign="right">
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            color={statusConfig.color}
                                            mb={0.5}
                                        >
                                            {formatCurrency(payment.amount)}
                                        </Typography>
                                        <Chip
                                            label={statusConfig.label}
                                            icon={statusConfig.icon}
                                            size="small"
                                            sx={{
                                                backgroundColor: statusConfig.bgColor,
                                                color: statusConfig.color,
                                                fontWeight: 600,
                                                border: `1px solid ${alpha(statusConfig.color, 0.3)}`,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}

                {paymentList.length === 0 && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 3,
                            border: `1px dashed ${theme.palette.divider}`,
                            bgcolor: alpha(theme.palette.grey[500], 0.05),
                        }}
                    >
                        <CardContent>
                            <Box textAlign="center" py={4}>
                                <Receipt sx={{ fontSize: 48, color: theme.palette.grey[400], mb: 2 }} />
                                <Typography variant="body1" color="text.secondary">
                                    ยังไม่มีประวัติการชำระเงิน
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
};

export default PaymentHistoryCard;
