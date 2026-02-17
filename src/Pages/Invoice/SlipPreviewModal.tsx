import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface SlipPreviewModalProps {
    open: boolean;
    onClose: () => void;
    imageUrl?: string | null;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 1,
    borderRadius: 4,
    outline: 'none',
};

const SlipPreviewModal: React.FC<SlipPreviewModalProps> = ({ open, onClose, imageUrl }) => {
    if (!imageUrl) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box position="static" display="flex" justifyContent="flex-end">
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <img
                    src={imageUrl}
                    alt="Slip Preview"
                    style={{ width: '100%', borderRadius: '12px', display: 'block' }}
                />
            </Box>
        </Modal>
    );
};

export default SlipPreviewModal;
