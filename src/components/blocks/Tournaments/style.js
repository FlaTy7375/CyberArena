import styled, { css, keyframes } from 'styled-components';

/**
 * Конфигурация секции "04 Соревнования — Турниры зимой".
 * Все цвета, скорости и параметры вынесены в переменные.
 */
export const TOURNAMENTS_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#B6FF00',
    neonSoft: 'rgba(182, 255, 0, 0.22)',
    textPrimary: '#F2F2F5',
    textSecondary: '#B8B8C2',
    textMuted: '#72727E',
    line: 'rgba(242, 242, 245, 0.14)',
  },
  animation: {
    scrub: 0.15,
    prizeCountDurationSec: 1.05,
    slotStaggerSec: 0.02,
    dimmedOpacity: 0.32,
    easeOut: 'power3.out',
    easeExpo: 'expo.out',
  },
};

const livePulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 12px ${TOURNAMENTS_CONFIG.colors.neon};
  }
  50% {
    transform: scale(1.32);
    opacity: 0.55;
    box-shadow: 0 0 22px ${TOURNAMENTS_CONFIG.colors.neon};
  }
`;

const finaleFlarePulse = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.35);
    opacity: 1;
  }
`;

export const TournamentsSection = styled.section`
  position: relative;
  width: 100%;
  padding: clamp(5.5rem, 11vw, 9.5rem) 0 clamp(6rem, 12vw, 10rem);
  background: ${TOURNAMENTS_CONFIG.colors.bg};
  color: ${TOURNAMENTS_CONFIG.colors.textPrimary};
  overflow-x: clip;
`;

/**
 * Клиппер свечения: секция без overflow (чтобы работал sticky-фон),
 * поэтому дрейфующий свет обрезаем локально.
 */
export const GlowClipper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 1;
  pointer-events: none;
`;

/**
 * Липкий полноэкранный арт активного турнира: экран «залипает», пока
 * скроллишь сетку, — картинка игры плавно проявляется на весь экран
 * и так же плавно передаётся эстафету следующей.
 */
export const TournamentArtBackdrop = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  width: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  /* Нулевая высота в потоке: арт всегда стоит за контентом, экран «залипает» */
  margin-bottom: -100vh;
`;

export const ArtLayer = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(1.08);
  transition:
    opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1),
    transform 2.4s cubic-bezier(0.22, 1, 0.36, 1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  &[data-active='true'] {
    opacity: 0.38;
    transform: scale(1);
    will-change: opacity, transform;
  }
`;

export const ArtShade = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(7, 7, 10, 0.92) 0%,
      rgba(7, 7, 10, 0.6) 46%,
      rgba(7, 7, 10, 0.86) 100%
    ),
    linear-gradient(
      180deg,
      rgba(7, 7, 10, 0.82) 0%,
      rgba(7, 7, 10, 0.25) 40%,
      rgba(7, 7, 10, 0.25) 60%,
      rgba(7, 7, 10, 0.88) 100%
    );
`;

/**
 * Медленно дрейфующее салатовое свечение (чистый radial-gradient без filter/mix-blend-mode).
 */
export const AmbientNodeGlow = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 58vw;
  height: 58vw;
  max-width: 780px;
  max-height: 780px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    circle,
    rgba(182, 255, 0, 0.11) 0%,
    rgba(182, 255, 0, 0.03) 42%,
    transparent 70%
  );
  transform: translate3d(25vw, 18vh, 0) translate(-50%, -50%);
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;

  @media (max-width: 767px) {
    width: 85vw;
    height: 85vw;
    transform: translate3d(50vw, 20vh, 0) translate(-50%, -50%);
    will-change: auto;
  }
`;

export const TournamentsContainer = styled.div`
  position: relative;
  z-index: 3;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

/* --- ВВОДНЫЙ БЛОК И КРУПНЫЙ ТАЙМЕР ОБРАТНОГО ОТСЧЁТА --- */

export const IntroHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: clamp(3rem, 6vw, 4.5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 7fr 5fr;
    align-items: end;
  }
