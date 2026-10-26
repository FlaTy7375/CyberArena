import styled, { css } from 'styled-components';

/**
 * Конфигурация полноэкранной секции залов (Awwwards / Locomotive / Nothing эстетика).
 * Никаких карточек, рамок, сеток, чипов или glassmorphism.
 * Только полноэкранные 100vh сцены, диагональные clip-path шторки, гигантская типографика 38vw,
 * статическое кинематографичное зерно (6%) и дрейфующее салатовое свечение.
 */
export const ZONES_CONFIG = {
  colors: {
    bgBase: '#07070A',
    neon: '#D4FF3F',
    textPrimary: '#F2F2F5',
    textSecondary: '#C4C4CE',
    textMuted: '#7A7A86',
  },
  animation: {
    scrub: 0.35,
    scrollVhPerScene: 92,
    easeOut: 'power3.out',
    easeExpo: 'expo.out',
    staggerSec: 0.065,
    counterDurationSec: 0.9,
    diagonalSlantPct: 20,
  },
  noiseOpacity: 0.055,
};

export const ZonesSection = styled.section`
  position: relative;
  width: 100%;
  background: ${ZONES_CONFIG.colors.bgBase};
  color: ${ZONES_CONFIG.colors.textPrimary};
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    a,
    button {
      cursor: none;
    }
  }
`;

/**
 * Вступительный асимметричный блок заголовка секции (без рамок и без выравнивания по центру).
 */
export const IntroBlock = styled.div`
  position: relative;
  z-index: 3;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: clamp(5rem, 10vw, 8.5rem) ${({ theme }) => theme.layout.gutter}
    clamp(2.5rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 8fr 4fr;
    align-items: end;
  }
`;

export const IntroLeft = styled.div`
  position: relative;
`;

export const IntroKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.textMuted};
  margin-bottom: 1.25rem;

  span {
    color: ${ZONES_CONFIG.colors.neon};
  }
`;

export const ZonesTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(38px, 6.8vw, 96px);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.textPrimary};
  margin: 0;

  .line-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.06em;
  }

  .line-inner {
    display: block;
    will-change: transform, opacity;
  }

  .neon-word {
    color: ${ZONES_CONFIG.colors.neon};
  }

  em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1.5px ${ZONES_CONFIG.colors.textPrimary};
  }
`;

export const IntroNote = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: ${ZONES_CONFIG.colors.textMuted};
  max-width: 34ch;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: end;
    padding-bottom: 0.4rem;
  }
`;

/* --- ПОЛНОЭКРАННАЯ СЦЕНА (100VH) С CLIP-PATH ПЕРЕХОДАМИ --- */

export const FullscreenStage = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: ${ZONES_CONFIG.colors.bgBase};
  contain: layout paint;

  ${({ $reducedMotion }) =>
    $reducedMotion &&
    css`
      height: auto;
      contain: none;
    `}
`;

/**
 * Медленно дрейфующее салатовое свечение (аппаратный композитинг без mix-blend-mode и blur-фильтра).
 */
export const AmbientDriftGlow = styled.div`
  position: absolute;
  width: 64vw;
  height: 64vw;
  max-width: 860px;
  max-height: 860px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 15;
  left: 0;
  top: 0;
  background: radial-gradient(
    circle,
    rgba(212, 255, 63, 0.13) 0%,
    rgba(212, 255, 63, 0.04) 38%,
    transparent 68%
  );
  transform: translate3d(68vw, 24vh, 0) translate(-50%, -50%);
  will-change: transform;

  @media (max-width: 767px) {
    width: 85vw;
    height: 85vw;
    transform: translate3d(70vw, 22vh, 0) translate(-50%, -50%);
    will-change: auto;
  }
`;

/**
 * Полноэкранный слой статического зерна (отключён на мобильных для экономии филлрейта GPU).
 */
export const SvgNoiseOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  opacity: ${ZONES_CONFIG.noiseOpacity};
  background-repeat: repeat;
  background-size: 140px 140px;

  @media (max-width: 767px) {
    display: none;
  }
