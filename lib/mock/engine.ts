// Deterministic random number generator
function sfc32(a: number, b: number, c: number, d: number) {
  return function() {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  }
}

function hashString(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

function getSeededRandom(seedStr: string) {
  const seed = hashString(seedStr);
  return sfc32(0x9E3779B9, 0x243F6A88, 0xB7E15162, seed());
}

// 1. Grid and Time Constants
export const LATS = 101; // 5 to 30 N (0.25)
export const LONS = 241; // 45 to 105 E (0.25)
export const LAT_MIN = 5;
export const LAT_MAX = 30;
export const LON_MIN = 45;
export const LON_MAX = 105;

export const DEPTHS = [0, 5, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 500, 700, 1000];

export function getPeriod(dateStr: string): "Train" | "Validation" | "Test" | "Gap (excluded)" {
  const d = new Date(dateStr);
  const time = d.getTime();
  const trainEnd = new Date("2019-12-31").getTime();
  const valStart = new Date("2020-01-06").getTime();
  const valEnd = new Date("2021-12-31").getTime();
  const testStart = new Date("2022-01-06").getTime();
  
  if (time <= trainEnd) return "Train";
  if (time >= valStart && time <= valEnd) return "Validation";
  if (time >= testStart) return "Test";
  return "Gap (excluded)";
}

// 2. Physical Plausibility Engine

function getDayOfYear(dateStr: string) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getTrueTemperature(lat: number, lon: number, depth: number, dateStr: string): number {
  const doy = getDayOfYear(dateStr);
  const isArabianSea = lon < 77;
  const isBayOfBengal = lon >= 77 && lon < 95;
  
  // Seasonal cycle: warmest in May (doy 135), coolest in Jan (doy 15)
  const season = Math.sin((doy - 75) / 365 * Math.PI * 2); 
  
  // Base surface temp
  let sst = 28 + season * 1.5;
  if (isArabianSea && lat > 15) sst -= 1; // Cooler north AS
  if (lat > 20) sst -= 1.5; // Cooler generally in north
  
  // Upwelling in summer (SW monsoon) off Somalia/Oman (doy 160-250)
  if (doy > 160 && doy < 250 && lon < 60 && lat > 8 && lat < 20) {
    sst -= 3;
  }
  
  // Vertical structure
  const mld = isArabianSea ? 50 : 30; // Mixed layer depth
  
  if (depth <= mld) {
    return sst - (depth / mld) * 0.5; // Slight cooling in MLD
  }
  
  // Thermocline
  const thermoclineDepth = isArabianSea ? 100 : 80;
  
  // Add some eddy variation based on lat/lon (slowly moving west based on year/doy)
  const rand = getSeededRandom(`eddy_${Math.floor(doy/10)}_${Math.floor(lat/2)}_${Math.floor(lon/2)}`);
  const eddyEffect = (rand() - 0.5) * 2; // -1 to 1
  
  const currentZ = depth - mld - eddyEffect * 20; 
  if (currentZ <= 0) return sst - 0.5;
  
  // Exponential decay
  const baseT = sst - 0.5;
  const bottomT = 4.0;
  const decayT = (baseT - bottomT) * Math.exp(-currentZ / thermoclineDepth) + bottomT;
  
  return decayT;
}

// 2.3 The Four Voices

export function getProfileData(lat: number, lon: number, dateStr: string, depth: number) {
  const trueT = getTrueTemperature(lat, lon, depth, dateStr);
  const rand = getSeededRandom(`err_${dateStr}_${lat}_${lon}_${depth}`);
  
  // OceanEmbed Error
  let errorSize = 0;
  if (depth > 20 && depth < 200) errorSize = 1.0; // max error in thermocline
  else if (depth <= 20) errorSize = 0.4;
  else errorSize = 0.2; // deep
  
  const oeError = (rand() - 0.5) * 2 * errorSize;
  const oceanEmbed = trueT + oeError;
  
  // Baseline
  const rand2 = getSeededRandom(`base_${dateStr}_${lat}_${lon}_${depth}`);
  const baseline = trueT + (rand2() - 0.5) * 3 * errorSize;
  
  // ARGO
  const rand3 = getSeededRandom(`argo_${dateStr}_${lat}_${lon}_${depth}`);
  const argo = trueT + (rand3() - 0.5) * 0.2;
  
  return { glorys: trueT, oceanEmbed, baseline, argo, error: oeError };
}

// API functions
export function getField(dateStr: string, depth: number, layer: string, region: string) {
  // Returns a grid of values for the map
  const data = new Float32Array(LATS * LONS);
  for (let y = 0; y < LATS; y++) {
    for (let x = 0; x < LONS; x++) {
      const lat = LAT_MIN + y * 0.25;
      const lon = LON_MIN + x * 0.25;
      const p = getProfileData(lat, lon, dateStr, depth);
      
      let val = p.oceanEmbed;
      if (layer === "GLORYS") val = p.glorys;
      if (layer === "Error") val = p.error;
      // ARGO is handled as points on the frontend
      data[y * LONS + x] = val;
    }
  }
  return data;
}

export function getProfile(lat: number, lon: number, dateStr: string) {
  return DEPTHS.map(d => {
    const p = getProfileData(lat, lon, dateStr, d);
    return { depth: d, ...p };
  });
}

// Validation Metrics
export const METRICS_TABLE = [
  { depth: 0, oeRmse: 0.41, glorysRmse: 0.36, baseRmse: 0.78, bias: 0.03, corr: 0.97 },
  { depth: 5, oeRmse: 0.42, glorysRmse: 0.36, baseRmse: 0.80, bias: 0.03, corr: 0.97 },
  { depth: 10, oeRmse: 0.44, glorysRmse: 0.38, baseRmse: 0.86, bias: 0.02, corr: 0.96 },
  { depth: 20, oeRmse: 0.52, glorysRmse: 0.44, baseRmse: 1.02, bias: 0.01, corr: 0.95 },
  { depth: 30, oeRmse: 0.63, glorysRmse: 0.53, baseRmse: 1.24, bias: -0.02, corr: 0.93 },
  { depth: 50, oeRmse: 0.79, glorysRmse: 0.66, baseRmse: 1.58, bias: -0.05, corr: 0.90 },
  { depth: 75, oeRmse: 0.96, glorysRmse: 0.80, baseRmse: 1.86, bias: -0.08, corr: 0.87 },
  { depth: 100, oeRmse: 1.08, glorysRmse: 0.91, baseRmse: 2.05, bias: -0.10, corr: 0.84 },
  { depth: 125, oeRmse: 1.14, glorysRmse: 0.95, baseRmse: 2.02, bias: -0.09, corr: 0.82 },
  { depth: 150, oeRmse: 1.10, glorysRmse: 0.93, baseRmse: 1.88, bias: -0.07, corr: 0.82 },
  { depth: 200, oeRmse: 0.96, glorysRmse: 0.82, baseRmse: 1.55, bias: -0.05, corr: 0.83 },
  { depth: 300, oeRmse: 0.72, glorysRmse: 0.62, baseRmse: 1.05, bias: -0.03, corr: 0.85 },
  { depth: 500, oeRmse: 0.46, glorysRmse: 0.40, baseRmse: 0.62, bias: -0.01, corr: 0.88 },
  { depth: 700, oeRmse: 0.32, glorysRmse: 0.28, baseRmse: 0.41, bias: 0.00, corr: 0.90 },
  { depth: 1000, oeRmse: 0.21, glorysRmse: 0.19, baseRmse: 0.26, bias: 0.00, corr: 0.92 }
];

export function getValidation(filters: { basin: string, season: string, depthRange: string }) {
  let basinMult = 1.0;
  if (filters.basin === "Bay of Bengal") basinMult = 0.92;
  if (filters.basin === "Arabian Sea") basinMult = 1.08;
  
  let seasonMult = 1.0;
  if (filters.season === "SW monsoon") seasonMult = 1.12;
  if (filters.season === "NE monsoon") seasonMult = 0.94;
  if (filters.season === "Inter-monsoon") seasonMult = 0.98;
  
  const mult = basinMult * seasonMult;
  
  return METRICS_TABLE.map(row => ({
    ...row,
    oeRmse: +(row.oeRmse * mult).toFixed(2),
    glorysRmse: +(row.glorysRmse * mult).toFixed(2),
    baseRmse: +(row.baseRmse * mult).toFixed(2),
    mae: +(row.oeRmse * mult * 0.78).toFixed(2),
    skill: +(1 - (row.oeRmse / row.baseRmse)).toFixed(2)
  }));
}
