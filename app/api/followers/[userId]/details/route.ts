export async function GET(
  _req: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params

  return Response.json({ userId })
}

//test