`;

/* --- ВЕРХНЯЯ МИНИМАЛИСТИЧНАЯ НАВИГАЦИЯ ПОВЕРХ ПОЛНОЭКРАННОГО КАДРА --- */

export const StageTopHud = styled.div`
  position: absolute;
  top: clamp(5.2rem, 8vh, 6.8rem);
  left: ${({ theme }) => theme.layout.gutter};
  right: ${({ theme }) => theme.layout.gutter};
  z-index: 25;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  pointer-events: none;
`;

export const CounterReadout = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  font-variant-numeric: tabular-nums;
  color: ${ZONES_CONFIG.colors.textPrimary};

  .current {
    color: ${ZONES_CONFIG.colors.neon};
  }

  .slash {
    color: ${ZONES_CONFIG.colors.textMuted};
    margin: 0 0.45rem;
  }

  .total {
    color: ${ZONES_CONFIG.colors.textMuted};
  }
`;

export const MinimalSegments = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
`;

export const SegmentTick = styled.button`
  position: relative;
  width: clamp(22px, 3.8vw, 48px);
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;

  &:focus-visible {
    outline: 1px solid ${ZONES_CONFIG.colors.neon};
    outline-offset: 3px;
  }

  &::before {
    content: '';
    width: 100%;
    height: 2px;
    background: rgba(242, 242, 245, 0.2);
  }
`;

export const SegmentTickFill = styled.span`
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  margin-top: -1px;
  background: ${ZONES_CONFIG.colors.neon};
  transform-origin: left center;
  transform: scaleX(${({ $fill }) => $fill ?? 0});
  will-change: transform;
`;

/* --- СЛОЙ ОТДЕЛЬНОГО ЗАЛА (100VH, ПЕРЕКРЫТИЕ ЧЕРЕЗ CLIP-PATH) --- */

export const HallSceneLayer = styled.article`
  position: ${({ $reducedMotion }) => ($reducedMotion ? 'relative' : 'absolute')};
  inset: 0;
  width: 100%;
  height: ${({ $reducedMotion }) => ($reducedMotion ? '85vh' : '100%')};
  overflow: hidden;
  z-index: ${({ $index }) => ($index || 0) + 3};
  background: ${ZONES_CONFIG.colors.bgBase};
  pointer-events: none;
  will-change: transform, clip-path;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);

  @media (max-width: 767px) {
    will-change: transform;
  }

  &[data-active='true'] {
    pointer-events: auto;
  }

  ${({ $reducedMotion }) =>
    $reducedMotion &&
    css`
      pointer-events: auto;
      will-change: auto;
    `}
`;

export const HallPhotoBg = styled.div`
  position: absolute;
  inset: -3%;
  width: 106%;
  height: 106%;
  z-index: 1;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;

  @media (max-width: 767px) {
    inset: 0;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
    pointer-events: none;
  }

  /* Кинематографичное затемнение градиентом без тяжёлых CSS filter */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        rgba(7, 7, 10, 0.72) 0%,
        rgba(7, 7, 10, 0.28) 38%,
        rgba(7, 7, 10, 0.82) 78%,
        rgba(7, 7, 10, 0.96) 100%
      ),
      linear-gradient(
        90deg,
        rgba(7, 7, 10, 0.84) 0%,
        rgba(7, 7, 10, 0.32) 65%,
        rgba(7, 7, 10, 0.62) 100%
      );

    @media (max-width: 767px) {
      background: linear-gradient(
        180deg,
        rgba(7, 7, 10, 0.54) 0%,
        rgba(7, 7, 10, 0.18) 34%,
        rgba(7, 7, 10, 0.78) 72%,
        rgba(7, 7, 10, 0.95) 100%
      );
    }
  }
`;

/**
 * Гигантский контурный номер зала (до 40vw), выходящий за границу экрана.
 * У каждого зала своё смещение для живой журнальной асимметрии.
 */
export const GiantBleedNumber = styled.div`
  position: absolute;
  z-index: 2;
  pointer-events: none;
  user-select: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(210px, 38vw, 560px);
  font-weight: 800;
  line-height: 0.78;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(212, 255, 63, 0.25);
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;

  ${({ $pos }) => {
    switch ($pos) {
      case 'top-right':
        return css`
          top: -6vh;
          right: -5vw;
        `;
      case 'bottom-left':
        return css`
          bottom: -9vh;
          left: -6vw;
        `;
      case 'mid-right':
        return css`
          top: 14vh;
          right: -7vw;
        `;
      default:
        return css`
          bottom: -8vh;
          right: -5vw;
        `;
    }
  }}
