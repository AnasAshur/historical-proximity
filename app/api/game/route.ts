import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGameForDate } from '@/lib/gameData';
import { getTodayET } from '@/lib/utils';

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ date: searchParams.get('date') ?? undefined });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }

  const date = parsed.data.date ?? getTodayET();
  const game = getGameForDate(date);

  if (!game) {
    return NextResponse.json({ error: 'No game found for this date' }, { status: 404 });
  }

  return NextResponse.json(game);
}
