// src/services/uploadService.ts
export async function uploadImageService(
    endpoint: string,
    file: File
): Promise<any> {
    const baseUrl = process.env.REACT_APP_API_URL ?? '';

    const formData = new FormData();
    formData.append('image', file, file.name);

    try {
        const token = localStorage.getItem('token'); // หรือจาก secure storage
        const response = await fetch(`${baseUrl}/${endpoint}`, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${token}`, // ✅ Inject Bearer Token
                // ไม่ต้องใส่ Content-Type เพราะ fetch จะจัดการให้เมื่อใช้ FormData
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }

        return await response.json(); // หรือ response.text() ถ้า API ส่งข้อความ
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}