import { CivicUser, CivicIssue, TrustExplainer } from "../types/civic";

export interface TrustResult {
  score: number;
  explainer: TrustExplainer;
}

export function calculateTrustScore(
  user: CivicUser,
  issue: CivicIssue
): TrustResult {
  const baseScore = 50;

  // Reporter CivicCred: user.civicCred * 0.3, maximum 30
  const reporterCivicCredContribution = Math.min(30, user.civicCred * 0.3);

  // Evidence: issue.evidenceCount * 5, maximum 15
  const evidenceMultiplier = Math.min(15, (issue.evidenceCount || 0) * 5);

  // Community Confirmations: issue.communityConfirmations * 3, maximum 15
  // Linked Reports: issue.linkedReports * 2, maximum 10
  const confirmationsContrib = Math.min(15, (issue.communityConfirmations || 0) * 3);
  const linkedReportsContrib = Math.min(10, (issue.linkedReports || 0) * 2);
  const verificationWeight = confirmationsContrib + linkedReportsContrib;

  // Rejected Reports Penalty: ((user.reportsRejected / user.reportsFiled) * 20) if reportsFiled > 0, maximum 20
  let anomalyPenalty = 0;
  if (user.reportsFiled > 0) {
    anomalyPenalty = Math.min(
      20,
      ((user.reportsRejected || 0) / user.reportsFiled) * 20
    );
  }

  // Calculate final score
  let finalScore =
    baseScore +
    reporterCivicCredContribution +
    evidenceMultiplier +
    verificationWeight -
    anomalyPenalty;

  // Clamp final score between 0 and 100
  finalScore = Math.max(0, Math.min(100, finalScore));
  const roundedScore = Math.round(finalScore * 10) / 10;

  // Formulate explanation reasoning text
  const reason = `Base: ${baseScore}, CivicCred: +${reporterCivicCredContribution.toFixed(1)}, Evidence: +${evidenceMultiplier.toFixed(1)}, Community/Linked: +${verificationWeight.toFixed(1)}, Penalty: -${anomalyPenalty.toFixed(1)}`;

  const explainer: TrustExplainer = {
    baseScore,
    reporterCivicCredContribution,
    evidenceMultiplier,
    verificationWeight,
    anomalyPenalty,
    finalScore: roundedScore,
    reason,
  };

  return {
    score: roundedScore,
    explainer,
  };
}
