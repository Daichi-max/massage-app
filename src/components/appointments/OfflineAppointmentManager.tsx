'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';
import { AppointmentForm } from './AppointmentForm';

interface OfflineAppointmentManagerProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  patients: Patient[];
  onAddAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent'>) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
}

const OFFLINE_STORAGE_KEY = 'offline_appointments';

export const OfflineAppointmentManager = ({
  appointments,
  practitioners,
  patients,
  onAddAppointment,
  onEditAppointment,
  onCancelAppointment,
}: OfflineAppointmentManagerProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineAppointments, setOfflineAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);

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

  // オフライン時の予約データの保存と読み込み
  useEffect(() => {
    if (!isOnline) {
      const storedAppointments = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (storedAppointments) {
        setOfflineAppointments(JSON.parse(storedAppointments));
      }
    } else {
      // オンライン復帰時にオフラインで保存された予約を同期
      const storedAppointments = localStorage.getItem(OFFLINE_STORAGE_KEY);
      if (storedAppointments) {
        const offlineData = JSON.parse(storedAppointments);
        offlineData.forEach((appointment: Appointment) => {
          onAddAppointment(appointment);
        });
        localStorage.removeItem(OFFLINE_STORAGE_KEY);
        setOfflineAppointments([]);
      }
    }
  }, [isOnline, onAddAppointment]);

  const handleAddOfflineAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent'>) => {
    const newAppointment = {
      ...data,
      id: `offline-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reminderSent: false,
    };

    const updatedAppointments = [...offlineAppointments, newAppointment];
    setOfflineAppointments(updatedAppointments);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedAppointments));
    setShowForm(false);
  };

  const displayedAppointments = isOnline ? appointments : offlineAppointments;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium text-gray-900">予約管理</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isOnline ? 'オンライン' : 'オフライン'}
          </span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          新規予約
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="space-y-4">
          {displayedAppointments.map((appointment) => (
            <div key={appointment.id} className="border-b pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {appointment.date} {appointment.startTime} - {appointment.endTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    {patients.find(p => p.id === appointment.patientId)?.lastName} {patients.find(p => p.id === appointment.patientId)?.firstName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {practitioners.find(p => p.id === appointment.practitionerId)?.firstName} {practitioners.find(p => p.id === appointment.practitionerId)?.lastName}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditAppointment(appointment)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => onCancelAppointment(appointment)}
                    className="text-red-600 hover:text-red-900"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">新規予約</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AppointmentForm
              practitioners={practitioners}
              patient={patients[0]}
              onSubmit={isOnline ? onAddAppointment : handleAddOfflineAppointment}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 