'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleNewPatient = () => {
    router.push('/patients/new');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          訪問マッサージ管理システム
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          お客様の健康管理から予約・請求まで、すべてを一括で管理できるアプリです。
        </p>
        <div className="space-y-4">
          <button
            onClick={handleNewPatient}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            新規患者登録
          </button>
          <div>
            <Link
              href="/patients"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              患者一覧へ →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 