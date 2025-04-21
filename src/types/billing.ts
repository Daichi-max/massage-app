export interface InsuranceClaim {
  id: string;
  patientId: string;
  practitionerId: string;
  claimDate: string;
  treatmentDate: string;
  totalAmount: number;
  insuranceAmount: number;
  patientCopayment: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';
  claimNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Receipt {
  id: string;
  patientId: string;
  treatmentId: string;
  issueDate: string;
  amount: number;
  paymentMethod: 'cash' | 'credit' | 'insurance';
  status: 'issued' | 'paid';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  patientId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'credit' | 'insurance';
  receiptId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
} 