import styled, { css, keyframes } from 'styled-components';

/**
 * Конфигурация секции «07 Контакты — Забронировать место».
 * Все параметры режима работы, лимитов мест, URL эндпоинта, цветов и скоростей
 * вынесены в единый объект в начале файла.
 */
export const CONTACT_CONFIG = {
  colors: {
    bg: '#07070A',
    neon: '#B6FF00',
    neonDim: 'rgba(182, 255, 0, 0.16)',
    neonGlow: 'rgba(182, 255, 0, 0.36)',
    textPrimary: '#F2F2F5',
    textSecondary: '#B8B8C2',
    textMuted: '#72727E',
    danger: '#FF5A5A',
    line: 'rgba(242, 242, 245, 0.14)',
    lineStrong: 'rgba(242, 242, 245, 0.28)',
  },
  workHours: {
    timeZone: 'Europe/Moscow',
    openHour: 10, // 10:00
    closeHour: 2, // 02:00 ночи
    totalTimelineHours: 16, // шкала с 10:00 до 02:00 = 16 часов
    replyMinutes: 15,
    scheduleText: 'Ежедневно 10:00 — 02:00',
  },
  booking: {
    totalSteps: 7,
    maxSeats: 5,
    daysAhead: 14,
    minDuration: 1,
    maxDuration: 12,
    defaultStartOffset: 9, // 10:00 + 9 ч = 19:00
    defaultDuration: 3, // 3 ч (19:00 -> 22:00)
  },
  api: {
    endpointUrl: '/api/v1/bookings',
    requestTimeoutMs: 4500,
    simulateDelayMs: 650,
  },
  animation: {
    stepTransitionMs: 420,
    typewriterSpeedMs: 22,
    mapStrokeDurationSec: 1.35,
    seatStaggerSec: 0.024,
    marqueeDurationSec: 28,
  },
};

const C = CONTACT_CONFIG.colors;
const GUTTER = ({ theme }) => theme.layout?.gutter || 'clamp(20px, 4vw, 48px)';

const statusPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.38);
    opacity: 0.42;
  }
`;

const seatFreePulse = keyframes`
  0%, 100% {
    opacity: 0.88;
  }
  50% {
    opacity: 0.45;
  }
`;

const seatBurstRing = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.95;
  }
  100% {
    transform: scale(2.35);
    opacity: 0;
  }
`;

const marqueeScroll = keyframes`
  0% {
    transform: translate3d(0%, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
`;

const blinkCaret = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

export const ContactSection = styled.section`
  position: relative;
  width: 100%;
  padding: clamp(5.5rem, 11vw, 9.5rem) 0 0;
  background: ${C.bg};
  color: ${C.textPrimary};
  overflow: hidden;
  border-top: 1px solid ${C.line};

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    a,
    button,
    input,
    textarea,
    label {
      cursor: none;
    }
  }
`;

/**
 * Фоновое зерно и медленно дрейфующее салатовое свечение (без сеток и клеток).
 */
export const AmbientGlowOrb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 62vw;
  height: 62vw;
  max-width: 820px;
  max-height: 820px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    circle,
    rgba(182, 255, 0, 0.09) 0%,
    rgba(182, 255, 0, 0.025) 42%,
    transparent 70%
  );
  transform: translate3d(68vw, 24vh, 0) translate(-50%, -50%);
  transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;

  @media (max-width: 767px) {
    width: 90vw;
    height: 90vw;
    transform: translate3d(65vw, 18vh, 0) translate(-50%, -50%);
    will-change: auto;
  }
`;

export const GrainLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
`;

export const ContactContainer = styled.div`
  position: relative;
  z-index: 3;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0 ${GUTTER};
`;

/* ============================================================================
 * ШАПКА СЕКЦИИ: СТАТУС ПО МОСКВЕ + ГИГАНТСКИЙ ЗАГОЛОВОК МАСКОЙ + ПОДПИСЬ
 * ========================================================================== */

