export type TreatmentType = 'massage' | 'acupuncture' | 'both';

export interface Pricing {
  localAreas: {
    [key: number]: number; // 局所数に対する施術料
  };
  treatments: {
    [key: number]: number; // 術数に対する施術料
  };
  additionalServices: {
    warmCompress: number; // 温罨法
    warmAndElectric: number; // 温＋電気光線
    manualTherapy: number; // 変形徒手
    electrotherapy: number; // 電療
  };
  visitFee: number; // 訪問施術料
} 