export interface Appointment {
  id: string;
  patientId: string;
  practitionerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  treatmentType: 'single' | 'combined';
  notes?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentReminder {
  id: string;
  appointmentId: string;
  reminderType: 'email' | 'sms';
  scheduledTime: string;
  sent: boolean;
  createdAt: string;
}

export interface AppointmentHistory {
  id: string;
  appointmentId: string;
  action: 'created' | 'updated' | 'cancelled' | 'rescheduled';
  previousData?: Partial<Appointment>;
  newData?: Partial<Appointment>;
  changedBy: string;
  createdAt: string;
} 