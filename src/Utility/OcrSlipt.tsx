import React, { useState } from 'react';
import axios from 'axios';

const OcrSlipUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert('กรุณาเลือกไฟล์สลิป');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/ocr-slip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error('OCR Error:', error);
      alert('เกิดข้อผิดพลาดในการ OCR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>อัปโหลดสลิปเพื่อ OCR</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'กำลังประมวลผล...' : 'อัปโหลดและ OCR'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>ผลลัพธ์ OCR:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default OcrSlipUpload;