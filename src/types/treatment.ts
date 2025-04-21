export interface TreatmentFee {
  localCount: number;
  baseFee: number;
  hotCompressFee: number;
  hotElectricFee: number;
  manualTherapyFee: number;
  treatmentCount: number;
  electrotherapyFee: number;
  visitFee: number;
  firstVisitFee: number;
}

export const FEE_TABLE = {
  localCount: {
    1: 450,
    2: 900,
    3: 1350,
    4: 1800,
    5: 2250,
  },
  hotCompress: {
    1: 180,
  },
  hotElectric: {
    1: 300,
  },
  manualTherapy: {
    1: 470,
    2: 940,
    3: 1410,
    4: 1880,
  },
  treatmentCount: {
    1: 0,
    2: 1770,
  },
  electrotherapy: 100,
  visit: 2300,
  firstVisit: {
    single: 1950, // 1術（はり又はきゅうのいずれか一方）
    combined: 2230, // 2術（はり・きゅう併用）
  },
} as const;

export interface TreatmentRecord {
  id: string;
  patientId: string;
  practitionerId: string;
  date: string;
  time: string;
  treatmentType: 'single' | 'combined';
  treatmentAreas: {
    neck: boolean;
    shoulder: boolean;
    back: boolean;
    arm: boolean;
    leg: boolean;
    other?: string;
  };
  treatmentMethods: {
    massage: boolean;
    stretching: boolean;
    taping: boolean;
    other?: string;
  };
  painLevel: 1 | 2 | 3 | 4 | 5;
  localCount: number;
  isHotCompress: boolean;
  isHotElectric: boolean;
  isManualTherapy: boolean;
  treatmentCount: number;
  isElectrotherapy: boolean;
  isFirstVisit: boolean;
  firstVisitFee: number;
  totalFee: number;
  patientCopayment: number;
  copaymentRate: 0.1 | 0.2 | 0.3;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const TREATMENT_AREAS = [
  { id: 'neck', label: '首' },
  { id: 'shoulder', label: '肩' },
  { id: 'back', label: '背中' },
  { id: 'arm', label: '腕' },
  { id: 'leg', label: '脚' },
  { id: 'other', label: 'その他' },
] as const;

export const TREATMENT_METHODS = [
  { id: 'massage', label: 'マッサージ' },
  { id: 'stretching', label: 'ストレッチ' },
  { id: 'taping', label: 'テーピング' },
  { id: 'other', label: 'その他' },
] as const;

export const PAIN_LEVELS = [
  { value: 1, label: '軽度' },
  { value: 2, label: 'やや軽度' },
  { value: 3, label: '中度' },
  { value: 4, label: 'やや重度' },
  { value: 5, label: '重度' },
] as const; 