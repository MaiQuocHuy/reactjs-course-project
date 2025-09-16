export interface GetDiscountsParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface GetDiscountsByTypeParams {
  type: 'GENERAL' | 'REFERRAL';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface GetDiscountsByOwnerUserIdParams {
  ownerUserId: string;
  type: 'GENERAL' | 'REFERRAL';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
}

export interface Discount {
  id: string;
  code: string;
  discountPercent: number;
  description: string;
  type: 'GENERAL' | 'REFERRAL';
  ownerUser?: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  isActive: boolean;
  currentUsageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  code: string;
  discountPercent: number;
  description: string;
  type: 'GENERAL' | 'REFERRAL';
  ownerUserId?: string;
  startDate: string;
  endDate: string;
  usageLimit: number | null;
  perUserLimit: number | null;
}

export interface SendDiscountEmailRequest {
  subject: string;
  discount_id: string;
  user_ids?: string[] | string;
}
