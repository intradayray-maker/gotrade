import { POST as linkAlpaca } from "@/app/api/alpaca/link/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  return linkAlpaca(req);
}
