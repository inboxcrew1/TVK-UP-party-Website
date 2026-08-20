import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../lib/prisma';
import { getStates, getDistricts, getAssemblies, validateHierarchy } from '../server/geo';

describe('Geographic Hierarchy Integration Tests', () => {
  let stateId = '';
  let bulandshahrId = '';
  let ghaziabadId = '';
  let syanaAssemblyId = ''; // Belongs to Bulandshahr
  let loniAssemblyId = ''; // Belongs to Ghaziabad

  beforeAll(async () => {
    // Retrieve seeded IDs
    const state = await prisma.state.findUnique({ where: { code: 'UP' } });
    if (!state) throw new Error('State seed missing');
    stateId = state.id;

    const bDist = await prisma.district.findFirst({
      where: { stateId: state.id, name: 'Bulandshahr' },
      include: { assemblies: true },
    });
    if (!bDist) throw new Error('Bulandshahr seed missing');
    bulandshahrId = bDist.id;
    
    const syana = bDist.assemblies.find(a => a.name === 'Syana');
    if (!syana) throw new Error('Syana assembly seed missing');
    syanaAssemblyId = syana.id;

    const gDist = await prisma.district.findFirst({
      where: { stateId: state.id, name: 'Ghaziabad' },
      include: { assemblies: true },
    });
    if (!gDist) throw new Error('Ghaziabad seed missing');
    ghaziabadId = gDist.id;

    const loni = gDist.assemblies.find(a => a.name === 'Loni');
    if (!loni) throw new Error('Loni assembly seed missing');
    loniAssemblyId = loni.id;
  });

  it('should fetch seeded states', async () => {
    const states = await getStates();
    expect(states.length).toBeGreaterThan(0);
    const up = states.find(s => s.code === 'UP');
    expect(up).toBeDefined();
    expect(up?.name).toBe('Uttar Pradesh');
  });

  it('should fetch districts for a valid state ID', async () => {
    const districts = await getDistricts(stateId);
    expect(districts.length).toBeGreaterThan(1);
    
    const bulandshahr = districts.find(d => d.name === 'Bulandshahr');
    expect(bulandshahr).toBeDefined();
    expect(bulandshahr?.stateId).toBe(stateId);
  });

  it('should fetch assemblies for a valid district ID', async () => {
    const assemblies = await getAssemblies(bulandshahrId);
    expect(assemblies.length).toBe(7); // Seeded 7 assemblies for Bulandshahr
    
    const syana = assemblies.find(a => a.name === 'Syana');
    expect(syana).toBeDefined();
    expect(syana?.districtId).toBe(bulandshahrId);
  });

  it('should validate a correct nested hierarchy', async () => {
    // UP -> Bulandshahr -> Syana (Valid)
    const valid = await validateHierarchy(stateId, bulandshahrId, syanaAssemblyId);
    expect(valid).toBe(true);

    // UP -> Ghaziabad -> Loni (Valid)
    const valid2 = await validateHierarchy(stateId, ghaziabadId, loniAssemblyId);
    expect(valid2).toBe(true);
  });

  it('should reject an incorrect nested hierarchy', async () => {
    // UP -> Ghaziabad -> Syana (Invalid: Syana belongs to Bulandshahr, not Ghaziabad)
    const invalid = await validateHierarchy(stateId, ghaziabadId, syanaAssemblyId);
    expect(invalid).toBe(false);

    // UP -> Bulandshahr -> Loni (Invalid: Loni belongs to Ghaziabad)
    const invalid2 = await validateHierarchy(stateId, bulandshahrId, loniAssemblyId);
    expect(invalid2).toBe(false);
  });

  it('should reject non-existent IDs', async () => {
    const invalid = await validateHierarchy(stateId, bulandshahrId, 'non-existent-assembly-uuid');
    expect(invalid).toBe(false);
  } );
});
