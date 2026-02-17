import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, useTheme, Card, CardContent } from '@mui/material';
import { EmojiObjects, CalendarToday, Person, Paid } from '@mui/icons-material';
import MinimalAppBar from '../../Component/MinimalAppBar';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../../Component/StatusBadge';
import callApi from '../../Services/callApi';
import PaymentHistoryCard from '../../Component/PaymentHistoryCard';

const DetailRow: React.FC<any> = ({ label, value, icon, isTotal = false }) => {
    const theme = useTheme();
    return (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1.5}
            borderBottom={isTotal ? 'none' : `1px dashed ${theme.palette.divider}`}
            sx={{
                bgcolor: isTotal ? theme.palette.primary.light : 'transparent',
                borderRadius: isTotal ? 2 : 0,
                px: isTotal ? 2 : 0,
                mt: isTotal ? 1 : 0
            }}
        >
            <Box display="flex" alignItems="center" gap={1.5}>
                <Box color="text.secondary" display="flex">{icon}</Box>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
            </Box>
            <Typography
                variant="body2"
                component="span"
                fontWeight={isTotal ? 'bold' : 'medium'}
                color={isTotal ? 'primary.contrastText' : 'text.primary'}
            >
                {value}
            </Typography>
        </Box>
    );
};

const LoanDetail: React.FC = () => {

    const location = useLocation();
    const loanData = location.state;
    const [data, setData] = useState<any>(loanData);
    const [payment, setPayment] = useState<any>([]);
    const theme = useTheme();

    useEffect(() => {
        setData(loanData)
    }, [loanData])

    useEffect(() => {
        onLoadPayment();
    }, [loanData.id]);

    const onLoadPayment = async () => {
        const response = await callApi.get(`Mobile/MyPayment/loans/${loanData.id}`);
        setPayment(response.data.data);
    }

    return (
        <>
            <MinimalAppBar onBack={() => window.history.back()} title="รายละเอียดสัญญา" />
            {data && (
                <Box p={2} bgcolor={theme.palette.grey[100]} minHeight="100vh">
                    <Card elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
                        <CardContent>
                            <Stack spacing={0.5}>
                                <DetailRow label="เลขที่สัญญา" value={data.id} icon={<EmojiObjects fontSize="small" />} />
                                <DetailRow label="สินค้า" value={data.productName} icon={<EmojiObjects fontSize="small" />} />
                                <DetailRow label="ยอดทั้งหมด" value={`฿${data.loanAmount.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                                <DetailRow label="จำนวนงวด" value={`${data.installmentCount.toLocaleString()} งวด`} icon={<EmojiObjects fontSize="small" />} />
                                <DetailRow label="ยอดผ่อน/งวด" value={`฿${data.installmentAmount.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                                <DetailRow label="เริ่มต้น"
                                    value={new Date(data.startDate).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                    icon={<CalendarToday fontSize="small" />} />
                                <DetailRow label="สิ้นสุด"
                                    value={new Date(data.endDate).toLocaleDateString('th-TH', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                    icon={<CalendarToday fontSize="small" />} />
                                <DetailRow label="สถานะ" value={<StatusBadge status={data.status} />} icon={<Person fontSize="small" />} />
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Payment History Section */}
                    <PaymentHistoryCard payments={payment} />
                </Box>
            )}
        </>
    );
};

export default LoanDetail;