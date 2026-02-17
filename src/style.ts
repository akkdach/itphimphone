import React from 'react';
import { makeStyles, createStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: 'lightblue',
      padding: '20px',
      borderRadius: '8px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    btn: {
      padding: 5,
      borderRadius: 15
    }, btnPrimary: {
      background: '#fff',
      color: '#000'
    }, bgPrimary: {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #00BFA5 100%)',
      padding: 4,
      borderRadius: 0,
      color: '#004D40', // สีฟอนต์เข้มที่ตัดกับพื้นหลังเขียวมิ้นต์
      fontFamily: 'Prompt, sans-serif',

    }
  })
);

export default useStyles;



