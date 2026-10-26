import styled, { keyframes } from 'styled-components';

export const INTERLUDE_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#D4FF3F',
    textPrimary: '#F2F2F5',
    textSecondary: '#B4B4BE',
    textMuted: '#72727E',
  },
  timing: {
    terminalLineDelay: 0.25,
    easeOut: 'power3.out',
    easeExpo: 'expo.out',
  },
};

const cursorBlink = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
`;

const neonNumberPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    text-shadow:
      0 0 22px rgba(212, 255, 63, 0.55),
      0 0 54px rgba(212, 255, 63, 0.26);
  }
  50% {
    transform: scale(1.045);
    text-shadow:
      0 0 34px rgba(212, 255, 63, 0.88),
      0 0 76px rgba(212, 255, 63, 0.45);
  }
`;

export const InterludeSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100svh;
  background: ${INTERLUDE_CONFIG.colors.bg};
  color: ${INTERLUDE_CONFIG.colors.textPrimary};
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: clamp(5rem, 12vh, 9rem) 0;
`;

/**
 * Мягкое фоновое свечение, которое вспыхивает в момент фиксации "2 мс" и "0".
 * Никаких сеток, точек или рамок.
 */
export const PingFlashAura = styled.div`
  position: absolute;
  left: 18%;
  top: 48%;
  width: 54vw;
  height: 54vw;
  max-width: 720px;
  max-height: 720px;
  transform: translate(-50%, -50%) scale(0.85);
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.22;
  background: radial-gradient(
    circle,
    rgba(212, 255, 63, 0.16) 0%,
    rgba(212, 255, 63, 0.04) 40%,
    transparent 70%
  );
  will-change: transform, opacity;
`;

/**
 * Слой со словами-отговорками ("лагает", "интернет упал", "мышка", "тиммейты"),
 * которые вылетают с разных сторон, дрожат (glitch) и улетают за границы экрана.
 */
export const ExcusesStage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
`;

export const ExcuseGhostWord = styled.span`
  position: absolute;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 3.6vw, 54px);
  font-weight: 800;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: rgba(242, 242, 245, 0.72);
  white-space: nowrap;
  user-select: none;
  opacity: 0;
  will-change: transform, opacity, filter;

  /* Тонкое перечёркивание-глитч без плашек и рамок */
  &::after {
    content: '';
    position: absolute;
    left: -4%;
    right: -4%;
    top: 52%;
    height: 2px;
    background: ${INTERLUDE_CONFIG.colors.neon};
    box-shadow: 0 0 12px ${INTERLUDE_CONFIG.colors.neon};
    transform: rotate(-4deg);
  }

  &:nth-child(1) {
    top: 20%;
    left: 14%;
  }

  &:nth-child(2) {
    top: 26%;
    right: 16%;
  }

  &:nth-child(3) {
    bottom: 24%;
    left: 22%;
  }

  &:nth-child(4) {
    bottom: 20%;
    right: 20%;
  }
`;

/**
 * Асимметричная сетка контента: слева гигантское высказывание, справа живой терминал и линия пакета.
 */
export const InterludeContainer = styled.div`
  position: relative;
  z-index: 4;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 7.5fr 4.5fr;
    gap: 4rem;
  }
`;

export const LeftEditorialColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

