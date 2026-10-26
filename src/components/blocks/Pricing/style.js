import styled, { css, keyframes } from 'styled-components';

/**
 * Конфигурация секции "03 Цены — Тарифная доска" (эстетика табло вокзала / split-flap).
 * Все параметры цветов, скорости флипа и скорости тикера вынесены в переменные.
 */
export const PRICING_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#D4FF3F',
    textPrimary: '#F2F2F5',
    textSecondary: '#B8B8C2',
    textMuted: '#72727E',
    line: 'rgba(242, 242, 245, 0.12)',
    lineStrong: 'rgba(242, 242, 245, 0.24)',
  },
  animation: {
    flapStepMs: 52,
    flapCyclesBase: 6,
    rowStaggerSec: 0.11,
    accordionDurationSec: 0.36,
    marqueeDurationSec: 26,
    dimmedOpacity: 0.35,
    easeOut: 'power3.out',
    easeExpo: 'expo.out',
  },
};

const hitDotBlink = keyframes`
  0%, 48% {
    opacity: 1;
    transform: scale(1);
  }
  50%, 100% {
    opacity: 0.2;
    transform: scale(0.82);
  }
`;

const hitBarPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 14px rgba(212, 255, 63, 0.32), 0 0 32px rgba(212, 255, 63, 0.12);
    opacity: 0.9;
  }
  50% {
    box-shadow: 0 0 24px rgba(212, 255, 63, 0.72), 0 0 54px rgba(212, 255, 63, 0.28);
    opacity: 1;
  }
`;

const marqueeScroll = keyframes`
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
`;

export const PricingSection = styled.section`
  position: relative;
  width: 100%;
  padding: clamp(5rem, 10vw, 8.5rem) 0 clamp(4rem, 8vw, 6.5rem);
  background: ${PRICING_CONFIG.colors.bg};
  color: ${PRICING_CONFIG.colors.textPrimary};
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    button,
    a,
    input {
      cursor: none;
    }
  }
`;

export const PricingContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

/* --- ШАПКА ДОСКИ (АСИММЕТРИЧНАЯ, БЕЗ ЦЕНТРИРОВАНИЯ) --- */

export const BoardHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: clamp(2rem, 4.5vw, 3.5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 7.5fr 4.5fr;
    align-items: end;
  }
`;

export const HeaderLeft = styled.div``;

export const HeaderKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textMuted};
  margin-bottom: 1.1rem;

  span {
    color: ${PRICING_CONFIG.colors.neon};
  }
`;

export const HeaderTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(36px, 6.6vw, 94px);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textPrimary};
  margin: 0;

  em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1.5px ${PRICING_CONFIG.colors.textPrimary};
  }
`;

export const HeaderNote = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  line-height: 1.72;
  letter-spacing: 0.04em;
  color: ${PRICING_CONFIG.colors.textMuted};
  max-width: 40ch;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: end;
    padding-bottom: 0.35rem;
  }
`;

/* --- ИНТЕРАКТИВНЫЙ ПОЛЗУНОК "СКОЛЬКО ЧАСОВ ИГРАЕШЬ?" (ФИКСИРОВАННАЯ ГЕОМЕТРИЯ БЕЗ ПРЫЖКОВ) --- */

export const CalculatorStrip = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  padding: 1.25rem 0 1.5rem;
  border-top: 1px solid ${PRICING_CONFIG.colors.line};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2.5rem;
  }
`;

export const SliderControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.65rem;
  flex-shrink: 0;

  @media (min-width: 540px) {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
`;

export const SliderLabel = styled.label`
  display: inline-flex;
  align-items: baseline;
  justify-content: space-between;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textSecondary};
  white-space: nowrap;
  flex-shrink: 0;

  strong {
    display: inline-block;
    min-width: 4.2ch;
    text-align: right;
    color: ${PRICING_CONFIG.colors.neon};
    font-size: 14px;
    font-weight: 700;
    margin-left: 0.5rem;
    font-variant-numeric: tabular-nums;
  }
`;

export const RangeInputWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  flex-shrink: 0;

  @media (min-width: 540px) {
    width: 240px;
  }
`;

export const HoursRangeInput = styled.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  background: linear-gradient(
    90deg,
    ${PRICING_CONFIG.colors.neon} ${({ $pct }) => $pct || 0}%,
    rgba(242, 242, 245, 0.22) ${({ $pct }) => $pct || 0}%
  );
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${PRICING_CONFIG.colors.neon};
    box-shadow: 0 0 14px rgba(212, 255, 63, 0.85);
    transition: transform 180ms ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: none;
    border-radius: 50%;
    background: ${PRICING_CONFIG.colors.neon};
    box-shadow: 0 0 14px rgba(212, 255, 63, 0.85);
    transition: transform 180ms ease;
  }

  &:focus-visible {
    outline: 1px solid ${PRICING_CONFIG.colors.neon};
    outline-offset: 6px;
  }
