import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  Star, StarBorder, CloudUpload, CheckCircle,
  CameraAlt, HistoryOutlined, LocalOffer,
  ArrowBack, Add,
  Link as LinkIcon, ChatBubbleOutline, Instagram
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../Context/userContext';
import {
  submitReview,
  getMyReviews,
  ReviewSubmitDto,
  ReviewCouponResponse
} from '../../Services/ReviewCouponService';
import { uploadImageService } from '../../Services/uploadImageService';
import './ReviewPage.css';

const CONFETTI_COLORS = ['#6e5353', '#1b413c', '#159e75', '#ffb74d', '#e91e63', '#2196f3'];

const ImageWithAuth = ({ src, className, alt }: { src: string; className?: string; alt?: string }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl = '';
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const response = await fetch(src, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch image');
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        console.error('Error fetching image:', err);
        setError(true);
      }
    };
    if (src) {
      if (src.startsWith('http') || src.startsWith('/')) {
        fetchImage();
      } else {
        setImageSrc(src);
      }
    }
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (error) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eded', color: '#a0928f', fontSize: '10px', textAlign: 'center', padding: '10px' }}>
        ไม่สามารถโหลดภาพได้
      </div>
    );
  }
  if (!imageSrc) {
    return (
      <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0eded' }}>
        <CircularProgress size={20} sx={{ color: '#6e5353' }} />
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

export default function ReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const memberId = (user as any)?.member?.id || (user as any)?.id || 0;

  // Pre-filled from CouponBanner (DownPayment / LoanScreen)
  const navState = location.state as any;
  console.log('[ReviewPage] navState:', JSON.stringify(navState));
  const prefillOrderType = navState?.orderType as 'loan' | 'order' | undefined;
  const prefillOrderId = navState?.orderId != null ? String(navState.orderId) : '';
  const prefillCouponId = navState?.couponId != null ? String(navState.couponId) : undefined;
  console.log('[ReviewPage] prefillCouponId:', prefillCouponId);
  const isPrefilledFromOrder = !!(prefillOrderType && prefillOrderId);

  const [tab, setTab] = useState<'upload' | 'history'>('upload');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [screenshots, setScreenshots] = useState<{ file: File; preview: string }[]>([]);
  const [reviewType, setReviewType] = useState<'loan' | 'order'>(prefillOrderType || 'loan');
  const [reviewOrderId, setReviewOrderId] = useState(prefillOrderId);
  const [couponId, setCouponId] = useState(prefillCouponId || '');
  const [socialLink, setSocialLink] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // History
  const [reviews, setReviews] = useState<ReviewCouponResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!memberId) return;
    setLoadingHistory(true);
    try {
      const data = await getMyReviews(memberId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  }, [memberId]);

  useEffect(() => {
    if (tab === 'history') fetchHistory();
  }, [tab, fetchHistory]);

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setScreenshots(newFiles.slice(0, 1)); // exactly 1 total
    e.target.value = ''; // reset input
  };

  const removeScreenshot = (index: number) => {
    setScreenshots(prev => {
      const newList = [...prev];
      URL.revokeObjectURL(newList[index].preview);
      newList.splice(index, 1);
      return newList;
    });
  };

  // Must have exactly 1 image
  const hasAttachments = screenshots.length === 1;

  const handleSubmit = async () => {
    if (!rating || !reviewOrderId || !hasAttachments) return;
    setSubmitting(true);
    try {
      // Upload first image as primary image
      let imageUrl: string | undefined;

      if (screenshots.length > 0) {
        try {
          const uploadResult = await uploadImageService(
            'review-coupons/upload-image',
            screenshots[0].file
          );
          // Backend returns { fileName: "url", path: "..." }
          imageUrl = uploadResult?.fileName || uploadResult?.data?.fileName;
        } catch {
          imageUrl = screenshots[0].preview;
        }
      }

      // Build description
      const parts: string[] = [];
      if (screenshots.length > 0) parts.push(`${screenshots.length} รูป`);
      if (socialLink.trim()) parts.push('ลิงก์');
      const reviewDesc = parts.length > 0 ? `รีวิวจาก Social Media (${parts.join(', ')})` : '';

      const dto: ReviewSubmitDto = {
        memberId,
        reviewType,
        reviewOrderId: Number(reviewOrderId),
        reviewOrderType: reviewType === 'loan' ? 'LOAN' : 'DOWN',
        rating,
        reviewText: reviewComment.trim() || reviewDesc,
        reviewImageUrl: imageUrl || null,
        socialLink: socialLink.trim() || null,
        couponId: couponId || null,
      };
      const res = await submitReview(dto);
      setSuccessData(res);
      setShowSuccess(true);
      // Reset
      setRating(0);
      setScreenshots([]);
      setSocialLink('');
      setReviewComment('');
      if (!isPrefilledFromOrder) setReviewOrderId('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="review-page">
      {/* Hero */}
      <motion.div
        className="review-hero"
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
            <div className="review-hero-title">รีวิว & รับคูปอง</div>
            <div className="review-hero-sub">รีวิวบน Social Media แล้วแคปหน้าจอมาอัปโหลด</div>
          </div>
        </Box>
      </motion.div>

      {/* Tabs */}
      <div className="review-tabs">
        <button
          className={`review-tab ${tab === 'upload' ? 'active' : ''}`}
          onClick={() => setTab('upload')}
        >
          <CloudUpload sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
          อัปโหลดรีวิว
        </button>
        <button
          className={`review-tab ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          <HistoryOutlined sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
          รีวิวของฉัน
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upload' ? (
          <motion.div
            key="upload"
            className="review-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Go review on social media */}
            <motion.div
              className="step-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="step-title">
                <span className="step-number">1</span>
                รีวิวบน Social Media
              </div>
              <Typography variant="body2" color="#8a7d7d" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                กดเลือกช่องทาง แล้วเขียนรีวิวประสบการณ์ของคุณ
              </Typography>
              <div className="social-buttons">
                <a
                  className="social-btn ig"
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="social-icon" />
                  Instagram
                </a>
                <a
                  className="social-btn tiktok"
                  href="https://www.tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="social-icon" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.28 8.28 0 005.58 2.17V11.9a4.83 4.83 0 01-3.77-1.6V2h3.77v4.69z" />
                  </svg>
                  TikTok
                </a>
              </div>
            </motion.div>

            {/* Step 2: Upload Images, Videos, Link & Comment */}
            <motion.div
              className="step-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="step-title">
                <span className="step-number">2</span>
                แนบหลักฐานรีวิว
              </div>
              <Typography variant="body2" color="#8a7d7d" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                โปรดแนบรูปแคปหน้าจอ 1 รูป (บังคับ) และลิงก์/คอมเม้นต์เพิ่มเติมได้
              </Typography>

              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleImageAdd}
                style={{ display: 'none' }}
              />

              {/* Upload zone */}
              {screenshots.length === 0 ? (
                <label htmlFor="screenshot-upload">
                  <div className="screenshot-upload-zone">
                    <CameraAlt className="upload-area-icon" />
                    <div className="upload-area-title">แตะเพื่ออัปโหลดรูปแคปหน้าจอ</div>
                    <div className="upload-area-sub">รองรับ JPG, PNG • 1 รูปเท่านั้น</div>
                  </div>
                </label>
              ) : (
                <div className="screenshot-upload-zone has-images">
                  <div className="screenshot-grid">
                    {screenshots.map((s, i) => (
                      <motion.div
                        key={i}
                        className="screenshot-thumb"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <img src={s.preview} alt={`Screenshot ${i + 1}`} />
                        <button
                          className="screenshot-remove"
                          onClick={() => removeScreenshot(i)}
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}

                  </div>
                </div>
              )}

              {/* Social Link */}
              <div className="section-title" style={{ marginTop: 16 }}>
                <LinkIcon sx={{ fontSize: 16 }} /> ลิงก์รีวิว / วีดีโอ (ไม่บังคับ)
              </div>
              <input
                type="url"
                className="order-id-input"
                value={socialLink}
                onChange={e => setSocialLink(e.target.value)}
                placeholder="https://facebook.com/... หรือ https://tiktok.com/..."
              />

              {/* Comment */}
              <div className="section-title" style={{ marginTop: 16 }}>
                <ChatBubbleOutline sx={{ fontSize: 16 }} /> คอมเม้นต์ (ไม่บังคับ)
              </div>
              <textarea
                className="review-comment-input"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                placeholder="เขียนข้อความรีวิว ความประทับใจ..."
                rows={3}
              />
            </motion.div>

            {/* Step 3: Select Order + Rating */}
            <motion.div
              className="step-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="step-title">
                <span className="step-number">3</span>
                ข้อมูลรีวิว & ให้คะแนน
              </div>

              <div className="section-title">
                ประเภท
                {isPrefilledFromOrder && (
                  <span style={{ fontWeight: 400, fontSize: '0.7rem', color: '#159e75', marginLeft: 8 }}>
                    ✅ อ้างอิงจาก{reviewType === 'loan' ? 'สินเชื่อ' : 'คำสั่งซื้อ'} #{reviewOrderId}
                  </span>
                )}
              </div>
              <div className="review-type-row">
                <button
                  className={`review-type-btn ${reviewType === 'loan' ? 'selected' : ''}`}
                  onClick={() => !isPrefilledFromOrder && setReviewType('loan')}
                  disabled={isPrefilledFromOrder}
                  style={isPrefilledFromOrder ? { opacity: reviewType === 'loan' ? 1 : 0.4, cursor: 'default' } : {}}
                >
                  🏦 สินเชื่อ
                </button>
                <button
                  className={`review-type-btn ${reviewType === 'order' ? 'selected' : ''}`}
                  onClick={() => !isPrefilledFromOrder && setReviewType('order')}
                  disabled={isPrefilledFromOrder}
                  style={isPrefilledFromOrder ? { opacity: reviewType === 'order' ? 1 : 0.4, cursor: 'default' } : {}}
                >
                  📦 คำสั่งซื้อ
                </button>
              </div>

              <div className="section-title">หมายเลขรายการ</div>
              <input
                type="number"
                className="order-id-input"
                value={reviewOrderId}
                onChange={e => !isPrefilledFromOrder && setReviewOrderId(e.target.value)}
                placeholder="กรอก Loan/Order ID"
                readOnly={isPrefilledFromOrder}
                style={isPrefilledFromOrder ? { background: '#f0eded', color: '#6e5353' } : {}}
              />

              <div className="section-title" style={{ marginTop: 16 }}>
                <Star sx={{ fontSize: 16, color: '#ffb74d' }} /> ให้คะแนน
              </div>
              <div className="star-container">
                {[1, 2, 3, 4, 5].map(s => (
                  <motion.button
                    key={s}
                    className={`star-btn ${s <= rating ? 'active' : ''}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileTap={{ scale: 0.85 }}
                  >
                    {s <= displayRating ? (
                      <Star sx={{ fontSize: 40, color: '#ffb74d' }} />
                    ) : (
                      <StarBorder sx={{ fontSize: 40, color: '#d0c4c4' }} />
                    )}
                  </motion.button>
                ))}
              </div>
              <Typography textAlign="center" variant="body2" sx={{ color: '#8a7d7d', fontSize: '0.78rem' }}>
                {displayRating === 0 && 'แตะดาวเพื่อให้คะแนน'}
                {displayRating === 1 && '😔 ต้องปรับปรุง'}
                {displayRating === 2 && '😐 พอใช้ได้'}
                {displayRating === 3 && '🙂 ดี'}
                {displayRating === 4 && '😃 ดีมาก'}
                {displayRating === 5 && '🤩 ยอดเยี่ยม!'}
              </Typography>
            </motion.div>

            {/* Submit */}
            <motion.button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting || !rating || !reviewOrderId || !hasAttachments}
              whileTap={{ scale: 0.97 }}
            >
              {submitting ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : (
                '📸 ส่งรีวิว & รับคูปอง'
              )}
            </motion.button>
          </motion.div>
        ) : (
          /* History Tab */
          <motion.div
            key="history"
            className="review-content"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {loadingHistory ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress size={32} sx={{ color: '#6e5353' }} />
              </Box>
            ) : reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                <CameraAlt sx={{ fontSize: 56, color: '#d0c4c4', mb: 1 }} />
                <Typography variant="body1" fontWeight={600} color="#6e5353">
                  ยังไม่มีรีวิว
                </Typography>
                <Typography variant="body2" color="#a0928f" mt={0.5}>
                  รีวิวบน Social Media แล้วอัปโหลดรูปแคปหน้าจอ
                </Typography>
                <motion.button
                  className="submit-btn"
                  style={{ maxWidth: 240, margin: '20px auto 0' }}
                  onClick={() => setTab('upload')}
                  whileTap={{ scale: 0.97 }}
                >
                  ส่งรีวิวตอนนี้
                </motion.button>
              </motion.div>
            ) : (
              reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  className="review-history-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="review-meta">
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className="review-type-tag">
                        {r.reviewType === 'loan' ? '🏦' : '📦'} {r.reviewType}
                      </span>
                      <Typography variant="caption" color="#a0928f">#{r.reviewOrderId}</Typography>
                    </div>
                    <span className={`status-badge status-${r.status}`}>
                      {r.status === 'pending' && 'รออนุมัติ'}
                      {r.status === 'approved' && 'อนุมัติแล้ว'}
                      {r.status === 'rejected' && 'ถูกปฏิเสธ'}
                      {r.status === 'expired' && 'หมดอายุ'}
                    </span>
                  </div>

                  {/* Screenshot thumbnail */}
                  {r.reviewImageUrl && (
                    <div className="history-images">
                      <ImageWithAuth src={r.reviewImageUrl} alt="Review screenshot" className="history-thumb" />
                    </div>
                  )}

                  <div className="preview-stars" style={{ margin: '6px 0' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        sx={{ fontSize: 16, color: s <= r.rating ? '#ffb74d' : '#e0d6d6' }}
                      />
                    ))}
                  </div>

                  <Typography variant="caption" color="#a0928f">
                    {new Date(r.reviewedAt).toLocaleDateString('th-TH', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </Typography>

                  {r.couponCode && (
                    <div className="coupon-reward">
                      <LocalOffer sx={{ fontSize: 18, color: '#159e75' }} />
                      <div>
                        <div className="coupon-code-text">{r.couponCode}</div>
                        <Typography variant="caption" color="#8a7d7d">
                          ส่วนลด {r.discountValue}
                          {r.discountType === 'percent' ? '%' : ' บาท'}
                          {r.couponExpiredAt && ` • หมดอายุ ${new Date(r.couponExpiredAt).toLocaleDateString('th-TH')}`}
                        </Typography>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              className="success-card"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              onClick={e => e.stopPropagation()}
            >
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                    left: `${10 + Math.random() * 80}%`,
                    top: `${Math.random() * 30}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
              <CheckCircle className="success-icon" />
              <div className="success-title">ส่งรีวิวสำเร็จ! 🎉</div>
              <div className="success-sub">
                {successData?.data?.status === 'approved'
                  ? 'คุณได้รับคูปองส่วนลดแล้ว!'
                  : 'รีวิวของคุณอยู่ระหว่างรอการอนุมัติ จะได้รับคูปองเมื่ออนุมัติแล้ว'}
              </div>
              {successData?.data?.couponCode && (
                <div className="coupon-reward" style={{ justifyContent: 'center' }}>
                  <LocalOffer sx={{ fontSize: 18, color: '#159e75' }} />
                  <span className="coupon-code-text">{successData.data.couponCode}</span>
                </div>
              )}
              <motion.button
                className="submit-btn"
                style={{ marginTop: 16 }}
                onClick={() => {
                  setShowSuccess(false);
                  setTab('history');
                  fetchHistory();
                }}
                whileTap={{ scale: 0.97 }}
              >
                ดูรีวิวของฉัน
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
