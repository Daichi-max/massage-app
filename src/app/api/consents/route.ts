import { NextResponse } from 'next/server';
import { Consent, ConsentStatus, ConsentNotification } from '@/types/consent';

// 仮のデータストア（実際の実装ではデータベースを使用）
let consents: Consent[] = [];
let notifications: ConsentNotification[] = [];

// 同意書の状態を更新する関数
const updateConsentStatus = (consent: Consent) => {
  const today = new Date();
  const expirationDate = new Date(consent.expirationDate);
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiration < 0) {
    return ConsentStatus.EXPIRED;
  } else if (daysUntilExpiration <= 30) {
    return ConsentStatus.EXPIRING_SOON;
  } else {
    return ConsentStatus.ACTIVE;
  }
};

// 通知を作成する関数
const createNotification = (consent: Consent, type: 'EXPIRING_SOON' | 'EXPIRED') => {
  const notification: ConsentNotification = {
    id: Math.random().toString(36).substr(2, 9),
    consentId: consent.id,
    patientId: consent.patientId,
    practitionerId: consent.practitionerId,
    notificationType: type,
    message: type === 'EXPIRING_SOON'
      ? `患者ID: ${consent.patientId} の同意書の有効期限が30日以内に切れます。`
      : `患者ID: ${consent.patientId} の同意書の有効期限が切れました。`,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notification);
};

// 同意書一覧を取得
export async function GET() {
  // 同意書の状態を更新
  consents = consents.map(consent => {
    const newStatus = updateConsentStatus(consent);
    if (newStatus !== consent.status) {
      if (newStatus === ConsentStatus.EXPIRING_SOON) {
        createNotification(consent, 'EXPIRING_SOON');
      } else if (newStatus === ConsentStatus.EXPIRED) {
        createNotification(consent, 'EXPIRED');
      }
      return { ...consent, status: newStatus };
    }
    return consent;
  });

  return NextResponse.json({ consents, notifications });
}

// 同意書を登録
export async function POST(request: Request) {
  const data = await request.json();
  const newConsent: Consent = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    status: updateConsentStatus(data),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  consents.push(newConsent);

  return NextResponse.json(newConsent);
}

// 同意書を更新
export async function PUT(request: Request) {
  const data = await request.json();
  const index = consents.findIndex(c => c.id === data.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Consent not found' }, { status: 404 });
  }

  const updatedConsent: Consent = {
    ...consents[index],
    ...data,
    status: updateConsentStatus(data),
    updatedAt: new Date().toISOString(),
  };
  consents[index] = updatedConsent;

  return NextResponse.json(updatedConsent);
}

// 通知を既読にする
export async function PATCH(request: Request) {
  const { notificationId } = await request.json();
  const notification = notifications.find(n => n.id === notificationId);
  if (!notification) {
    return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
  }

  notification.isRead = true;
  return NextResponse.json(notification);
} 