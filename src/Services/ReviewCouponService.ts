import callApi from './callApi';

// =============================================
// Types
// =============================================

export interface ReviewSubmitDto {
  memberId: number;
  reviewType: 'loan' | 'order';
  reviewOrderId: number;
  reviewOrderType?: 'LOAN' | 'DOWN';
  rating: number;
  reviewText?: string;
  reviewImageUrl?: string | null;
  socialLink?: string | null;
  reviewVideoUrl?: string | null;
  couponId?: string | null;
}

export interface ReviewCouponResponse {
  id: number;
  memberId: number;
  memberName: string;
  reviewType: string;
  reviewOrderId: number;
  rating: number;
  reviewText?: string;
  reviewImageUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  reviewedAt: string;
  approvedAt?: string;
  couponId?: string;
  couponCode?: string;
  discountValue?: number;
  discountType?: string;
  couponExpiredAt?: string;
}

export interface CouponAvailable {
  couponId: string;
  code: string;
  name: string;
  description: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  applicableTo: string;
  source: string;
  maxUsage?: number;
  usedCount?: number;
}

export interface CouponValidateRequest {
  code: string;
  memberId: number;
  orderType: string;
  orderAmount: number;
}

export interface CouponApplyRequest {
  code: string;
  memberId: number;
  orderType: string;
  orderId: number;
  orderAmount: number;
}

export interface CouponValidationResult {
  valid: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
  couponCode?: string;
  discountType?: string;
  discountValue?: number;
}

export interface CouponUsageRecord {
  id: number;
  couponId: string;
  memberId: number;
  orderType: string;
  orderId: number;
  discountApplied: number;
  usedAt: string;
}

// =============================================
// API Calls
// =============================================

/** ส่งรีวิว + รับคูปอง */
export const submitReview = async (dto: ReviewSubmitDto) => {
  const res = await callApi.post('/review-coupons/submit', dto);
  return res.data;
};

/** ดูรีวิวของฉัน */
export const getMyReviews = async (memberId: number): Promise<ReviewCouponResponse[]> => {
  const res = await callApi.get(`/review-coupons/my/${memberId}`);
  return res.data?.data || [];
};

/** คูปองที่ใช้ได้ */
export const getAvailableCoupons = async (
  memberId: number,
  applicableTo: string = 'all',
  orderAmount?: number,
  productId?: number
): Promise<CouponAvailable[]> => {
  const params: any = { memberId, applicableTo };
  if (orderAmount !== undefined) params.orderAmount = orderAmount;
  if (productId !== undefined) params.productId = productId;

  const res = await callApi.get('/coupons/applicable', {
    params,
  });
  return res.data?.data || res.data || [];
};

/** ตรวจสอบคูปอง */
export const validateCoupon = async (request: CouponValidateRequest): Promise<CouponValidationResult> => {
  const res = await callApi.post('/coupons/validate', request);
  return res.data?.data;
};

/** ใช้คูปอง */
export const applyCoupon = async (request: CouponApplyRequest): Promise<CouponValidationResult> => {
  const res = await callApi.post('/coupons/apply', request);
  return res.data?.data;
};

/** ประวัติการใช้คูปอง */
export const getCouponHistory = async (memberId: number): Promise<CouponUsageRecord[]> => {
  const res = await callApi.get(`/coupons/usage/${memberId}`);
  return res.data?.data || [];
};
