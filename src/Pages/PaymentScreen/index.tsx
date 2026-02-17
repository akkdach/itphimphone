import { Box, Typography, TextField, Button, Stack, Divider, List, ListItem, ListItemText, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import MinimalAppBar from '../../Component/MinimalAppBar';
import PaymentHistory from './PaymentHistory';
import UploadSlip from '../../Component/UploadSlip';

export default function PaymentScreen() {


    const [contract, setContract] = useState('');
    const [slip, setSlip] = useState(null);
    const [history, setHistory] = useState([
        { date: '2025-08-01', amount: '฿1,000', status: 'ชำระแล้ว', contract: 'สัญญา A' },
        { date: '2025-07-01', amount: '฿1,000', status: 'ชำระแล้ว', contract: 'สัญญา B' },
    ]);

    const handleSlipUpload = (e: any) => {
        // setSlip(URL.createObjectURL(e.target.files[0]));
    };

    return (
        <>
            <MinimalAppBar title='ชำระเงิน' onBack={function (): void {
                throw new Error('Function not implemented.');
            }} />

            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <PaymentHistory />
            </Box>

        </>
    );
}
