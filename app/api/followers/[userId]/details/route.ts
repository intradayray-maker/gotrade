export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params

  return Response.json({ userId })
}
