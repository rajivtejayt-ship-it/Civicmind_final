import { CivicIssue, ImpactExplainer, SeverityLevel } from "../types/civic";

export interface ImpactResult {
  score: number;
  explainer: ImpactExplainer;
}

/**
 * Calculates a deterministic impact score (0–100) for a civic issue.
 *
 * Inputs:
 *   - issue.severity          → severity multiplier
 *   - issue.trustScore        → weighted trust contribution (max 20)
 *   - issue.communityConfirmations → density factor (max 20)
 *   - issue.linkedReports     → density factor (max 15)
 *   - issue.createdAt         → age factor (days unresolved)
 *
 * No Gemini. No Firestore reads. No AI calls. Fully reproducible.
 */
export function calculateImpactScore(issue: CivicIssue): ImpactResult {
  // ── Base ────────────────────────────────────────────────────────────────
  const baseWeight = 20;

  // ── Severity multiplier ─────────────────────────────────────────────────
  const severityMap: Record<SeverityLevel, number> = {
    low: 5,
    medium: 15,
    high: 30,
    critical: 40,
  };
  const severityMultiplier = severityMap[issue.severity] ?? 15;

  // ── Trust contribution: issue.trustScore * 0.2, max 20 ─────────────────
  const trustFactor = Math.min(20, (issue.trustScore ?? 0) * 0.2);

  // ── Community confirmations: * 4, max 20 ───────────────────────────────
  const confirmationFactor = Math.min(
    20,
    (issue.communityConfirmations ?? 0) * 4
  );

  // ── Linked reports: * 3, max 15 ────────────────────────────────────────
  const linkedFactor = Math.min(15, (issue.linkedReports ?? 0) * 3);

  // Density factor = community confirmations + linked reports contributions
  const densityFactor = confirmationFactor + linkedFactor;

  // ── Age factor (days unresolved) ────────────────────────────────────────
  let durationDaysFactor = 0;
  const createdAt = new Date(issue.createdAt);
  if (!isNaN(createdAt.getTime())) {
    const ageMs = Date.now() - createdAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);

    if (ageDays >= 30) {
      durationDaysFactor = 15;
    } else if (ageDays >= 7) {
      durationDaysFactor = 10;
    } else if (ageDays >= 1) {
      durationDaysFactor = 5;
    }
    // < 1 day → 0
  }

  // ── Final score ─────────────────────────────────────────────────────────
  const raw =
    baseWeight +
    severityMultiplier +
    trustFactor +
    densityFactor +
    durationDaysFactor;

  const finalScore = Math.round(Math.max(0, Math.min(100, raw)));

  // ── Explainer ───────────────────────────────────────────────────────────
  const reason = [
    `Base: ${baseWeight}`,
    `Severity: +${severityMultiplier}`,
    `Trust: +${trustFactor.toFixed(1)}`,
    `Community: +${confirmationFactor.toFixed(1)}`,
    `Linked: +${linkedFactor.toFixed(1)}`,
    `Age: +${durationDaysFactor}`,
    `Final: ${finalScore}`,
  ].join(", ");

  const explainer: ImpactExplainer = {
    baseWeight,
    severityMultiplier,
    densityFactor,
    durationDaysFactor,
    finalScore,
    reason,
  };

  return { score: finalScore, explainer };
}
