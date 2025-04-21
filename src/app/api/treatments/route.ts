import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TreatmentRecord } from '@/types/treatment';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 初検料の判定
    const patient = await db.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      return NextResponse.json({ error: '患者が見つかりません' }, { status: 404 });
    }

    const isFirstVisit = !patient.firstVisitDate;
    const firstVisitFee = isFirstVisit
      ? data.treatmentCount === 2
        ? 2230 // 併用施術
        : 1950 // 単独施術
      : 0;

    // 料金計算
    const totalFee = calculateTotalFee({
      ...data,
      isFirstVisit,
      firstVisitFee,
    });

    const patientCopayment = Math.floor(totalFee * patient.copaymentRate);

    // 施術記録の作成
    const treatmentRecord = await db.treatmentRecord.create({
      data: {
        ...data,
        isFirstVisit,
        firstVisitFee,
        totalFee,
        patientCopayment,
        copaymentRate: patient.copaymentRate,
      },
    });

    // 初回来院の場合、患者情報を更新
    if (isFirstVisit) {
      await db.patient.update({
        where: { id: data.patientId },
        data: { firstVisitDate: data.date },
      });
    }

    return NextResponse.json(treatmentRecord);
  } catch (error) {
    console.error('Error creating treatment record:', error);
    return NextResponse.json(
      { error: '施術記録の作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    
    const treatments = await db.treatmentRecord.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { date: 'desc' },
      include: {
        patient: true,
        practitioner: true,
      },
    });

    return NextResponse.json(treatments);
  } catch (error) {
    console.error('Error fetching treatment records:', error);
    return NextResponse.json(
      { error: '施術記録の取得に失敗しました' },
      { status: 500 }
    );
  }
}

function calculateTotalFee(data: TreatmentRecord): number {
  let fee = 0;

  // 局所数による基本料金
  fee += data.localCount * 450;

  // 温罨法
  if (data.isHotCompress) {
    fee += 180;
  }

  // 温＋電気光線
  if (data.isHotElectric) {
    fee += 300;
  }

  // 変形徒手
  if (data.isManualTherapy) {
    fee += data.localCount * 470;
  }

  // 術数
  if (data.treatmentCount === 2) {
    fee += 1770;
  }

  // 電療
  if (data.isElectrotherapy) {
    fee += 100;
  }

  // 訪問施術料
  fee += 2300;

  // 初検料
  fee += data.firstVisitFee;

  return fee;
} 