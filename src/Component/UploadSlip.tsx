import React, { useState } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Save } from "@mui/icons-material";
import { ocrImage } from "../Services/ocrImage";
import { parseSlipText } from "../Utility/parseSlipText";
import Loader from "./Loader";

interface UploadSlipProps {
  onUpload?: (file: File) => void;
}

const UploadSlip: React.FC<UploadSlipProps> = ({ onUpload }) => {

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoader(true)
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // const ocrText = await ocrImage(file);
      // console.log(ocrText);
      // const parsedata = await parseSlipText(ocrText);
      // console.log(parsedata);
      event.target.value = "";

    }
    setLoader(false)
  };

  const handleUpload = () => {

    if (selectedFile && onUpload) onUpload(selectedFile);
    setSelectedFile(null)
  }

  return (
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 4,
        p: 3,
        textAlign: "center",
        backgroundColor: "#fafafa",
      }}
    >
      {/* <Typography variant="h6" sx={{ mb: 2 }}>
        อัปโหลดสลิปโอนเงิน
      </Typography> */}
      <Loader isLoader={loader} />
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="upload-slip"
        type="file"
        onChange={handleFileChange}
      />

      <label htmlFor="upload-slip">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          sx={{
            backgroundColor: "#6c63ff",
            color: "#fff",
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1.5,
            margin: 1,
            width: 150,
            "&:hover": { backgroundColor: "#5a54d6" },
          }}
        >
          เลือกไฟล์
        </Button>
      </label>

      {selectedFile && (
        <Typography variant="body2" sx={{ mt: 2, color: "#333" }}>
          ✅ {selectedFile.name}
        </Typography>
      )}

      {selectedFile &&
        <Button
          variant="contained"
          component="span"
          startIcon={<Save />}
          sx={{
            backgroundColor: "#1a924cff",
            color: "#fff",
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1.5,
            margin: 1,
            width: 150,
            "&:hover": { backgroundColor: "#7dd654ff" },
          }}
          onClick={() => { handleUpload() }}
        >
          บันทึก
        </Button>}


    </Box>
  );
};

export default UploadSlip;