// Mock profile data — shape matches GET /profile (lat, lon, date) from Section 10
// Standard 15 depths (metres)

export const STANDARD_DEPTHS = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 400, 500, 700, 1000];

export interface ProfilePoint {
  depth: number;
  oceanembed: number | null;
  glorys: number | null;
  argo: number | null;
  error_oe_argo: number | null;
}

// Sample profile at 12°N, 80°E, 2023-10-15 — realistic warm Bay of Bengal thermocline
// Marked as SAMPLE DATA
export const MOCK_PROFILE: ProfilePoint[] = [
  { depth:    0, oceanembed: 29.8, glorys: 29.5, argo: 29.6, error_oe_argo:  0.2 },
  { depth:   10, oceanembed: 29.5, glorys: 29.2, argo: 29.3, error_oe_argo:  0.2 },
  { depth:   20, oceanembed: 29.0, glorys: 28.8, argo: 28.9, error_oe_argo:  0.1 },
  { depth:   30, oceanembed: 28.2, glorys: 28.0, argo: 28.1, error_oe_argo:  0.1 },
  { depth:   50, oceanembed: 26.1, glorys: 25.7, argo: 25.9, error_oe_argo:  0.2 },
  { depth:   75, oceanembed: 22.4, glorys: 21.8, argo: 22.0, error_oe_argo:  0.4 },
  { depth:  100, oceanembed: 18.9, glorys: 18.2, argo: 18.5, error_oe_argo:  0.4 },
  { depth:  125, oceanembed: 16.1, glorys: 15.5, argo: 15.8, error_oe_argo:  0.3 },
  { depth:  150, oceanembed: 14.2, glorys: 13.6, argo: 13.9, error_oe_argo:  0.3 },
  { depth:  200, oceanembed: 12.1, glorys: 11.7, argo: 11.9, error_oe_argo:  0.2 },
  { depth:  300, oceanembed: 10.4, glorys: 10.0, argo: 10.2, error_oe_argo:  0.2 },
  { depth:  400, oceanembed:  9.1, glorys:  8.7, argo:  8.9, error_oe_argo:  0.2 },
  { depth:  500, oceanembed:  7.8, glorys:  7.4, argo:  7.6, error_oe_argo:  0.2 },
  { depth:  700, oceanembed:  6.2, glorys:  5.9, argo:  null, error_oe_argo: null },
  { depth: 1000, oceanembed:  5.1, glorys:  4.9, argo:  null, error_oe_argo: null },
];

export const MOCK_PROFILE_META = {
  lat: 12.0,
  lon: 80.0,
  date: "2023-10-15",
  period: "train" as "train" | "validation" | "test",
  note: "Gridded ARGO is spatially smoothed. Individual float values may differ.",
};
