import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 施術者一覧の取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 特定の施術者情報を取得
      const practitioner = await db.practitioner.findUnique({
        where: { id },
        include: {
          treatments: {
            orderBy: { date: 'desc' },
            take: 5, // 直近5件の施術記録を取得
          },
        },
      });

      if (!practitioner) {
        return NextResponse.json({ error: '施術者が見つかりません' }, { status: 404 });
      }

      return NextResponse.json(practitioner);
    }

    // 施術者一覧を取得
    const practitioners = await db.practitioner.findMany({
      orderBy: { lastName: 'asc' },
    });

    return NextResponse.json(practitioners);
  } catch (error) {
    console.error('Error fetching practitioners:', error);
    return NextResponse.json(
      { error: '施術者情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 施術者情報の作成
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const practitioner = await db.practitioner.create({
      data,
    });

    return NextResponse.json(practitioner);
  } catch (error) {
    console.error('Error creating practitioner:', error);
    return NextResponse.json(
      { error: '施術者情報の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// 施術者情報の更新
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    const practitioner = await db.practitioner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(practitioner);
  } catch (error) {
    console.error('Error updating practitioner:', error);
    return NextResponse.json(
      { error: '施術者情報の更新に失敗しました' },
      { status: 500 }
    );
  }
} 