`;

export const IntroLeft = styled.div``;

export const SectionKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.textMuted};
  margin-bottom: 1.15rem;

  span {
    color: ${TOURNAMENTS_CONFIG.colors.neon};
  }
`;

export const SectionMainTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(38px, 6.8vw, 96px);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.textPrimary};
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

  em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1.5px ${TOURNAMENTS_CONFIG.colors.neon};
  }
`;

export const IntroNote = styled.p`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  line-height: 1.72;
  letter-spacing: 0.04em;
  color: ${TOURNAMENTS_CONFIG.colors.textMuted};
  max-width: 42ch;
  margin: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: end;
    padding-bottom: 0.35rem;
  }
`;

export const CountdownBanner = styled.div`
  padding: clamp(1.5rem, 3vw, 2.25rem) 0;
  margin-bottom: clamp(3.5rem, 7vw, 6rem);
  border-top: 1px solid ${TOURNAMENTS_CONFIG.colors.line};
  border-bottom: 1px solid ${TOURNAMENTS_CONFIG.colors.line};
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 3rem;
  }
`;

export const CountdownMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  .label {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${TOURNAMENTS_CONFIG.colors.neon};
  }

  .target-name {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${TOURNAMENTS_CONFIG.colors.textSecondary};
  }
`;

export const CountdownDigitsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.85rem 1.75rem;
  align-items: baseline;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-variant-numeric: tabular-nums;

  @media (min-width: 640px) {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }
`;

export const CountdownUnitPair = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;

  .digits {
    display: inline-flex;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(32px, 4.8vw, 64px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
    color: ${TOURNAMENTS_CONFIG.colors.textPrimary};
    perspective: 360px;
  }

  .digit-char {
    display: inline-block;
    min-width: 0.62em;
    text-align: center;
    will-change: transform, opacity;
  }

  .digit-char.sec-last {
    color: ${TOURNAMENTS_CONFIG.colors.neon};
    text-shadow: 0 0 18px rgba(182, 255, 0, 0.48);
  }

  .unit-tag {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${TOURNAMENTS_CONFIG.colors.textMuted};
  }

  .colon {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(22px, 3vw, 40px);
    font-weight: 700;
    color: ${TOURNAMENTS_CONFIG.colors.neon};
    margin: 0 0.25rem;
    opacity: 0.8;

    @media (max-width: 639px) {
      &.hide-mobile-break {
        display: none;
      }
    }
  }
`;

export const ScreenReaderOnly = styled.span`
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

/* --- ПУТЬ ПО ТУРНИРНОЙ СЕТКЕ (90° SVG БЕЗ ТЯЖЁЛОГО DROP-SHADOW ФИЛЬТРА) --- */

export const BracketPathStage = styled.div`
  position: relative;
  width: 100%;
`;

export const BracketSvgOverlay = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: visible;

  .track-blueprint {
    fill: none;
    stroke: rgba(242, 242, 245, 0.07);
    stroke-width: 1px;
    stroke-dasharray: 4 6;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }

  .track-bg {
    fill: none;
    stroke: rgba(242, 242, 245, 0.14);
    stroke-width: 1.5px;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }

  /* Векторный ореол вместо тяжёлого CSS filter: drop-shadow (60 FPS при скролле) */
  .track-glow {
    fill: none;
    stroke: rgba(182, 255, 0, 0.18);
    stroke-width: 8px;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }

  .track-neon {
    fill: none;
    stroke: ${TOURNAMENTS_CONFIG.colors.neon};
    stroke-width: 2.25px;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }

  /* Боковые 90° ветки к заголовку турнира и к арту игры + входящие вилки сетки */
  .branch-bg,
  .gate-fork-bg {
    fill: none;
    stroke: rgba(242, 242, 245, 0.13);
    stroke-width: 1.25px;
    stroke-linecap: square;
    stroke-linejoin: miter;
  }

  .branch-neon,
  .gate-fork-neon {
    fill: none;
    stroke: ${TOURNAMENTS_CONFIG.colors.neon};
    stroke-width: 1.75px;
    stroke-linecap: square;
    stroke-linejoin: miter;
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .branch-group[data-lit='true'] .branch-neon,
  .gate-group[data-lit='true'] .gate-fork-neon {
    opacity: 1;
  }

  .branch-port-dot,
  .gate-vertex-dot {
    fill: #14141C;
    stroke: rgba(242, 242, 245, 0.35);
    stroke-width: 1.5px;
    transition:
      fill 220ms ease,
      stroke 220ms ease;
  }

  .branch-group[data-lit='true'] .branch-port-dot,
  .gate-group[data-lit='true'] .gate-vertex-dot {
    fill: ${TOURNAMENTS_CONFIG.colors.neon};
    stroke: ${TOURNAMENTS_CONFIG.colors.neon};
  }

  .gate-stage-label {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    fill: rgba(242, 242, 245, 0.28);
    transition: fill 220ms ease;
  }

  .gate-group[data-lit='true'] .gate-stage-label {
    fill: ${TOURNAMENTS_CONFIG.colors.neon};
  }
`;

