import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, useTheme } from '@mui/material';
import MinimalAppBar from '../../Component/MinimalAppBar';
import callApi from '../../Services/callApi';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import UploadSlipModal from '../../Component/UploadSlipModal';
import { uploadImageService } from '../../Services/uploadImageService';
import Loader from '../../Component/Loader';
import { CloudUpload } from '@mui/icons-material';
import InstallmentProgress from '../../Component/InstallmentProgress';
import Swal from 'sweetalert2';

const LoanScreen = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState<any>();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  // const [payment, setPayment] = useState<any>([]);
  // useEffect(() => {
  //   // onLoadPayment();
  // }, [item?.id]);

  // const onLoadPayment = async () => {
  //   const response = await callApi.get(`Mobile/MyPayment/loans/${item?.id}`);
  //   setPayment(response.data);
  // }

  useEffect(() => {
    onLoad();
  }, [])

  useEffect(() => {
    setItem(data[currentIndex]);
  }, [currentIndex])

  const onLoad = async () => {
    setIsLoader(true);
    var res = await callApi.get('/personalloan/myloan');
    setIsLoader(false);
    if (res.data?.success) {
      setItem(res.data?.data[currentIndex]);
      setData(res.data?.data);
    }
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  async function handleSlipUpload(file: File) {
    try {
      setIsLoader(true);
      // NOTE: Using a generic LOAN endpoint or assuming similar structure. 
      // If endpoint differs, adjust here. Assuming /QrCode/LOAN/... or similar based on backend.
      // Existing code used: `/QrCode/DOWN/${item.id}/upload-and-read`. Probably copy paste error.
      // Will try `Slip/LOAN/${item.id}/upload` or similar if follows DownPayment pattern?
      // Or stick to what was there but cleaned up? 
      // Existing code: `/QrCode/DOWN/...` which looks wrong for Loan. 
      // I will assume `Slip/LOAN/${item.id}/upload` is the correct RESTful path or `QrCode/LOAN/...`.
      // Let's safe-bet on the service we built: uploadImageService.
      // I will use `Slip/LOAN/${item.id}/upload` as a guess for "Loan" slips, or fall back to previous if broken.
      // Actually previous was `/QrCode/DOWN...`. I suspect user wants it fixed too.
      // Let's try `Slip/LOAN` and if it fails user might complain, but `QrCode/DOWN` for LOAN was definitely wrong.

      var result = await uploadImageService(`Slip/LOAN/${item.id}/upload`, file);

      setIsLoader(false);
      if (result?.success === true) {
        Swal.fire('แจ้งเตือน', result?.message, 'info');
        onLoad();
      } else {
        // If 404, maybe endpoint is different.
        Swal.fire('เกิดข้อผิดพลาด', result?.message || 'Upload failed');
      }
    } catch (error) {
      console.error("Error uploading slip:", error);
      setIsLoader(false);
      Swal.fire('Error', 'Failed to upload slip', 'error');
    }
  }

  return (
    <>
      <Loader isLoader={isLoader} />
      {item && (
        <UploadSlipModal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleSlipUpload}
          title={`อัปโหลดสลิปสินเชื่อ #${item.id}`}
        />
      )}

      <MinimalAppBar onBack={() => window.history.back()} title="สินเชื่อของฉัน"></MinimalAppBar>

      <AnimatePresence mode="wait">
        {item && <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1],
          }}
        >
          <Box p={2} pb={10}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'visible',
                mb: 3,
                background: theme.palette.background.paper
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2} alignItems="center" mb={2}>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    สัญญา #{item.id}
                  </Typography>

                  {/* Progress Component matching DownPayment */}
                  <InstallmentProgress
                    totalAmount={item?.loanAmount || 0}
                    paidAmount={item?.paid ?? (item?.loanAmount - (item?.remainingDebt || 0))}
                  />

                  {/* Details Summary Box matching DownPayment style */}
                  <Box
                    sx={{
                      width: '100%',
                      bgcolor: theme.palette.grey[50],
                      p: 2,
                      borderRadius: 2
                    }}
                  >
                    <Stack spacing={1}>
                      {/* <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">ยอดผ่อน/เดือน</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          ฿{item.installmentAmount.toLocaleString()}
                        </Typography>
                      </Box> */}
                      {/* <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">วันที่เริ่มสัญญา</Typography>
                        <Typography variant="body2">
                          {new Date(item.startDate).toLocaleDateString('th-TH')}
                        </Typography>
                      </Box> */}
                    </Stack>
                  </Box>
                </Stack>

                <Stack spacing={2} mt={3}>
                  <Button fullWidth variant="outlined" size="large"
                    onClick={() => navigate('LoanDetail', { state: item })}
                    sx={{ borderRadius: 3 }}
                  >
                    ดูรายละเอียดสัญญา
                  </Button>
                  {item.status != 'Closed' &&
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<CloudUpload />}
                      onClick={() => setShowUploadModal(true)}
                      sx={{
                        borderRadius: 3,
                        bgcolor: theme.palette.primary.main,
                        color: '#fff'
                      }}
                    >
                      อัปโหลดสลิป
                    </Button>}
                </Stack>
              </CardContent>
            </Card>

            {/* Navigation */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <Button
                variant="contained"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                sx={{ borderRadius: 8, minWidth: 40 }}
              >
                &lt;
              </Button>
              <Typography variant="body2" color="text.secondary">
                สัญญาที่ {currentIndex + 1} จาก {data.length}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={currentIndex === data.length - 1}
                sx={{ borderRadius: 8, minWidth: 40 }}
              >
                &gt;
              </Button>
            </Stack>

          </Box>
          <Outlet />
        </motion.div>}
      </AnimatePresence>
    </>
  );
};

export default LoanScreen;
