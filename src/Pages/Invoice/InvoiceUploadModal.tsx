import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    CircularProgress,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';
import { uploadImageService } from '../../Services/uploadImageService';

interface InvoiceUploadModalProps {
    open: boolean;
    onClose: () => void;
    invoiceId: string | number;
    onSuccess: () => void;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 400,
    maxHeight: '90vh', // Prevent overflow on small screens
    overflowY: 'auto' as const, // Scroll if content is too tall
    bgcolor: 'background.paper',
    borderRadius: 4,
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    p: 4,
    outline: 'none',
    textAlign: 'center' as const
};

const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({ open, onClose, invoiceId, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleClose = () => {
        setFile(null);
        setPreview(null);
        onClose();
    };



    const handleSubmit = async () => {
        if (!file || !invoiceId) return;

        try {
            const result = await Swal.fire({
                title: 'ยืนยันการส่ง?',
                text: "คุณต้องการอัปโหลดสลิปใช่ไหม",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ใช่, อัปโหลด!',
                cancelButtonText: 'ยกเลิก',
                customClass: {
                    container: 'swal-above-modal'
                }
            });

            if (result.isConfirmed) {
                setLoading(true);
                var uploadResult = await uploadImageService(`Slip/OTHER/${invoiceId}/upload`, file);

                setLoading(false);
                if (uploadResult?.success === true || uploadResult?.message === 'Success') { // Adjust check based on API response structure
                    // If success
                    await Swal.fire({
                        title: 'สำเร็จ!',
                        text: uploadResult?.message == 'บันทึกชำระเงินเรียบร้อย' ? 'อัปโหลดสลิปเรียบร้อยแล้ว' : uploadResult?.message,
                        icon: uploadResult?.message == 'บันทึกชำระเงินเรียบร้อย' ? 'success' : 'error',
                        customClass: { container: 'swal-above-modal' }
                    });
                    onSuccess();
                    handleClose();
                } else {
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: uploadResult?.message || 'อัปโหลดไม่สำเร็จ',
                        icon: uploadResult?.message == 'บันทึกชำระเงินเรียบร้อย' ? 'success' : 'error',
                        customClass: { container: 'swal-above-modal' }
                    });
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
            setLoading(false);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                icon: 'error',
                customClass: { container: 'swal-above-modal' }
            });
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Box position="absolute" right={8} top={8}>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="h6" mb={1} fontWeight={600} color="#333">
                    อัปโหลดสลิป 🧾
                </Typography>
                <Typography variant="body2" color="textSecondary" mb={3}>
                    แนบหลักฐานการโอนเงินเพื่อยืนยัน
                </Typography>

                <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                        mb: 2,
                        height: 120,
                        borderStyle: 'dashed',
                        borderRadius: 3,
                        borderColor: '#FF9A9E',
                        color: '#FF9A9E',
                        flexDirection: 'column',
                        '&:hover': {
                            borderColor: '#ff7b82',
                            backgroundColor: '#fff0f1'
                        }
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }}
                        />
                    ) : (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
                            <span>แตะเพื่อเลือกรูปภาพ</span>
                        </>
                    )}
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    sx={{
                        mt: 1,
                        borderRadius: 50,
                        padding: '10px 0',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        '&:disabled': {
                            opacity: 0.6,
                            color: 'white' // Keep text visible if desirable or let MUI handle it
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'ยืนยันการส่ง'}
                </Button>
            </Box>
        </Modal>
    );
};

export default InvoiceUploadModal;
