export interface Consent {
  id: string;
  patientId: string;
  practitionerId: string;
  issueDate: string;
  expirationDate: string;
  doctorName: string;
  hospitalName: string;
  status: ConsentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum ConsentStatus {
  ACTIVE = 'ACTIVE',
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
}

export interface ConsentNotification {
  id: string;
  consentId: string;
  patientId: string;
  practitionerId: string;
  notificationType: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  EXPIRING_SOON = 'EXPIRING_SOON',
  EXPIRED = 'EXPIRED'
} 