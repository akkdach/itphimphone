import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  isLoader: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoader }) => {
  if (!isLoader) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 9999,
        flexDirection: "column",
      }}
    >
      <CircularProgress
        size={60}
        sx={{
          color: "#A7C7E7", // พาสเทลฟ้า
          animation: "spin 1.2s linear infinite",
        }}
      />
      <Typography
        sx={{
          marginTop: 2,
          fontSize: "1.2rem",
          color: "#A7C7E7",
          fontWeight: 500,
        }}
      >
        กำลังโหลด...
      </Typography>
    </Box>
  );
};

export default Loader;