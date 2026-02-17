import React, { useState } from 'react';
import './UploadSlipPopup.css';
import {
    Modal,
    Box,
    Typography,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface UploadSlipModalProps {
    id: string,
    open: boolean;
    onClose: () => void;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const UploadSlipPopup: React.FC<UploadSlipModalProps> = ({ id, open, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file || !id) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:5160/api/QrCode/DOWN/${id}/upload-and-read`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: '*/*',
                    },
                }
            );

    
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            alert('เกิดข้อผิดพลาดในการอัปโหลด');
        } finally {
            setFile(null)
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" mb={2}>
                    อัปโหลดสลิปชำระเงิน
                </Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                    เลือกรูปภาพ
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>
                {file && <Typography variant="body2">ไฟล์ที่เลือก: {file.name}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading || !file || !id}
                    sx={{ mt: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'อัปโหลด'}
                </Button>
            </Box>
        </Modal>
    );
};

export default UploadSlipPopup;