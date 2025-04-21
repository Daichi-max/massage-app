'use client';

import React from 'react';
import { InsuranceClaim } from '@/types/billing';
import { Patient } from '@/types/patient';
import { Practitioner } from '@/types/practitioner';

interface InsuranceClaimListProps {
  claims: InsuranceClaim[];
  patients: Patient[];
  practitioners: Practitioner[];
  onEdit: (claim: InsuranceClaim) => void;
  onDelete: (claim: InsuranceClaim) => void;
}

export const InsuranceClaimList = ({
  claims,
  patients,
  practitioners,
  onEdit,
  onDelete,
}: InsuranceClaimListProps) => {
  const getPatientName = (id: string) => {
    const patient = patients.find(p => p.id === id);
    return patient ? `${patient.lastName} ${patient.firstName}` : '不明';
  };

  const getPractitionerName = (id: string) => {
    const practitioner = practitioners.find(p => p.id === id);
    return practitioner ? `${practitioner.firstName} ${practitioner.lastName}` : '不明';
  };

  const getStatusColor = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: InsuranceClaim['status']) => {
    switch (status) {
      case 'pending':
        return '未処理';
      case 'submitted':
        return '提出済み';
      case 'approved':
        return '承認済み';
      case 'rejected':
        return '却下';
      case 'paid':
        return '支払い済み';
      default:
        return '不明';
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
              請求日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              施術日
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              合計金額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              保険給付額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              自己負担額
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
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPatientName(claim.patientId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getPractitionerName(claim.practitionerId)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(claim.claimDate).toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(claim.treatmentDate).toLocaleDateString('ja-JP')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {claim.totalAmount.toLocaleString()}円
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {claim.insuranceAmount.toLocaleString()}円
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {claim.patientCopayment.toLocaleString()}円
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(claim.status)}`}>
                  {getStatusText(claim.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={() => onEdit(claim)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  編集
                </button>
                <button
                  onClick={() => onDelete(claim)}
                  className="text-red-600 hover:text-red-900"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 