import styled, { css, keyframes } from 'styled-components';

/**
 * Конфигурация футера CyberArena:
 * Все параметры режима работы, скорости заливки, цветов и отступов вынесены в переменные.
 * Цвет textMuted (#9898A6) подобран с контрастом > 5.8:1 на фоне #07070A (требование WCAG >= 4.5:1).
 */
export const FOOTER_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#B6FF00',
    neonSoft: 'rgba(182, 255, 0, 0.22)',
    textPrimary: '#F2F2F5',
    textSecondary: '#C4C4D0',
    textMuted: '#9898A6', // Контраст 6.6:1 на #07070A (>= 4.5:1)
    line: 'rgba(242, 242, 245, 0.14)',
    lineStrong: 'rgba(242, 242, 245, 0.28)',
  },
  workHours: {
    timeZone: 'Europe/Moscow',
    openHour: 10, // 10:00
    closeHour: 2, // 02:00
    scheduleLabel: 'Ежедневно 10:00 — 02:00',
  },
  animation: {
    navStaggerSec: 0.06, // 60 мс между строками навигации
    navRevealDurationSec: 0.75,
    logoFillDurationSec: 0.85,
    logoFadeDurationSec: 0.9,
    logoLetterStaggerSec: 0.045,
    scrollTopDurationSec: 1.5,
    hoverShiftPx: 12,
    letterMaxLiftPx: 6,
  },
};

const C = FOOTER_CONFIG.colors;
const GUTTER = ({ theme }) => theme.layout?.gutter || 'clamp(20px, 4vw, 48px)';

const statusDotPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.36);
    opacity: 0.38;
  }
`;

const bottomGlowDrift = keyframes`
  0%, 100% {
    transform: translate3d(-18%, 0, 0) scale(1);
    opacity: 0.85;
  }
  50% {
    transform: translate3d(18%, -4%, 0) scale(1.08);
    opacity: 1;
  }
`;

/**
 * На десктопе (>= 768px) и без prefers-reduced-motion футер лежит под <main>
 * (position: sticky; bottom: 0; z-index: 1), а секция «07 Контакты» уезжает вверх как занавес.
 * На мобильных и при reduced-motion — обычный футер в потоке.
 */
export const FooterWrapper = styled.footer`
  position: relative;
  z-index: 1;
  width: 100%;
  background: ${C.bg};
  color: ${C.textPrimary};
  padding-top: clamp(3.5rem, 7vw, 6.25rem);
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    ${({ $reducedMotion }) =>
      !$reducedMotion &&
      css`
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
      `}
  }

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    a,
    button {
      cursor: none;
    }
  }
`;

/**
 * Фоновое зерно и едва заметное дрейфующее салатовое свечение у нижнего края.
 */
export const FooterGrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
`;

export const BottomAmbientGlow = styled.div`
  position: absolute;
  left: 50%;
  bottom: -24%;
  width: 76vw;
  height: 36vw;
  max-width: 1100px;
  max-height: 440px;
  margin-left: -38vw;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(182, 255, 0, 0.11) 0%,
    rgba(182, 255, 0, 0.035) 45%,
    transparent 72%
  );
  will-change: transform, opacity;
  animation: ${({ $reducedMotion }) =>
    $reducedMotion ? 'none' : css`${bottomGlowDrift} 14s ease-in-out infinite`};
`;

export const FooterContainer = styled.div`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0 ${GUTTER};
`;

/* ============================================================================
 * 1. ВЕРХ: КРАТКОЕ ОПИСАНИЕ КЛУБА СЛЕВА (КРУПНЫЙ ТЕКСТ, МАКСИМУМ 3 СТРОКИ)
 * И 2. НАВИГАЦИЯ В 2 КОЛОНКИ С НОМЕРАМИ 01..06
 * ========================================================================== */

export const TopEditorialLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2.5rem, 5vw, 4rem);
  padding-bottom: clamp(2.5rem, 5vw, 4rem);
  border-bottom: 1px solid ${C.line};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 5.6fr 6.4fr;
    align-items: start;
    gap: clamp(2.5rem, 4.2vw, 4.5rem);
  }
