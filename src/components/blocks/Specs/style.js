import styled, { css, keyframes } from 'styled-components';

/**
 * Конфигурация секции "05 Железо — Железо без компромиссов".
 * Цвета и тайминги — в одном месте, как и в остальных секциях.
 */
export const HW_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#B6FF00',
    textPrimary: '#F2F2F5',
    textSecondary: '#B8B8C2',
    textMuted: '#72727E',
    hairline: 'rgba(242, 242, 245, 0.14)',
  },
  layout: {
    // Размеры viewBox схем — от них считаются проценты позиций выносок
    deskViewW: 1400,
    deskViewH: 780,
    mobileViewW: 360,
    mobileViewH: 470,
    headerOffset: '76px',
  },
};

const C = HW_CONFIG.colors;
const LG = ({ theme }) => theme.breakpoints.lg;

/* --- Фон: медленный дрейф свечения (только transform) --- */

const glowDrift = keyframes`
  0%   { transform: translate(-50%, -50%) translate3d(0, 0, 0); }
  50%  { transform: translate(-50%, -50%) translate3d(4vw, -3vh, 0); }
  100% { transform: translate(-50%, -50%) translate3d(-3vw, 4vh, 0); }
`;

export const HardwareSection = styled.section`
  position: relative;
  width: 100%;
  padding: clamp(5.5rem, 11vw, 9.5rem) 0 clamp(5rem, 10vw, 8.5rem);
  background: ${C.bg};
  color: ${C.textPrimary};
  overflow-x: hidden;
  overflow-x: clip;

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    button {
      cursor: none;
    }
  }
`;

/**
 * Салатовое свечение: у каждой сцены своё положение ($x / $y в процентах сцены).
 */
