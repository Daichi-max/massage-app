import { PRICING } from '@/constants/pricing';
import { TreatmentType } from '@/types/pricing';

interface CalculatePriceParams {
  treatmentType: TreatmentType;
  localAreas?: number;
  treatments?: number;
  additionalServices?: {
    warmCompress?: boolean;
    warmAndElectric?: boolean;
    manualTherapy?: boolean;
    electrotherapy?: boolean;
  };
}

export const calculatePrice = ({
  treatmentType,
  localAreas,
  treatments,
  additionalServices,
}: CalculatePriceParams): number => {
  let total = PRICING.visitFee;

  // 局所数による料金計算
  if (localAreas && PRICING.localAreas[localAreas]) {
    total += PRICING.localAreas[localAreas];
  }

  // 術数による料金計算
  if (treatments && PRICING.treatments[treatments]) {
    total += PRICING.treatments[treatments];
  }

  // 追加サービスによる料金計算
  if (additionalServices) {
    if (additionalServices.warmCompress) {
      total += PRICING.additionalServices.warmCompress;
    }
    if (additionalServices.warmAndElectric) {
      total += PRICING.additionalServices.warmAndElectric;
    }
    if (additionalServices.manualTherapy) {
      total += PRICING.additionalServices.manualTherapy;
    }
    if (additionalServices.electrotherapy) {
      total += PRICING.additionalServices.electrotherapy;
    }
  }

  return total;
}; 