export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE'
}

export enum SalarySystem {
  HOURLY = 'HOURLY',
  MONTHLY = 'MONTHLY',
  COMMISSION = 'COMMISSION'
}

export interface Practitioner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialties: string[];
  employmentType: EmploymentType;
  salarySystem: SalarySystem;
  startDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkRecord {
  id: string;
  practitionerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  treatmentDetails: string;
  salesAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalaryCalculation {
  practitionerId: string;
  year: number;
  month: number;
  baseSalary: number; // 固定給または歩合給の基本額
  totalSales: number; // 売上合計
  commission: number; // 歩合額（歩合制の場合）
  totalAmount: number; // 支給総額
  createdAt: Date;
} 