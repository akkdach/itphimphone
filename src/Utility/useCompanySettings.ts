import { useState, useEffect } from 'react';
import callApi from '../Services/callApi';

export interface CompanySettings {
  enableCouponForLoan: boolean;
  enableCouponForOrder: boolean;
  enableReviewCouponForLoan: boolean;
  enableReviewCouponForOrder: boolean;
}

const DEFAULT: CompanySettings = {
  enableCouponForLoan: true,
  enableCouponForOrder: true,
  enableReviewCouponForLoan: true,
  enableReviewCouponForOrder: true,
};

// Simple cache so multiple components don't re-fetch
let cached: CompanySettings | null = null;
let fetchPromise: Promise<CompanySettings> | null = null;

async function loadSettings(): Promise<CompanySettings> {
  if (cached) return cached;
  if (fetchPromise) return fetchPromise;

  fetchPromise = callApi
    .get('/CompanySetting')
    .then(res => {
      const d = res.data?.data;
      console.log('[useCompanySettings] API response:', d);
      cached = {
        enableCouponForLoan: d?.enableCouponForLoan ?? true,
        enableCouponForOrder: d?.enableCouponForOrder ?? true,
        enableReviewCouponForLoan: d?.enableReviewCouponForLoan ?? true,
        enableReviewCouponForOrder: d?.enableReviewCouponForOrder ?? true,
      };
      console.log('[useCompanySettings] Resolved settings:', cached);
      return cached;
    })
    .catch((err) => {
      console.warn('[useCompanySettings] API failed, using defaults:', err?.message);
      cached = DEFAULT;
      return DEFAULT;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings>(cached || DEFAULT);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let mounted = true;
    loadSettings().then(s => {
      if (mounted) {
        setSettings(s);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return { settings, loading };
}
