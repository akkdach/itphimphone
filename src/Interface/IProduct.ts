export type IProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  cost: number;
  depositAmount: number;
  depositMinimum: number;
  estimatedDeliveryDate: string; // หรือใช้ Date ถ้าแปลงแล้ว
  imageUrl: string;
  preOrders: any[]; // ถ้ารู้โครงสร้างของ preOrders สามารถระบุ type ได้ละเอียดขึ้น
};