import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(
  _req: NextRequest,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  try {
    // 1. Follower settings
    const { data: settings } = await supabaseAdmin
      .from('copy_trading_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 2. Broker connection
    const { data: broker } = await supabaseAdmin
      .from('broker_connections')
      .select('*')
      .eq('user_id', userId)
      .single();

    // 3. Pending queue
    const { data: queue } = await supabaseAdmin
      .from('trade_queue')
      .select('*')
      .eq('follower_user_id', userId)
      .order('created_at', { ascending: false });

    // 4. Recent errors
    const { data: errors } = await supabaseAdmin
      .from('trade_errors')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // 5. Positions
    const { data: positions } = await supabaseAdmin
      .from('follower_positions')
      .select('*')
      .eq('follower_user_id', userId);

    // 6. Recent trades
    const { data: trades } = await supabaseAdmin
      .from('follower_trades')
      .select('*')
      .eq('follower_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({
      success: true,
      userId,
      settings,
      broker,
      queue,
      errors,
      positions,
      trades
    });
  } catch (err) {
    console.error('details error', err);

    return NextResponse.json(
      { success: false, error: 'Failed to load follower details' },
      { status: 500 }
    );
  }
}
