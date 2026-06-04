export function calculateGoalData({
  monthlyIncomeGoal,
  annualIncomeGoal,
  expectedMonthlyReturnPct,
  currentBalance
}: {
  monthlyIncomeGoal: number;
  annualIncomeGoal: number;
  expectedMonthlyReturnPct: number;
  currentBalance: number;
}) {
  // Convert between monthly/annual
  const monthlyGoal = monthlyIncomeGoal || annualIncomeGoal / 12;
  const annualGoal = annualIncomeGoal || monthlyIncomeGoal * 12;

  const monthlyReturn = expectedMonthlyReturnPct / 100;

  // Required account size
  const requiredBalance = monthlyGoal / monthlyReturn;

  // Progress
  const progressPct = (currentBalance / requiredBalance) * 100;

  // Time to goal
  const monthsToGoal =
    Math.log(requiredBalance / currentBalance) /
    Math.log(1 + monthlyReturn);

  // Bigger account impact
  const scenarios = [20000, 30000, 50000].map((balance) => ({
    balance,
    months: Math.log(requiredBalance / balance) / Math.log(1 + monthlyReturn)
  }));

  return {
    monthlyGoal,
    annualGoal,
    requiredBalance,
    progressPct,
    monthsToGoal,
    scenarios
  };
}
