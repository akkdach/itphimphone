import React from 'react';
import { Box, Container } from '@mui/material';
import PaymentHistoryCard from '../../Component/PaymentHistoryCard';

// ตัวอย่างข้อมูลที่ใช้ทดสอบ
const samplePaymentData = [
    {
        id: 4793,
        docNo: "AR000550",
        paymentDate: "2025-12-21T13:14:41Z",
        amount: 1000,
        status: 1
    },
    {
        id: 4359,
        docNo: "AR000550",
        paymentDate: "2025-12-20T08:04:18.437Z",
        amount: 23900,
        status: 1
    }
];

const PaymentHistoryDemo: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <PaymentHistoryCard payments={samplePaymentData} />
        </Container>
    );
};

export default PaymentHistoryDemo;
