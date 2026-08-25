import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveGameResult } from '@/lib/supabase';

const bodySchema = z.object({
  user_session_id: z.string().min(1),
  game_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scores: z.array(z.number().min(0).max(100)).min(1).max(3),
  final_score: z.number().min(0).max(100),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { data, error } = await saveGameResult(parsed.data);
  if (error) {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
