import React, { useState, useEffect } from 'react';
import { Patient } from '@/types/patient';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Patient) => void;
  onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  patient,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Patient>({
    id: '',
    firstName: '',
    lastName: '',
    kanaFirstName: '',
    kanaLastName: '',
    birthDate: '',
    gender: 'other',
    phoneNumber: '',
    address: '',
    insuranceType: 'medical',
    insuranceNumber: '',
    insuranceCardExpiryDate: '',
    firstVisitDate: '',
    copaymentRate: 0.3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          姓
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          名
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
          生年月日
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          性別
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </select>
      </div>

      <div>
        <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700">
          保険種別
        </label>
        <select
          id="insuranceType"
          name="insuranceType"
          value={formData.insuranceType}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="medical">医療保険</option>
          <option value="nursing">介護保険</option>
        </select>
      </div>

      <div>
        <label htmlFor="firstVisitDate" className="block text-sm font-medium text-gray-700">
          初診日
        </label>
        <input
          type="date"
          id="firstVisitDate"
          name="firstVisitDate"
          value={formData.firstVisitDate || ''}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="copaymentRate" className="block text-sm font-medium text-gray-700">
          保険負担率
        </label>
        <input
          type="number"
          id="copaymentRate"
          name="copaymentRate"
          value={formData.copaymentRate}
          onChange={handleChange}
          min="0"
          max="1"
          step="0.1"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          例：0.3 = 30%（3割負担）
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">保険証番号</label>
        <input
          type="text"
          name="insuranceNumber"
          value={formData.insuranceNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">保険証有効期限</label>
        <input
          type="date"
          name="insuranceCardExpiryDate"
          value={formData.insuranceCardExpiryDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {patient ? '更新' : '登録'}
        </button>
      </div>
    </form>
  );
}; 