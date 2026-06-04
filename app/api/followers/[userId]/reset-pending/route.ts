import { NextResponse } from 'next/server';

type RouteContext = {
  params: {
    userId: string;
  };
};

export async function POST(_req: Request, context: RouteContext) {
  const { userId } = context.params;

  try {
    // TODO:
    // - Clear pendingQueue for this follower in your DB
    // - Optionally log / audit this action

    return NextResponse.json(
      {
        success: true,
        action: 'reset-pending',
        userId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('reset-pending error', error);

    return NextResponse.json(
      {
        success: false,
        action: 'reset-pending',
        userId,
        error: 'Failed to reset pending queue',
      },
      { status: 500 }
    );
  }
}
