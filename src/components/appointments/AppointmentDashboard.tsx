'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';
import { AppointmentList } from './AppointmentList';
import { AppointmentForm } from './AppointmentForm';

interface AppointmentDashboardProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  patients: Patient[];
  onAddAppointment: (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'reminderSent'>) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointment: Appointment) => void;
}

export const AppointmentDashboard = ({
  appointments,
  practitioners,
  patients,
  onAddAppointment,
  onEditAppointment,
  onCancelAppointment,
}: AppointmentDashboardProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPractitioner, setSelectedPractitioner] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const filtered = appointments.filter(appointment => {
      const matchesDate = appointment.date === selectedDate;
      const matchesPractitioner = !selectedPractitioner || appointment.practitionerId === selectedPractitioner;
      const matchesStatus = selectedStatus === 'all' || appointment.status === selectedStatus;
      return matchesDate && matchesPractitioner && matchesStatus;
    });

    // 開始時間でソート
    filtered.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.startTime}`).getTime();
      const timeB = new Date(`2000-01-01T${b.startTime}`).getTime();
      return timeA - timeB;
    });

    setFilteredAppointments(filtered);
  }, [appointments, selectedDate, selectedPractitioner, selectedStatus]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handlePractitionerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPractitioner(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.lastName} ${patient.firstName}` : '不明';
  };

  const getPractitionerName = (id: string) => {
    const practitioner = practitioners.find(p => p.id === id);
    return practitioner ? `${practitioner.firstName} ${practitioner.lastName}` : '不明';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">予約管理</h2>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          新規予約
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            日付
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="practitioner" className="block text-sm font-medium text-gray-700">
            施術者
          </label>
          <select
            id="practitioner"
            value={selectedPractitioner}
            onChange={handlePractitionerChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">すべて</option>
            {practitioners.map((practitioner) => (
              <option key={practitioner.id} value={practitioner.id}>
                {practitioner.firstName} {practitioner.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            ステータス
          </label>
          <select
            id="status"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">すべて</option>
            <option value="scheduled">予約済み</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
            <option value="rescheduled">再予約</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {new Date(selectedDate).toLocaleDateString('ja-JP', { weekday: 'long', month: 'long', day: 'numeric' })}
            の予約一覧
          </h3>
          <AppointmentList
            appointments={filteredAppointments}
            practitioners={practitioners}
            patients={patients}
            onEdit={onEditAppointment}
            onCancel={onCancelAppointment}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">訪問予定地</h3>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const patient = patients.find(p => p.id === appointment.patientId);
              return (
                <div key={appointment.id} className="border-b pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {appointment.startTime} - {appointment.endTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getPatientName(appointment.patientId)}
                      </p>
                      {patient?.address && (
                        <p className="text-sm text-gray-500">
                          {patient.address}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status === 'scheduled' && '予約済み'}
                      {appointment.status === 'completed' && '完了'}
                      {appointment.status === 'cancelled' && 'キャンセル'}
                      {appointment.status === 'rescheduled' && '再予約'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
              patient={patients[0]} // 実際の使用時には適切な患者を選択する必要があります
              onSubmit={(data) => {
                onAddAppointment(data);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 