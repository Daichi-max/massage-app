'use client';

import React, { useState } from 'react';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';

interface BulkEditAppointmentsProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  onBulkUpdate: (updates: Partial<Appointment>[]) => void;
}

export const BulkEditAppointments = ({
  appointments,
  practitioners,
  onBulkUpdate,
}: BulkEditAppointmentsProps) => {
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [updates, setUpdates] = useState<Partial<Appointment>>({
    practitionerId: '',
    status: 'scheduled',
  });

  const handleSelectAppointment = (appointmentId: string) => {
    setSelectedAppointments((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdates((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulkUpdate = () => {
    const appointmentUpdates = selectedAppointments.map((id) => ({
      id,
      ...updates,
    }));
    onBulkUpdate(appointmentUpdates);
    setSelectedAppointments([]);
    setUpdates({ practitionerId: '', status: 'scheduled' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <select
          name="practitionerId"
          value={updates.practitionerId}
          onChange={handleUpdateChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">施術者を選択</option>
          {practitioners.map((practitioner) => (
            <option key={practitioner.id} value={practitioner.id}>
              {practitioner.firstName} {practitioner.lastName}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={updates.status}
          onChange={handleUpdateChange}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="scheduled">予約済み</option>
          <option value="completed">完了</option>
          <option value="cancelled">キャンセル</option>
          <option value="rescheduled">再予約</option>
        </select>

        <button
          onClick={handleBulkUpdate}
          disabled={selectedAppointments.length === 0}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-gray-400"
        >
          一括更新
        </button>
      </div>

      <div className="space-y-2">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedAppointments.includes(appointment.id)}
              onChange={() => handleSelectAppointment(appointment.id)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-900">
              {appointment.date} {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 