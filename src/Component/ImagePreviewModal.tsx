
import React from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ImagePreviewModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  fullScreen?: boolean; // เพิ่ม option สำหรับเต็มจอ
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  imageSrc,
  onClose,
  fullScreen = true, // default ให้เต็มจอ
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#000',
        },
      }}
    >
      {/* ปุ่มปิด */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: '#fff',
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* แสดงภาพเต็มจอ */}
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Box
          component="img"
          src={imageSrc ?? '/photo.png'}
          alt="Preview"
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
