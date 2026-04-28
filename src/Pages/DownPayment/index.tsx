import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, AppBar, useTheme } from '@mui/material';
import MinimalAppBar from '../../Component/MinimalAppBar';
import callApi from '../../Services/callApi';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useNavigate } from 'react-router-dom';
import InstallmentProgress from './InstallmentProgress';
import UploadSlipPopup from './UploadSlipPopup';
import UploadSlip from '../../Component/UploadSlip';
import Swal from 'sweetalert2';
import { uploadImageService } from '../../Services/uploadImageService';
import Loader from '../../Component/Loader';
import CouponBanner from '../../Component/CouponBanner';
const DownPayment = () => {
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [item, setItem] = useState<any>();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    onLoad();
  }, [])

  useEffect(() => {
    setItem(data[currentIndex]);
  }, [currentIndex])

  const onLoad = async () => {
    setIsLoader(true)
    var res = await callApi.get('/Preorders/myOrder');
    setIsLoader(false)
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
      // Swal.fire('ปิดการใช้งานชั่วคราว', '', 'question')
      // return;
      setIsLoader(true)
      // const formData = new FormData();
      // formData.append("image", file, file.name);

      var result = await uploadImageService(`Slip/DOWN/${item.id}/upload`, file);
      setIsLoader(false)
      if (result?.success === true) {
        Swal.fire('แจ้งเตือน', result?.message, 'info')
        onLoad();
      } else {
        Swal.fire('เกิดข้อผิดพลาดในการอัปโหลด', result?.message)
      }

    } catch (error) {
      console.error("Error uploading slip:", error);
      throw error;
    }
  }



  return (
    <>
      <Loader isLoader={isLoader} />
      {showPopup && (
        <UploadSlipPopup id={item.id} onClose={() => setShowPopup(false)} open={showPopup} />
      )}

      <MinimalAppBar onBack={() => window.history.back} title={`ใบจองของฉัน`}></MinimalAppBar>
      <AnimatePresence mode="wait">
        {item && <motion.div
          key={item.id}

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.8, 0.25, 1], // ease-in-out แบบนุ่ม
          }}

        >
          <Card sx={{ width: '100%' }}>
            <CardContent
              sx={{
                // background: 'linear-gradient(135deg, #c8d60cff 0%, #b915b1ff 50%, #d80adfff 100%)',
                padding: 4,
                borderRadius: 0,
                color: '#FFFFFF',
                fontFamily: 'Prompt, sans-serif',
              }}
            >
              <Box p={0} bgcolor="background.primary">
                {/* สรุปสินเชื่อ */}
                {item && <Box sx={{ px: { xs: 2, sm: 4 }, py: 2 }}>
                  {/* การ์ดเดียวตาม index */}
                  <Box sx={{ mb: 4 }}>
                    <Card sx={{ width: '100%' }}>
                      <CardContent
                        sx={{
                          background: theme.palette.background.default,
                          padding: 4,
                          borderRadius: 0,
                          color: '#FFFFFF',
                          fontFamily: 'Prompt, sans-serif',
                        }}
                      >
                        <Stack spacing={2}>
                          <Typography variant="subtitle1">
                            #{item.id} / {item.orderType}
                          </Typography>
                          <Typography variant="body2">
                            ราคาสินค้า ฿{item.amount?.toLocaleString()}
                          </Typography>
                          {item.disCount > 0 && <Typography variant="body2">
                            ส่วนลด ฿{item.disCount?.toLocaleString()}
                          </Typography>}
                          {item.promotion && <Typography variant="body2">
                            โปรโมชั่นพิเศษ {item.promotion}
                          </Typography>}
                          {(item.couponDiscount > 0 || item.couponAmount > 0) && (
                            <Typography variant="body2" sx={{ color: '#159e75', fontWeight: 600 }}>
                              🎟️ มูลค่าคูปอง -฿{(item.couponDiscount || item.couponAmount || 0).toLocaleString()}
                              {item.couponCode && <span style={{ fontWeight: 400, fontSize: '0.75rem', marginLeft: 6 }}>({item.couponCode})</span>}
                            </Typography>
                          )}
                        </Stack>
                        <Stack p={0}>
                          <InstallmentProgress totalAmount={item?.amount} paidAmount={item?.paid} />
                        </Stack>
                      </CardContent>
                    </Card>

                    {/* Coupon Banner */}
                    <CouponBanner orderType="order" orderId={item.id} orderAmount={item.amount} />

                    {/* เมนูการดำเนินการ */}
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{ mt: 2 }}
                    >
                      <Button fullWidth variant="outlined" color="primary"
                        onClick={() => navigate('detail', { state: item })}
                      >
                        ดูรายละเอียดสัญญา
                      </Button>
                      {item.status != 'Closed' && <UploadSlip onUpload={handleSlipUpload} />}
                    </Stack>
                  </Box>

                  {/* ปุ่มเลื่อนการ์ด */}
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                    >
                      ก่อนหน้า
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleNext}
                      disabled={currentIndex === data.length - 1}
                    >
                      ถัดไป
                    </Button>
                  </Stack>
                </Box>}

              </Box>

            </CardContent>
          </Card>
          <Outlet />
        </motion.div>}
      </AnimatePresence>


    </>
  );
};

export default DownPayment;


