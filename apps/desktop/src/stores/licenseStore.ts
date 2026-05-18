import { create } from "zustand";
import { supabase } from "../lib/supabase";

export interface License {
  id: string;
  user_id: string;
  status: "trial" | "active" | "expired" | "cancelled";
  plan: "free" | "pro" | "enterprise";
  trial_ends_at: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

interface LicenseState {
  license: License | null;
  loading: boolean;
  trialDaysLeft: number;
  isLicensed: boolean;
  isTrial: boolean;
  isExpired: boolean;
  showLicenseModal: boolean;

  checkLicense: () => Promise<void>;
  setShowLicenseModal: (show: boolean) => void;
  openStripeCheckout: () => Promise<void>;
}

const TRIAL_DAYS = 14;

function getLocalTrialEnd(): Date {
  const key = "forgia_trial_start";
  let start = localStorage.getItem(key);
  if (!start) {
    start = new Date().toISOString();
    localStorage.setItem(key, start);
  }
  const end = new Date(start);
  end.setDate(end.getDate() + TRIAL_DAYS);
  return end;
}

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export const useLicenseStore = create<LicenseState>((set) => ({
  license: null,
  loading: true,
  trialDaysLeft: TRIAL_DAYS,
  isLicensed: false,
  isTrial: true,
  isExpired: false,
  showLicenseModal: false,

  async checkLicense() {
    set({ loading: true });

    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      // No user logged in: allow limited free use or force trial
      const trialEnd = getLocalTrialEnd();
      const daysLeft = daysBetween(new Date(), trialEnd);
      set({
        license: null,
        loading: false,
        isLicensed: false,
        isTrial: daysLeft > 0,
        isExpired: daysLeft <= 0,
        trialDaysLeft: Math.max(0, daysLeft),
      });
      return;
    }

    const { data, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_id", session.session.user.id)
      .single();

    if (error || !data) {
      // No license row yet: use local trial
      const trialEnd = getLocalTrialEnd();
      const daysLeft = daysBetween(new Date(), trialEnd);
      set({
        license: null,
        loading: false,
        isLicensed: false,
        isTrial: daysLeft > 0,
        isExpired: daysLeft <= 0,
        trialDaysLeft: Math.max(0, daysLeft),
      });
      return;
    }

    const lic = data as License;
    const now = new Date();

    let isActive = false;
    let isTrial = false;
    let isExpired = false;
    let daysLeft = 0;

    if (lic.status === "active" && lic.current_period_end) {
      isActive = new Date(lic.current_period_end) > now;
      daysLeft = daysBetween(now, new Date(lic.current_period_end));
    } else if (lic.status === "trial" && lic.trial_ends_at) {
      isTrial = new Date(lic.trial_ends_at) > now;
      daysLeft = daysBetween(now, new Date(lic.trial_ends_at));
      isExpired = !isTrial;
    } else {
      isExpired = true;
    }

    set({
      license: lic,
      loading: false,
      isLicensed: isActive,
      isTrial,
      isExpired: isExpired || (!isActive && !isTrial),
      trialDaysLeft: Math.max(0, daysLeft),
    });
  },

  setShowLicenseModal(show) {
    set({ showLicenseModal: show });
  },

  async openStripeCheckout() {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (paymentLink) {
      window.open(paymentLink, "_blank");
      return;
    }

    // Fallback: call Supabase Edge Function (configure when ready)
    try {
      const { data, error } = await supabase.functions.invoke("stripe-checkout", {
        body: { priceId: "price_pro_monthly" },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      } else {
        console.warn("No checkout URL returned");
      }
    } catch (e) {
      console.error("Stripe checkout failed:", e);
      // Last resort: open a contact/support page
      window.open("https://forgia.app/pricing", "_blank");
    }
  },
}));
