/**
 * DriftArmor Enterprise CI/CD Pull Request Budget Gatekeeper
 * Evaluates whether a Terraform PR can be safely merged or should be blocked.
 */
export function evaluatePullRequestBudget(costAnalysis, maxMonthlyDeltaUSD = 250.0) {
  const delta = costAnalysis.totalMonthlyUSD;
  const isBlocked = delta > maxMonthlyDeltaUSD;

  return {
    allowed: !isBlocked,
    monthlyCostDeltaUSD: delta,
    maxBudgetAllowedUSD: maxMonthlyDeltaUSD,
    status: isBlocked ? 'BLOCKED_BUDGET_EXCEEDED' : 'PASSED',
    reason: isBlocked
      ? `PR adds $${delta.toFixed(2)}/mo which exceeds the configured team limit of $${maxMonthlyDeltaUSD.toFixed(2)}/mo. Requires VP of Engineering approval.`
      : `PR adds $${delta.toFixed(2)}/mo, which is within the safe limit.`
  };
}
