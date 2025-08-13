import type { Payment } from "../payments";

export interface Refund {
  id: string;
  payment: Payment;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  reason: string;
  requestedAt?: Date;
  processedAt?: Date | null;
}
