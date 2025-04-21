'use client';

import React, { useEffect, useState } from 'react';
import { Consent, ConsentStatus, ConsentNotification } from '@/types/consent';
import { Practitioner } from '@/types/practitioner';

interface ConsentListProps {
  consents: Consent[];
  practitioners: Practitioner[];
  notifications: ConsentNotification[];
  onUpdateConsent: (consent: Consent) => void;
  onMarkNotificationAsRead: (notificationId: string) => void;
}

export const ConsentList = ({
  consents,
  practitioners,
  notifications,
  onUpdateConsent,
  onMarkNotificationAsRead,
}: ConsentListProps) => {
  const [filteredConsents, setFilteredConsents] = useState<Consent[]>(consents);
  const [statusFilter, setStatusFilter] = useState<ConsentStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredConsents(consents);
    } else {
      setFilteredConsents(consents.filter(consent => consent.status === statusFilter));
    }
  }, [consents, statusFilter]);

  const getStatusBadge = (status: ConsentStatus) => {
    switch (status) {
      case ConsentStatus.ACTIVE:
        return <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">有効</span>;
      case ConsentStatus.EXPIRING_SOON:
        return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20">期限間近</span>;
      case ConsentStatus.EXPIRED:
        return <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">期限切れ</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">同意書一覧</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ConsentStatus | 'ALL')}
          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="ALL">すべて</option>
          <option value={ConsentStatus.ACTIVE}>有効</option>
          <option value={ConsentStatus.EXPIRING_SOON}>期限間近</option>
          <option value={ConsentStatus.EXPIRED}>期限切れ</option>
        </select>
      </div>

      {notifications.length > 0 && (
        <div className="rounded-lg bg-yellow-50 p-4">
          <h3 className="text-sm font-medium text-yellow-800">通知</h3>
          <div className="mt-2 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
              >
                <p className="text-sm text-gray-700">{notification.message}</p>
                <button
                  onClick={() => onMarkNotificationAsRead(notification.id)}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
                >
                  既読にする
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                患者ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                担当施術者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                発行日
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                有効期限
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                医師名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                病院名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredConsents.map((consent) => {
              const practitioner = practitioners.find(p => p.id === consent.practitionerId);
              return (
                <tr key={consent.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consent.patientId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {practitioner ? `${practitioner.firstName} ${practitioner.lastName}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(consent.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(consent.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consent.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {consent.hospitalName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(consent.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => onUpdateConsent(consent)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 