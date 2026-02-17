
import React from 'react';

interface ImageIconProps {
  image: string;          // path หรือ URL ของภาพ
  size?: number;          // ขนาด icon (default: 48)
  alt?: string;           // ข้อความแทนภาพ
  className?: string;     // สำหรับ custom CSS
}

const ImageIcon: React.FC<ImageIconProps> = ({
  image,
  size = 48,
  alt = '',
  className
}) => {
  return (
    <img
      src={image}
      alt={alt}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain'
      }}
    />
  );
};

export default ImageIcon;
