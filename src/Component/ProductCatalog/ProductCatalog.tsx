
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import callApi from '../../Services/callApi';
import { IProduct } from '../../Interface/IProduct';
import { useNavigate } from 'react-router-dom';

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); // จำนวนที่แสดง
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const rs = await callApi.get('/Product/list2');
    if (rs.data?.data) {
      setProducts(rs.data?.data);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6); // เพิ่มทีละ 6
  };

  return (
    <Box p={2}>
      {/* Title */}
      <Box display="flex" alignItems="center" mb={2} sx={{ width: '100%' }}>
        <Box
          sx={{
            width: 6,
            height: 24,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1,
            mr: 1.5,
          }}
        />
        <Typography variant="h6" fontWeight={600}>
          สินค้าแนะนำ
        </Typography>
      </Box>

      {/* Product List */}
      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2}>
        {products.slice(0, visibleCount).map((product: IProduct) => (
          <Box
            key={product.id}
            onClick={() => navigate('/ProductDetail', { state: product })}
            sx={{
              width: { xs: 'calc(50% - 16px)', sm: 'calc(33.333% - 16px)' },
              maxWidth: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              boxShadow: 1,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 3,
              },
            }}
          >
            <Box
              component="img"
              src={product.imageUrl ? product.imageUrl : '/photo.png'}
              alt={product.name}
              sx={{
                width: '100%',
                height: { xs: 120, sm: 140 },
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Typography
              variant="body2"
              mt={1}
              sx={{
                width: '100%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 150,
                fontSize: { xs: 10, sm: 11 },
              }}
            >
              {product.name}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Load More Button */}
      {visibleCount < products.length && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              borderRadius: '12px',
              px: 4,
              py: 1.2,
              textTransform: 'none',
            }}
          >
            โหลดเพิ่ม
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductCatalog;
