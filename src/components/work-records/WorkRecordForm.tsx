'use client';

import React, { useState, FormEvent } from 'react';
import { Practitioner, WorkRecord } from '@/types/practitioner';

interface WorkRecordFormProps {
  practitioners: Practitioner[];
  initialData?: WorkRecord;
  onSubmit: (data: Omit<WorkRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const WorkRecordForm = ({ practitioners, initialData, onSubmit }: WorkRecordFormProps) => {
  const [formData, setFormData] = useState({
    practitionerId: initialData?.practitionerId || '',
    date: initialData?.date.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '17:00',
    location: initialData?.location || '',
    treatmentDetails: initialData?.treatmentDetails || '',
    salesAmount: initialData?.salesAmount || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date),
      salesAmount: Number(formData.salesAmount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          担当施術者
        </label>
        <select
          required
          value={formData.practitionerId}
          onChange={(e) => setFormData({ ...formData, practitionerId: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          {practitioners.map((practitioner) => (
            <option key={practitioner.id} value={practitioner.id}>
              {practitioner.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            施術日
          </label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            訪問先
          </label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            開始時間
          </label>
          <input
            type="time"
            required
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            終了時間
          </label>
          <input
            type="time"
            required
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          施術内容
        </label>
        <textarea
          required
          value={formData.treatmentDetails}
          onChange={(e) => setFormData({ ...formData, treatmentDetails: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          売上金額（円）
        </label>
        <input
          type="number"
          required
          min={0}
          step={100}
          value={formData.salesAmount}
          onChange={(e) => setFormData({ ...formData, salesAmount: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
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