`;

/**
 * Асимметричная композиция контента поверх полноэкранного фото.
 */
export const HallContentLayout = styled.div`
  position: relative;
  z-index: 4;
  width: 100%;
  height: 100%;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: clamp(7.5rem, 14vh, 10.5rem) ${({ theme }) => theme.layout.gutter}
    clamp(2.5rem, 6vh, 4.5rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const HallEditorialGroup = styled.div`
  width: 100%;
  max-width: 1180px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: ${({ $offsetLeft }) => $offsetLeft || '0'};
  }
`;

export const HallFormatKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.neon};
  margin-bottom: 0.85rem;
`;

/**
 * Огромное название зала, перекрывающее фото и контурный номер.
 */
export const HallMassiveTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(46px, 8.6vw, 132px);
  font-weight: 800;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.textPrimary};
  margin: 0 0 clamp(1.1rem, 2.2vh, 1.65rem) -0.03em;
`;

/**
 * Широкое описание зала — свободная журнальная вёрстка во всю доступную ширину (до 760px).
 */
export const HallDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: clamp(16px, 1.35vw, 20px);
  line-height: 1.62;
  color: ${ZONES_CONFIG.colors.textSecondary};
  margin: 0 0 clamp(1.5rem, 2.8vh, 2.25rem) 0;
  max-width: clamp(540px, 64vw, 780px);
`;

export const HallBottomRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid rgba(242, 242, 245, 0.14);
  max-width: 1060px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 2.5rem;
  }
`;

export const HallMetaRight = styled.div`
  display: contents;
`;

/**
 * Характеристики одной строкой текста через разделитель (никаких плашек и тегов).
 */
export const HallSpecsString = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11px, 0.95vw, 13px);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  line-height: 1.7;

  .spec-item {
    white-space: nowrap;
  }

  .spec-num {
    color: ${ZONES_CONFIG.colors.neon};
    font-weight: 700;
  }

  .spec-sep {
    color: ${ZONES_CONFIG.colors.neon};
    margin: 0 0.75rem;
    opacity: 0.7;
  }
`;

export const HallActionGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.75rem;
  flex-shrink: 0;
`;

export const HallTariffText = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${ZONES_CONFIG.colors.textMuted};
  font-variant-numeric: tabular-nums;

  strong {
    font-size: 22px;
    font-weight: 700;
    color: ${ZONES_CONFIG.colors.textPrimary};
    letter-spacing: -0.03em;
    margin: 0 0.2rem;
  }
`;

export const HallBookLink = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  color: ${ZONES_CONFIG.colors.neon};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.5px;
    background: ${ZONES_CONFIG.colors.neon};
    transform-origin: left center;
    transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  svg {
    width: 13px;
    height: 13px;
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover svg {
    transform: translate(3px, -3px);
  }
`;

/* --- КАСТОМНЫЙ КУРСОР (УПРАВЛЯЕТСЯ ЧЕРЕЗ DATA-АТРИБУТЫ БЕЗ RE-RENDER REACT) --- */

export const CustomCursorFollower = styled.div`
  display: none !important;
`;

export const CursorCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
  background: ${ZONES_CONFIG.colors.neon};
  color: #07070A;
  opacity: 0;
  transform: scale(0.3);
  transition:
    width 300ms cubic-bezier(0.16, 1, 0.3, 1),
    height 300ms cubic-bezier(0.16, 1, 0.3, 1),
    margin 300ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible='true'] {
    opacity: 1;
    transform: scale(1);
  }

  &[data-expanded='true'] {
    width: 86px;
    height: 86px;
    margin-left: -43px;
    margin-top: -43px;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 160ms ease;
    white-space: nowrap;
  }

  &[data-expanded='true'] span {
    opacity: 1;
  }
`;
