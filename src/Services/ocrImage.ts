
import Tesseract from "tesseract.js";

/**
 * OCR Helper: รับไฟล์ภาพ, ปรับ Contrast + Grayscale, ทำ OCR และคืนข้อความ
 */
export const ocrImage = async (file: File): Promise<string> => {
  const processedImage = await preprocessImage(file);

  const result = await Tesseract.recognize(processedImage, "tha+eng", {
    logger: (m) => console.log(m), // แสดง progress
  });

  return result.data.text;
};

/**
 * Preprocess Image: ปรับ Contrast + Grayscale ก่อน OCR
 */
const preprocessImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const contrast = 50; // เพิ่ม contrast 50%
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        // Grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;

        // Contrast
        data[i] = factor * (data[i] - 128) + 128;
        data[i + 1] = factor * (data[i + 1] - 128) + 128;
        data[i + 2] = factor * (data[i + 2] - 128) + 128;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
};
