import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const jobOptions = [
'นักเรียน / นักศึกษา',
'ค้าขาย / ร้านค้า',
'ข้าราชการ / รัฐวิสาหกิจ ',
'พนักงานประจำเอกชน',
'ฟรีแลนซ์ / รับจ้างอิสระ ',
'เกษตรกร / ประมง / ปศุสัตว์',
'พนักงานขาย ',
'นักบัญชี',
'นักการตลาด',
'นักออกแบบกราฟิก',
'วิศวกรไฟฟ้า ',
'บุคลากรทางการแพทย์ / สาธารณสุข ',
'อื่นๆ ( โปรดระบุ)',

];

const JobSearchAutocomplete = ({ value, onChange }) => {
  return (
    <Autocomplete
      options={jobOptions}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField {...params} label="ค้นหาตำแหน่งงาน" variant="outlined" />
      )}
      fullWidth
    />
  );
};

export default JobSearchAutocomplete;