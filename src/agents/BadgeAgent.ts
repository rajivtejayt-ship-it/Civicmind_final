import { Badge } from "@/types/civic";

export function getBadge(civicCred: number): Badge {
  if (civicCred < 50) return "New Neighbor";
  if (civicCred < 100) return "Active Neighbor";
  if (civicCred < 200) return "Trusted Neighbor";
  if (civicCred < 500) return "Guardian";
  return "Civic Champion";
}

export function calculateCivicCredProgress(civicCred: number) {
  const currentBadge = getBadge(civicCred);

  let nextBadge: Badge | null = null;
  let nextThreshold = 0;
  let prevThreshold = 0;

  if (civicCred < 50) {
    nextBadge = "Active Neighbor";
    nextThreshold = 50;
    prevThreshold = 0;
  } else if (civicCred < 100) {
    nextBadge = "Trusted Neighbor";
    nextThreshold = 100;
    prevThreshold = 50;
  } else if (civicCred < 200) {
    nextBadge = "Guardian";
    nextThreshold = 200;
    prevThreshold = 100;
  } else if (civicCred < 500) {
    nextBadge = "Civic Champion";
    nextThreshold = 500;
    prevThreshold = 200;
  } else {
    // Max level
    return {
      currentBadge,
      nextBadge: null,
      progressPercent: 100,
    };
  }

  const range = nextThreshold - prevThreshold;
  const progressIntoRange = civicCred - prevThreshold;
  const progressPercent = Math.round((progressIntoRange / range) * 100);

  return {
    currentBadge,
    nextBadge,
    progressPercent,
  };
}
