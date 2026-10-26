import { createGlobalStyle, css } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-variant-emoji: text;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: dark;
  }

  html.lenis,
  html.lenis body {
    height: auto;
  }

  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.body};
    background-color: ${({ theme }) => theme.colors.base};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    position: relative;
    z-index: 2;
    background-color: ${({ theme }) => theme.colors.base};
    box-shadow: 0 28px 64px rgba(0, 0, 0, 0.92);
  }

  section {
    scroll-margin-top: 84px;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.01em;
    text-wrap: balance;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  ul, ol {
    list-style: none;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.signal};
    color: #07070A;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #0A0A0E;
  }

  ::-webkit-scrollbar-thumb {
    background: #26262E;
    border-radius: 0;
    border: 2px solid #0A0A0E;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #3A3A44;
  }

  /* Общий моно-лейбл: цифры и технические подписи */
  .mono-label {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  /* Глобальное отключение системного курсора на десктопе — везде работает кастомный неоновый курсор */
  @media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
    html,
    body,
    *,
    *::before,
    *::after {
      cursor: none !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyles;
