'use client';

import React, { useState, useEffect } from 'react';
import { TreatmentRecord, TREATMENT_AREAS, TREATMENT_METHODS, PAIN_LEVELS } from '@/types/treatment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';
import { FEE_TABLE } from '@/types/treatment';

interface TreatmentFormMobileProps {
  initialData?: Partial<TreatmentRecord>;
  practitioners: Practitioner[];
  patient: Patient;
  onSubmit: (data: Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalFee' | 'patientCopayment'>) => void;
  onOfflineSave: (data: Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalFee' | 'patientCopayment'>) => void;
}

export const TreatmentFormMobile = ({
  initialData,
  practitioners,
  patient,
  onSubmit,
  onOfflineSave,
}: TreatmentFormMobileProps) => {
  const [formData, setFormData] = useState<{
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
    notes: string;
  }>({
    practitionerId: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    treatmentType: 'single',
    treatmentAreas: {
      neck: false,
      shoulder: false,
      back: false,
      arm: false,
      leg: false,
    },
    treatmentMethods: {
      massage: false,
      stretching: false,
      taping: false,
    },
    painLevel: 1,
    localCount: 0,
    isHotCompress: false,
    isHotElectric: false,
    isManualTherapy: false,
    treatmentCount: 1,
    isElectrotherapy: false,
    isFirstVisit: false,
    firstVisitFee: 0,
    notes: '',
  });

  const [totalFee, setTotalFee] = useState(0);
  const [patientCopayment, setPatientCopayment] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    calculateFees();
  }, [formData, patient.copaymentRate]);

