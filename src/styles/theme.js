export const theme = {
  colors: {
    // Базовые поверхности
    base: '#07070A',
    surface: '#0C0C11',
    surfaceRaised: '#12121A',

    // Линии
    line: 'rgba(240, 240, 247, 0.08)',
    lineStrong: 'rgba(240, 240, 247, 0.22)',

    // Текст
    textPrimary: '#F2F2F5',
    textSecondary: '#B4B4BE',
    textMuted: '#7A7A86',

    // Акцент — единственный: сигнальный лайм. Фиолетовый убран полностью
    primary: '#D4FF3F',
    primaryDim: 'rgba(212, 255, 63, 0.12)',
    signal: '#D4FF3F',
    signalDim: 'rgba(212, 255, 63, 0.12)',
    success: '#3ED598',
    danger: '#FF6B6B',

    // Легаси-ключи (совместимость со старыми блоками)
    bgPrimary: '#07070A',
    bgSecondary: '#07070A',
    bgTertiary: '#12121A',
    bgCard: '#0C0C11',
    border: 'rgba(240, 240, 247, 0.08)',
    borderLight: 'rgba(240, 240, 247, 0.22)',
    accent: '#D4FF3F',
    primaryLight: '#E5FF80',
    primaryDark: '#A9CC2F',
    textDim: '#B4B4BE',
  },

  fonts: {
    heading: "'Tektur', 'Inter', sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'Martian Mono', 'JetBrains Mono', monospace",
  },

  fontSizes: {
    xs: '0.6875rem',
    sm: '0.8125rem',
    base: '1rem',
    lg: '1.0625rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Резкие углы — HUD-эстетика вместо «карточных» радиусов
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    full: '9999px',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.16, 1, 0.3, 1)',
    normal: '250ms cubic-bezier(0.16, 1, 0.3, 1)',
    slow: '500ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  layout: {
    containerWidth: '1360px',
    gutter: 'clamp(20px, 4vw, 48px)',
  },

  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    glow: 'none',
    glowStrong: 'none',
  },
};

export const media = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
};

export default theme;
