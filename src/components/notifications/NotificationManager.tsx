'use client';

import React, { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { Notification, NotificationTemplate } from '@/types/notification';
import { Practitioner } from '@/types/practitioner';
import { Patient } from '@/types/patient';

interface NotificationManagerProps {
  appointments: Appointment[];
  practitioners: Practitioner[];
  patients: Patient[];
  templates: NotificationTemplate[];
  onSendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NotificationManager = ({
  appointments,
  practitioners,
  patients,
  templates,
  onSendNotification,
}: NotificationManagerProps) => {
  const [scheduledNotifications, setScheduledNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 予約のリマインダー通知をスケジュール
    const now = new Date();
    const upcomingAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
      const timeDiff = appointmentDate.getTime() - now.getTime();
      return timeDiff > 0 && timeDiff <= 40 * 60 * 1000; // 40分以内の予約
    });

    const newNotifications = upcomingAppointments.map(appointment => {
      const patient = patients.find(p => p.id === appointment.patientId);
      const practitioner = practitioners.find(p => p.id === appointment.practitionerId);
      const template = templates.find(t => t.type === 'appointment_reminder');

      if (!patient || !practitioner || !template) return null;

      const notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> = {
        type: 'appointment_reminder',
        recipientId: practitioner.id,
        recipientType: 'practitioner',
        title: template.title.replace('{patientName}', `${patient.lastName} ${patient.firstName}`),
        message: template.message
          .replace('{patientName}', `${patient.lastName} ${patient.firstName}`)
          .replace('{appointmentTime}', `${appointment.startTime} - ${appointment.endTime}`)
          .replace('{treatmentType}', appointment.treatmentType === 'single' ? '単術' : '複合'),
        scheduledTime: new Date().toISOString(),
        sent: false,
        deliveryMethod: 'sms',
      };

      return notification;
    }).filter((notification): notification is Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> => notification !== null);

    newNotifications.forEach(notification => {
      onSendNotification(notification);
    });
  }, [appointments, patients, practitioners, templates, onSendNotification]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">通知管理</h2>
      <div className="rounded-lg bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-900">予定された通知</h3>
        <div className="mt-2 space-y-2">
          {scheduledNotifications.map(notification => (
            <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded-md">
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-sm text-gray-500">{notification.message}</p>
                <p className="text-xs text-gray-400">
                  送信予定: {new Date(notification.scheduledTime).toLocaleString('ja-JP')}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                notification.sent ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {notification.sent ? '送信済み' : '送信待ち'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 