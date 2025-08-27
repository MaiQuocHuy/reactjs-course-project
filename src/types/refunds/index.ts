import type { PaymentDetailResponse, PaymentUser } from "../payments";

// Types for API responses
export interface RefundPaymentBasic {
  id: string;
  amount: number;
  status: string;
  user: PaymentUser;
  createdAt: string;
}

export interface RefundResponse {
  id: string;
  payment: RefundPaymentBasic;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  requestedAt: string;
  processedAt: string | null;
}

export interface RefundDetailResponse {
  id: string;
  payment: PaymentDetailResponse;
  reason: string;
  rejectedReason: string | null;
  amount: number;
  status: string;
  requestedAt: string;
  processedAt: string | null;
}

export interface RefundsApiResponse {
  statusCode: number;
  message: string;
  data: {
    content: RefundResponse[];
    page: {
      number: number;
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
    };
  };
  timestamp: string;
}

export interface RefundDetailApiResponse {
  statusCode: number;
  message: string;
  data: RefundDetailResponse;
  timestamp: string;
}

export interface RefundStatistics {
  total: number;
  completed: number;
  pending: number;
  failed: number;
}

export interface RefundStatisticsResponse {
  statusCode: number;
  message: string;
  data: RefundStatistics;
  timestamp: string;
}
