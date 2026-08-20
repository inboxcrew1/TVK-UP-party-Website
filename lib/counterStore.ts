// Global in-memory store initialized for sequential member IDs and live applied counts
let currentMemberCounter = 100;
const districtLiveCounts: Record<string, number> = {
  'Bulandshahr': 3,
  'Lucknow': 1,
};
const assemblyLiveCounts: Record<string, number> = {};

export function getNextMemberId(district?: string, assembly?: string): { number: number; formattedId: string } {
  const current = currentMemberCounter;
  currentMemberCounter += 1;

  if (district) {
    districtLiveCounts[district] = (districtLiveCounts[district] || 0) + 1;
  }
  if (assembly) {
    assemblyLiveCounts[assembly] = (assemblyLiveCounts[assembly] || 0) + 1;
  }

  return {
    number: current,
    formattedId: `TVK-UP ${current}`,
  };
}

export function getCurrentMemberCount(): number {
  return currentMemberCounter;
}

export function getDistrictLiveCount(district: string): number {
  return districtLiveCounts[district] || 0;
}

export function getAssemblyLiveCount(assembly: string): number {
  return assemblyLiveCounts[assembly] || 0;
}

export function resetMemberCounter(startVal: number = 100): number {
  currentMemberCounter = startVal;
  return currentMemberCounter;
}