export const HeaderTopBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: clamp(1.75rem, 3.5vw, 2.75rem);
`;

export const SectionKicker = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.textMuted};

  span {
    color: ${C.neon};
  }
`;

export const LiveStatusLine = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(10.5px, 0.9vw, 12px);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $isOpen }) => ($isOpen ? C.textPrimary : C.textSecondary)};

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $isOpen }) => ($isOpen ? C.neon : C.textMuted)};
    box-shadow: ${({ $isOpen }) => ($isOpen ? `0 0 12px ${C.neon}` : 'none')};
    animation: ${({ $isOpen, $reducedMotion }) =>
      $isOpen && !$reducedMotion
        ? css`${statusPulse} 2.2s ease-in-out infinite`
        : 'none'};
  }

  .status-msk-tag {
    color: ${C.textMuted};
  }
`;

export const HeaderEditorialSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: clamp(3rem, 6vw, 4.75rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 8fr 4fr;
    align-items: end;
  }
`;

export const GiantSectionTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(40px, 7.2vw, 108px);
  font-weight: 900;
  line-height: 0.92;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: ${C.textPrimary};

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
    color: ${C.neon};
  }

  .indent-line {
    padding-left: clamp(0.75rem, 5vw, 5.5rem);
  }
`;

export const HeaderLeadNote = styled.p`
  margin: 0;
  max-width: 38ch;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11.5px, 0.95vw, 13px);
  line-height: 1.68;
  letter-spacing: 0.03em;
  color: ${C.textSecondary};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    justify-self: end;
    padding-bottom: 0.35rem;
  }

  a {
    color: ${C.neon};
    text-decoration: none;
    border-bottom: 1px solid ${C.neon};
    padding-bottom: 1px;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

/* ============================================================================
 * ПОШАГОВАЯ РАЗГОВОРНАЯ ФОРМА (CONVERSATIONAL FORM)
 * ========================================================================== */

export const ConversationalForm = styled.form`
  position: relative;
  width: 100%;
  margin-bottom: clamp(5rem, 9vw, 8rem);
`;

/**
 * Поля для работы формы без JS (progressive enhancement) и полной семантики <form>.
 * Скрыты визуально при активном JS, но остаются в DOM и отправляются вместе с формой.
 */
export const VisuallyHiddenFields = styled.div`
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

/**
 * Верхняя тонкая линия прогресса из 7 сегментов + индикатор текущего шага.
 */
export const ProgressHeaderWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
`;

export const ProgressTopMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${C.textMuted};

  .step-counter strong {
    color: ${C.neon};
    font-weight: 700;
  }

  .kbd-hint {
    display: none;
    color: ${C.textMuted};

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      display: inline;
    }

    span {
      color: ${C.textSecondary};
    }
  }
`;

export const SevenSegmentsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: clamp(6px, 1vw, 12px);
  width: 100%;
`;

export const SegmentButton = styled.button`
  position: relative;
  height: 24px;
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;

  &::before {
    content: '';
    width: 100%;
    height: 2px;
    background: ${C.line};
    transition: opacity 0.25s ease;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 2px;
    margin-top: -1px;
    background: ${C.neon};
    transform-origin: left center;
    transform: scaleX(${({ $state }) => ($state === 'done' || $state === 'active' ? 1 : 0)});
    opacity: ${({ $state }) => ($state === 'done' ? 0.55 : $state === 'active' ? 1 : 0)};
    transition:
      transform 0.38s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.25s ease;
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 2px;
  }
`;

/**
 * Хлебные крошки ответов предыдущих шагов мелкой моно-строкой над вопросом.
 */
export const BreadcrumbsTrail = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.9rem;
  min-height: 1.6rem;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textSecondary};

  .crumb-btn {
    padding: 0.2rem 0;
    background: transparent;
    border: none;
    border-bottom: 1px dashed rgba(242, 242, 245, 0.22);
    color: ${C.textSecondary};
    font-family: inherit;
    font-size: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    .crumb-key {
      color: ${C.textMuted};
      margin-right: 0.35rem;
    }

    .crumb-val {
      color: ${C.neon};
      font-weight: 600;
    }

    &:hover,
    &:focus-visible {
      color: ${C.textPrimary};
      border-color: ${C.neon};
      outline: none;
    }
  }

  .crumb-sep {
    color: rgba(242, 242, 245, 0.2);
  }
