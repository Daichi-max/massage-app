'use client';

import React, { useState } from 'react';
import { Practitioner, EmploymentType, SalarySystem } from '@/types/practitioner';

interface PractitionerFormProps {
  initialData?: Partial<Practitioner>;
  onSubmit: (data: Omit<Practitioner, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const PractitionerForm = ({ initialData, onSubmit }: PractitionerFormProps) => {
  const initialFormData = {
    name: initialData?.name || '',
    email: initialData?.email || '',
    phoneNumber: initialData?.phoneNumber || '',
    affiliation: initialData?.affiliation || '',
    employmentType: initialData?.employmentType || 'contractor' as EmploymentType,
    salarySystem: initialData?.salarySystem || 'fixed' as SalarySystem,
    compensation: initialData?.compensation || 0,
    specialties: initialData?.specialties || []
  };

  const [formData, setFormData] = useState<Omit<Practitioner, 'id' | 'createdAt' | 'updatedAt'>>(initialFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          名前 *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          電話番号 *
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          required
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="affiliation" className="block text-sm font-medium text-gray-700">
          所属 *
        </label>
        <input
          type="text"
          id="affiliation"
          name="affiliation"
          required
          value={formData.affiliation}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          給与体系
        </label>
        <select
          value={formData.salarySystem}
          onChange={(e) => setFormData({ ...formData, salarySystem: e.target.value as SalarySystem })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="fixed">固定給</option>
          <option value="commission">歩合制</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {formData.salarySystem === 'fixed' ? '月額固定給（円）' : '歩合率（%）'}
        </label>
        <input
          type="number"
          required
          min={0}
          step={formData.salarySystem === 'fixed' ? 1000 : 0.1}
          value={formData.compensation}
          onChange={(e) => setFormData({ ...formData, compensation: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
          専門分野 *
        </label>
        <select
          id="specialties"
          name="specialties"
          multiple
          required
          value={formData.specialties}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setFormData(prev => ({ ...prev, specialties: selectedOptions }));
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="massage">マッサージ</option>
          <option value="acupuncture">鍼灸</option>
          <option value="chiropractic">整体</option>
          <option value="physiotherapy">理学療法</option>
        </select>
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