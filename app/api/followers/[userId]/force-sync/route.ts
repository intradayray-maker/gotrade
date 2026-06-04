import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(_req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    await supabaseAdmin
      .from('sync_logs')
      .insert({
        context: 'force_sync',
        user_id: userId,
        error_message: null,
        payload: { requested_at: new Date().toISOString() }
      });

    return NextResponse.json({
      success: true,
      action: 'force-sync',
      userId
    });
  } catch (err) {
    console.error('force-sync error', err);

    return NextResponse.json(
      { success: false, error: 'Failed to enqueue sync job' },
      { status: 500 }
    );
  }
}