`;

/**
 * Сцена текущего вопроса с маской перехода:
 * старый вопрос уезжает вверх с fade, новый выезжает снизу.
 */
export const StepViewportMask = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 0.25rem 0 1rem;
`;

export const StepAnimatedStage = styled.div`
  width: 100%;
  will-change: transform, opacity;
  transform: translate3d(
    0,
    ${({ $phase }) =>
      $phase === 'exit-up'
        ? '-32px'
        : $phase === 'enter-from-bottom'
          ? '36px'
          : '0px'},
    0
  );
  opacity: ${({ $phase }) =>
    $phase === 'exit-up' || $phase === 'enter-from-bottom' ? 0 : 1};
  transition: ${({ $reducedMotion, $phase }) =>
    $reducedMotion || $phase === 'enter-from-bottom'
      ? 'none'
      : `transform ${CONTACT_CONFIG.animation.stepTransitionMs}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${Math.round(
          CONTACT_CONFIG.animation.stepTransitionMs * 0.85
        )}ms ease`};
`;

export const StepQuestionLabel = styled.label`
  display: block;
  margin: 0 0 clamp(1.25rem, 2.8vw, 2rem);
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(28px, 4.8vw, 68px);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: ${C.textPrimary};

  .q-num {
    display: inline-block;
    margin-right: 0.55em;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(12px, 1.2vw, 16px);
    font-weight: 600;
    letter-spacing: 0.18em;
    color: ${C.neon};
    vertical-align: middle;
  }

  .q-optional {
    display: inline-block;
    margin-left: 0.65em;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(10px, 0.95vw, 13px);
    font-weight: 500;
    letter-spacing: 0.16em;
    color: ${C.textMuted};
    vertical-align: middle;
  }
`;

export const GiantUnderlineInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: clamp(0.65rem, 1.5vw, 1.15rem) 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $hasError }) => ($hasError ? C.danger : C.lineStrong)};
  border-radius: 0;
  color: ${C.textPrimary};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 3.8vw, 54px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  outline: none;
  transition: border-color 0.25s ease;

  &::placeholder {
    color: rgba(242, 242, 245, 0.2);
    font-weight: 600;
  }

  &:focus {
    border-bottom-color: ${C.neon};
  }
`;

export const GiantUnderlineTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 104px;
  padding: clamp(0.65rem, 1.5vw, 1.15rem) 0;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${C.lineStrong};
  border-radius: 0;
  color: ${C.textPrimary};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: clamp(18px, 2.2vw, 30px);
  font-weight: 500;
  line-height: 1.45;
  resize: vertical;
  outline: none;
  transition: border-color 0.25s ease;

  &::placeholder {
    color: rgba(242, 242, 245, 0.24);
  }

  &:focus {
    border-bottom-color: ${C.neon};
  }
`;

export const ValidationErrorLine = styled.div`
  min-height: 1.5rem;
  margin-top: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  letter-spacing: 0.08em;
  color: ${C.danger};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translate3d(0, ${({ $visible }) => ($visible ? '0' : '-4px')}, 0);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
`;

/**
 * Навигационная строка под текущим шагом: «← Назад», «Пропустить», «Далее →»
 * Все интерактивные зоны >= 44px по высоте.
 */
export const StepNavRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  padding-top: 1rem;
  border-top: 1px solid ${C.line};

  .nav-left,
  .nav-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
  }