export const SceneGlow = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $size }) => $size || '62vw'};
  height: ${({ $size }) => $size || '62vw'};
  max-width: 860px;
  max-height: 860px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    circle,
    rgba(182, 255, 0, 0.12) 0%,
    rgba(182, 255, 0, 0.035) 42%,
    transparent 70%
  );
  transform: translate(-50%, -50%);
  animation: ${glowDrift} ${({ $duration }) => $duration || 24}s ease-in-out
    infinite alternate;
  will-change: transform;

  @media (max-width: 1023px) {
    width: 110vw;
    height: 110vw;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const HwContainer = styled.div`
  position: relative;
  z-index: 2;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

/* --- ВВОДНЫЙ БЛОК --- */

export const IntroGrid = styled.div`
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.75rem;
  margin-bottom: clamp(2.5rem, 6vw, 4.5rem);

  @media (min-width: ${LG}) {
    grid-template-columns: 8fr 4fr;
    align-items: end;
  }
`;

export const MonoKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.textMuted};
  margin-bottom: ${({ $tight }) => ($tight ? '0' : '1.15rem')};

  b {
    font-weight: 600;
    color: ${C.neon};
  }
`;

const lineMaskCss = css`
  .line-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
  }

  .line-inner {
    display: block;
    will-change: transform, opacity;
  }
`;

export const HwTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(40px, 8.2vw, 128px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.045em;
  text-transform: uppercase;
  margin: 0;
  ${lineMaskCss}

  .line-mask:nth-child(2) {
    padding-left: 0.9em;
  }

  em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1.5px ${C.neon};
  }
`;

export const IntroNote = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  line-height: 1.75;
  letter-spacing: 0.04em;
  color: ${C.textSecondary};
  max-width: 38ch;
  margin: 0;

  @media (min-width: ${LG}) {
    padding-bottom: 0.5rem;
  }
`;

/* --- СЦЕНА A: СХЕМА РАБОЧЕГО МЕСТА (PIN) --- */

export const SchematicStage = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  overflow: clip;
  z-index: 2;

  @media (min-width: ${LG}) {
    height: 100vh;
    min-height: 620px;
    display: flex;
    flex-direction: column;
    padding: clamp(92px, 12vh, 124px) 0 clamp(20px, 4vh, 44px);
  }

  @media (max-width: 1023px) {
    padding-bottom: 1rem;
  }
`;

export const StageInner = styled(HwContainer)`
  width: 100%;

  @media (min-width: ${LG}) {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
`;

/**
 * Гигантское контурное слово зоны (PRO / STD), уходит за левый край экрана.
 */
export const GhostWordStack = styled.div`
  position: absolute;
  left: -3vw;
  bottom: -4vh;
  z-index: 0;
  pointer-events: none;
  user-select: none;

  @media (max-width: 1023px) {
    top: 5.5rem;
    bottom: auto;
    left: auto;
    right: -6vw;
  }
`;

export const GhostWord = styled.span`
  position: absolute;
  left: 0;
  bottom: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(150px, 31vw, 520px);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1.5px
    ${({ $pro }) =>
      $pro ? 'rgba(182, 255, 0, 0.16)' : 'rgba(242, 242, 245, 0.1)'};
  white-space: nowrap;
  opacity: 0;
  transform: translate3d(0, 8%, 0);
  transition:
    opacity 520ms ease,
    transform 700ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-active='true'] {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  @media (max-width: 1023px) {
    left: auto;
    right: 0;
    bottom: auto;
    top: 0;
    font-size: 46vw;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const StageTopRow = styled.div`
  position: relative;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2.5rem;

  @media (max-width: 1023px) {
    /* Тумблер закреплён сверху сцены на мобильных */
    position: sticky;
    top: ${HW_CONFIG.layout.headerOffset};
    padding: 0.85rem 0 1.4rem;
    background: linear-gradient(
      180deg,
      ${C.bg} 0%,
      ${C.bg} 72%,
      rgba(7, 7, 10, 0) 100%
    );
  }
`;

export const StageMeta = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${C.textMuted};
  line-height: 1.7;

  @media (max-width: 1023px) {
    display: none;
  }
`;

/* --- ТУМБЛЕР STANDARD ⇄ PRO (radiogroup, без плашек и рамок) --- */

export const ZoneToggle = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: clamp(0.6rem, 1.4vw, 1.2rem);
`;

export const ZoneOption = styled.button`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  padding: 0.2rem 0;
  background: transparent;
  border: none;
  color: ${C.textPrimary};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(19px, 2.3vw, 34px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0.3;
  transition: opacity 240ms ease;
  -webkit-tap-highlight-color: transparent;

  .zone-mark {
    display: inline-block;
    width: 7px;
    height: 7px;
    background: ${C.neon};
    transform: translateY(-0.28em) scale(0);
    transition: transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .zone-sub {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.16em;
    color: ${C.textMuted};

    @media (max-width: 520px) {
      display: none;
    }
  }

  &:hover {
    opacity: 0.6;
  }

  &[aria-checked='true'] {
    opacity: 1;

    .zone-mark {
      transform: translateY(-0.28em) scale(1);
    }
  }

  ${({ $pro }) =>
    $pro &&
    css`
      &[aria-checked='true'] {
        color: ${C.neon};
        text-shadow: 0 0 22px rgba(182, 255, 0, 0.35);
      }
    `}

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 6px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    .zone-mark {
      transition: none;
    }
  }
`;

export const ZoneSwapGlyph = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(16px, 1.6vw, 22px);
  color: ${C.neon};
  transition: transform 460ms cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;

  &[data-zone='standard'] {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/* --- РАМКА СХЕМЫ И SVG --- */

export const SchematicFrame = styled.div`
  position: relative;
  z-index: 2;

  @media (min-width: ${LG}) {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 1.25rem;
  }
`;

export const SchematicBox = styled.div`
  position: relative;
  width: 100%;

  @media (min-width: ${LG}) {
    width: min(
      100%,
      calc(
        (100vh - 260px) * ${HW_CONFIG.layout.deskViewW / HW_CONFIG.layout.deskViewH}
      )
    );
    aspect-ratio: ${HW_CONFIG.layout.deskViewW} / ${HW_CONFIG.layout.deskViewH};
  }
`;

export const PulseHalo = styled.div`
  position: absolute;
  inset: 8% 14%;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(182, 255, 0, 0.16) 0%,
    rgba(182, 255, 0, 0.04) 45%,
    transparent 72%
  );
  opacity: 0;
  z-index: 0;
`;

export const SvgBox = styled.div`
  position: relative;
  z-index: 1;
  will-change: transform;

  @media (min-width: ${LG}) {
    position: absolute;
    inset: 0;
  }

  @media (max-width: 1023px) {
    width: 100%;
    max-width: 440px;
    aspect-ratio: ${HW_CONFIG.layout.mobileViewW} / ${HW_CONFIG.layout.mobileViewH};
  }
`;

const schematicStrokes = css`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;

  .draw {
    fill: none;
    stroke: ${C.neon};
    stroke-linecap: square;
    stroke-linejoin: miter;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .draw--soft {
    opacity: 0.45;
  }

  .leader {
    fill: none;
    stroke: ${C.neon};
    stroke-linecap: square;
    stroke-linejoin: miter;
    opacity: 0.7;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .leader-dot {
    fill: ${C.neon};
  }

  .device-tag {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-weight: 600;
    letter-spacing: 0.08em;
    fill: ${C.neon};
  }
`;

export const DeskSvg = styled.svg`
  ${schematicStrokes}

  .draw {
    stroke-width: 1.7;
  }

  .leader {
    stroke-width: 1.3;
  }

  @media (max-width: 1023px) {
    display: none;
  }
`;

export const MobileDeskSvg = styled.svg`
  ${schematicStrokes}

  .draw {
    stroke-width: 1.4;
  }

  .device-tag {
    font-size: 11px;
  }

  @media (min-width: ${LG}) {
    display: none;
  }
`;

/* --- ВЫНОСКИ (на ПК — поверх схемы, на мобильных — списком под ней) --- */

export const CalloutLayer = styled.div`
  position: relative;
  z-index: 3;

  @media (min-width: ${LG}) {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  @media (max-width: 1023px) {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
    margin-top: 2rem;
  }
`;

export const Callout = styled.div`
  @media (min-width: ${LG}) {
    position: absolute;
    top: calc(var(--y) * 1%);
    transform: translateY(-50%);
    width: max-content;
    max-width: 23%;

    &[data-side='left'] {
      right: calc(100% - var(--x) * 1%);
      text-align: right;
    }

    &[data-side='right'] {
      left: calc(var(--x) * 1%);
      text-align: left;
    }
  }
`;

export const CalloutInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  will-change: transform, opacity;

  @media (min-width: ${LG}) {
    ${Callout}[data-side='left'] & {
      align-items: flex-end;
    }
  }

  .callout-head {
    display: inline-flex;
    align-items: baseline;
    gap: 0.6rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${C.textMuted};
    white-space: nowrap;
  }

  .callout-idx {
    color: ${C.neon};
    opacity: 0.8;
  }

  .callout-diff {
    color: ${C.neon};
    font-weight: 600;
    letter-spacing: 0.08em;
    opacity: 0;
    transform: translate3d(-6px, 0, 0);
    transition:
      opacity 260ms ease,
      transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .callout-value {
    position: relative;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(12.5px, 1.08vw, 15.5px);
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.25;
    color: ${C.textPrimary};
    white-space: nowrap;
  }

  &[data-win='true'] {
    .callout-value {
      color: ${C.neon};
      text-shadow: 0 0 16px rgba(182, 255, 0, 0.42);
    }

    .callout-diff {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media (max-width: 1023px) {
    .callout-value {
      font-size: 15px;
      white-space: normal;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .callout-diff {
      transition: none;
    }
  }
`;

/* --- СЦЕНА B: МАШИНА №1 = МАШИНА №20 --- */

export const SyncScene = styled.div`
  position: relative;
  padding-top: clamp(6rem, 13vw, 11rem);
`;

export const SyncHeadline = styled.h3`
  position: relative;
  z-index: 2;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(60px, 13vw, 230px);
  font-weight: 800;
  line-height: 0.84;
  letter-spacing: -0.055em;
  text-transform: uppercase;
  white-space: nowrap;
  margin: 0 0 0 -0.04em;
  ${lineMaskCss}

  .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(242, 242, 245, 0.55);
  }

  .eq {
    color: ${C.neon};
    padding: 0 0.08em;
  }
`;

export const SyncSubRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;

  p {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    line-height: 1.75;
    letter-spacing: 0.06em;
    color: ${C.textSecondary};
    max-width: 40ch;
    margin: 0;
  }

  @media (max-width: 1023px) {
    justify-content: flex-start;
  }
`;

export const MachinesRow = styled.div`
  --gap: clamp(4px, 0.65vw, 12px);
  --sil-h: 48px;
  position: relative;
  z-index: 2;
  display: flex;
  gap: var(--gap);
  margin-top: clamp(3rem, 6vw, 5rem);

  @media (max-width: 1023px) {
    --sil-h: 34px;
    flex-direction: column;
    gap: 1.75rem;
  }
`;

export const MachinesGroup = styled.div`
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
  gap: var(--gap);

  @media (max-width: 1023px) {
    gap: 6px;
  }
`;

export const MachineUnit = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .sil {
    position: relative;
    height: var(--sil-h);
    aspect-ratio: 40 / 64;
  }

  .sil svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .sil-dim {
    color: rgba(242, 242, 245, 0.2);
  }

  .sil-lit {
    color: ${C.neon};
    will-change: opacity;
  }

  .sil-glow {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 260%;
    height: 180%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(
      ellipse at center,
      rgba(182, 255, 0, 0.26) 0%,
      rgba(182, 255, 0, 0.06) 45%,
      transparent 70%
    );
    will-change: opacity;
  }

  .bar {
    position: relative;
    width: 100%;
    height: 2px;
    margin-top: 0.75rem;
    background: rgba(242, 242, 245, 0.12);
    overflow: hidden;
  }

  .bar-fill {
    position: absolute;
    inset: 0;
    background: ${C.neon};
    transform-origin: left center;
    transform: scaleX(var(--mark));
    will-change: transform;
  }

  .num {
    margin-top: 0.5rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.06em;
    font-variant-numeric: tabular-nums;
    color: ${C.textMuted};
  }

  @media (max-width: 1023px) {
    .bar {
      margin-top: 0.55rem;
    }

    .num {
      font-size: 9px;
      letter-spacing: 0;
    }
  }
`;

/**
 * Линия-финиш: пересекает ряд машин по середине силуэтов (scaleX слева направо).
 */
export const FinishLine = styled.span`
  position: absolute;
  left: 0;
  right: ${({ $bridge }) => ($bridge ? 'calc(-1 * var(--gap))' : '0')};
  top: calc(var(--sil-h) * 0.5);
  height: 1.5px;
  background: ${C.neon};
  box-shadow: 0 0 12px rgba(182, 255, 0, 0.7);
  transform-origin: left center;
  z-index: 3;
  pointer-events: none;
  will-change: transform;

  @media (max-width: 1023px) {
    right: 0;
  }
`;

export const SyncCaptionRow = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem 3rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
`;

export const SyncCaption = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(34px, 5.8vw, 92px);
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  margin: 0;
  ${lineMaskCss}

  .line-mask:nth-child(2) {
    padding-left: 1.4em;
    color: ${C.neon};
  }
`;

export const SyncReadout = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${C.textMuted};
  margin: 0;
  padding-bottom: 0.4rem;

  b {
    color: ${C.neon};
    font-weight: 600;
  }
`;

/* --- СЦЕНА C: ПОЛОСА ЦИФР --- */

export const StatsScene = styled.div`
  position: relative;
  padding-top: clamp(6rem, 12vw, 10rem);
`;

export const StatsStrip = styled.ul`
  position: relative;
  z-index: 2;
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  row-gap: 2rem;
  overflow: visible;

  @media (max-width: 1023px) {
    flex-direction: column;
    row-gap: 0;
    margin-right: 0;
    padding-right: 0;
    border-top: 1px solid ${C.hairline};
  }
`;

export const StatItem = styled.li`
  flex: 1 1 auto;
  min-width: max-content;
  padding: 0.35rem clamp(14px, 1.5vw, 24px);
  border-left: 1px solid ${C.hairline};
  will-change: transform, opacity;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }

  .stat-value {
    display: block;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(28px, 2.7vw, 46px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.035em;
    white-space: nowrap;
    color: ${C.textPrimary};
  }

  .stat-num {
    position: relative;
    display: inline-block;
    font-variant-numeric: tabular-nums;
    color: ${C.neon};
  }

  .stat-num .ghost {
    visibility: hidden;
  }

  .stat-num .live {
    position: absolute;
    left: 0;
    top: 0;
  }

  .stat-label {
    display: block;
    margin-top: 0.7rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${C.textMuted};
    white-space: nowrap;
  }

  @media (max-width: 1023px) {
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    padding: 1.15rem 0;
    border-left: none;
    border-bottom: 1px solid ${C.hairline};
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;

    .stat-value {
      font-size: clamp(28px, 8.2vw, 42px);
    }

    .stat-label {
      margin-top: 0;
      text-align: right;
      white-space: normal;
    }
  }
`;

export const PartnersLine = styled.p`
  position: relative;
  z-index: 2;
  margin: clamp(3.5rem, 7vw, 5.5rem) 0 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10.5px;
  line-height: 1.9;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${C.textMuted};
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  row-gap: 0.2rem;

  b {
    color: ${C.textSecondary};
    font-weight: 500;
  }

  .sep {
    color: ${C.neon};
    padding: 0 0.6em;
  }
`;

/* --- ДОСТУПНОСТЬ --- */

export const SrOnly = styled.div`
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

/* --- КАСТОМНЫЙ КУРСОР (только transform/opacity) --- */

export const HwCursorFollower = styled.div`
  display: none !important;
`;

export const HwCursorDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  margin-left: -42px;
  margin-top: -42px;
  border-radius: 50%;
  background: ${C.neon};
  color: #07070a;
  opacity: 0;
  transform: scale(0.05);
  transition:
    opacity 180ms ease,
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible='true'] {
    opacity: 1;
    transform: scale(0.143);
  }

  &[data-visible='true'][data-expanded='true'] {
    transform: scale(1);
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 150ms ease;
  }

  &[data-expanded='true'] span {
    opacity: 1;
  }
`;
