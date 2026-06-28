const fs = require('fs');
const path = require('path');

const issues = [];
const statuses = ['reported', 'classified', 'investigating', 'addressing', 'resolved', 'archived'];
const categories = ['infrastructure', 'safety', 'sanitation', 'mobility', 'environment', 'other'];
const severities = ['low', 'medium', 'high', 'critical'];

for (let i = 1; i <= 25; i++) {
  const cat = categories[i % categories.length];
  const sev = severities[i % severities.length];
  const stat = statuses[i % statuses.length];
  const tScore = Math.floor(Math.random() * 60) + 40;
  const iScore = Math.floor(Math.random() * 100);
  issues.push({
    id: 'demo-issue-' + i,
    reporterId: 'demo-user-' + (i%5 + 1),
    title: 'Demo Issue ' + i + ' (' + cat + ')',
    description: 'This is an automatically generated demo issue for testing purposes.',
    coordinates: { lat: 37.75 + (Math.random() * 0.05), lng: -122.45 + (Math.random() * 0.05) },
    status: stat,
    createdAt: new Date(Date.now() - (Math.random() * 10 * 86400000)).toISOString(),
    updatedAt: new Date().toISOString(),
    category: cat,
    severity: sev,
    trustScore: tScore,
    trustExplainer: { 
      finalScore: tScore, 
      reason: 'Generated trust score.',
      baseScore: tScore,
      reporterCivicCredContribution: 0,
      evidenceMultiplier: 1,
      verificationWeight: 1,
      anomalyPenalty: 0
    },
    impactScore: iScore,
    impactExplainer: { 
      finalScore: iScore, 
      reason: 'Generated impact score.',
      baseWeight: iScore,
      severityMultiplier: 1,
      densityFactor: 1,
      durationDaysFactor: 1
    },
    evidenceCount: Math.floor(Math.random() * 4),
    communityConfirmations: 0,
    linkedReports: 0
  });
}

const file = path.join(process.cwd(), 'src/lib/demoData.ts');
let content = 'import { CivicIssue } from "@/types/civic";\n\nexport const DEMO_ISSUES: CivicIssue[] = ' + JSON.stringify(issues, null, 2) + ';\n';
fs.writeFileSync(file, content);
