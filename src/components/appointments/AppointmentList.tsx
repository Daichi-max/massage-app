'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';

interface AppointmentListProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  patients: Patient[];
  onEdit: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
}

export const AppointmentList = ({ appointments, practitioners, patients, onEdit, onCancel }: AppointmentListProps) => {
  const getPractitionerName = (id: string) => {
    const practitioner = practitioners.find(p => p.id === id);
    return practitioner ? `${practitioner.firstName} ${practitioner.lastName}` : '不明';
  };

  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.lastName} ${patient.firstName}` : '不明';
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              患者名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施術者
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              日時
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施術タイプ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              アクション
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPatientName(appointment.patientId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPractitionerName(appointment.practitionerId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(appointment.date).toLocaleDateString('ja-JP')}
                <br />
                {appointment.startTime} - {appointment.endTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {appointment.treatmentType === 'single' ? '単術' : '複合'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                  {appointment.status === 'scheduled' && '予約済み'}
                  {appointment.status === 'completed' && '完了'}
                  {appointment.status === 'cancelled' && 'キャンセル'}
                  {appointment.status === 'rescheduled' && '再予約'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onEdit(appointment)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編集
                </button>
                <button
                  onClick={() => onCancel(appointment)}
                  className="text-red-600 hover:text-red-900"
                >
                  キャンセル
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 