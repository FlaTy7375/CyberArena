export const theme = {
  colors: {
    // Primary colors
    primary: '#7C3AED',
    primaryLight: '#A855F7',
    primaryDark: '#5B21B6',
    
    // Background colors
    bgPrimary: '#000000',
    bgSecondary: '#0A0A0A',
    bgTertiary: '#1A1A1A',
    bgCard: '#141414',
    
    // Text colors
    textPrimary: '#FFFFFF',
    textSecondary: '#E5E5E5',
    textMuted: '#A1A1AA',
    
    // Accent colors
    accent: '#A855F7',
    accentGlow: 'rgba(168, 85, 247, 0.5)',
    
    // Neon glow
    neonPurple: '#A855F7',
    neonGlow: '0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)',
    neonGlowStrong: '0 0 30px rgba(168, 85, 247, 0.7), 0 0 60px rgba(168, 85, 247, 0.5)',
    
    // Gradients
    gradientPrimary: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    gradientDark: 'linear-gradient(180deg, #0A0A0A 0%, #000000 100%)',
    gradientOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%)',
    
    // Border
    border: '#2D2D2D',
    borderLight: '#3D3D3D',
  },
  
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Roboto Mono', monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
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
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(168, 85, 247, 0.3)',
    glowStrong: '0 0 40px rgba(168, 85, 247, 0.5)',
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