`;

export const TextStepActionBtn = styled.button`
  min-height: 46px;
  padding: 0.4rem 0;
  background: transparent;
  border: none;
  color: ${({ $primary }) => ($primary ? C.neon : C.textSecondary)};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: ${({ $primary }) =>
    $primary ? 'clamp(20px, 2.4vw, 32px)' : 'clamp(14px, 1.3vw, 18px)'};
  font-weight: ${({ $primary }) => ($primary ? 800 : 600)};
  letter-spacing: ${({ $primary }) => ($primary ? '-0.02em' : '0.08em')};
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  transition:
    color 0.2s ease,
    opacity 0.2s ease,
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  .arrow-glyph {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
      width: 0.92em;
      height: 0.92em;
      display: block;
    }
  }

  &:hover:not(:disabled) {
    color: ${({ $primary }) => ($primary ? C.textPrimary : C.neon)};

    .arrow-glyph {
      transform: translate3d(${({ $back }) => ($back ? '-5px' : '6px')}, 0, 0);
    }
  }

  &:disabled {
    opacity: 0.35;
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 4px;
  }
`;

/* ============================================================================
 * ШАГ 4: ИНТЕРАКТИВНАЯ SVG-СХЕМА ЗАЛА СВЕРХУ (STANDARD ZONE + PRO ZONE)
 * Без карточек и рамок — только чертёжные линии и пульсирующие места
 * ========================================================================== */

export const HallMapStageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
`;

