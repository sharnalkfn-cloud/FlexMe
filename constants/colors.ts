export const Colors = {
  background: '#060810',
  glassBg: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.08)',
  accent: '#dceeff',
  gold: '#e8b84b',
  textPrimary: '#f0f4ff',
  textMuted: 'rgba(240,244,255,0.32)',
  purple: '#7c5cff',
  blue: '#4a7cff',
  violet: '#9c5cff',
  red: '#ff4757',
  green: '#2ed573',
};

export const Gradients = {
  purpleBlue: ['#7c5cff', '#4a7cff'] as const,
  violetBlue: ['#9c5cff', '#4a7cff'] as const,
  gold: ['#f5cc6f', '#e8b84b'] as const,
  ambientPurple: ['rgba(124,92,255,0.35)', 'rgba(124,92,255,0)'] as const,
  ambientBlue: ['rgba(74,124,255,0.3)', 'rgba(74,124,255,0)'] as const,
  cardOverlay: ['transparent', 'rgba(0,0,0,0.97)'] as const,
};

export const Radius = {
  card: 18,
  pill: 100,
  button: 16,
};

export default Colors;
