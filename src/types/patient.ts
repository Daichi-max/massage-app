export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  kanaFirstName: string;
  kanaLastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  email?: string;
  address: string;
  insuranceType: 'health' | 'longTermCare' | 'none' | 'medical' | 'nursing';
  insuranceNumber: string;
  insuranceCardExpiryDate: string;
  copaymentRate: number; // 保険負担率（例：0.3 = 30%）
  firstVisitDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const FIRST_VISIT_FEE = {
  single: 1950,
  combined: 2230,
} as const; 