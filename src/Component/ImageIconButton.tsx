
import React from 'react';
import { IconButton } from '@mui/material';

interface ImageIconButtonProps {
  src: any;           // URL หรือ path ของรูปภาพ
  alt?: string;          // ข้อความแทนรูปภาพ
  size?: number;         // ขนาด icon (default: 48)
  onClick?: () => void;  // ฟังก์ชันเมื่อคลิก
  disabled?: boolean;    // ปิดการใช้งานปุ่ม
  tooltip?: string;      // ข้อความ tooltip
}

const ImageIconButton: React.FC<ImageIconButtonProps> = ({
  src,
  alt = '',
  size = 48,
  onClick,
  disabled = false,
  tooltip
}) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{ width: size, height: size, p: 0 }}
      title={tooltip}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: size,
          height: size,
          objectFit: 'contain'
        }}
      />
    </IconButton>
  );
};

export default ImageIconButton;
