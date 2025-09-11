export interface GetDiscountsParams {
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
  usageLimit: number;
  perUserLimit: number;
}