export const NodesStack = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: clamp(6rem, 11vw, 9.5rem);
  padding: 2.25rem 0 2.5rem;
`;

/**
 * Строка турнира: на десктопе 2-колоночный сплит вокруг широкого коридора турнирной сетки.
 * С одной стороны — узел турнира, со стороны свободного пространства — арт игры в диагональном срезе.
 */
export const TournamentNodeArticle = styled.article`
  position: relative;
  width: 100%;
  padding-left: 2.5rem;
  transition: opacity 280ms ease;

  &[data-dimmed='true'] {
    opacity: ${TOURNAMENTS_CONFIG.animation.dimmedOpacity};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding-left: 0;
    display: grid;
    grid-template-columns: 1fr clamp(110px, 11vw, 156px) 1fr;
    align-items: center;
  }
`;

/**
 * Узел-стык на линии турнирной сетки (загорается ровно в момент касания кончиком линии).
 */
export const SpineCenterColumn = styled.div`
  position: absolute;
  left: 14px;
  top: 2.5rem;
  z-index: 4;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    position: relative;
    left: auto;
    top: auto;
    grid-column: 2;
    grid-row: 1;
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 2.95rem;
  }
`;

export const NodeJunctionPoint = styled.span`
  position: relative;
  display: block;
  width: ${({ $isFinale }) => ($isFinale ? '18px' : '12px')};
  height: ${({ $isFinale }) => ($isFinale ? '18px' : '12px')};
  transform: translate(-50%, -50%) scale(0.72);
  background: #14141C;
  border: 2px solid rgba(242, 242, 245, 0.35);
  transition:
    transform 340ms cubic-bezier(0.34, 1.56, 0.64, 1),
    background 200ms ease,
    border-color 200ms ease,
    box-shadow 220ms ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    transform: translate(0, -50%) scale(0.72);
    margin-left: ${({ $alignRight, $isFinale }) =>
      $isFinale ? '26px' : $alignRight ? '36px' : '-36px'};
  }

  &[data-lit='true'] {
    background: ${TOURNAMENTS_CONFIG.colors.neon};
    border-color: ${TOURNAMENTS_CONFIG.colors.neon};
    box-shadow:
      0 0 18px ${TOURNAMENTS_CONFIG.colors.neon},
      0 0 38px rgba(182, 255, 0, 0.55);
    transform: translate(-50%, -50%) scale(1.16);

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      transform: translate(0, -50%) scale(1.16);
    }
  }

  ${({ $isFinale }) =>
    $isFinale &&
    css`
      &[data-lit='true'] {
        box-shadow:
          0 0 24px ${TOURNAMENTS_CONFIG.colors.neon},
          0 0 52px rgba(182, 255, 0, 0.72);
      }
    `}
`;

export const NodeContentColumn = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-column: ${({ $alignRight }) => ($alignRight ? '3' : '1')};
    grid-row: 1;
    padding-left: ${({ $alignRight }) => ($alignRight ? '1.25rem' : '0')};
    padding-right: ${({ $alignRight }) => ($alignRight ? '0' : '1.25rem')};
  }
`;

