// User Types
export type UserRole = "subscriber" | "author" | "admin" | "super_admin";
export type UserStatus = "active" | "blocked";
export type AuthorVerificationStatus = "pending" | "active" | "rejected";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  organization?: string;
  orgRole?: string;
  status: UserStatus;
  isPremium: boolean;
  authorVerificationStatus?: AuthorVerificationStatus;
  totalEarnings: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "subscriber" | "author";
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    userInfo: User;
    otp?: string; // For development mode or OTP challenge
  };
}

// Plan Types
export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  stripePriceId: string;
  isActive: boolean;
  createdAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory: boolean;
  subCategories: string[] | Category[];
  categoryType: "main_category" | "sub_category";
  availableFilters?: FilterGroup[];
}

export interface FilterGroup {
  filterKey: string;
  displayName: string;
  options: FilterOption[];
}

export interface FilterOption {
  displayName: string;
  value: string | NestedFilterValue[];
}

export interface NestedFilterValue {
  displayName: string;
  filterKey: string;
}

// Asset Types
export type AssetType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "3d"
  | "template"
  | "other";
export type AssetStatus = "pending_review" | "approved" | "rejected";
export type Orientation = "landscape" | "portrait" | "square";

export interface Asset {
  _id: string;
  title: string;
  slug: string;
  author: string | User;
  assetType: AssetType;
  categories: string[] | Category[];
  tags: string[];
  compatibleTools: string[];
  resolution?: string;
  orientation?: Orientation;
  isPremium: boolean;
  isAIGenerated: boolean;
  livePreview?: string;
  price: number;
  discountPrice?: number;
  status: AssetStatus;
  storage: {
    public_id: string;
    secure_url: string;
    resource_type: string;
    format: string;
    bytes: number;
  };
  previews?: {
    thumbnail?: {
      public_id: string;
      secure_url: string;
    };
    watermark?: string;
    images?: {
      public_id: string;
      secure_url: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

// Subscription Types
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "expired";

export interface Subscription {
  _id: string;
  user: string | User;
  plan: string | Plan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  stripeSubscriptionId: string;
  createdAt: string;
  updatedAt: string;
}

// Payment Types
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface IndividualPayment {
  _id: string;
  user: string | User;
  asset: string | Asset;
  assetDetails?: Asset; // Backend populates this field
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  isPremiumUser: boolean;
  paymentStatus: PaymentStatus;
  stripeSessionId: string;
  stripePaymentIntentId?: string;
  paymentMethod?: string;
  transactionDate: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface AuthorReply {
  comment: string;
  repliedAt: Date | string;
}

export interface Review {
  _id: string;
  asset: string | Asset;
  user: string | User;
  rating: number;
  comment: string;
  authorReply?: AuthorReply;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export type ContactCategory =
  | "general"
  | "technical"
  | "billing"
  | "content"
  | "other";
export type ContactPriority = "low" | "medium" | "high" | "urgent";
export type ContactStatus = "open" | "in_progress" | "resolved" | "closed";

export interface Contact {
  _id: string;
  user: string | User;
  subject: string;
  category: ContactCategory;
  priority: ContactPriority;
  message: string;
  status: ContactStatus;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Analytics Types
export interface PeriodStats {
  lifetime: number;
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
}

export interface AuthorAnalytics {
  views: PeriodStats;
  downloads: PeriodStats;
  earnings: PeriodStats;
  topAssets: {
    assetId: string;
    title: string;
    views: number;
    downloads: number;
    earnings: number;
  }[];
}

export interface AdminAnalytics {
  views: PeriodStats;
  downloads: PeriodStats;
  earnings: {
    total: PeriodStats;
    company: PeriodStats;
    authors: PeriodStats;
  };
  users: {
    total: number;
    subscribers: number;
    authors: number;
    premium: number;
  };
  assets: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errorMessages: any[];
  stack?: string;
}

// Asset Stats Types
export interface AssetStats {
  views: number;
  downloads: number;
  likes: number;
}

// Checkout Types
export interface CheckoutSession {
  sessionId: string;
  sessionUrl: string;
  url?: string; // Keep for backward compatibility
  payment?: IndividualPayment;
}