`;

export const CalculatorSummary = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  line-height: 1.5;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textMuted};
  font-variant-numeric: tabular-nums;
  min-height: 1.6em;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.3rem 0.6rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-content: flex-end;
    white-space: nowrap;
    flex-wrap: nowrap;
  }

  .highlight {
    color: ${PRICING_CONFIG.colors.neon};
    font-weight: 700;
  }

  .total-rub {
    color: ${PRICING_CONFIG.colors.textPrimary};
    font-weight: 700;
    font-size: 13px;
  }

  .sep {
    color: ${PRICING_CONFIG.colors.neon};
    opacity: 0.65;
  }
`;

/* --- ТАБЛО ТАРИФОВ (4 ГОРИЗОНТАЛЬНЫЕ СТРОКИ НА ВСЮ ШИРИНУ) --- */

export const PricingBoard = styled.div`
  border-top: 1px solid ${PRICING_CONFIG.colors.lineStrong};
  border-bottom: 1px solid ${PRICING_CONFIG.colors.lineStrong};
`;

export const BoardRowItem = styled.div`
  position: relative;
  border-bottom: 1px solid ${PRICING_CONFIG.colors.line};
  transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  opacity: ${({ $dimmed }) => ($dimmed ? PRICING_CONFIG.animation.dimmedOpacity : 1)};

  &:last-child {
    border-bottom: none;
  }

  /* Вертикальная полоса слева: постоянный отступ у всех строк, чтобы ничего не прыгало */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${PRICING_CONFIG.colors.neon};
    opacity: ${({ $isHit, $isBestValue }) => ($isHit ? 1 : $isBestValue ? 0.85 : 0)};
    transition: opacity 240ms ease;

    ${({ $isHit }) =>
      $isHit &&
      css`
        animation: ${hitBarPulse} 3s ease-in-out infinite;
      `}
  }
`;

/**
 * Основная интерактивная кнопка-строка.
 * На десктопе (>=1024px) — 6 колонок в ряд (табло вокзала).
 * На мобильных (<1024px) — чистая 2-колоночная строка: слева название + цена под ним, справа чёткий триггер.
 */
export const RowTriggerButton = styled.button`
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: inherit;
  padding: 1.35rem 0 1.35rem 1.15rem;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'meta action'
    'title action'
    'price action';
  gap: 0.35rem 1rem;
  align-items: center;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 1px solid ${PRICING_CONFIG.colors.neon};
    outline-offset: -2px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: clamp(1.6rem, 2.8vw, 2.3rem) 0 clamp(1.6rem, 2.8vw, 2.3rem) 1.35rem;
    grid-template-columns: 48px minmax(210px, 3fr) minmax(140px, 1.7fr) minmax(200px, 2.6fr) auto auto;
    grid-template-areas: none;
    gap: 1.5rem;
    align-items: baseline;
  }
`;

export const RowIndexCode = styled.span`
  grid-area: meta;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ $active }) =>
    $active ? PRICING_CONFIG.colors.neon : PRICING_CONFIG.colors.textMuted};
  font-variant-numeric: tabular-nums;

  .mobile-zone-inline {
    color: ${PRICING_CONFIG.colors.textSecondary};

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      display: none;
    }
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-area: auto;
    font-size: 11px;
  }
`;

export const RowTitleWrap = styled.span`
  grid-area: title;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4.6vw, 66px);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textPrimary};

  .title-mask {
    display: inline-block;
    overflow: hidden;
    padding-bottom: 0.05em;
  }

  .title-inner {
    display: inline-block;
    will-change: transform, opacity;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-area: auto;
  }
`;

/**
 * Мигающая салатовая точка у строки "ПроХит" (не бейдж и не плашка).
 */
export const HitBlinkDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${PRICING_CONFIG.colors.neon};
  box-shadow: 0 0 12px ${PRICING_CONFIG.colors.neon};
  animation: ${hitDotBlink} 1.4s ease-in-out infinite;
  flex-shrink: 0;
`;

export const OptimalHintText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.neon};
`;

export const RowZoneMeta = styled.span`
  display: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline;
  }
`;

export const RowKeySpec = styled.span`
  display: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  letter-spacing: 0.06em;
  color: ${PRICING_CONFIG.colors.textMuted};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline;
  }
`;

/* --- ЦЕНА С SPLIT-FLAP ЯЧЕЙКАМИ НА ДЕСКТОПЕ И ПОД НАЗВАНИЕМ НА МОБИЛЬНЫХ --- */

export const RowPriceCluster = styled.span`
  grid-area: price;
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  margin-top: 0.15rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-area: auto;
    margin-top: 0;
    justify-self: end;
  }
`;

