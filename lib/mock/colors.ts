function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

function interpolate(colors: number[][], val: number) {
  val = Math.max(0, Math.min(1, val));
  if (val === 1) return colors[colors.length - 1];
  
  const idx = val * (colors.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  
  const c1 = colors[i];
  const c2 = colors[i + 1];
  
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f)
  ];
}

const THERMAL_STOPS = ["#042333", "#2C3395", "#744992", "#B15F82", "#EB7958", "#FBB43D", "#E8FA5B"].map(hexToRgb);
const HALINE_STOPS = ["#2A186C", "#1D5DA0", "#1F9E98", "#6DCB8C", "#FDEE99"].map(hexToRgb);
const DIVERGING_STOPS = ["#2B5D8A", "#F4F1EA", "#B5432A"].map(hexToRgb);

export function getThermalColor(val: number, min: number, max: number) {
  const norm = (val - min) / (max - min);
  const rgb = interpolate(THERMAL_STOPS, norm);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function getHalineColor(val: number, min: number, max: number) {
  const norm = (val - min) / (max - min);
  const rgb = interpolate(HALINE_STOPS, norm);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function getDivergingColor(val: number, min: number, max: number) {
  const norm = (val - min) / (max - min);
  const rgb = interpolate(DIVERGING_STOPS, norm);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