/* --- АРТ ИГРЫ СО СТОРОНЫ СВОБОДНОГО ПРОСТРАНСТВА (ДИАГОНАЛЬНЫЙ СРЕЗ БЕЗ КАРТОЧЕК И РАМОК) --- */

export const GameVisualShowcase = styled.div`
  position: relative;
  margin-bottom: 1.35rem;
  user-select: none;
  pointer-events: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-bottom: 0;
    grid-column: ${({ $alignRight }) => ($alignRight ? '1' : '3')};
    grid-row: 1;
    padding-right: ${({ $alignRight }) => ($alignRight ? '1.5rem' : '0')};
    padding-left: ${({ $alignRight }) => ($alignRight ? '0' : '1.5rem')};
  }
`;

export const GameArtworkCutout = styled.div`
  position: relative;
  width: 100%;
  height: clamp(185px, 23vw, 320px);
  overflow: hidden;
  /* Острый диагональный срез в эстетике Awwwards / Nothing (никаких рамок и скруглений) */
  clip-path: ${({ $alignRight }) =>
    $alignRight
      ? 'polygon(0% 0%, 91% 0%, 100% 100%, 7% 100%)'
      : 'polygon(7% 0%, 100% 0%, 91% 100%, 0% 100%)'};
  background: #0D0D12;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: scale(1.03);
    opacity: 0.62;
    transition:
      transform 650ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 420ms ease;

    @media (max-width: 767px) {
      opacity: 0.82;
    }
  }

  /* Кинематографичное слияние краёв арта с чёрным фоном секции */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        180deg,
        rgba(7, 7, 10, 0.55) 0%,
        rgba(7, 7, 10, 0.05) 45%,
        rgba(7, 7, 10, 0.85) 100%
      ),
      linear-gradient(
        90deg,
        rgba(7, 7, 10, 0.65) 0%,
        transparent 35%,
        transparent 65%,
        rgba(7, 7, 10, 0.65) 100%
      );
  }

  /* Когда линия сетки дошла до турнира или на узел навели — арт игры загорается */
  ${TournamentNodeArticle}[data-lit='true'] & img {
    opacity: 0.86;
    transform: scale(1.06);
  }

  ${TournamentNodeArticle}[data-hovered='true'] & img {
    opacity: 1;
    transform: scale(1.1);
  }
`;

export const GameVisualSlashAccent = styled.span`
  position: absolute;
  bottom: 0;
  left: ${({ $alignRight }) => ($alignRight ? '7%' : '0%')};
  width: 38%;
  height: 2px;
  background: ${TOURNAMENTS_CONFIG.colors.neon};
  box-shadow: 0 0 14px ${TOURNAMENTS_CONFIG.colors.neon};
  transform-origin: left center;
  transform: scaleX(0.25);
  opacity: 0.4;
  transition:
    transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 320ms ease;

  ${TournamentNodeArticle}[data-lit='true'] &,
  ${TournamentNodeArticle}[data-hovered='true'] & {
    transform: scaleX(1);
    opacity: 1;
  }
`;

export const GameGhostWatermark = styled.div`
  position: absolute;
  bottom: -0.18em;
  right: ${({ $alignRight }) => ($alignRight ? 'auto' : '-0.04em')};
  left: ${({ $alignRight }) => ($alignRight ? '-0.04em' : 'auto')};
  z-index: 3;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(54px, 7.2vw, 108px);
  font-weight: 800;
  line-height: 0.8;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(242, 242, 245, 0.22);
  transition: -webkit-text-stroke 300ms ease;

  ${TournamentNodeArticle}[data-lit='true'] &,
  ${TournamentNodeArticle}[data-hovered='true'] & {
    -webkit-text-stroke: 1.5px rgba(182, 255, 0, 0.55);
  }
`;

