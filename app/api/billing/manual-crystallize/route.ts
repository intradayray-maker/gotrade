import { NextResponse } from "next/server";
import { POST as crystallize } from "@/app/api/fees/crystallize/route";

export async function POST(req: Request) {
  return crystallize(req);
}
