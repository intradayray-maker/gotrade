import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(_req: NextRequest, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    await supabaseAdmin
      .from('broker_connections')
      .update({ updated_at: new Date().toISOString() })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      action: 'reconnect',
      userId
    });
  } catch (err) {
    console.error('reconnect error', err);

    return NextResponse.json(
      { success: false, error: 'Failed to update broker connection' },
      { status: 500 }
    );
  }
}
