// The only four hues allowed in the app.
export const COLORS = {
  teal: '#31AAA9',
  cream: '#F8E0A4',
  red: '#A82020',
  burgundy: '#6C1A1A',
};

// Translucent variant of a palette color, e.g. withAlpha(COLORS.cream, 0.2).
export function withAlpha(hex, alpha) {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
