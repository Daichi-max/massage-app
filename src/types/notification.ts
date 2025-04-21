export interface Notification {
  id: string;
  type: 'appointment_reminder' | 'payment_reminder' | 'system';
  recipientId: string;
  recipientType: 'patient' | 'practitioner';
  title: string;
  message: string;
  scheduledTime: string;
  sent: boolean;
  deliveryMethod: 'email' | 'sms' | 'push';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: 'appointment_reminder' | 'payment_reminder' | 'system';
  title: string;
  message: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: string;
  userId: string;
  userType: 'patient' | 'practitioner';
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  paymentReminders: boolean;
  systemNotifications: boolean;
  createdAt: string;
  updatedAt: string;
} 