`;

export const ClubLeadStatement = styled.p`
  margin: 0;
  max-width: 44ch;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(18px, 1.52vw, 22px);
  font-weight: 700;
  line-height: 1.32;
  letter-spacing: -0.015em;
  color: ${C.textPrimary};
`;

export const FooterNavGrid = styled.nav`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem 2.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const NavLineMask = styled.div`
  overflow: hidden;
  border-bottom: 1px solid ${C.line};
`;

export const NavRowLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  padding: 0.65rem 0;
  text-decoration: none;
  color: ${C.textPrimary};
  will-change: transform, opacity;
  transition:
    transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    color 0.22s ease;

  .nav-left {
    display: inline-flex;
    align-items: baseline;
    gap: 0.85rem;
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-idx {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: ${C.textMuted};
    transition:
      color 0.22s ease,
      text-shadow 0.22s ease;
  }

  .nav-label {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(19px, 1.9vw, 27px);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    transition: color 0.22s ease;
  }

  .nav-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${C.neon};
    opacity: 0;
    transform: translate3d(-10px, 0, 0);
    transition:
      opacity 0.25s ease,
      transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
      width: 18px;
      height: 18px;
      display: block;
    }
  }

  &:hover,
  &:focus-visible {
    outline: none;
    color: ${C.neon};

    .nav-left {
      transform: translate3d(${FOOTER_CONFIG.animation.hoverShiftPx}px, 0, 0);
    }

    .nav-idx {
      color: ${C.neon};
      text-shadow: 0 0 12px rgba(182, 255, 0, 0.55);
    }

    .nav-label {
      color: ${C.neon};
    }

    .nav-arrow {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

/* ============================================================================
 * 3. КОМПАКТНЫЕ КОНТАКТЫ МОНО-ШРИФТОМ И 4. ЖИВАЯ СТРОКА ВРЕМЕНИ И СТАТУСА МСК
 * ========================================================================== */

export const TelemetryStrip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: clamp(1.35rem, 2.5vw, 2rem) 0;
  border-bottom: 1px solid ${C.line};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11px, 0.92vw, 12.5px);
  line-height: 1.6;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }
`;

export const CompactContactsLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.75rem;
  color: ${C.textSecondary};

  a {
    color: ${C.textPrimary};
    text-decoration: none;
    border-bottom: 1px solid rgba(242, 242, 245, 0.24);
    padding-bottom: 1px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      min-height: 0;
    }

    &:hover,
    &:focus-visible {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
      outline: none;
    }
  }

  .sep-dot {
    color: ${C.textMuted};
  }
`;

/* ============================================================================
 * 5. ГИГАНТСКИЙ ЛОГОТИП CYBERARENA НА ВСЮ ШИРИНУ
 * ========================================================================== */

export const WordmarkBleedViewport = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(1.2rem, 2.4vw, 2.2rem) ${GUTTER} 0;
  box-sizing: border-box;
  user-select: none;

  @media (max-width: 767px) {
    padding: 1.4rem ${GUTTER} 0.65rem;
  }
`;

export const WordmarkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
  gap: 0.14em 0;
  transform: none;
  margin-top: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-wrap: nowrap;
    gap: 0;
    /* На десктопе слегка срезаем нижние ~10% высоты гигантских букв нижним краем */
    transform: translate3d(0, 10%, 0);
    margin-top: -1.5%;
  }

  .word-group {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      width: auto;
      display: contents;
    }
  }
`;

