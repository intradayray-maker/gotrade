export type GoalDataInput = {
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  expectedMonthlyReturnPct: number;
  currentBalance: number;
};

export type GoalScenario = {
  balance: number;
  months: number;
};

export type GoalDataResult = {
  monthlyGoal: number;
  annualGoal: number;
  requiredBalance: number;
  progressPct: number;
  monthsToGoal: number;
  scenarios: GoalScenario[];
};

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function monthsToTarget(
  startBalance: number,
  requiredBalance: number,
  expectedMonthlyReturnPct: number
): number {
  const start = toNumber(startBalance);
  const required = toNumber(requiredBalance);
  const monthlyRate = toNumber(expectedMonthlyReturnPct) / 100;

  if (required <= 0 || monthlyRate <= 0 || start <= 0) {
    return 0;
  }

  const raw = (required - start) / (start * monthlyRate);
  if (!Number.isFinite(raw)) {
    return 0;
  }

  return Math.max(0, raw);
}

export function calculateGoalData({
  monthlyIncomeGoal,
  annualIncomeGoal,
  expectedMonthlyReturnPct,
  currentBalance,
}: GoalDataInput): GoalDataResult {
  const monthlyGoal = Math.max(
    0,
    toNumber(monthlyIncomeGoal) || toNumber(annualIncomeGoal) / 12
  );
  const annualGoal = Math.max(
    0,
    toNumber(annualIncomeGoal) || monthlyGoal * 12
  );

  const safeExpectedMonthlyReturnPct = toNumber(expectedMonthlyReturnPct);
  const safeCurrentBalance = Math.max(0, toNumber(currentBalance));

  if (safeExpectedMonthlyReturnPct <= 0) {
    return {
      monthlyGoal,
      annualGoal,
      requiredBalance: 0,
      progressPct: 0,
      monthsToGoal: 0,
      scenarios: [20000, 30000, 50000].map((balance) => ({
        balance,
        months: 0,
      })),
    };
  }

  const requiredBalance =
    monthlyGoal / (safeExpectedMonthlyReturnPct / 100);

  if (!Number.isFinite(requiredBalance) || requiredBalance <= 0) {
    return {
      monthlyGoal,
      annualGoal,
      requiredBalance: 0,
      progressPct: 0,
      monthsToGoal: 0,
      scenarios: [20000, 30000, 50000].map((balance) => ({
        balance,
        months: 0,
      })),
    };
  }

  const rawProgress = (safeCurrentBalance / requiredBalance) * 100;
  const progressPct = Number.isFinite(rawProgress) ? Math.max(0, rawProgress) : 0;

  const monthsToGoal = monthsToTarget(
    safeCurrentBalance,
    requiredBalance,
    safeExpectedMonthlyReturnPct
  );

  const scenarios = [20000, 30000, 50000].map((balance) => ({
    balance,
    months: monthsToTarget(balance, requiredBalance, safeExpectedMonthlyReturnPct),
  }));

  return {
    monthlyGoal,
    annualGoal,
    requiredBalance,
    progressPct,
    monthsToGoal,
    scenarios,
  };
}
