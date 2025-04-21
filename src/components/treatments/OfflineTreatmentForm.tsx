'use client';

import React, { useState, useEffect } from 'react';
import { TreatmentRecord, TREATMENT_AREAS, TREATMENT_METHODS, PAIN_LEVELS } from '@/types/treatment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';

interface OfflineTreatmentFormProps {
  practitioners: Practitioner[];
  patient: Patient;
  onSubmit: (data: Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const OFFLINE_STORAGE_KEY = 'offline_treatments';

export const OfflineTreatmentForm = ({
  practitioners,
  patient,
  onSubmit,
}: OfflineTreatmentFormProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState<Omit<TreatmentRecord, 'id' | 'createdAt' | 'updatedAt'>>({
    patientId: patient.id,
    practitionerId: practitioners[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
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
    painLevel: 3,
  });

  // オンライン/オフライン状態の監視
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOnline) {
      onSubmit(formData);
    } else {
      // オフライン時のデータ保存
      const storedTreatments = localStorage.getItem(OFFLINE_STORAGE_KEY);
      const treatments = storedTreatments ? JSON.parse(storedTreatments) : [];
      treatments.push({
        ...formData,
        id: `offline-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(treatments));
      alert('オフラインで保存しました。オンライン時に自動的に同期されます。');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">施術者</label>
            <select
              value={formData.practitionerId}
              onChange={(e) => setFormData({ ...formData, practitionerId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {practitioners.map((practitioner) => (
                <option key={practitioner.id} value={practitioner.id}>
                  {practitioner.lastName} {practitioner.firstName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">施術日時</label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">施術タイプ</label>
            <div className="mt-1 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="single"
                  checked={formData.treatmentType === 'single'}
                  onChange={() => setFormData({ ...formData, treatmentType: 'single' })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">単独施術</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="combined"
                  checked={formData.treatmentType === 'combined'}
                  onChange={() => setFormData({ ...formData, treatmentType: 'combined' })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2">併用施術</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">施術部位</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              {TREATMENT_AREAS.map((area) => (
                <label key={area.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.treatmentAreas[area.id as keyof typeof formData.treatmentAreas]}
                    onChange={(e) => {
                      const newAreas = { ...formData.treatmentAreas };
                      newAreas[area.id as keyof typeof newAreas] = e.target.checked;
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
                    checked={formData.treatmentMethods[method.id as keyof typeof formData.treatmentMethods]}
                    onChange={(e) => {
                      const newMethods = { ...formData.treatmentMethods };
                      newMethods[method.id as keyof typeof newMethods] = e.target.checked;
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
            <label className="block text-sm font-medium text-gray-700">備考</label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            {isOnline ? '保存' : 'オフラインで保存'}
          </button>
        </div>
      </div>
    </form>
  );
}; 