export const WordmarkChar = styled.span`
  position: relative;
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(54px, 11.4vw, 174px);
  font-weight: 900;
  line-height: 0.84;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(242, 242, 245, 0.34);
  will-change: transform;
  transition:
    transform 0.26s cubic-bezier(0.16, 1, 0.3, 1),
    -webkit-text-stroke-color 0.26s ease;

  @media (max-width: 767px) {
    font-size: clamp(50px, 16.5vw, 104px);
    line-height: 0.94;
  }

  /* Внутренний слой салатовой заливки буквы (поднимается снизу вверх через clip-path) */
  .char-fill {
    position: absolute;
    inset: 0;
    color: ${C.neon};
    -webkit-text-stroke: 1.5px ${C.neon};
    text-shadow: 0 0 28px rgba(182, 255, 0, 0.42);
    clip-path: inset(100% 0 0 0);
    opacity: 0.95;
    pointer-events: none;
    will-change: clip-path, opacity;
  }
`;

export const SrOnlyText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

/* ============================================================================
 * 6. НИЖНЯЯ СТРОКА: КОПИРАЙТ, ПОЛИТИКА, ПРАВИЛА И КНОПКА «ПЕРЕЗАГРУЗИТЬ ↑»
 * ========================================================================== */

export const BottomBarWrap = styled.div`
  position: relative;
  z-index: 3;
  border-top: 1px solid ${C.lineStrong};
  background: ${C.bg};
`;

export const BottomBarInner = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 1.25rem ${GUTTER} 1.6rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem 2rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`;

export const CopyrightLabel = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  color: ${C.textMuted};

  .brand-slashes {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 14px;
    font-weight: 900;
    letter-spacing: -0.06em;
    color: ${C.neon};
    text-shadow: 0 0 12px rgba(182, 255, 0, 0.45);
  }

  .copy-year {
    color: ${C.textMuted};
    font-variant-numeric: tabular-nums;
  }

  .copy-brand {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: ${C.textPrimary};
  }

  .copy-dot {
    color: ${C.neon};
    font-weight: 700;
  }

  .copy-city {
    color: ${C.textSecondary};
  }
`;

export const BottomRightCluster = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.75rem;
`;

export const LegalDocLink = styled.a`
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: ${C.textMuted};
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition:
    color 0.2s ease,
    border-color 0.2s ease;

  &:hover,
  &:focus-visible {
    color: ${C.textPrimary};
    border-bottom-color: ${C.neon};
    outline: none;
  }
`;

export const MagneticRebootButton = styled.button`
  min-height: 44px;
  padding: 0.35rem 0;
  background: transparent;
  border: none;
  color: ${C.neon};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  will-change: transform;
  transition: color 0.2s ease;

  .up-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
      width: 13px;
      height: 13px;
      display: block;
    }
  }

  &:hover,
  &:focus-visible {
    color: ${C.textPrimary};
    outline: none;

    .up-arrow {
      color: ${C.neon};
      transform: translate3d(0, -4px, 0);
    }
  }
`;

/* ============================================================================
 * МОДАЛЬНОЕ ОКНО ДЛЯ ПРОСМОТРА ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ И ПРАВИЛ КЛУБА
 * ========================================================================== */

export const LegalModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  background: rgba(5, 5, 8, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${GUTTER};
  box-sizing: border-box;
`;

export const LegalModalSheet = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 82vh;
  overflow-y: auto;
  background: #0b0b10;
  border-top: 2px solid ${C.neon};
  border-bottom: 1px solid ${C.lineStrong};
  padding: clamp(1.5rem, 3.5vw, 2.5rem);
  color: ${C.textPrimary};

  .modal-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 1rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid ${C.line};
  }

  h3 {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(20px, 2.4vw, 30px);
    text-transform: uppercase;
    color: ${C.neon};
  }

  .modal-close {
    min-height: 44px;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    color: ${C.textSecondary};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.16em;
    text-transform: uppercase;

    &:hover {
      color: ${C.neon};
    }
  }

  .modal-body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 14.5px;
    line-height: 1.68;
    color: ${C.textSecondary};
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
`;

/* ============================================================================
 * КАСТОМНЫЙ КУРСОР ФУТЕРА
 * ========================================================================== */

export const FooterCursorFollower = styled.div`
  display: none !important;
`;

export const FooterCursorDot = styled.div`
  display: none !important;
`;
