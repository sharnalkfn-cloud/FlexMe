export const Colors = {
  background: '#0A0A0C',
  surface: '#151316',
  surfaceMuted: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  red: '#E8213C',
  redDark: '#8C0F20',
  gold: '#F0B429',
  textPrimary: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.45)',
  textFaint: 'rgba(255,255,255,0.28)',
  green: '#2ED573',
};

export const Gradients = {
  red: ['#FF3B54', '#8C0F20'] as const,
  cardOverlay: ['transparent', 'rgba(0,0,0,0.92)'] as const,
};

export const Radius = {
  card: 16,
  pill: 100,
  button: 16,
};

export default Colors;