export const HallMapToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.75rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${C.line};

  .toolbar-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.25rem;
  }

  .zone-quick-switch {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11.5px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .zone-switch-btn {
    min-height: 44px;
    padding: 0.35rem 0;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: ${C.textMuted};
    font-family: inherit;
    font-size: inherit;
    font-weight: 700;
    letter-spacing: inherit;
    text-transform: inherit;
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    &[data-active='true'] {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
    }
  }
`;

export const AnySeatToggleLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 44px;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ $checked }) => ($checked ? C.neon : C.textSecondary)};
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .toggle-track {
    position: relative;
    width: 40px;
    height: 18px;
    border-bottom: 2px solid ${({ $checked }) => ($checked ? C.neon : C.lineStrong)};
    transition: border-color 0.25s ease;
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 0;
    width: 12px;
    height: 10px;
    background: ${({ $checked }) => ($checked ? C.neon : C.textMuted)};
    transform: translate3d(${({ $checked }) => ($checked ? '26px' : '2px')}, 0, 0);
    transition:
      transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
      background 0.25s ease;
  }
`;

export const MobileZoomControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  color: ${C.textSecondary};

  button {
    min-width: 44px;
    min-height: 44px;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid ${C.lineStrong};
    color: ${C.textPrimary};
    font-family: inherit;
    font-size: 13px;
    font-weight: 700;

    &:active {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
    }
  }
`;

export const HallSvgViewport = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
  padding: 0.5rem 0;
`;

export const HallSvgPanLayer = styled.div`
  width: 100%;
  transform-origin: center center;
  will-change: transform;
  transition: ${({ $dragging }) =>
    $dragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'};
`;

export const HallBlueprintSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;

  .blueprint-stroke {
    fill: none;
    stroke: rgba(242, 242, 245, 0.22);
    stroke-width: 1.4;
    stroke-dasharray: 1800;
    stroke-dashoffset: ${({ $drawn }) => ($drawn ? 0 : 1800)};
    transition: stroke-dashoffset ${CONTACT_CONFIG.animation.mapStrokeDurationSec}s
      cubic-bezier(0.16, 1, 0.3, 1);
  }

  .blueprint-stroke-pro {
    fill: none;
    stroke: ${C.neon};
    stroke-width: 1.75;
    stroke-opacity: 0.65;
    stroke-dasharray: 1400;
    stroke-dashoffset: ${({ $drawn }) => ($drawn ? 0 : 1400)};
    transition: stroke-dashoffset ${CONTACT_CONFIG.animation.mapStrokeDurationSec}s
      cubic-bezier(0.16, 1, 0.3, 1) 0.12s;
  }

  .zone-heading-svg {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.16em;
    fill: ${C.textPrimary};
  }

  .zone-heading-pro {
    fill: ${C.neon};
  }

  .zone-sub-svg {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.18em;
    fill: ${C.textMuted};
  }

  .seat-node {
    cursor: pointer;
    transform-box: fill-box;
    transform-origin: center center;
    opacity: ${({ $drawn }) => ($drawn ? 1 : 0)};
    transition:
      transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.38s ease;
  }

  .seat-node[data-occupied='true'] {
    cursor: not-allowed;
    opacity: ${({ $drawn }) => ($drawn ? 0.24 : 0)};
  }

  .seat-desk-outline {
    fill: rgba(7, 7, 10, 0.85);
    stroke: rgba(242, 242, 245, 0.38);
    stroke-width: 1.3;
    transition:
      stroke 0.2s ease,
      fill 0.2s ease;
  }

  .seat-node[data-zone='pro'] .seat-desk-outline {
    stroke: rgba(182, 255, 0, 0.65);
  }

  .seat-monitor-bar {
    fill: rgba(242, 242, 245, 0.55);
    transition: fill 0.2s ease;
  }

  .seat-core-dot {
    fill: ${C.neon};
    animation: ${({ $reducedMotion }) =>
      $reducedMotion ? 'none' : css`${seatFreePulse} 2.6s ease-in-out infinite`};
  }

  .seat-node[data-occupied='true'] .seat-core-dot {
    fill: ${C.textMuted};
    animation: none;
  }

  .seat-node[data-selected='true'] .seat-desk-outline {
    fill: ${C.neon};
    stroke: ${C.neon};
  }

  .seat-node[data-selected='true'] .seat-monitor-bar {
    fill: #07070a;
  }

  .seat-node[data-selected='true'] .seat-core-dot {
    fill: #07070a;
    animation: none;
  }

  .seat-num-text {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9.5px;
    font-weight: 700;
    fill: ${C.textSecondary};
    pointer-events: none;
    transition: fill 0.2s ease;
  }

  .seat-node[data-selected='true'] .seat-num-text {
    fill: #07070a;
  }

  .seat-burst {
    fill: none;
    stroke: ${C.neon};
    stroke-width: 1.6;
    pointer-events: none;
    transform-box: fill-box;
    transform-origin: center center;
    animation: ${seatBurstRing} 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
`;

export const HallHoverReadoutBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  min-height: 2rem;
  padding-top: 0.65rem;
  border-top: 1px solid ${C.line};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(11px, 0.95vw, 13px);
  letter-spacing: 0.1em;
  text-transform: uppercase;

  .hover-info {
    color: ${C.neon};
    font-weight: 600;
  }

  .selected-summary {
    color: ${C.textPrimary};

    span {
      color: ${C.neon};
      font-weight: 700;
    }
  }

  .legend-row {
    display: inline-flex;
    align-items: center;
    gap: 1.15rem;
    color: ${C.textMuted};
    font-size: 10.5px;

    .leg-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      margin-right: 0.4rem;
      vertical-align: middle;
    }

    .leg-free {
      background: ${C.neon};
    }

    .leg-busy {
      background: rgba(242, 242, 245, 0.22);
    }
  }
`;

/* ============================================================================
 * ШАГ 5 И 6: ГОРИЗОНТАЛЬНАЯ ЛЕНТА ДНЕЙ (14 ДНЕЙ) + ШКАЛА ВРЕМЕНИ 10:00–02:00
 * ========================================================================== */

export const DateRibbonTrack = styled.div`
  display: flex;
  align-items: stretch;
  gap: clamp(1rem, 2.2vw, 2rem);
  overflow-x: auto;
  padding: 0.5rem 0 1.25rem;
  cursor: grab;
  user-select: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &:active {
    cursor: grabbing;
  }
`;

export const DayStripItem = styled.button`
  flex: 0 0 auto;
  min-width: clamp(92px, 11vw, 128px);
  min-height: 78px;
  padding: 0.5rem 0 0.75rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${({ $selected }) => ($selected ? C.neon : C.line)};
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition:
    border-color 0.25s ease,
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  .day-rel {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ $selected }) => ($selected ? C.neon : C.textMuted)};
  }

  .day-big {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(26px, 3vw, 38px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    color: ${({ $selected }) => ($selected ? C.neon : C.textPrimary)};
  }

  .day-month {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ $selected }) => ($selected ? C.textPrimary : C.textSecondary)};
  }

  &:hover {
    border-bottom-color: ${({ $selected }) => ($selected ? C.neon : C.textPrimary)};
    transform: translate3d(0, -3px, 0);
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 3px;
  }
`;

export const TimelineStageWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
  width: 100%;
  padding-top: 0.5rem;
`;

export const TimelineLiveReadout = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;

  .time-giant {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(26px, 4vw, 52px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: ${C.neon};
  }

  .time-hint {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${C.textMuted};
  }
`;

export const TimelineInteractiveBar = styled.div`
  position: relative;
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  touch-action: none;
  user-select: none;

  .rail-base {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    background: ${C.lineStrong};
  }

  .tick-marks {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    pointer-events: none;
    padding-bottom: 2px;
  }

  .tick-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 9.5px;
    color: ${C.textMuted};

    &::before {
      content: '';
      width: 1px;
      height: 8px;
      background: rgba(242, 242, 245, 0.22);
    }
  }

  .active-range-segment {
    position: absolute;
    top: 50%;
    height: 6px;
    margin-top: -3px;
    background: ${C.neon};
    box-shadow: 0 0 18px ${C.neonGlow};
    transform-origin: left center;
    cursor: grab;
  }

  .handle-node {
    position: absolute;
    top: 50%;
    width: 44px;
    height: 44px;
    margin-top: -22px;
    margin-left: -22px;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    z-index: 4;

    .handle-core {
      width: 14px;
      height: 22px;
      background: #07070a;
      border: 2px solid ${C.neon};
      transition:
        transform 0.2s ease,
        background 0.2s ease;
    }

    &:hover .handle-core,
    &:focus-visible .handle-core {
      transform: scale(1.18);
      background: ${C.neon};
    }

    &:focus-visible {
      outline: none;
    }
  }
`;

export const DurationQuickRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${C.textMuted};

  .dur-btn {
    min-height: 44px;
    padding: 0.25rem 0.4rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    color: ${C.textSecondary};
    font-family: inherit;
    font-size: inherit;
    font-weight: 600;
    letter-spacing: inherit;

    &[data-active='true'] {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
    }
  }
`;

/* ============================================================================
 * ШАГ 7: СОГЛАСИЕ + КРУПНАЯ ТЕКСТОВАЯ КНОПКА С МАГНИТНЫМ HOVER + ТЕРМИНАЛ УСПЕХА
 * ========================================================================== */

export const ConsentCheckboxRow = styled.label`
  display: inline-flex;
  align-items: flex-start;
  gap: 0.85rem;
  min-height: 44px;
  margin-top: 1.5rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  line-height: 1.55;
  color: ${C.textSecondary};
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
  }

  .check-glyph {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    margin-top: 2px;
    border: 1.5px solid ${({ $checked, $hasError }) =>
      $hasError ? C.danger : $checked ? C.neon : C.lineStrong};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #07070a;
    background: ${({ $checked }) => ($checked ? C.neon : 'transparent')};
    font-size: 12px;
    font-weight: 900;
    transition:
      background 0.2s ease,
      border-color 0.2s ease;
  }

  a {
    color: ${C.textPrimary};
    border-bottom: 1px solid ${C.lineStrong};
    text-decoration: none;

    &:hover {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
    }
  }
`;

export const MagneticSubmitBtn = styled.button`
  position: relative;
  min-height: 58px;
  padding: 0.5rem 0;
  background: transparent;
  border: none;
  color: ${C.neon};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(30px, 5vw, 68px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  will-change: transform;
  transition:
    color 0.25s ease,
    opacity 0.25s ease;

  .submit-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
      width: 0.88em;
      height: 0.88em;
      display: block;
    }
  }

  &:hover:not(:disabled) {
    color: ${C.textPrimary};

    .submit-arrow {
      color: ${C.neon};
      transform: translate3d(10px, -6px, 0);
    }
  }

  &:disabled {
    opacity: 0.45;
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 6px;
  }
