export const Colors = {
  background: '#151417',
  surface: '#1E1D22',
  surfaceRaised: '#242329',
  surfaceMuted: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  reliefTop: 'rgba(255,255,255,0.07)',
  reliefBottom: 'rgba(0,0,0,0.35)',
  accent: '#6C5CE7',
  accentDark: '#3B2FA0',
  gold: '#F0B429',
  textPrimary: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.45)',
  textFaint: 'rgba(255,255,255,0.28)',
  green: '#2ED573',
};

export const Gradients = {
  accent: ['#8B7CFF', '#4A3FC7'] as const,
  cardOverlay: ['transparent', 'rgba(0,0,0,0.92)'] as const,
  reliefCard: ['#26252B', '#1A191D'] as const,
};

export const Radius = {
  card: 16,
  pill: 100,
  button: 16,
};

export default Colors;
