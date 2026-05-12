import { NextResponse } from "next/server";
import { crystallizePerformanceFees } from "@/utils/trading/crystallizeFees";

export async function GET() {
  try {
    await crystallizePerformanceFees();

    return NextResponse.json({
      ok: true,
      message: "Performance fees crystallized successfully",
    });
  } catch (err) {
    console.error("Crystallization error:", err);

    return NextResponse.json(
      { ok: false, error: "Crystallization failed" },
      { status: 500 }
    );
  }
}
