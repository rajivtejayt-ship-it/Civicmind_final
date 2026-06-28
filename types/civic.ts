/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole ="citizen" | "municipality";
export type Badge =
  | "New Neighbor"
  | "Active Neighbor"
  | "Trusted Neighbor"
  | "Guardian"
  | "Civic Champion";

export interface CivicUser {
  uid: string;

  displayName: string;
  email: string;
  photoURL?: string;

  civicCred: number;
  badge: Badge;

  role: UserRole;

  reportsFiled: number;
  reportsConfirmed: number;
  reportsRejected: number;

  isGuardian: boolean;

  joinedAt: string;
  lastActiveAt: string;
}
export type IssueStatus =
  | "reported"
  | "classified"
  | "investigating"
  | "addressing"
  | "resolved"
  | "archived";

export type IssueCategory =
  | "infrastructure"
  | "safety"
  | "sanitation"
  | "mobility"
  | "environment"
  | "other";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TrustExplainer {
  baseScore: number;
  reporterCivicCredContribution: number;
  evidenceMultiplier: number;
  verificationWeight: number;
  anomalyPenalty: number;
  finalScore: number;
  reason: string;
}

export interface ImpactExplainer {
  baseWeight: number;
  severityMultiplier: number;
  densityFactor: number; // surrounding reports/population
  durationDaysFactor: number;
  finalScore: number;
  reason: string;
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  category: IssueCategory;
  severity: SeverityLevel;
  trustScore: number; // 0-100 heuristic
  trustExplainer?: TrustExplainer;
  impactScore: number; // 0-100 heuristic
  impactExplainer?: ImpactExplainer;
  coordinates: Coordinates;
  reporterId: string;
  assignedAgency?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  classificationReason?: string;
  recommendations?: string[];
  evidenceCount: number;
  communityConfirmations: number;
  linkedReports: number;
}

export type EvidenceType = "photo" | "video" | "text" | "sensor";

export interface EvidenceContribution {
  id: string;
  issueId: string;
  reporterId: string;
  description: string;
  evidenceType: EvidenceType;
  evidenceUrl?: string;
  trustContribution: number;
  suspicionScore: number; // 0-100 heuristic
  timestamp: string;
}

export interface CivicCredTransaction {
  id: string;
  userId: string;
  changeAmount: number;
  newBalance: number;
  reason: string;
  timestamp: string;
}

export interface SuspicionLog {
  id: string;
  targetId: string; // userId or issueId or reportId
  targetType: "user" | "issue" | "report";
  ruleTriggered: string;
  suspicionDelta: number;
  description: string;
  timestamp: string;
}

export interface AgentLog {
  id: string;
  issueId: string;
  agentName:
    | "Intake"
    | "Classification"
    | "CivicCred"
    | "Suspicion"
    | "Impact"
    | "Recommendation"
    | "Resolution"
    | "Assistant";
  inputData: string;
  outputData: string;
  isAiGenerated: boolean;
  timestamp: string;
}
