'use client';

import React, { useState } from 'react';
import { Consent } from '@/types/consent';
import { Practitioner } from '@/types/practitioner';

interface ConsentFormProps {
  initialData?: Partial<Consent>;
  practitioners: Practitioner[];
  onSubmit: (data: Omit<Consent, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

export const ConsentForm = ({ initialData, practitioners, onSubmit }: ConsentFormProps) => {
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || '',
    practitionerId: initialData?.practitionerId || '',
    issueDate: initialData?.issueDate || new Date().toISOString().split('T')[0],
    expirationDate: initialData?.expirationDate || '',
    doctorName: initialData?.doctorName || '',
    hospitalName: initialData?.hospitalName || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
          発行日 *
        </label>
        <input
          type="date"
          id="issueDate"
          name="issueDate"
          required
          value={formData.issueDate}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
          有効期限 *
        </label>
        <input
          type="date"
          id="expirationDate"
          name="expirationDate"
          required
          value={formData.expirationDate}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">
          医師名 *
        </label>
        <input
          type="text"
          id="doctorName"
          name="doctorName"
          required
          value={formData.doctorName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700">
          病院名 *
        </label>
        <input
          type="text"
          id="hospitalName"
          name="hospitalName"
          required
          value={formData.hospitalName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
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