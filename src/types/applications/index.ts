export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp?: string;
}

export interface Application {
  id: string;
  applicant: Applicant;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  documents?: string;
  rejectionReason?: string | null;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  thumbnailUrl?: string
}

export interface ReviewApplicationRequest {
  id: string; 
  action: 'APPROVED' | 'REJECTED';
  rejectionReason?: string | null;
}