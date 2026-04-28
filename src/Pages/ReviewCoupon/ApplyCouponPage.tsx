import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  CheckCircle, Cancel, ArrowBack, LocalOffer,
  ConfirmationNumber, ShoppingCart
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../Context/userContext';
import {
  validateCoupon,
  applyCoupon,
  getAvailableCoupons,
  CouponAvailable,
  CouponValidationResult,
} from '../../Services/ReviewCouponService';
import './ApplyCouponPage.css';

const CONFETTI_COLORS = ['#159e75', '#1b413c', '#6e5353', '#ffb74d', '#e91e63'];

export default function ApplyCouponPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const memberId = (user as any)?.member?.id || (user as any)?.id || 0;

  // Pre-filled from CouponBanner / MyCouponsPage navigation
  const navState = location.state as any;
  console.log('[ApplyCouponPage] navState:', navState);
  const prefillCode = navState?.couponCode || '';
  const prefillOrderType = navState?.orderType as 'loan' | 'order' | undefined;
  const prefillOrderId = navState?.orderId != null ? String(navState.orderId) : '';
  const prefillOrderAmount = navState?.orderAmount != null ? String(navState.orderAmount) : '';
  const isPrefilledFromOrder = !!(prefillOrderType && prefillOrderId);
  console.log('[ApplyCouponPage] prefill:', { prefillCode, prefillOrderType, prefillOrderId, prefillOrderAmount, isPrefilledFromOrder });

  const [couponCode, setCouponCode] = useState(prefillCode);
  const [orderType, setOrderType] = useState<'loan' | 'order'>(prefillOrderType || 'loan');
  const [orderId, setOrderId] = useState(prefillOrderId);
  const [orderAmount, setOrderAmount] = useState(prefillOrderAmount);
  const [validating, setValidating] = useState(false);
  const [applying, setApplying] = useState(false);
  const [validationResult, setValidationResult] = useState<CouponValidationResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successResult, setSuccessResult] = useState<CouponValidationResult | null>(null);

  // Available coupons
  const [availableCoupons, setAvailableCoupons] = useState<CouponAvailable[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  const fetchAvailable = useCallback(async () => {
    if (!memberId) return;
    setLoadingCoupons(true);
    try {
      const amt = parseFloat(orderAmount) || 0;
      const coupons = await getAvailableCoupons(memberId, orderType, amt);
      setAvailableCoupons(coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCoupons(false);
    }
  }, [memberId, orderType, orderAmount]);

  useEffect(() => {
    fetchAvailable();
  }, [fetchAvailable]);

  // Auto validate when prefilled from order page
  useEffect(() => {
    if (prefillCode && prefillOrderAmount) {
      handleValidate(prefillCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValidate = async (code?: string) => {
    const c = code || couponCode;
    if (!c) return;
    setValidating(true);
    setValidationResult(null);
    try {
      const result = await validateCoupon({
        code: c,
        memberId,
        orderType,
        orderAmount: parseFloat(orderAmount) || 0,
      });
      setValidationResult(result);
    } catch (err: any) {
      setValidationResult({
        valid: false,
        message: err?.response?.data?.message || 'คูปองไม่ถูกต้องหรือหมดอายุ',
      });
    } finally {
      setValidating(false);
    }
  };

  const handleApply = async () => {
    if (!couponCode || !orderId || !orderAmount) return;
    setApplying(true);
    try {
      const result = await applyCoupon({
        code: couponCode,
        memberId,
        orderType,
        orderId: Number(orderId),
        orderAmount: parseFloat(orderAmount),
      });
      setSuccessResult(result);
      setShowSuccess(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'ไม่สามารถใช้คูปองได้');
    } finally {
      setApplying(false);
    }
  };

  const selectCoupon = (code: string) => {
    setCouponCode(code);
    setValidationResult(null);
    if (orderAmount) {
      setTimeout(() => handleValidate(code), 100);
    }
  };

  const amt = parseFloat(orderAmount) || 0;
  const discountAmt = validationResult?.valid ? (validationResult.discountAmount || 0) : 0;
  const finalAmt = validationResult?.valid
    ? (validationResult.finalAmount || Math.max(0, amt - discountAmt))
    : amt;

  return (
    <div className="apply-page">
      {/* Hero */}
      <motion.div
        className="apply-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <ArrowBack
            sx={{ cursor: 'pointer', fontSize: 22, opacity: 0.85 }}
            onClick={() => navigate(-1)}
          />
          <div>
            <Typography variant="h6" fontWeight={700} fontSize="1.3rem">
              ใช้คูปอง
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, fontSize: '0.8rem' }}>
              กรอกรหัสหรือเลือกจากคูปองของคุณ
            </Typography>
          </div>
        </Box>
      </motion.div>

      <div className="apply-content">
        {/* Code Input Card */}
        <motion.div
          className="code-input-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Typography variant="body2" fontWeight={600} color="#6e5353" mb={1}>
            🎟️ รหัสคูปอง
          </Typography>
          <div className="code-input-wrapper">
            <input
              className={`code-input ${
                validationResult
                  ? validationResult.valid ? 'valid' : 'invalid'
                  : ''
              }`}
              value={couponCode}
              onChange={e => {
                setCouponCode(e.target.value.toUpperCase());
                setValidationResult(null);
              }}
              placeholder="RVW-XXXXXX-XXXX"
            />
            <button
              className="validate-btn"
              onClick={() => handleValidate()}
              disabled={validating || !couponCode}
            >
              {validating ? (
                <div className="thinking-dots">
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </div>
              ) : 'ตรวจสอบ'}
            </button>
          </div>

          {/* Validation Result */}
          <AnimatePresence>
            {validationResult && (
              <motion.div
                className={`validation-result ${validationResult.valid ? 'success' : 'error'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {validationResult.valid ? (
                  <CheckCircle className="validation-icon" sx={{ color: '#159e75' }} />
                ) : (
                  <Cancel className="validation-icon" sx={{ color: '#cf3e3e' }} />
                )}
                <div className="validation-msg" style={{ color: validationResult.valid ? '#159e75' : '#cf3e3e' }}>
                  {validationResult.valid ? '✅ คูปองใช้ได้!' : '❌ คูปองไม่สามารถใช้ได้'}
                </div>
                <Typography variant="caption" color="#8a7d7d">
                  {validationResult.message}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Order Info */}
        <motion.div
          className="code-input-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="body2" fontWeight={600} color="#6e5353" mb={1.5}>
            📝 ข้อมูลรายการ
            {isPrefilledFromOrder && (
              <span style={{ fontWeight: 400, fontSize: '0.7rem', color: '#159e75', marginLeft: 8 }}>
                ✅ อ้างอิงจาก{orderType === 'loan' ? 'สินเชื่อ' : 'คำสั่งซื้อ'} #{orderId}
              </span>
            )}
          </Typography>

          <div className="order-input-group">
            <div className="order-input-label">ประเภท</div>
            <div className="type-selector">
              <button
                className={`type-option ${orderType === 'loan' ? 'selected' : ''}`}
                onClick={() => !isPrefilledFromOrder && setOrderType('loan')}
                disabled={isPrefilledFromOrder}
                style={isPrefilledFromOrder ? { opacity: orderType === 'loan' ? 1 : 0.4, cursor: 'default' } : {}}
              >
                🏦 สินเชื่อ
              </button>
              <button
                className={`type-option ${orderType === 'order' ? 'selected' : ''}`}
                onClick={() => !isPrefilledFromOrder && setOrderType('order')}
                disabled={isPrefilledFromOrder}
                style={isPrefilledFromOrder ? { opacity: orderType === 'order' ? 1 : 0.4, cursor: 'default' } : {}}
              >
                📦 ออเดอร์
              </button>
            </div>
          </div>

          <div className="order-input-group">
            <div className="order-input-label">หมายเลขรายการ</div>
            <input
              className="order-input"
              type="number"
              value={orderId}
              onChange={e => !isPrefilledFromOrder && setOrderId(e.target.value)}
              placeholder="กรอก Loan/Order ID"
              readOnly={isPrefilledFromOrder}
              style={isPrefilledFromOrder ? { background: '#f0eded', color: '#6e5353' } : {}}
            />
          </div>

          <div className="order-input-group">
            <div className="order-input-label">ยอดเงิน (บาท)</div>
            <input
              className="order-input"
              type="number"
              value={orderAmount}
              onChange={e => {
                if (!isPrefilledFromOrder) {
                  setOrderAmount(e.target.value);
                  setValidationResult(null);
                }
              }}
              placeholder="0.00"
              readOnly={isPrefilledFromOrder}
              style={isPrefilledFromOrder ? { background: '#f0eded', color: '#6e5353' } : {}}
            />
          </div>
        </motion.div>

        {/* Discount Calculator */}
        {validationResult?.valid && amt > 0 && (
          <motion.div
            className="discount-calc"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Typography variant="body2" fontWeight={600} color="#6e5353" mb={1}>
              💰 สรุปส่วนลด
            </Typography>
            <div className="calc-row">
              <span className="calc-label">ยอดเงินเดิม</span>
              <span className="calc-value">฿{amt.toLocaleString()}</span>
            </div>
            <div className="calc-row">
              <span className="calc-label">
                ส่วนลด
                {validationResult.discountType === 'percent'
                  ? ` (${validationResult.discountValue}%)`
                  : ''}
              </span>
              <span className="calc-value discount">
                -฿{discountAmt.toLocaleString()}
              </span>
            </div>
            <div className="calc-divider" />
            <div className="calc-row">
              <span className="calc-label" style={{ fontWeight: 700, color: '#4a3f3f' }}>
                ยอดที่ต้องชำระ
              </span>
              <motion.span
                className="calc-value total"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                key={finalAmt}
              >
                ฿{finalAmt.toLocaleString()}
              </motion.span>
            </div>
          </motion.div>
        )}

        {/* Apply Button */}
        <motion.button
          className="apply-btn"
          onClick={handleApply}
          disabled={applying || !validationResult?.valid || !orderId || !orderAmount}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {applying ? (
            <CircularProgress size={22} sx={{ color: '#fff' }} />
          ) : (
            '🎉 ใช้คูปองเลย!'
          )}
        </motion.button>

        {/* Available Coupons List */}
        <div className="available-section">
          <div className="available-title">
            <LocalOffer sx={{ fontSize: 18 }} />
            คูปองที่ใช้ได้ ({availableCoupons.length})
          </div>

          {loadingCoupons ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={28} sx={{ color: '#6e5353' }} />
            </Box>
          ) : availableCoupons.length === 0 ? (
            <Box textAlign="center" py={3}>
              <ConfirmationNumber sx={{ fontSize: 40, color: '#d0c4c4', mb: 1 }} />
              <Typography variant="body2" color="#a0928f">
                ไม่มีคูปองที่ใช้ได้
              </Typography>
            </Box>
          ) : (
            availableCoupons.map((c, i) => (
              <motion.div
                key={c.couponId}
                className={`mini-coupon ${couponCode === c.code ? 'active' : ''}`}
                onClick={() => selectCoupon(c.code)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="mini-discount-badge">
                  <span className="mini-discount-val">{c.discountValue}</span>
                  <span className="mini-discount-unit">
                    {c.discountType === 'percent' ? '%' : '฿'}
                  </span>
                </div>
                <div className="mini-coupon-info">
                  <div className="mini-coupon-code">{c.code}</div>
                  <div className="mini-coupon-name">{c.name}</div>
                </div>
                <ShoppingCart sx={{ fontSize: 18, color: couponCode === c.code ? '#159e75' : '#d0c4c4' }} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="apply-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              className="apply-success-card"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Confetti */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    borderRadius: 2,
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    left: `${10 + Math.random() * 80}%`,
                    top: `${Math.random() * 30}%`,
                    animation: `confettiFall 1.2s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
              <CheckCircle sx={{ fontSize: 56, color: '#159e75', mb: 1 }} />
              <Typography variant="h6" fontWeight={700} color="#1b413c">
                ใช้คูปองสำเร็จ! 🎉
              </Typography>
              {successResult?.discountAmount && (
                <>
                  <div className="success-amount">
                    -฿{successResult.discountAmount.toLocaleString()}
                  </div>
                  <div className="success-amount-label">ส่วนลดที่ได้รับ</div>
                </>
              )}
              {successResult?.finalAmount !== undefined && (
                <Typography variant="body2" color="#8a7d7d" mt={1}>
                  ยอดที่ต้องชำระ: <strong style={{ color: '#159e75' }}>
                    ฿{successResult.finalAmount.toLocaleString()}
                  </strong>
                </Typography>
              )}
              <motion.button
                className="apply-btn"
                style={{ marginTop: 20 }}
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/my-coupons');
                }}
                whileTap={{ scale: 0.97 }}
              >
                ดูคูปองของฉัน
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
