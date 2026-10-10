import React, { useState, useEffect } from 'react';
import { CircularProgress, Box, BoxProps } from '@mui/material';
import { normalizeImageUrl } from '../Utility/normalizeImageUrl';

interface ImageWithAuthProps extends Omit<BoxProps<'img'>, 'src'> {
  src: string;
  alt?: string;
  fallbackText?: string;
}

const ImageWithAuth: React.FC<ImageWithAuthProps> = ({
  src,
  alt,
  fallbackText = 'ไม่สามารถโหลดภาพได้',
  sx,
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = '';
    const fetchImage = async () => {
      try {
        setError(false);
        setLoading(true);

        const token = localStorage.getItem('token') || '';

        // Rebuild the URL on the current environment's host: images uploaded from a
        // dev machine are stored in the database with a localhost base URL.
        const finalUrl = normalizeImageUrl(src);

        const response = await fetch(finalUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
        setLoading(false);
      }
    };

    if (src) {
      if (src.startsWith('data:') || src.startsWith('blob:')) {
        setImageSrc(src);
        setLoading(false);
      } else {
        fetchImage();
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (error) {
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff5f7',
          color: '#c4a0a8',
          fontSize: '10px',
          textAlign: 'center',
          padding: '10px',
          width: '100%',
          height: '100%',
          ...sx,
        }}
      >
        {fallbackText}
      </Box>
    );
  }

  if (loading || !imageSrc) {
    return (
      <Box
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fff5f7',
          width: '100%',
          height: '100%',
          ...sx,
        }}
      >
        <CircularProgress size={20} sx={{ color: '#e8879a' }} />
      </Box>
    );
  }

  return (
    <Box
      component="img"
      src={imageSrc}
      alt={alt}
      className={className}
      sx={sx}
      {...props}
    />
  );
};

export default ImageWithAuth;