export const StatementHeading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(42px, 7.6vw, 116px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: ${INTERLUDE_CONFIG.colors.textPrimary};
  margin: 0 0 clamp(2.2rem, 4.5vh, 3.5rem) -0.02em;

  /* Просторный отступ внутри маски + снятие overflow после входа, чтобы свечение цифр 2 и 0 никогда не обрезалось */
  .line-mask {
    display: block;
    overflow: hidden;
    padding: 0.36em 0.55em;
    margin: -0.32em -0.55em;

    &[data-unclipped='true'] {
      overflow: visible;
    }
  }

  .line-inner {
    display: block;
    will-change: transform, opacity;
  }
`;

export const PingValueWrap = styled.span`
  display: inline-block;
  padding: 0 0.06em;
  color: ${INTERLUDE_CONFIG.colors.neon};
  font-variant-numeric: tabular-nums;
  transform-origin: center 56%;
  text-shadow:
    0 0 22px rgba(212, 255, 63, 0.55),
    0 0 54px rgba(212, 255, 63, 0.26);
  will-change: transform, text-shadow;

  &[data-pulsing='true'] {
    animation: ${neonNumberPulse} 2.8s ease-in-out infinite;
  }
`;

export const ZeroBloomValue = styled.span`
  display: inline-block;
  padding: 0 0.08em;
  color: ${INTERLUDE_CONFIG.colors.neon};
  transform-origin: center 56%;
  text-shadow:
    0 0 24px rgba(212, 255, 63, 0.65),
    0 0 58px rgba(212, 255, 63, 0.32);
  will-change: transform, text-shadow;

  &[data-pulsing='true'] {
    animation: ${neonNumberPulse} 2.8s ease-in-out 0.65s infinite;
  }
`;

export const ExcusesLabelText = styled.span`
  color: transparent;
  -webkit-text-stroke: 1.5px ${INTERLUDE_CONFIG.colors.textPrimary};
`;

/**
 * Характеристики внизу ОДНОЙ строкой через разделитель, моно-шрифтом, мелко:
 * Москва · 10 Гбит/с · Cisco
 */
export const BottomSpecsLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11px, 0.95vw, 13px);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${INTERLUDE_CONFIG.colors.textMuted};
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;

  .spec-char {
    display: inline-block;
    will-change: transform, opacity;
  }

  .spec-dot {
    color: ${INTERLUDE_CONFIG.colors.neon};
    margin: 0 0.25rem;
  }
`;

/**
 * Правая колонка: живая деталь — сырой терминальный вывод без рамок и карточек + линия импульса пакета.
 */
export const RightTerminalColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.4rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: end;
    width: 100%;
    max-width: 460px;
    padding-bottom: 0.5rem;
  }
`;

export const RawTerminalOutput = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11.5px, 1vw, 13.5px);
  line-height: 1.85;
  letter-spacing: 0.04em;
  color: ${INTERLUDE_CONFIG.colors.textSecondary};
  width: 100%;

  .term-line {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    will-change: transform, opacity;
  }

  .prompt {
    color: ${INTERLUDE_CONFIG.colors.neon};
    margin-right: 0.55rem;
    font-weight: 700;
  }

  .cmd {
    color: ${INTERLUDE_CONFIG.colors.textPrimary};
    font-weight: 600;
  }

  .ms-val {
    color: ${INTERLUDE_CONFIG.colors.neon};
    font-weight: 600;
  }

  .reply-token {
    margin-right: 0.95rem;
  }

  /* На мобильных терминал строго сжимается до 2 строк */
  .desktop-only-line {
    @media (max-width: 767px) {
      display: none;
    }
  }
`;

export const BlinkingCursor = styled.span`
  display: inline-block;
  width: 7px;
  height: 13px;
  margin-left: 6px;
  vertical-align: -2px;
  background: ${INTERLUDE_CONFIG.colors.neon};
  box-shadow: 0 0 10px ${INTERLUDE_CONFIG.colors.neon};
  animation: ${cursorBlink} 1.05s steps(1) infinite;
`;

/**
 * Живая линия пакета (импульс 2ms вдоль тонкой трассы).
 */
export const PacketTraceTrack = styled.div`
  position: relative;
  width: 100%;
  height: 1px;
  background: rgba(242, 242, 245, 0.14);
  overflow: hidden;
`;

export const PacketPulseBeam = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 72px;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    ${INTERLUDE_CONFIG.colors.neon} 75%,
    #ffffff 100%
  );
  box-shadow: 0 0 12px ${INTERLUDE_CONFIG.colors.neon};
  transform: translate3d(-100%, 0, 0);
  will-change: transform;
`;
