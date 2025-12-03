// ===========================================
// 📦 TYPES GLOBAUX POUR L'APPLICATION
// ===========================================

export interface SubscriptionTier {
  id: string;
  name: "Free" | "Premium";
  description: string;
  price: number;
  currency: "XOF" | "USD";
  duration_days: number;
  features: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: "active" | "expired" | "cancelled";
  start_date: string;
  end_date: string;
  payment_reference?: string | null;
  created_at: string;
  subscription_tiers?: SubscriptionTier;
}

export interface SubscriptionData {
  planName: string;
  status: "free" | "premium" | "expired" | "unknown";
  endDate?: string | null;
}

export interface MonerooPaymentResponse {
  data: {
    reference: string;
    payment_url: string;
    amount: number;
    currency: string;
    status: "initialized" | "success" | "failed";
  };
  message: string;
}

export interface MonerooWebhookEvent {
  event: "payment.success" | "payment.failed";
  data: {
    reference: string;
    amount: number;
    currency: string;
    status: "success" | "failed";
    customer_email?: string;
  };
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string | null;
}
