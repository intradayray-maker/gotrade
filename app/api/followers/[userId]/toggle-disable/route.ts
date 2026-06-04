import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(
  _req: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    // Fetch current enabled state
    const { data, error } = await supabaseAdmin
      .from('copy_trading_settings')
      .select('is_enabled')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      throw new Error('Follower not found');
    }

    const newState = !data.is_enabled;

    // Update to the opposite state
    await supabaseAdmin
      .from('copy_trading_settings')
      .update({ is_enabled: newState })
      .eq('user_id', userId);

    return NextResponse.json({
      success: true,
      action: 'toggle-disable',
      userId,
      is_enabled: newState
    });
  } catch (err) {
    console.error('toggle-disable error', err);

    return NextResponse.json(
      { success: false, error: 'Failed to toggle follower state' },
      { status: 500 }
    );
  }
}
