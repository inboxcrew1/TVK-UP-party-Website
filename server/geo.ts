import { prisma } from '../lib/prisma';

export async function getStates() {
  return prisma.state.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getDistricts(stateId: string) {
  return prisma.district.findMany({
    where: { stateId },
    orderBy: { name: 'asc' },
  });
}

export async function getAssemblies(districtId: string) {
  return prisma.assembly.findMany({
    where: { districtId },
    orderBy: { name: 'asc' },
  });
}

/**
 * Validates that the provided state, district, and assembly form a valid nested hierarchy.
 * E.g., the district must belong to the state, and the assembly must belong to the district.
 */
export async function validateHierarchy(stateId: string, districtId: string, assemblyId: string): Promise<boolean> {
  const district = await prisma.district.findUnique({
    where: { id: districtId },
  });
  
  if (!district || district.stateId !== stateId) {
    return false;
  }
  
  const assembly = await prisma.assembly.findUnique({
    where: { id: assemblyId },
  });
  
  if (!assembly || assembly.districtId !== districtId) {
    return false;
  }
  
  return true;
}
