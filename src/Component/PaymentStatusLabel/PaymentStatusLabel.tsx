// src/constants/paymentStatus.ts
export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Duplicate = 2,
  FailedValidation = 3,
  Cancelled = 4,
  Refunded = 5,
  Error = 6
}

export const paymentStatusText: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'รอตรวจสอบ',
  [PaymentStatus.Completed]: 'สำเร็จ',
  [PaymentStatus.Duplicate]: 'รายการซ้ำ',
  [PaymentStatus.FailedValidation]: 'ไม่ผ่าน',
  [PaymentStatus.Cancelled]: 'ยกเลิก',
  [PaymentStatus.Refunded]: 'คืนเงิน',
  [PaymentStatus.Error]: 'ผิดพลาด'
};

export const paymentStatusColor: Record<PaymentStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
  [PaymentStatus.Pending]: 'warning',
  [PaymentStatus.Completed]: 'success',
  [PaymentStatus.Duplicate]: 'primary',
  [PaymentStatus.FailedValidation]: 'error',
  [PaymentStatus.Cancelled]: 'default',
  [PaymentStatus.Refunded]: 'primary',
  [PaymentStatus.Error]: 'error'
};