`;

/**
 * Финальный экран успешной отправки: притухшая схема со вспышкой выбранных мест
 * и печатающаяся терминальная строка.
 */
export const TerminalSuccessStage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: clamp(1.5rem, 3vw, 2.5rem) 0;
  border-top: 1px solid ${C.line};
  border-bottom: 1px solid ${C.line};

  .terminal-line {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(14px, 1.65vw, 22px);
    font-weight: 600;
    line-height: 1.5;
    color: ${C.neon};
    word-break: break-word;
  }

  .terminal-caret {
    display: inline-block;
    width: 0.55em;
    height: 1.05em;
    margin-left: 0.25em;
    background: ${C.neon};
    vertical-align: text-bottom;
    animation: ${blinkCaret} 1s infinite;
  }

  .terminal-sub {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(12px, 1vw, 14px);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${C.textSecondary};
  }

  .success-mini-map {
    width: 100%;
    max-width: 760px;
    opacity: 0.88;
  }
`;

export const ErrorFallbackBanner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid rgba(255, 90, 90, 0.4);

  .err-msg {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 13px;
    line-height: 1.5;
    color: ${C.danger};
  }

  .err-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
  }

  .tg-fallback-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-height: 44px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${C.neon};
    text-decoration: none;
    border-bottom: 1px solid ${C.neon};
  }
