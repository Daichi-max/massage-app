'use client';

import React, { useState, useEffect } from 'react';
import { TreatmentRecord, FEE_TABLE } from '@/types/treatment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';

interface TreatmentFormProps {
  initialData?: Partial<TreatmentRecord>;
  practitioners: Practitioner[];
  patient: Patient;
  onSubmit: (data: Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt' | 'totalFee' | 'patientCopayment'>) => void;
}

export const TreatmentForm = ({ initialData, practitioners, patient, onSubmit }: TreatmentFormProps) => {
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || patient.id,
    practitionerId: initialData?.practitionerId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    localCount: initialData?.localCount || 1,
    isHotCompress: initialData?.isHotCompress || false,
    isHotElectric: initialData?.isHotElectric || false,
    isManualTherapy: initialData?.isManualTherapy || false,
    treatmentCount: initialData?.treatmentCount || 1,
    isElectrotherapy: initialData?.isElectrotherapy || false,
    isFirstVisit: initialData?.isFirstVisit || !patient.firstVisitDate,
    notes: initialData?.notes || '',
  });

  const [totalFee, setTotalFee] = useState(0);
  const [patientCopayment, setPatientCopayment] = useState(0);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalFee,
      patientCopayment,
      copaymentRate: patient.copaymentRate,
      firstVisitFee: formData.isFirstVisit
        ? (formData.treatmentCount === 2
          ? FEE_TABLE.firstVisit.combined
          : FEE_TABLE.firstVisit.single)
        : 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
          患者ID *
        </label>
        <input
          type="text"
          id="patientId"
          name="patientId"
          required
          value={formData.patientId}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">追加施術</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isHotCompress"
            name="isHotCompress"
            checked={formData.isHotCompress}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isHotCompress" className="ml-2 block text-sm text-gray-900">
            温罨法 (+{FEE_TABLE.hotCompress[1]}円)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isHotElectric"
            name="isHotElectric"
            checked={formData.isHotElectric}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isHotElectric" className="ml-2 block text-sm text-gray-900">
            温＋電気光線 (+{FEE_TABLE.hotElectric[1]}円)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isManualTherapy"
            name="isManualTherapy"
            checked={formData.isManualTherapy}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isManualTherapy" className="ml-2 block text-sm text-gray-900">
            変形徒手 (+{FEE_TABLE.manualTherapy[formData.localCount as keyof typeof FEE_TABLE.manualTherapy] || 0}円)
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isElectrotherapy"
            name="isElectrotherapy"
            checked={formData.isElectrotherapy}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isElectrotherapy" className="ml-2 block text-sm text-gray-900">
            電療 (+{FEE_TABLE.electrotherapy}円)
          </label>
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
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {initialData ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
}; 