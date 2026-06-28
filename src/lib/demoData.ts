import { CivicIssue } from "@/types/civic";

export const DEMO_ISSUES: CivicIssue[] = [
  {
    "id": "demo-issue-1",
    "reporterId": "demo-user-2",
    "title": "Demo Issue 1 (safety)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.7528783934059,
      "lng": -122.44686616045232
    },
    "status": "classified",
    "createdAt": "2026-06-20T14:09:52.432Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "safety",
    "severity": "medium",
    "trustScore": 58,
    "trustExplainer": {
      "finalScore": 58,
      "reason": "Generated trust score.",
      "baseScore": 58,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 9,
    "impactExplainer": {
      "finalScore": 9,
      "reason": "Generated impact score.",
      "baseWeight": 9,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-2",
    "reporterId": "demo-user-3",
    "title": "Demo Issue 2 (sanitation)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.7881636281798,
      "lng": -122.4183371875073
    },
    "status": "investigating",
    "createdAt": "2026-06-24T00:04:55.662Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "sanitation",
    "severity": "high",
    "trustScore": 71,
    "trustExplainer": {
      "finalScore": 71,
      "reason": "Generated trust score.",
      "baseScore": 71,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 6,
    "impactExplainer": {
      "finalScore": 6,
      "reason": "Generated impact score.",
      "baseWeight": 6,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-3",
    "reporterId": "demo-user-4",
    "title": "Demo Issue 3 (mobility)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.77656592727268,
      "lng": -122.43106562022422
    },
    "status": "addressing",
    "createdAt": "2026-06-17T05:38:32.544Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "mobility",
    "severity": "critical",
    "trustScore": 80,
    "trustExplainer": {
      "finalScore": 80,
      "reason": "Generated trust score.",
      "baseScore": 80,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 14,
    "impactExplainer": {
      "finalScore": 14,
      "reason": "Generated impact score.",
      "baseWeight": 14,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-4",
    "reporterId": "demo-user-5",
    "title": "Demo Issue 4 (environment)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.77621241160507,
      "lng": -122.43555161632416
    },
    "status": "resolved",
    "createdAt": "2026-06-23T06:54:04.271Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "environment",
    "severity": "low",
    "trustScore": 49,
    "trustExplainer": {
      "finalScore": 49,
      "reason": "Generated trust score.",
      "baseScore": 49,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 27,
    "impactExplainer": {
      "finalScore": 27,
      "reason": "Generated impact score.",
      "baseWeight": 27,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-5",
    "reporterId": "demo-user-1",
    "title": "Demo Issue 5 (other)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.7867344880368,
      "lng": -122.4101191455117
    },
    "status": "archived",
    "createdAt": "2026-06-17T17:07:10.701Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "other",
    "severity": "medium",
    "trustScore": 81,
    "trustExplainer": {
      "finalScore": 81,
      "reason": "Generated trust score.",
      "baseScore": 81,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 41,
    "impactExplainer": {
      "finalScore": 41,
      "reason": "Generated impact score.",
      "baseWeight": 41,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 1,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-6",
    "reporterId": "demo-user-2",
    "title": "Demo Issue 6 (infrastructure)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.784105290362646,
      "lng": -122.41305522606412
    },
    "status": "reported",
    "createdAt": "2026-06-26T09:38:04.085Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "infrastructure",
    "severity": "high",
    "trustScore": 40,
    "trustExplainer": {
      "finalScore": 40,
      "reason": "Generated trust score.",
      "baseScore": 40,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 58,
    "impactExplainer": {
      "finalScore": 58,
      "reason": "Generated impact score.",
      "baseWeight": 58,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 1,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-7",
    "reporterId": "demo-user-3",
    "title": "Demo Issue 7 (safety)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.78308155579889,
      "lng": -122.44360872221714
    },
    "status": "classified",
    "createdAt": "2026-06-18T19:15:02.576Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "safety",
    "severity": "critical",
    "trustScore": 57,
    "trustExplainer": {
      "finalScore": 57,
      "reason": "Generated trust score.",
      "baseScore": 57,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 95,
    "impactExplainer": {
      "finalScore": 95,
      "reason": "Generated impact score.",
      "baseWeight": 95,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-8",
    "reporterId": "demo-user-4",
    "title": "Demo Issue 8 (sanitation)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.78537135314475,
      "lng": -122.40197969405558
    },
    "status": "investigating",
    "createdAt": "2026-06-21T10:20:23.297Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "sanitation",
    "severity": "low",
    "trustScore": 90,
    "trustExplainer": {
      "finalScore": 90,
      "reason": "Generated trust score.",
      "baseScore": 90,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 19,
    "impactExplainer": {
      "finalScore": 19,
      "reason": "Generated impact score.",
      "baseWeight": 19,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 3,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-9",
    "reporterId": "demo-user-5",
    "title": "Demo Issue 9 (mobility)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.75289847379569,
      "lng": -122.43221449230673
    },
    "status": "addressing",
    "createdAt": "2026-06-25T20:05:14.761Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "mobility",
    "severity": "medium",
    "trustScore": 63,
    "trustExplainer": {
      "finalScore": 63,
      "reason": "Generated trust score.",
      "baseScore": 63,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 37,
    "impactExplainer": {
      "finalScore": 37,
      "reason": "Generated impact score.",
      "baseWeight": 37,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-10",
    "reporterId": "demo-user-1",
    "title": "Demo Issue 10 (environment)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.780818810278156,
      "lng": -122.42221505522873
    },
    "status": "resolved",
    "createdAt": "2026-06-22T13:37:02.253Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "environment",
    "severity": "high",
    "trustScore": 93,
    "trustExplainer": {
      "finalScore": 93,
      "reason": "Generated trust score.",
      "baseScore": 93,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 12,
    "impactExplainer": {
      "finalScore": 12,
      "reason": "Generated impact score.",
      "baseWeight": 12,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-11",
    "reporterId": "demo-user-2",
    "title": "Demo Issue 11 (other)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.76189192939943,
      "lng": -122.4499031731533
    },
    "status": "archived",
    "createdAt": "2026-06-25T14:01:08.926Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "other",
    "severity": "critical",
    "trustScore": 68,
    "trustExplainer": {
      "finalScore": 68,
      "reason": "Generated trust score.",
      "baseScore": 68,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 89,
    "impactExplainer": {
      "finalScore": 89,
      "reason": "Generated impact score.",
      "baseWeight": 89,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-12",
    "reporterId": "demo-user-3",
    "title": "Demo Issue 12 (infrastructure)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.766454927356534,
      "lng": -122.41173132320264
    },
    "status": "reported",
    "createdAt": "2026-06-20T20:49:17.375Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "infrastructure",
    "severity": "low",
    "trustScore": 94,
    "trustExplainer": {
      "finalScore": 94,
      "reason": "Generated trust score.",
      "baseScore": 94,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 2,
    "impactExplainer": {
      "finalScore": 2,
      "reason": "Generated impact score.",
      "baseWeight": 2,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 1,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-13",
    "reporterId": "demo-user-4",
    "title": "Demo Issue 13 (safety)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.76552085593864,
      "lng": -122.44689192703296
    },
    "status": "classified",
    "createdAt": "2026-06-24T12:15:45.086Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "safety",
    "severity": "medium",
    "trustScore": 74,
    "trustExplainer": {
      "finalScore": 74,
      "reason": "Generated trust score.",
      "baseScore": 74,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 36,
    "impactExplainer": {
      "finalScore": 36,
      "reason": "Generated impact score.",
      "baseWeight": 36,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-14",
    "reporterId": "demo-user-5",
    "title": "Demo Issue 14 (sanitation)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.773977824770846,
      "lng": -122.42207969569067
    },
    "status": "investigating",
    "createdAt": "2026-06-20T08:30:32.246Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "sanitation",
    "severity": "high",
    "trustScore": 53,
    "trustExplainer": {
      "finalScore": 53,
      "reason": "Generated trust score.",
      "baseScore": 53,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 21,
    "impactExplainer": {
      "finalScore": 21,
      "reason": "Generated impact score.",
      "baseWeight": 21,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 3,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-15",
    "reporterId": "demo-user-1",
    "title": "Demo Issue 15 (mobility)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.759342919663325,
      "lng": -122.41299423116318
    },
    "status": "addressing",
    "createdAt": "2026-06-19T15:25:40.997Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "mobility",
    "severity": "critical",
    "trustScore": 79,
    "trustExplainer": {
      "finalScore": 79,
      "reason": "Generated trust score.",
      "baseScore": 79,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 34,
    "impactExplainer": {
      "finalScore": 34,
      "reason": "Generated impact score.",
      "baseWeight": 34,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-16",
    "reporterId": "demo-user-2",
    "title": "Demo Issue 16 (environment)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.78914446594013,
      "lng": -122.42010704129146
    },
    "status": "resolved",
    "createdAt": "2026-06-17T13:40:23.998Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "environment",
    "severity": "low",
    "trustScore": 55,
    "trustExplainer": {
      "finalScore": 55,
      "reason": "Generated trust score.",
      "baseScore": 55,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 6,
    "impactExplainer": {
      "finalScore": 6,
      "reason": "Generated impact score.",
      "baseWeight": 6,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-17",
    "reporterId": "demo-user-3",
    "title": "Demo Issue 17 (other)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.76867885686378,
      "lng": -122.43019977638653
    },
    "status": "archived",
    "createdAt": "2026-06-19T06:28:38.196Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "other",
    "severity": "medium",
    "trustScore": 41,
    "trustExplainer": {
      "finalScore": 41,
      "reason": "Generated trust score.",
      "baseScore": 41,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 44,
    "impactExplainer": {
      "finalScore": 44,
      "reason": "Generated impact score.",
      "baseWeight": 44,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-18",
    "reporterId": "demo-user-4",
    "title": "Demo Issue 18 (infrastructure)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.77814856316306,
      "lng": -122.43483418668481
    },
    "status": "reported",
    "createdAt": "2026-06-24T13:26:00.700Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "infrastructure",
    "severity": "high",
    "trustScore": 51,
    "trustExplainer": {
      "finalScore": 51,
      "reason": "Generated trust score.",
      "baseScore": 51,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 62,
    "impactExplainer": {
      "finalScore": 62,
      "reason": "Generated impact score.",
      "baseWeight": 62,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-19",
    "reporterId": "demo-user-5",
    "title": "Demo Issue 19 (safety)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.792661397077865,
      "lng": -122.43518352613229
    },
    "status": "classified",
    "createdAt": "2026-06-24T09:59:41.846Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "safety",
    "severity": "critical",
    "trustScore": 48,
    "trustExplainer": {
      "finalScore": 48,
      "reason": "Generated trust score.",
      "baseScore": 48,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 26,
    "impactExplainer": {
      "finalScore": 26,
      "reason": "Generated impact score.",
      "baseWeight": 26,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-20",
    "reporterId": "demo-user-1",
    "title": "Demo Issue 20 (sanitation)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.79999767837605,
      "lng": -122.43723589618943
    },
    "status": "investigating",
    "createdAt": "2026-06-24T00:31:13.076Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "sanitation",
    "severity": "low",
    "trustScore": 68,
    "trustExplainer": {
      "finalScore": 68,
      "reason": "Generated trust score.",
      "baseScore": 68,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 98,
    "impactExplainer": {
      "finalScore": 98,
      "reason": "Generated impact score.",
      "baseWeight": 98,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-21",
    "reporterId": "demo-user-2",
    "title": "Demo Issue 21 (mobility)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.78277838432104,
      "lng": -122.40982686881426
    },
    "status": "addressing",
    "createdAt": "2026-06-25T02:46:30.557Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "mobility",
    "severity": "medium",
    "trustScore": 63,
    "trustExplainer": {
      "finalScore": 63,
      "reason": "Generated trust score.",
      "baseScore": 63,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 57,
    "impactExplainer": {
      "finalScore": 57,
      "reason": "Generated impact score.",
      "baseWeight": 57,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 0,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-22",
    "reporterId": "demo-user-3",
    "title": "Demo Issue 22 (environment)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.782000202083985,
      "lng": -122.40877874004447
    },
    "status": "resolved",
    "createdAt": "2026-06-18T09:25:21.274Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "environment",
    "severity": "high",
    "trustScore": 52,
    "trustExplainer": {
      "finalScore": 52,
      "reason": "Generated trust score.",
      "baseScore": 52,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 20,
    "impactExplainer": {
      "finalScore": 20,
      "reason": "Generated impact score.",
      "baseWeight": 20,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 1,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-23",
    "reporterId": "demo-user-4",
    "title": "Demo Issue 23 (other)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.75978690201484,
      "lng": -122.4444192246219
    },
    "status": "archived",
    "createdAt": "2026-06-24T06:16:58.585Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "other",
    "severity": "critical",
    "trustScore": 44,
    "trustExplainer": {
      "finalScore": 44,
      "reason": "Generated trust score.",
      "baseScore": 44,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 57,
    "impactExplainer": {
      "finalScore": 57,
      "reason": "Generated impact score.",
      "baseWeight": 57,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 1,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-24",
    "reporterId": "demo-user-5",
    "title": "Demo Issue 24 (infrastructure)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.768565394621355,
      "lng": -122.4497330755563
    },
    "status": "reported",
    "createdAt": "2026-06-21T15:47:39.838Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "infrastructure",
    "severity": "low",
    "trustScore": 49,
    "trustExplainer": {
      "finalScore": 49,
      "reason": "Generated trust score.",
      "baseScore": 49,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 14,
    "impactExplainer": {
      "finalScore": 14,
      "reason": "Generated impact score.",
      "baseWeight": 14,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  },
  {
    "id": "demo-issue-25",
    "reporterId": "demo-user-1",
    "title": "Demo Issue 25 (safety)",
    "description": "This is an automatically generated demo issue for testing purposes.",
    "coordinates": {
      "lat": 37.79009144571874,
      "lng": -122.40252646157201
    },
    "status": "classified",
    "createdAt": "2026-06-21T17:46:07.713Z",
    "updatedAt": "2026-06-26T16:42:24.600Z",
    "category": "safety",
    "severity": "medium",
    "trustScore": 74,
    "trustExplainer": {
      "finalScore": 74,
      "reason": "Generated trust score.",
      "baseScore": 74,
      "reporterCivicCredContribution": 0,
      "evidenceMultiplier": 1,
      "verificationWeight": 1,
      "anomalyPenalty": 0
    },
    "impactScore": 17,
    "impactExplainer": {
      "finalScore": 17,
      "reason": "Generated impact score.",
      "baseWeight": 17,
      "severityMultiplier": 1,
      "densityFactor": 1,
      "durationDaysFactor": 1
    },
    "evidenceCount": 2,
    "communityConfirmations": 0,
    "linkedReports": 0
  }
];
