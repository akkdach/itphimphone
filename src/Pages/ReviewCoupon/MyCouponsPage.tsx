import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  LocalOffer, AccessTime, ContentCopy, ArrowBack,
  ConfirmationNumber, RateReview, ShoppingCart
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/userContext';
import {
  getMyReviews,
  getAvailableCoupons,
  getCouponHistory,
  ReviewCouponResponse,
  CouponAvailable,
  CouponUsageRecord
} from '../../Services/ReviewCouponService';
import './MyCouponsPage.css';

type TabKey = 'available' | 'used' | 'expired';

/** คำนวณเวลาคงเหลือ */
function getCountdown(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { days, hours, mins, urgent: days <= 3 };
}

export default function MyCouponsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const memberId = (user as any)?.member?.id || (user as any)?.id || 0;

  const [tab, setTab] = useState<TabKey>('available');
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Data
  const [availableCoupons, setAvailableCoupons] = useState<CouponAvailable[]>([]);
  const [reviewCoupons, setReviewCoupons] = useState<ReviewCouponResponse[]>([]);
  const [usageHistory, setUsageHistory] = useState<CouponUsageRecord[]>([]);

  const fetchData = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const [available, reviews, history] = await Promise.all([
        getAvailableCoupons(memberId),
        getMyReviews(memberId),
        getCouponHistory(memberId),
      ]);
      setAvailableCoupons(available);
      setReviewCoupons(reviews);
      setUsageHistory(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive expired from review coupons
  const expiredCoupons = reviewCoupons.filter(r =>
    r.couponExpiredAt && new Date(r.couponExpiredAt).getTime() < Date.now()
  );

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'available', label: 'ใช้ได้', count: availableCoupons.length },
    { key: 'used', label: 'ใช้แล้ว', count: usageHistory.length },
    { key: 'expired', label: 'หมดอายุ', count: expiredCoupons.length },
  ];

  return (
    <div className="coupons-page">
      {/* Hero */}
      <motion.div
        className="coupons-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <ArrowBack
            sx={{ cursor: 'pointer', fontSize: 22, opacity: 0.85 }}
            onClick={() => navigate(-1)}
          />
          <div>
            <Typography variant="h6" fontWeight={700} fontSize="1.3rem">
              คูปองของฉัน
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, fontSize: '0.8rem' }}>
              ส่วนลดพิเศษสำหรับคุณ
            </Typography>
          </div>
        </Box>

        <div className="coupons-hero-stats">
          <motion.div className="hero-stat" whileHover={{ scale: 1.03 }}>
            <div className="hero-stat-value">{availableCoupons.length}</div>
            <div className="hero-stat-label">ใช้ได้</div>
          </motion.div>
          <motion.div className="hero-stat" whileHover={{ scale: 1.03 }}>
            <div className="hero-stat-value">{usageHistory.length}</div>
            <div className="hero-stat-label">ใช้แล้ว</div>
          </motion.div>
          <motion.div className="hero-stat" whileHover={{ scale: 1.03 }}>
            <div className="hero-stat-value">
              {reviewCoupons.filter(r => r.status === 'pending').length}
            </div>
            <div className="hero-stat-label">รออนุมัติ</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="coupon-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`coupon-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            <span className="coupon-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="coupons-content">
        {loading ? (
          // Skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="skeleton-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))
        ) : (
          <AnimatePresence mode="wait">
            {tab === 'available' && (
              <motion.div
                key="available"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {availableCoupons.length === 0 ? (
                  <div className="empty-state">
                    <ConfirmationNumber className="empty-icon" />
                    <Typography variant="body1" fontWeight={600} color="#6e5353">
                      ยังไม่มีคูปอง
                    </Typography>
                    <Typography variant="body2" color="#a0928f" mt={0.5} mb={2}>
                      เขียนรีวิวเพื่อรับคูปองส่วนลดฟรี!
                    </Typography>
                    <motion.button
                      className="coupon-use-btn"
                      style={{ margin: '0 auto', padding: '10px 24px', fontSize: '0.85rem' }}
                      onClick={() => navigate('/review')}
                      whileTap={{ scale: 0.97 }}
                    >
                      <RateReview sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                      เขียนรีวิว
                    </motion.button>
                  </div>
                ) : (
                  availableCoupons.map((c, i) => {
                    const countdown = getCountdown(c.endDate);
                    return (
                      <motion.div
                        key={c.couponId}
                        className="coupon-card"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="coupon-card-inner">
                          <div className="coupon-left">
                            <div className="discount-value">
                              {c.discountType === 'percent'
                                ? c.discountValue
                                : c.discountValue.toLocaleString()
                              }
                            </div>
                            <div className="discount-unit">
                              {c.discountType === 'percent' ? '% OFF' : 'บาท'}
                            </div>
                            {c.source === 'review' && (
                              <div className="coupon-source-tag">⭐ review</div>
                            )}
                          </div>
                          <div className="coupon-right">
                            <div className="coupon-name">{c.name}</div>
                            <div className="coupon-desc">{c.description}</div>

                            <div className="coupon-code-row">
                              <span
                                className="coupon-code-badge"
                                onClick={() => copyCode(c.code)}
                                title="คัดลอกรหัส"
                              >
                                {c.code}
                              </span>
                              <ContentCopy
                                sx={{ fontSize: 14, color: '#a0928f', cursor: 'pointer' }}
                                onClick={() => copyCode(c.code)}
                              />
                              <span className="copy-hint">แตะเพื่อคัดลอก</span>
                            </div>

                            {countdown && (
                              <div className={`coupon-expire ${countdown.urgent ? 'urgent' : ''}`}>
                                {countdown.urgent && <span className="expire-dot" />}
                                <AccessTime sx={{ fontSize: 13 }} />
                                เหลือ {countdown.days} วัน {countdown.hours} ชม. {countdown.mins} น.
                              </div>
                            )}

                            <motion.button
                              className="coupon-use-btn"
                              onClick={() => navigate(
                                c.source === 'review' ? '/review' : '/apply-coupon',
                                { state: { couponCode: c.code, orderType: c.applicableTo, couponId: c.couponId } }
                              )}
                              whileTap={{ scale: 0.95 }}
                            >
                              {c.source === 'review' ? (
                                <><RateReview sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} /> ไปรีวิว</>
                              ) : (
                                <><ShoppingCart sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'text-bottom' }} /> ใช้คูปอง</>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {tab === 'used' && (
              <motion.div
                key="used"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {usageHistory.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingCart className="empty-icon" />
                    <Typography variant="body1" fontWeight={600} color="#6e5353">
                      ยังไม่มีประวัติการใช้
                    </Typography>
                    <Typography variant="body2" color="#a0928f" mt={0.5}>
                      ใช้คูปองเพื่อรับส่วนลด!
                    </Typography>
                  </div>
                ) : (
                  usageHistory.map((u, i) => (
                    <motion.div
                      key={u.id}
                      className="coupon-card used"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="coupon-card-inner">
                        <div className="coupon-left">
                          <div className="discount-value">
                            {u.discountApplied.toLocaleString()}
                          </div>
                          <div className="discount-unit">บาท</div>
                          <div className="coupon-source-tag">ใช้แล้ว</div>
                        </div>
                        <div className="coupon-right">
                          <div className="coupon-name">
                            {u.orderType === 'loan' ? '🏦 สินเชื่อ' : '📦 ออเดอร์'} #{u.orderId}
                          </div>
                          <Typography variant="caption" color="#a0928f">
                            ใช้เมื่อ {new Date(u.usedAt).toLocaleDateString('th-TH', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </Typography>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {tab === 'expired' && (
              <motion.div
                key="expired"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {expiredCoupons.length === 0 ? (
                  <div className="empty-state">
                    <AccessTime className="empty-icon" />
                    <Typography variant="body1" fontWeight={600} color="#6e5353">
                      ไม่มีคูปองหมดอายุ
                    </Typography>
                  </div>
                ) : (
                  expiredCoupons.map((r, i) => (
                    <motion.div
                      key={r.id}
                      className="coupon-card expired"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className="coupon-card-inner">
                        <div className="coupon-left">
                          <div className="discount-value">
                            {r.discountValue || '—'}
                          </div>
                          <div className="discount-unit">
                            {r.discountType === 'percent' ? '% OFF' : 'บาท'}
                          </div>
                          <div className="coupon-source-tag">หมดอายุ</div>
                        </div>
                        <div className="coupon-right">
                          <div className="coupon-name">
                            {r.couponCode || 'คูปองหมดอายุ'}
                          </div>
                          <Typography variant="caption" color="#a0928f">
                            หมดอายุ {r.couponExpiredAt &&
                              new Date(r.couponExpiredAt).toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })
                            }
                          </Typography>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Copied Toast */}
      <AnimatePresence>
        {copiedCode && (
          <motion.div
            className="copied-toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            ✅ คัดลอก "{copiedCode}" แล้ว!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
