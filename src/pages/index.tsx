import { PriceCalculatorForm } from '../components/PriceCalculatorForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          訪問マッサージ料金計算
        </h1>
        <PriceCalculatorForm />
      </div>
    </div>
  );
} 