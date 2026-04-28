import React, { useState, useEffect, useCallback } from 'react';
import { LocalOffer, AccessTime, RateReview } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/userContext';
import { getAvailableCoupons, CouponAvailable } from '../Services/ReviewCouponService';
import { useCompanySettings } from '../Utility/useCompanySettings';
import './CouponBanner.css';

interface CouponBannerProps {
  orderType: 'loan' | 'order';
  orderId?: number;
  orderAmount?: number;
}

function getCountdown(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  return { days, hours, urgent: days <= 3 };
}

const CouponBanner: React.FC<CouponBannerProps> = ({ orderType, orderId, orderAmount = 0 }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const memberId = (user as any)?.member?.id || (user as any)?.id || 0;
  const { settings, loading: settingsLoading } = useCompanySettings();

  // Check flags based on orderType
  const couponEnabled = orderType === 'loan'
    ? settings.enableCouponForLoan
    : settings.enableCouponForOrder;

  const reviewEnabled = orderType === 'loan'
    ? settings.enableReviewCouponForLoan
    : settings.enableReviewCouponForOrder;

  const [coupons, setCoupons] = useState<CouponAvailable[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('[CouponBanner]', {
    memberId, orderType, orderAmount,
    couponEnabled, reviewEnabled,
    settingsLoading, loading,
    couponsCount: coupons.length
  });

  const fetchCoupons = useCallback(async () => {
    if (!memberId || !couponEnabled) {
      console.log('[CouponBanner] Skip fetch:', { memberId, couponEnabled });
      setLoading(false);
      return;
    }
    try {
      const data = await getAvailableCoupons(memberId, orderType, orderAmount);
      // Filter out coupons that have reached their usage limit
      const available = data.filter(c => {
        if (!c.maxUsage || c.maxUsage <= 0) return true; // unlimited
        return (c.usedCount || 0) < c.maxUsage;
      });
      console.log('[CouponBanner] Fetched coupons:', data.length, '→ available:', available.length);
      setCoupons(available);
    } catch (err) {
      console.error('CouponBanner: failed to load coupons', err);
    } finally {
      setLoading(false);
    }
  }, [memberId, orderType, orderAmount, couponEnabled]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // If settings loaded and both disabled → render nothing
  if (!settingsLoading && !couponEnabled && !reviewEnabled) {
    console.log('[CouponBanner] Hidden: both flags disabled');
    return null;
  }

  return (
    <div className="coupon-banner">
      <div className="coupon-banner-title">
        <LocalOffer sx={{ fontSize: 18, color: '#159e75' }} />
        คูปองส่วนลด
        {coupons.length > 0 && (
          <span className="coupon-banner-count">{coupons.length}</span>
        )}
      </div>

      <div className="coupon-scroll">
        {(loading || settingsLoading) ? (
          <>
            <div className="coupon-skeleton" />
            <div className="coupon-skeleton" />
          </>
        ) : (
          <>
            {/* Coupon cards — only if coupon enabled */}
            {couponEnabled && coupons.map((c, i) => {
              const countdown = getCountdown(c.endDate);
              return (
                <motion.div
                  key={c.couponId}
                  className="coupon-ticket"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => navigate(c.source === 'review' ? '/review' : '/apply-coupon', {
                    state: { couponCode: c.code, orderType, orderId, orderAmount, couponId: c.couponId }
                  })}
                >
                  <div className="coupon-ticket-left">
                    <span className="ticket-discount-val">
                      {c.discountType === 'percent' ? c.discountValue : c.discountValue.toLocaleString()}
                    </span>
                    <span className="ticket-discount-unit">
                      {c.discountType === 'percent' ? '% OFF' : 'บาท'}
                    </span>
                    {c.source === 'review' && (
                      <span className="ticket-source">⭐ review</span>
                    )}
                  </div>
                  <div className="coupon-ticket-right">
                    <div className="ticket-code">{c.code}</div>
                    <div className="ticket-name">{c.name}</div>
                    {countdown && (
                      <div className={`ticket-expire ${countdown.urgent ? 'urgent' : ''}`}>
                        <AccessTime sx={{ fontSize: 11 }} />
                        เหลือ {countdown.days} วัน {countdown.hours} ชม.
                      </div>
                    )}
                    <button
                      className="ticket-use-btn"
                      onClick={e => {
                        e.stopPropagation();
                        navigate(c.source === 'review' ? '/review' : '/apply-coupon', {
                          state: { couponCode: c.code, orderType, orderId, orderAmount, couponId: c.couponId }
                        });
                      }}
                    >
                      {c.source === 'review' ? 'ไปรีวิว' : 'ใช้คูปอง'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default CouponBanner;
