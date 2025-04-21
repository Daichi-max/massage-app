'use client';

import { useState } from 'react';
import { TreatmentType } from '@/types/pricing';
import { calculatePrice } from '@/utils/priceCalculator';

type IncomeCategory = 'general' | 'certain' | 'working';

interface CustomerInfo {
  age: number;
  incomeCategory: IncomeCategory;
}

export const PriceCalculatorForm = () => {
  const [treatmentType, setTreatmentType] = useState<TreatmentType>('massage');
  const [localAreas, setLocalAreas] = useState<number>(1);
  const [treatments, setTreatments] = useState<number>(2);
  const [additionalServices, setAdditionalServices] = useState({
    warmCompress: false,
    warmAndElectric: false,
    manualTherapy: false,
    electrotherapy: false,
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    age: 65,
    incomeCategory: 'general',
  });

  // 自己負担割合を計算
  const calculateCopaymentRate = (age: number, incomeCategory: IncomeCategory): number => {
    if (age >= 75) {
      switch (incomeCategory) {
        case 'working': return 0.3; // 3割
        case 'certain': return 0.2; // 2割
        default: return 0.1; // 1割
      }
    } else if (age >= 70) {
      return incomeCategory === 'working' ? 0.3 : 0.2; // 3割 or 2割
    }
    return 0.3; // 70歳未満は3割
  };

  const totalPrice = calculatePrice({
    treatmentType,
    localAreas,
    treatments,
    additionalServices,
  });

  const copaymentRate = calculateCopaymentRate(customerInfo.age, customerInfo.incomeCategory);
  const copaymentAmount = Math.floor(totalPrice * copaymentRate);
  const insuranceAmount = totalPrice - copaymentAmount;

  const handleAdditionalServiceChange = (service: keyof typeof additionalServices) => {
    setAdditionalServices(prev => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 顧客情報セクション */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">顧客情報</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年齢
            </label>
            <input
              type="number"
              value={customerInfo.age}
              onChange={(e) => setCustomerInfo(prev => ({
                ...prev,
                age: parseInt(e.target.value) || 0
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              max="120"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              所得区分
            </label>
            <select
              value={customerInfo.incomeCategory}
              onChange={(e) => setCustomerInfo(prev => ({
                ...prev,
                incomeCategory: e.target.value as IncomeCategory
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="general">一般</option>
              <option value="certain">一定以上所得</option>
              <option value="working">現役並み所得</option>
            </select>
          </div>
        </div>
      </div>

      {/* 施術内容セクション */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">施術内容</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              施術タイプ
            </label>
            <select
              value={treatmentType}
              onChange={(e) => setTreatmentType(e.target.value as TreatmentType)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="massage">マッサージ</option>
              <option value="acupuncture">はり</option>
              <option value="both">マッサージとはり</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              局所数
            </label>
            <select
              value={localAreas}
              onChange={(e) => setLocalAreas(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}局所
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              術数
            </label>
            <select
              value={treatments}
              onChange={(e) => setTreatments(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={2}>2術</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              追加サービス
            </label>
            <div className="space-y-2">
              {Object.entries(additionalServices).map(([service, checked]) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleAdditionalServiceChange(service as keyof typeof additionalServices)}
                    className="mr-2"
                  />
                  <span className="text-sm">
                    {service === 'warmCompress' && '温罨法'}
                    {service === 'warmAndElectric' && '温＋電気光線'}
                    {service === 'manualTherapy' && '変形徒手'}
                    {service === 'electrotherapy' && '電療'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 料金計算結果セクション */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">料金計算結果</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">施術料合計</span>
            <span className="font-medium">{totalPrice.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">自己負担割合</span>
            <span className="font-medium">{(copaymentRate * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">自己負担額</span>
            <span className="font-medium text-blue-600">{copaymentAmount.toLocaleString()}円</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">保険請求額</span>
            <span className="font-medium text-green-600">{insuranceAmount.toLocaleString()}円</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 