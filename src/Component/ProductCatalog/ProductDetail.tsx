
import React from "react";
import { Box, Typography, Button, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import MinimalAppBar from "../MinimalAppBar";
import photo from '../../assets/photo.png'
type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  description?: string;
};

const ProductDetail: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const product = location.state as Product; // รับค่าจาก navigate state
  const navigate = useNavigate();
  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          ไม่พบข้อมูลสินค้า
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }}
    >
      <MinimalAppBar onBack={() => navigate(-1)} title={product.name} />
      {/* รูปสินค้า */}
      <Box
        component="img"
        src={product.image ?? photo}
        alt={product.name}
        sx={{
          width: "100%",
          height: "50vh",
          objectFit: "cover",
          borderBottom: `4px solid ${theme.palette.primary.main}`,
        }}
      />

      {/* รายละเอียดสินค้า */}
      <Box sx={{ p: 2, flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h6" color={theme.palette.primary.main} gutterBottom>
          ฿{product.price.toLocaleString()}
        </Typography>
        {product.description && (
          <Typography variant="body1" sx={{ mb: 3 }}>
            {product.description}
          </Typography>
        )}

        <Button
        onClick={()=>navigate(-1)}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: theme.palette.primary.main,
            color: "#fff",
            borderRadius: "12px",
            py: 1.5,
            fontSize: "1rem",
            textTransform: "none",
          }}
        >
          กลับ
        </Button>
      </Box>
    </Box>
  );
};

export default ProductDetail;
