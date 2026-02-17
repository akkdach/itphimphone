import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    CircularProgress,
    Stack,
    IconButton
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

interface UploadSlipModalProps {
    open: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
    title?: string;
}

const UploadSlipModal: React.FC<UploadSlipModalProps> = ({ open, onClose, onUpload, title = "อัปโหลดสลิปชำระเงิน" }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file) return;

        setLoading(true);
        try {
            await onUpload(file);
            setFile(null);
            onClose();
        } catch (error) {
            console.error('Upload error:', error);
            // Alert is handled by parent or we can add it here if needed
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setFile(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        {title}
                    </Typography>
                    <IconButton onClick={handleClose} disabled={loading} size="small">
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <Box
                    sx={{
                        border: '2px dashed #ccc',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        mb: 2,
                        backgroundColor: '#f8f9fa',
                        cursor: 'pointer',
                        '&:hover': {
                            borderColor: '#1976d2',
                            backgroundColor: '#f0f7ff',
                        },
                        width: '100%',
                    }}
                    component="label"
                >
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} disabled={loading} />
                    <CloudUpload sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                        คลิกเพื่อเลือกรูปภาพ
                    </Typography>
                </Box>

                {file && (
                    <Box mb={2} p={1} bgcolor="#e3f2fd" borderRadius={1}>
                        <Typography variant="body2" noWrap>
                            📄 {file.name}
                        </Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    sx={{
                        borderRadius: 2,
                        py: 1.5,
                        boxShadow: 'none',
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'ยืนยันการอัปโหลด'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadSlipModal;