export const SplitFlapPriceWrap = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 1px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(22px, 3.3vw, 46px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  color: ${({ $glow }) =>
    $glow ? PRICING_CONFIG.colors.neon : PRICING_CONFIG.colors.textPrimary};
  text-shadow: ${({ $glow }) =>
    $glow
      ? '0 0 22px rgba(212, 255, 63, 0.68), 0 0 48px rgba(212, 255, 63, 0.28)'
      : 'none'};
  transition:
    color 240ms ease,
    text-shadow 240ms ease;
  perspective: 420px;
`;

export const SplitFlapDigitCell = styled.span`
  position: relative;
  display: inline-block;
  min-width: ${({ $isSpace }) => ($isSpace ? '0.28em' : '0.6em')};
  text-align: center;
  transform-origin: 50% 55%;
  backface-visibility: hidden;
  will-change: transform, opacity;

  @media (min-width: 768px) {
    ${({ $isSpace }) =>
      !$isSpace &&
      css`
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 52%;
          height: 1px;
          background: rgba(7, 7, 10, 0.48);
          pointer-events: none;
        }
      `}
  }
`;

export const PriceUnitText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textMuted};
`;

export const SelectActionText = styled.span`
  grid-area: action;
  justify-self: end;
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ $active }) =>
    $active ? PRICING_CONFIG.colors.neon : PRICING_CONFIG.colors.textSecondary};
  transition: color 220ms ease;
  white-space: nowrap;

  .desktop-label {
    display: none;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      display: inline;
    }
  }

  .mobile-label {
    color: ${({ $active }) =>
      $active ? PRICING_CONFIG.colors.neon : PRICING_CONFIG.colors.textPrimary};
    border-bottom: 1px solid
      ${({ $active }) =>
        $active ? PRICING_CONFIG.colors.neon : 'rgba(242, 242, 245, 0.35)'};
    padding-bottom: 2px;

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      display: none;
    }
  }

  .arrow {
    display: inline-block;
    font-size: 13px;
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
    transform: translate3d(${({ $active }) => ($active ? '5px' : '0')}, 0, 0);
    color: ${PRICING_CONFIG.colors.neon};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-area: auto;
    align-self: baseline;
    font-size: 11px;
  }
`;

/* --- РАСКРЫВАЮЩАЯСЯ СТРОКА ПОЛНЫХ ХАРАКТЕРИСТИК (ЧЕРЕЗ РАЗДЕЛИТЕЛЬ "·") --- */

export const ExpandableDetailsPanel = styled.div`
  height: 0;
  opacity: 0;
  overflow: hidden;
  will-change: height, opacity;

  ${({ $reducedMotion, $expanded }) =>
    $reducedMotion &&
    css`
      height: ${$expanded ? 'auto' : '0'};
      opacity: ${$expanded ? 1 : 0};
    `}
`;

export const ExpandableInner = styled.div`
  padding: 0.15rem 0 1.45rem 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.95rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 0 1.65rem calc(48px + 1.5rem + 1.35rem);
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 2rem;
  }
`;

export const FullSpecsLine = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11.5px, 1vw, 13px);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textPrimary};
  line-height: 1.75;

  .dot-sep {
    color: ${PRICING_CONFIG.colors.neon};
    margin: 0 0.6rem;
  }
`;

export const QuickBookLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.neon};
  text-decoration: none;
  flex-shrink: 0;
  border-bottom: 1.5px solid ${PRICING_CONFIG.colors.neon};
  padding-bottom: 3px;
`;

/* --- БЕГУЩАЯ СТРОКА ВНИЗУ (MARQUEE, МОНО-ШРИФТ, РАЗДЕЛИТЕЛЬ "//") --- */

export const BottomPromoMarquee = styled.div`
  margin-top: clamp(2.2rem, 4.5vw, 3.5rem);
  padding: 1rem 0;
  border-top: 1px solid ${PRICING_CONFIG.colors.line};
  border-bottom: 1px solid ${PRICING_CONFIG.colors.line};
  overflow: hidden;
  user-select: none;
`;

export const PromoMarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  will-change: transform;
  animation: ${marqueeScroll} ${PRICING_CONFIG.animation.marqueeDurationSec}s linear infinite;

  ${({ $reducedMotion }) =>
    $reducedMotion &&
    css`
      animation: none;
      flex-wrap: wrap;
      width: 100%;
      gap: 0.75rem 1.5rem;
    `}
`;

export const PromoMarqueeItem = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${PRICING_CONFIG.colors.textSecondary};
  white-space: nowrap;

  .slashes {
    color: ${PRICING_CONFIG.colors.neon};
    font-weight: 700;
    margin: 0 1.6rem;
  }
`;

/* --- КАСТОМНЫЙ КУРСОР ДЛЯ ТАРИФНОЙ ДОСКИ --- */

export const BoardCursorFollower = styled.div`
  display: none !important;
`;

export const BoardCursorDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
  background: ${PRICING_CONFIG.colors.neon};
  color: #07070A;
  opacity: 0;
  transform: scale(0.3);
  transition:
    width 280ms cubic-bezier(0.16, 1, 0.3, 1),
    height 280ms cubic-bezier(0.16, 1, 0.3, 1),
    margin 280ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible='true'] {
    opacity: 1;
    transform: scale(1);
  }

  &[data-expanded='true'] {
    width: 78px;
    height: 78px;
    margin-left: -39px;
    margin-top: -39px;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 8.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 150ms ease;
    white-space: nowrap;
  }

  &[data-expanded='true'] span {
    opacity: 1;
  }
`;
