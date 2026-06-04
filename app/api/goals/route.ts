import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

type GoalsPayload = {
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  requiredBalance: number;
};

const goalsPath = path.join(process.cwd(), "data", "goals.json");

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeGoals(value: unknown): GoalsPayload {
  const raw = (value ?? {}) as Record<string, unknown>;
  const monthlyIncomeGoal = toNumber(raw.monthlyIncomeGoal ?? raw.monthlyGoal);
  const annualIncomeGoal =
    toNumber(raw.annualIncomeGoal ?? raw.annualGoal) || monthlyIncomeGoal * 12;
  const requiredBalance = toNumber(raw.requiredBalance);

  return {
    monthlyIncomeGoal,
    annualIncomeGoal,
    requiredBalance,
  };
}

async function ensureGoalsFile() {
  const dataDir = path.dirname(goalsPath);
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(goalsPath);
  } catch {
    const defaults: GoalsPayload = {
      monthlyIncomeGoal: 0,
      annualIncomeGoal: 0,
      requiredBalance: 0,
    };
    await fs.writeFile(goalsPath, JSON.stringify(defaults, null, 2), "utf8");
  }
}

export async function GET() {
  try {
    await ensureGoalsFile();
    const raw = await fs.readFile(goalsPath, "utf8");
    const parsed = JSON.parse(raw);
    const data = normalizeGoals(parsed?.data ?? parsed);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("GET /api/goals failed:", error);
    return NextResponse.json(
      {
        data: {
          monthlyIncomeGoal: 0,
          annualIncomeGoal: 0,
          requiredBalance: 0,
        },
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureGoalsFile();
    const body = await req.json();
    const data = normalizeGoals(body?.data ?? body);

    await fs.writeFile(goalsPath, JSON.stringify(data, null, 2), "utf8");
    return NextResponse.json({ data });
  } catch (error) {
    console.error("POST /api/goals failed:", error);
    return NextResponse.json(
      {
        data: {
          monthlyIncomeGoal: 0,
          annualIncomeGoal: 0,
          requiredBalance: 0,
        },
      },
      { status: 200 }
    );
  }
}
