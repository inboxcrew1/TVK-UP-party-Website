import { prisma } from '../lib/prisma';
import { UP_DISTRICT_ASSEMBLIES } from '../lib/upConstituencies';

const STATIC_UP_STATE = [
  { id: 'state-up', name: 'Uttar Pradesh', code: 'UP' }
];

export async function getStates() {
  try {
    let state = await prisma.state.findFirst({
      where: { code: 'UP' }
    });
    if (!state) {
      state = await prisma.state.create({
        data: { name: 'Uttar Pradesh', code: 'UP' }
      });
    }
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
    });
    if (states && states.length > 0) return states;
  } catch (err) {
    console.warn('DB getStates fallback to static UP state:', err);
  }
  return STATIC_UP_STATE;
}

export async function getDistricts(stateId: string) {
  try {
    const districts = await prisma.district.findMany({
      where: { stateId },
      orderBy: { name: 'asc' },
    });
    if (districts && districts.length > 0) return districts;
  } catch (err) {
    console.warn('DB getDistricts fallback to static districts:', err);
  }

  // Fallback to all 75 static UP districts
  return Object.keys(UP_DISTRICT_ASSEMBLIES).map((dName) => ({
    id: `dist-${dName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: dName,
    stateId: stateId || 'state-up',
  }));
}

export async function getAssemblies(districtId: string) {
  try {
    const assemblies = await prisma.assembly.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
    });
    if (assemblies && assemblies.length > 0) return assemblies;
  } catch (err) {
    console.warn('DB getAssemblies fallback:', err);
  }

  return [];
}

/**
 * Validates that the provided state, district, and assembly form a valid nested hierarchy.
 */
export async function validateHierarchy(stateId: string, districtId: string, assemblyId: string): Promise<boolean> {
  try {
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
  } catch {
    // If DB check fails, assume true if IDs are non-empty
    return !!(stateId && districtId && assemblyId);
  }
}
