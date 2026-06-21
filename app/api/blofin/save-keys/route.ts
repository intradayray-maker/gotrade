import { POST as linkBlofin } from "@/app/api/blofin/link/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return linkBlofin(req);
}