export const GameVisualTechTag = styled.div`
  position: absolute;
  top: 0.85rem;
  left: ${({ $alignRight }) => ($alignRight ? '1.1rem' : 'auto')};
  right: ${({ $alignRight }) => ($alignRight ? 'auto' : '1.1rem')};
  z-index: 3;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.neon};
  opacity: 0.85;
`;

/**
 * Интерактивная зона узла (кнопка без рамок, карточек и фонов-плашек).
 */
export const NodeInteractiveTrigger = styled.button`
  position: relative;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: inherit;
  padding: 0;
  display: block;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 1px solid ${TOURNAMENTS_CONFIG.colors.neon};
    outline-offset: 10px;
  }

  ${({ $isFinale }) =>
    $isFinale &&
    css`
      &::before {
        content: '';
        position: absolute;
        left: -60%;
        top: -25%;
        width: 160%;
        height: 150%;
        pointer-events: none;
        z-index: -1;
        background: radial-gradient(
          circle at 45% 50%,
          rgba(182, 255, 0, 0.15) 0%,
          rgba(182, 255, 0, 0.05) 42%,
          transparent 72%
        );
      }
    `}
`;

export const FinaleSeasonKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.neon};
  text-shadow: 0 0 16px rgba(182, 255, 0, 0.55);
  margin-bottom: 0.65rem;
`;

export const NodeTopRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 1rem 1.85rem;
  margin-bottom: 0.65rem;
`;

export const GiantOutlineDate = styled.div`
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  user-select: none;

  .day-num {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: ${({ $isFinale }) =>
      $isFinale ? 'clamp(78px, 10.2vw, 144px)' : 'clamp(64px, 8.4vw, 122px)'};
    font-weight: 800;
    line-height: 0.82;
    letter-spacing: -0.05em;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(242, 242, 245, 0.36);
    transition: -webkit-text-stroke 260ms ease;
  }

  ${TournamentNodeArticle}[data-lit='true'] & .day-num,
  ${TournamentNodeArticle}[data-hovered='true'] & .day-num {
    -webkit-text-stroke: 1.5px ${TOURNAMENTS_CONFIG.colors.neon};
  }

  .month-tag {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: ${TOURNAMENTS_CONFIG.colors.textMuted};
  }
`;

export const StatusInlineText = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${TOURNAMENTS_CONFIG.colors.neon};
    animation: ${livePulse} 1.5s ease-in-out infinite;
  }

  .live-label {
    color: ${TOURNAMENTS_CONFIG.colors.neon};
  }

  .soon-label {
    color: transparent;
    -webkit-text-stroke: 0.8px rgba(242, 242, 245, 0.5);
    letter-spacing: 0.22em;
  }
`;

export const GameHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ $isFinale }) =>
    $isFinale ? 'clamp(34px, 5vw, 72px)' : 'clamp(28px, 3.8vw, 52px)'};
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.035em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.textPrimary};
  margin: 0 0 0.4rem 0;
`;

export const EventMonoSubtitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.textSecondary};
  margin-bottom: 1.15rem;
`;

const PRIZE_FONT_MAP = {
  20000: 'clamp(24px, 2.6vw, 36px)',
  30000: 'clamp(27px, 3.0vw, 42px)',
  40000: 'clamp(30px, 3.4vw, 48px)',
  50000: 'clamp(33px, 3.9vw, 54px)',
  75000: 'clamp(38px, 4.6vw, 66px)',
  100000: 'clamp(44px, 5.8vw, 84px)',
};

export const ProportionalPrizeValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ $amount }) =>
    PRIZE_FONT_MAP[$amount] || 'clamp(28px, 3.5vw, 48px)'};
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: ${TOURNAMENTS_CONFIG.colors.neon};
  font-variant-numeric: tabular-nums;
  margin-bottom: 1.25rem;
  text-shadow: ${({ $isFinale }) =>
    $isFinale
      ? '0 0 28px rgba(182, 255, 0, 0.55), 0 0 64px rgba(182, 255, 0, 0.25)'
      : '0 0 18px rgba(182, 255, 0, 0.25)'};
`;

