// Mock validation data — shape matches GET /validation from Section 10
// SAMPLE DATA — replace with real experiment results

export const STANDARD_DEPTHS = [0, 10, 20, 30, 50, 75, 100, 125, 150, 200, 300, 400, 500, 700, 1000];

export interface DepthMetric {
  depth: number;
  rmse_oe: number;
  rmse_glorys: number;
  rmse_baseline: number;
  bias_oe: number;
  corr_oe: number;
}

export const MOCK_VALIDATION_DEPTH: DepthMetric[] = [
  { depth:    0, rmse_oe: 0.52, rmse_glorys: 0.48, rmse_baseline: 0.91, bias_oe:  0.04, corr_oe: 0.97 },
  { depth:   10, rmse_oe: 0.58, rmse_glorys: 0.54, rmse_baseline: 0.99, bias_oe:  0.05, corr_oe: 0.96 },
  { depth:   20, rmse_oe: 0.65, rmse_glorys: 0.61, rmse_baseline: 1.10, bias_oe:  0.06, corr_oe: 0.95 },
  { depth:   30, rmse_oe: 0.79, rmse_glorys: 0.74, rmse_baseline: 1.28, bias_oe:  0.08, corr_oe: 0.94 },
  { depth:   50, rmse_oe: 1.10, rmse_glorys: 1.03, rmse_baseline: 1.72, bias_oe:  0.11, corr_oe: 0.91 },
  { depth:   75, rmse_oe: 1.45, rmse_glorys: 1.38, rmse_baseline: 2.20, bias_oe:  0.14, corr_oe: 0.88 },
  { depth:  100, rmse_oe: 1.68, rmse_glorys: 1.55, rmse_baseline: 2.51, bias_oe:  0.18, corr_oe: 0.85 },
  { depth:  125, rmse_oe: 1.74, rmse_glorys: 1.62, rmse_baseline: 2.58, bias_oe:  0.20, corr_oe: 0.83 },
  { depth:  150, rmse_oe: 1.71, rmse_glorys: 1.58, rmse_baseline: 2.52, bias_oe:  0.19, corr_oe: 0.83 },
  { depth:  200, rmse_oe: 1.62, rmse_glorys: 1.50, rmse_baseline: 2.38, bias_oe:  0.17, corr_oe: 0.84 },
  { depth:  300, rmse_oe: 1.38, rmse_glorys: 1.28, rmse_baseline: 2.01, bias_oe:  0.14, corr_oe: 0.86 },
  { depth:  400, rmse_oe: 1.11, rmse_glorys: 1.03, rmse_baseline: 1.62, bias_oe:  0.11, corr_oe: 0.88 },
  { depth:  500, rmse_oe: 0.88, rmse_glorys: 0.82, rmse_baseline: 1.28, bias_oe:  0.09, corr_oe: 0.90 },
  { depth:  700, rmse_oe: 0.61, rmse_glorys: 0.57, rmse_baseline: 0.88, bias_oe:  0.06, corr_oe: 0.93 },
  { depth: 1000, rmse_oe: 0.42, rmse_glorys: 0.39, rmse_baseline: 0.61, bias_oe:  0.04, corr_oe: 0.95 },
];

export const MOCK_SUMMARY_METRICS = {
  rmse:        1.21,
  bias:        0.11,
  correlation: 0.89,
  mae:         0.93,
  skill_score: 0.34,
  // Reference: GLORYS vs ARGO
  ref_rmse:        1.13,
  ref_correlation: 0.91,
};

export const MOCK_EXPERIMENTS = [
  {
    id: "EXP-001",
    tried: "Baseline MLP (no embedding)",
    hypothesis: "Simple regression from surface inputs",
    results: { rmse_0_100: 1.82, rmse_100_500: 2.41, rmse_500_1000: 1.02 },
    decision: "DROP" as const,
    reason: "Skill score near zero at 100 m. Fails to capture thermocline structure.",
    seeds: [42, 7, 123],
    params: "128k",
    date: "2023-08-01",
  },
  {
    id: "EXP-002",
    tried: "CNN encoder on SST patch",
    hypothesis: "Spatial context in SST improves thermocline depth estimate",
    results: { rmse_0_100: 1.51, rmse_100_500: 1.98, rmse_500_1000: 0.89 },
    decision: "KEEP" as const,
    reason: "RMSE at 100 m reduced by 17 %. Retained as baseline encoder.",
    seeds: [42, 7, 123],
    params: "340k",
    date: "2023-08-08",
  },
  {
    id: "EXP-003",
    tried: "Add SLA as input",
    hypothesis: "Sea level anomaly encodes dynamic height and thermocline depth",
    results: { rmse_0_100: 1.38, rmse_100_500: 1.72, rmse_500_1000: 0.81 },
    decision: "KEEP" as const,
    reason: "Consistent 9 % improvement at 75–150 m across all seeds.",
    seeds: [42, 7, 123],
    params: "341k",
    date: "2023-08-15",
  },
  {
    id: "EXP-004",
    tried: "Transformer cross-attention (all inputs)",
    hypothesis: "Attention across input channels learns inter-variable structure",
    results: { rmse_0_100: 1.70, rmse_100_500: 2.10, rmse_500_1000: 0.96 },
    decision: "DROP" as const,
    reason: "Worse than EXP-003 despite 4× parameter count. Likely over-parameterised for training set size.",
    seeds: [42, 7, 123],
    params: "1.4M",
    date: "2023-08-22",
  },
  {
    id: "EXP-005",
    tried: "Physics-informed loss (Brunt–Väisälä penalty)",
    hypothesis: "Penalise statically unstable profiles",
    results: { rmse_0_100: 1.26, rmse_100_500: 1.61, rmse_500_1000: 0.76 },
    decision: "KEEP" as const,
    reason: "Reduces profile inversions by 82 %. RMSE also improves marginally.",
    seeds: [42, 7, 123],
    params: "341k",
    date: "2023-09-01",
  },
  {
    id: "EXP-006",
    tried: "Final model (EXP-003 + EXP-005, depth-band weighting)",
    hypothesis: "Combining all kept decisions",
    results: { rmse_0_100: 1.21, rmse_100_500: 1.57, rmse_500_1000: 0.72 },
    decision: "KEEP" as const,
    reason: "Best overall skill score. Selected as production model v0.1.",
    seeds: [42, 7, 123, 9, 55],
    params: "342k",
    date: "2023-09-10",
  },
];