`;

/* ============================================================================
 * ЧЕТЫРЕ ГИГАНТСКИЕ СТРОКИ-ССЫЛКИ КОНТАКТОВ НА ВСЮ ШИРИНУ (CLIP-PATH ЗАЛИВКА)
 * ========================================================================== */

export const GiantContactsList = styled.div`
  width: 100%;
  border-top: 1px solid ${C.line};
`;

export const GiantContactRowLink = styled.a`
  position: relative;
  display: block;
  width: 100%;
  text-decoration: none;
  border-bottom: 1px solid ${C.line};
  overflow: hidden;

  .row-layer {
    box-sizing: border-box;
    width: 100%;
    max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
    margin: 0 auto;
    padding: clamp(1.35rem, 2.8vw, 2.35rem) ${GUTTER};
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: baseline;
    gap: 0.65rem 1.5rem;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      grid-template-columns: 180px 1fr auto;
    }
  }

  .row-kicker {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${C.textMuted};
    grid-column: 1 / -1;

    @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
      grid-column: 1;
    }
  }

  .row-value {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-size: clamp(22px, 3.8vw, 56px);
    font-weight: 800;
    line-height: 1.04;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: ${C.textPrimary};
    word-break: break-word;
  }

  .row-arrow {
    color: ${C.neon};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: clamp(22px, 3vw, 42px);
    height: clamp(22px, 3vw, 42px);
    align-self: center;
    transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1);

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  /* Салатовая заливка поднимается снизу через clip-path, текст инвертируется в чёрный */
  .row-fill-overlay {
    position: absolute;
    inset: 0;
    background: ${C.neon};
    clip-path: inset(100% 0 0 0);
    transition: clip-path 0.38s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;

    .row-kicker,
    .row-value,
    .row-arrow {
      color: #07070a;
    }
  }

  &:hover,
  &:focus-visible {
    outline: none;

    .row-fill-overlay {
      clip-path: inset(0% 0 0 0);
    }

    .row-arrow {
      transform: translate3d(8px, -8px, 0);
    }
  }
`;

/* ============================================================================
 * КАСТОМНЫЙ КУРСОР СЕКЦИИ
 * ========================================================================== */

export const ContactCursorFollower = styled.div`
  display: none !important;
`;

export const ContactCursorDot = styled.div`
  display: none !important;
`;