  const calculateFees = () => {
    let fee = 0;

    // 局所数による基本料金
    fee += FEE_TABLE.localCount[formData.localCount as keyof typeof FEE_TABLE.localCount];

    // 温罨法
    if (formData.isHotCompress) {
      fee += FEE_TABLE.hotCompress[1];
    }

    // 温＋電気光線
    if (formData.isHotElectric) {
      fee += FEE_TABLE.hotElectric[1];
    }

    // 変形徒手
    if (formData.isManualTherapy) {
      fee += FEE_TABLE.manualTherapy[formData.localCount as keyof typeof FEE_TABLE.manualTherapy] || 0;
    }

    // 術数
    fee += FEE_TABLE.treatmentCount[formData.treatmentCount as keyof typeof FEE_TABLE.treatmentCount];

    // 電療
    if (formData.isElectrotherapy) {
      fee += FEE_TABLE.electrotherapy;
    }

    // 訪問施術料
    fee += FEE_TABLE.visit;

    // 初検料
    let firstVisitFee = 0;
    if (formData.isFirstVisit) {
      firstVisitFee = formData.treatmentCount === 2
        ? FEE_TABLE.firstVisit.combined
        : FEE_TABLE.firstVisit.single;
      fee += firstVisitFee;
    }

    setTotalFee(fee);
    setPatientCopayment(Math.floor(fee * patient.copaymentRate));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const treatmentData: Omit<TreatmentRecord, "id" | "createdAt" | "updatedAt" | "totalFee" | "patientCopayment"> = {
        patientId: patient.id,
        practitionerId: formData.practitionerId,
        date: formData.date,
        time: formData.time,
        treatmentType: formData.treatmentType,
        treatmentAreas: formData.treatmentAreas,
        treatmentMethods: formData.treatmentMethods,
        painLevel: formData.painLevel,
        localCount: formData.localCount,
        isHotCompress: formData.isHotCompress,
        isHotElectric: formData.isHotElectric,
        isManualTherapy: formData.isManualTherapy,
        treatmentCount: formData.treatmentCount,
        isElectrotherapy: formData.isElectrotherapy,
        isFirstVisit: formData.isFirstVisit,
        firstVisitFee: formData.firstVisitFee,
        copaymentRate: patient.insuranceType === 'health' ? 0.3 : 0.1,
        notes: formData.notes,
      };

      if (isOnline) {
        await onSubmit(treatmentData);
      } else {
        // オフライン時の処理
        const offlineData = {
          ...treatmentData,
          status: 'pending' as const,
          synced: false,
        };
        await onSubmit(offlineData);
      }
    } catch (error) {
      console.error('Error submitting treatment record:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="sticky top-0 bg-white p-4 shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">施術記録</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOnline ? 'オンライン' : 'オフライン'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="practitionerId" className="block text-sm font-medium text-gray-700">
            担当施術者 *
          </label>
          <select
            id="practitionerId"
            name="practitionerId"
            required
            value={formData.practitionerId}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">選択してください</option>
            {practitioners.map((practitioner) => (
              <option key={practitioner.id} value={practitioner.id}>
                {practitioner.firstName} {practitioner.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            施術日 *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="localCount" className="block text-sm font-medium text-gray-700">
            局所数 *
          </label>
          <select
            id="localCount"
            name="localCount"
            required
            value={formData.localCount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {[1, 2, 3, 4, 5].map((count) => (
              <option key={count} value={count}>
                {count}局所
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">治療部位</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {TREATMENT_AREAS.map((area) => (
              <label key={area.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.treatmentAreas[area.id as keyof typeof formData.treatmentAreas] as boolean}
                  onChange={(e) => {
                    const newAreas = { ...formData.treatmentAreas };
                    (newAreas[area.id as keyof typeof newAreas] as boolean) = e.target.checked;
                    setFormData({ ...formData, treatmentAreas: newAreas });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">{area.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">施術方法</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {TREATMENT_METHODS.map((method) => (
              <label key={method.id} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.treatmentMethods[method.id as keyof typeof formData.treatmentMethods] as boolean}
                  onChange={(e) => {
                    const newMethods = { ...formData.treatmentMethods };
                    (newMethods[method.id as keyof typeof newMethods] as boolean) = e.target.checked;
                    setFormData({ ...formData, treatmentMethods: newMethods });
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">{method.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">痛みの程度</label>
          <div className="mt-1 grid grid-cols-5 gap-2">
            {PAIN_LEVELS.map((level) => (
              <label key={level.value} className="inline-flex items-center">
                <input
                  type="radio"
                  value={level.value}
                  checked={formData.painLevel === level.value}
                  onChange={() => setFormData({ ...formData, painLevel: level.value })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="treatmentCount" className="block text-sm font-medium text-gray-700">
            術数 *
          </label>
          <select
            id="treatmentCount"
            name="treatmentCount"
            required
            value={formData.treatmentCount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={1}>1術</option>
            <option value={2}>2術 (+{FEE_TABLE.treatmentCount[2]}円)</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            備考
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="text-sm font-medium text-gray-900">料金計算</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-700">
              局所数（{formData.localCount}局所）: {FEE_TABLE.localCount[formData.localCount as keyof typeof FEE_TABLE.localCount]}円
            </p>
            {formData.isHotCompress && (
              <p className="text-sm text-gray-700">
                温罨法: +{FEE_TABLE.hotCompress[1]}円
              </p>
            )}
            {formData.isHotElectric && (
              <p className="text-sm text-gray-700">
                温＋電気光線: +{FEE_TABLE.hotElectric[1]}円
              </p>
            )}
            {formData.isManualTherapy && (
              <p className="text-sm text-gray-700">
                変形徒手: +{FEE_TABLE.manualTherapy[formData.localCount as keyof typeof FEE_TABLE.manualTherapy] || 0}円
              </p>
            )}
            {formData.treatmentCount === 2 && (
              <p className="text-sm text-gray-700">
                2術: +{FEE_TABLE.treatmentCount[2]}円
              </p>
            )}
            {formData.isElectrotherapy && (
              <p className="text-sm text-gray-700">
                電療: +{FEE_TABLE.electrotherapy}円
              </p>
            )}
            <p className="text-sm text-gray-700">
              訪問施術料: {FEE_TABLE.visit}円
            </p>
            {formData.isFirstVisit && (
              <p className="text-sm text-gray-700">
                初検料: +{formData.treatmentCount === 2
                  ? FEE_TABLE.firstVisit.combined
                  : FEE_TABLE.firstVisit.single}円
              </p>
            )}
            <p className="mt-2 text-lg font-medium text-gray-900">
              合計: {totalFee.toLocaleString()}円
            </p>
            <p className="text-sm text-gray-700">
              保険負担割合: {patient.copaymentRate * 100}割
            </p>
            <p className="text-sm text-gray-700">
              自己負担額: {patientCopayment.toLocaleString()}円
            </p>
            <p className="text-sm font-medium text-blue-600">
              保険請求額: {(totalFee - patientCopayment).toLocaleString()}円
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {isOnline ? '登録' : 'オフライン保存'}
        </button>
      </div>
    </form>
  );
}; 