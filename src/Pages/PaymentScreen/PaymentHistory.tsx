import { Box, Typography, Stack, Divider, Chip, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import callApi from '../../Services/callApi';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import PaymentStatusChip from '../../Component/PaymentStatusLabel/PaymentStatusChip';
import { Image } from '@mui/icons-material';
import ImagePreviewModal from '../../Component/ImagePreviewModal';



export default function PaymentHistory() {
  const[history,setHistory] = useState<any[]>([]); 
  const[openImageModal,setOpenImageModal] = useState<boolean>(false);
  const[imageSelected,setImageSelected] = useState<string>('');
  useEffect(()=>{
    onLoad()
  },[])
  const onLoad = async()=>{
    var result = await callApi.get('Payments/myPayment')
    if(result.data?.success){
      setHistory(result.data.data)
    }else{
      Swal.fire('เกิดข้อผิดพลาด','','error')
    }
  }
  return (
    <Box>
      <ImagePreviewModal open={openImageModal} imageSrc={imageSelected} onClose={()=>setOpenImageModal(false)} />
      <Typography variant="h6" gutterBottom>ประวัติการชำระเงิน</Typography>
      <Stack spacing={2}>
        {history.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
            //   borderRadius: 2,
              backgroundColor: '#f9f9f9',
              boxShadow: 1,
              gap:1
            }}
          >
            <Box sx={{textAlign:'left'}}>
              <IconButton 
              onClick={()=>{
                setImageSelected(item.path)
                setOpenImageModal(true)
              }}
              sx={{boxShadow:3}}  ><Image /></IconButton>
            </Box>
            <Box sx={{textAlign:'left'}}>
              <Typography variant="caption">เลขที่ : ({item?.refernceType}) {item?.reference}</Typography><br/>
              <Typography variant="caption" color="text.secondary">{dayjs(item?.paymentDate).format('DD/MM/YYYY HH:mm:ss')}</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle1">{item?.amount}</Typography>
              <PaymentStatusChip status={item?.status} />
            </Box>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}
