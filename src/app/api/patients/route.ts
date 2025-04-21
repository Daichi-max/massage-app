import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 患者一覧の取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 特定の患者情報を取得
      const patient = await db.patient.findUnique({
        where: { id },
        include: {
          treatments: {
            orderBy: { date: 'desc' },
            take: 5, // 直近5件の施術記録を取得
          },
        },
      });

      if (!patient) {
        return NextResponse.json({ error: '患者が見つかりません' }, { status: 404 });
      }

      return NextResponse.json(patient);
    }

    // 患者一覧を取得
    const patients = await db.patient.findMany({
      orderBy: { lastName: 'asc' },
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: '患者情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 患者情報の作成
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 保険種類に応じて自己負担割合を設定
    const copaymentRate = data.insuranceType === 'health' ? 0.3 : 0.1;

    const patient = await db.patient.create({
      data: {
        ...data,
        copaymentRate,
      },
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: '患者情報の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// 患者情報の更新
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    // 保険種類が変更された場合、自己負担割合を更新
    if (updateData.insuranceType) {
      updateData.copaymentRate = updateData.insuranceType === 'health' ? 0.3 : 0.1;
    }

    const patient = await db.patient.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: '患者情報の更新に失敗しました' },
      { status: 500 }
    );
  }
} 