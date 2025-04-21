'use client';

import React, { useState } from 'react';
import { InsuranceClaim } from '@/types/billing';
import { TreatmentRecord } from '@/types/treatment';
import { Patient } from '@/types/patient';
import { Practitioner } from '@/types/practitioner';

interface InsuranceClaimFormProps {
  initialData?: Partial<InsuranceClaim>;
  treatment: TreatmentRecord;
  patient: Patient;
  practitioner: Practitioner;
  onSubmit: (data: Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const InsuranceClaimForm = ({
  initialData,
  treatment,
  patient,
  practitioner,
  onSubmit,
}: InsuranceClaimFormProps) => {
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || patient.id,
    practitionerId: initialData?.practitionerId || practitioner.id,
    claimDate: initialData?.claimDate || new Date().toISOString().split('T')[0],
    treatmentDate: initialData?.treatmentDate || treatment.date,
    totalAmount: initialData?.totalAmount || treatment.totalFee,
    insuranceAmount: initialData?.insuranceAmount || Math.floor(treatment.totalFee * (1 - patient.copaymentRate)),
    patientCopayment: initialData?.patientCopayment || treatment.patientCopayment,
    status: initialData?.status || 'pending',
    claimNumber: initialData?.claimNumber || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="claimDate" className="block text-sm font-medium text-gray-700">
            請求日 *
          </label>
          <input
            type="date"
            id="claimDate"
            name="claimDate"
            required
            value={formData.claimDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="treatmentDate" className="block text-sm font-medium text-gray-700">
            施術日 *
          </label>
          <input
            type="date"
            id="treatmentDate"
            name="treatmentDate"
            required
            value={formData.treatmentDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
            合計金額 *
          </label>
          <input
            type="number"
            id="totalAmount"
            name="totalAmount"
            required
            value={formData.totalAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="insuranceAmount" className="block text-sm font-medium text-gray-700">
            保険給付額 *
          </label>
          <input
            type="number"
            id="insuranceAmount"
            name="insuranceAmount"
            required
            value={formData.insuranceAmount}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="patientCopayment" className="block text-sm font-medium text-gray-700">
            自己負担額 *
          </label>
          <input
            type="number"
            id="patientCopayment"
            name="patientCopayment"
            required
            value={formData.patientCopayment}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="claimNumber" className="block text-sm font-medium text-gray-700">
          請求番号
        </label>
        <input
          type="text"
          id="claimNumber"
          name="claimNumber"
          value={formData.claimNumber}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          ステータス *
        </label>
        <select
          id="status"
          name="status"
          required
          value={formData.status}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="pending">未処理</option>
          <option value="submitted">提出済み</option>
          <option value="approved">承認済み</option>
          <option value="rejected">却下</option>
          <option value="paid">支払い済み</option>
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