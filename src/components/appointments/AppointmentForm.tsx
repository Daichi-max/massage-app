'use client';

import React, { useState } from 'react';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  practitioners: Practitioner[];
  patient: Patient;
  onSubmit: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent'>) => void;
}

export const AppointmentForm = ({ initialData, practitioners, patient, onSubmit }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    patientId: initialData?.patientId || patient.id,
    practitionerId: initialData?.practitionerId || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '10:00',
    status: initialData?.status || 'scheduled',
    treatmentType: initialData?.treatmentType || 'single',
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
          予約日 *
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            開始時間 *
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            required
            value={formData.startTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            終了時間 *
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            required
            value={formData.endTime}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="treatmentType" className="block text-sm font-medium text-gray-700">
          施術タイプ *
        </label>
        <select
          id="treatmentType"
          name="treatmentType"
          required
          value={formData.treatmentType}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="single">単術</option>
          <option value="combined">複合</option>
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