/* --- СЛОТЫ: РЯД КВАДРАТИКОВ (16 / 32 / 40) + СТРОКА ФОРМАТА И ВРЕМЕНИ ЧЕРЕЗ "·" --- */

export const SlotsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.15rem;
`;

export const SlotsSquaresRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  max-width: 440px;
`;

export const SlotSquareCell = styled.span`
  width: 9px;
  height: 9px;
  display: inline-block;
  background: ${({ $filled }) =>
    $filled ? TOURNAMENTS_CONFIG.colors.neon : 'transparent'};
  border: 1px solid
    ${({ $filled }) =>
      $filled
        ? TOURNAMENTS_CONFIG.colors.neon
        : 'rgba(242, 242, 245, 0.28)'};
  box-shadow: ${({ $filled }) =>
    $filled ? '0 0 8px rgba(182, 255, 0, 0.45)' : 'none'};
  will-change: transform, opacity;
`;

export const NodeMetaString = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${TOURNAMENTS_CONFIG.colors.textSecondary};
  font-variant-numeric: tabular-nums;

  .dot {
    color: ${TOURNAMENTS_CONFIG.colors.neon};
    margin: 0 0.6rem;
  }

  .slots-count {
    color: ${TOURNAMENTS_CONFIG.colors.textPrimary};
    font-weight: 600;
  }
`;

export const NodeActionLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ $open }) =>
    $open
      ? TOURNAMENTS_CONFIG.colors.neon
      : TOURNAMENTS_CONFIG.colors.textPrimary};

  .arrow {
    display: inline-block;
    color: ${TOURNAMENTS_CONFIG.colors.neon};
    transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${NodeInteractiveTrigger}:hover & .arrow,
  ${NodeInteractiveTrigger}:focus-visible & .arrow {
    transform: translate3d(7px, 0, 0);
  }
`;

/* --- ЧЁТКАЯ ГЕОМЕТРИЧЕСКАЯ МИНИ-СХЕМА SINGLE ELIMINATION (БЕЗ СДВИГА ВЕРСТКИ) --- */

export const MiniBracketDrawer = styled.div`
  margin-top: 1.15rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(242, 242, 245, 0.1);
  opacity: 0.28;
  transition:
    opacity 280ms ease,
    border-color 280ms ease;

  ${TournamentNodeArticle}[data-lit='true'] & {
    opacity: 0.55;
  }

  ${TournamentNodeArticle}[data-hovered='true'] & {
    opacity: 1;
    border-top-color: rgba(182, 255, 0, 0.35);
  }

  svg {
    width: 100%;
    max-width: 430px;
    height: 98px;
    display: block;
    overflow: visible;
  }

  .bracket-tree-bg {
    fill: none;
    stroke: rgba(242, 242, 245, 0.18);
    stroke-width: 1.2px;
    stroke-linecap: square;
  }

  .bracket-tree-active {
    fill: none;
    stroke: ${TOURNAMENTS_CONFIG.colors.neon};
    stroke-width: 1.6px;
    stroke-linecap: square;
    stroke-dasharray: 420;
    stroke-dashoffset: 420;
    transition: stroke-dashoffset 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  ${TournamentNodeArticle}[data-hovered='true'] & .bracket-tree-active,
  ${TournamentNodeArticle}[data-lit='true'] & .bracket-tree-active {
    stroke-dashoffset: 0;
  }

  .bracket-node-dot {
    fill: ${TOURNAMENTS_CONFIG.colors.neon};
  }

  .bracket-stage-text {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    fill: ${TOURNAMENTS_CONFIG.colors.textMuted};
  }

  .bracket-final-text {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    fill: ${TOURNAMENTS_CONFIG.colors.neon};
  }
`;

/* --- КАСТОМНЫЙ КУРСОР СЕКЦИИ ТУРНИРОВ --- */

export const TournamentsCursorFollower = styled.div`
  display: none !important;
`;

export const TournamentsCursorDot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
  background: ${TOURNAMENTS_CONFIG.colors.neon};
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
    width: 84px;
    height: 84px;
    margin-left: -42px;
    margin-top: -42px;
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
