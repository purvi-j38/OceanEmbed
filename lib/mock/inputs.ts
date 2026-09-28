// Surface input fields shown in the Inspector
// Exactly 7 inputs: SST, SSS, SLA, current U/V (OSCAR), wind U/V (CCMP)

export const MOCK_INPUTS = [
  {
    name: "SST (OSTIA)",
    abbr: "SST",
    flag: false,
    gradient: "linear-gradient(135deg, #1B4F72 0%, #C0392B 100%)",
  },
  {
    name: "Sea Level (DUACS)",
    abbr: "SLA",
    flag: false,
    gradient: "linear-gradient(135deg, #154360 0%, #2ECC71 100%)",
  },
  {
    name: "Salinity (multi-obs)",
    abbr: "SSS",
    flag: true, // interpolated
    gradient: "linear-gradient(135deg, #1A5276 0%, #27AE60 100%)",
  },
  {
    name: "Current U (OSCAR)",
    abbr: "U",
    flag: false,
    gradient: "linear-gradient(135deg, #4A235A 0%, #E8DAEF 100%)",
  },
  {
    name: "Current V (OSCAR)",
    abbr: "V",
    flag: false,
    gradient: "linear-gradient(135deg, #512E5F 0%, #D2B4DE 100%)",
  },
  {
    name: "Wind U (CCMP)",
    abbr: "Wu",
    flag: false,
    gradient: "linear-gradient(135deg, #1B2631 0%, #85929E 100%)",
  },
  {
    name: "Wind V (CCMP)",
    abbr: "Wv",
    flag: false,
    gradient: "linear-gradient(135deg, #2C3E50 0%, #BDC3C7 100%)",
  },
];
