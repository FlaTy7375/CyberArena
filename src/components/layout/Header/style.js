import styled, { css, keyframes } from 'styled-components';

/**
 * Все параметры шапки вынесены в конфигурацию в начале файла:
 * - цвета и контраст (приглушённый текст #A6A6B4 имеет контраст 7.9:1 на #07070A >= 4.5:1)
 * - пороги скрытия при скролле и выхода из Hero
 * - тайминги появления маской, scramble-эффекта и плавного скролла Lenis
 * - правила поведения кнопки «Бронь» после секции «Цены» и внутри «Контактов»
 */
export const HEADER_CONFIG = {
  colors: {
    bg: '#07070A',
    backdrop: 'rgba(7, 7, 10, 0.5)', // Тёмная подложка с opacity 0.5 после выхода из hero
    neon: '#B6FF00',
    neonGlow: 'rgba(182, 255, 0, 0.55)',
    textPrimary: '#F2F2F5',
    textSecondary: '#C8C8D4',
    textMuted: '#A6A6B4', // Контраст > 7.5:1 на #07070A (WCAG AA >= 4.5:1)
    line: 'rgba(242, 242, 245, 0.14)',
  },
  scroll: {
    directionDeltaThresholdPx: 8, // Порог 8 px для определения направления скролла
    alwaysVisibleTopPx: 48,
    blurPx: 12, // backdrop-filter: blur(12px) после выхода из hero
    scrollToDurationSec: 1.4, // Длительность плавного скролла Lenis (~1.4 с, expo.out)
    headerHeightOffsetPx: 68,
  },
  animation: {
    entranceStaggerSec: 0.06, // Stagger 60 мс при загрузке страницы
    entranceDurationSec: 0.72,
    scrambleDurationMs: 300, // Перебор символов 250–350 мс на hover
    scrambleStepMs: 28,
    magneticMaxShiftPx: 6, // Магнитное притяжение к курсору (±6 px)
    mobileItemStaggerSec: 0.06,
  },
  ctaRules: {
    boostAfterSectionId: 'pricing', // После секции «Цены» кнопка увеличивается на 8% и усиливает свечение
    afterPricingScale: 1.08,
    hideInSectionId: 'contact', // В секции «Контакты» мягко скрывается (opacity + translateY)
    hideTranslateYPx: -10,
  },
  workHours: {
    timeZone: 'Europe/Moscow',
    openHour: 10,
    closeHour: 2,
  },
};

const C = HEADER_CONFIG.colors;
const GUTTER = ({ theme }) => theme.layout?.gutter || 'clamp(20px, 4vw, 48px)';

const dotPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.42);
    opacity: 0.36;
  }
`;

export const SkipToContentLink = styled.a`
  position: fixed;
  top: 0.65rem;
  left: ${GUTTER};
  z-index: 1300;
  padding: 0.55rem 0.95rem;
  background: ${C.neon};
  color: ${C.bg};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, -260%, 0);
  transition:
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.15s ease;

  &:focus-visible {
    opacity: 1;
    pointer-events: auto;
    transform: translate3d(0, 0, 0);
    outline: 2px solid ${C.textPrimary};
    outline-offset: 2px;
  }

  @media (hover: none), (pointer: coarse) {
    display: none !important;
  }
`;

/**
 * Шапка: position: fixed поверх всех секций, pin-слоёв и canvas (z-index: 1200).
 * Над Hero полностью прозрачная и без нижней линии.
 * После выхода из Hero плавно появляется backdrop-filter: blur(12px),
 * тёмная подложка rgba(7, 7, 10, 0.5) и тонкая линия-подчёркивание снизу.
 */
export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;
  width: 100%;
  background: ${({ $pastHero, $menuOpen }) =>
    $menuOpen
      ? 'rgba(7, 7, 10, 0.94)'
      : $pastHero
        ? C.backdrop
        : 'transparent'};
  backdrop-filter: ${({ $pastHero, $menuOpen }) =>
    $pastHero || $menuOpen ? `blur(${HEADER_CONFIG.scroll.blurPx}px)` : 'none'};
  -webkit-backdrop-filter: ${({ $pastHero, $menuOpen }) =>
    $pastHero || $menuOpen ? `blur(${HEADER_CONFIG.scroll.blurPx}px)` : 'none'};
  border-bottom: 1px solid
    ${({ $pastHero, $menuOpen }) =>
      $pastHero && !$menuOpen ? C.line : 'transparent'};
  transform: ${({ $hidden, $reducedMotion }) =>
    $hidden && !$reducedMotion ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)'};
  transition:
    transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.38s ease,
    backdrop-filter 0.38s ease,
    -webkit-backdrop-filter 0.38s ease,
    border-bottom-color 0.38s ease;
  will-change: transform;

  /* Над hero или на секциях со светлым фоном обеспечиваем идеальную читаемость */
  ${({ $pastHero, $menuOpen }) =>
    !$pastHero &&
    !$menuOpen &&
    css`
      mix-blend-mode: difference;
    `}

  &[data-section-theme='light'] {
    background: rgba(242, 242, 245, 0.72);
    color: ${C.bg};
  }

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    a,
    button {
      cursor: none;
    }
  }
`;

export const HeaderGrainLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 0.035 : 0)};
  transition: opacity 0.35s ease;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 160px 160px;
`;

export const HeaderContainer = styled.div`
  position: relative;
  z-index: 2;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1rem, 2.2vw, 2.5rem);
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0.95rem ${GUTTER};
`;

export const EntranceMask = styled.div`
  overflow: hidden;
  overflow: clip;
  display: inline-flex;
  align-items: center;

  .entrance-inner {
    display: inline-flex;
    align-items: center;
    will-change: transform, opacity;
  }
`;

/* ============================================================================
 * 1. СЛЕВА: ЛОГОТИП CYBERARENA (КОНТУР ЗАЛИВАЕТСЯ САЛАТОВЫМ СЛЕВА НАПРАВО НА HOVER)
 * ========================================================================== */

export const LogoLink = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0.25rem 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(15px, 1.25vw, 17px);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  color: ${C.textPrimary};

  .logo-word {
    position: relative;
    display: inline-block;
    line-height: 1;
  }

  /* Контурная подложка логотипа */
  .logo-base {
    display: block;
    color: rgba(242, 242, 245, 0.88);
    -webkit-text-stroke: 0.6px ${C.textPrimary};
    transition: color 0.28s ease;
  }

  /* Слой салатовой заливки слева направо при наведении */
  .logo-fill {
    position: absolute;
    inset: 0;
    display: block;
    color: ${C.neon};
    -webkit-text-stroke: 0.6px ${C.neon};
    text-shadow: 0 0 18px rgba(182, 255, 0, 0.48);
    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.38s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  &:hover,
  &:focus-visible {
    outline: none;

    .logo-base {
      color: transparent;
    }

    .logo-fill {
      clip-path: inset(0 0% 0 0);
    }
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 4px;
  }
`;

/* ============================================================================
 * 2. ПО ЦЕНТРУ: НАВИГАЦИЯ (МОНО-ШРИФТ, МЕЛКИЙ КЕГЛЬ, UPPERCASE) + СЧЁТЧИК 03 / 07
 * ========================================================================== */

export const CenterNavArea = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  gap: clamp(1.2rem, 2.2vw, 2.4rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

export const NavList = styled.nav`
  display: flex;
  align-items: center;
  gap: clamp(1rem, 1.8vw, 2.05rem);
`;

export const NavItemMask = styled.div`
  overflow: hidden;
  display: inline-flex;
  align-items: center;
`;

export const NavLinkItem = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0.42rem 0.15rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  color: ${({ $active }) => ($active ? C.neon : C.textSecondary)};
  text-shadow: ${({ $active }) =>
    $active ? '0 0 12px rgba(182, 255, 0, 0.42)' : 'none'};
  will-change: transform, color;
  transition:
    color 0.2s ease,
    text-shadow 0.2s ease,
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  /* Фиксируем ширину по исходному слову через невидимый дубликат, чтобы scramble не дёргал соседей */
  .label-sizer {
    visibility: hidden;
    pointer-events: none;
    user-select: none;
  }

  .label-live {
    position: absolute;
    inset: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Фоновая направляющая под активным пунктом */
  .progress-track {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    height: 1.5px;
    background: rgba(242, 242, 245, 0.16);
    opacity: ${({ $active }) => ($active ? 1 : 0)};
    transition: opacity 0.22s ease;
    pointer-events: none;
  }

  /* Тонкая линия-прогресс, заполняющаяся по мере прокрутки активной секции */
  .progress-bar {
    position: absolute;
    inset: 0;
    background: ${C.neon};
    box-shadow: 0 0 8px ${C.neon};
    transform-origin: left center;
    transform: scaleX(var(--section-progress, 0));
    will-change: transform;
  }

  &:hover,
  &:focus-visible {
    color: ${C.neon};
    text-shadow: 0 0 12px rgba(182, 255, 0, 0.45);
    outline: none;
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 4px;
  }
`;

/**
 * Счётчик секций справа от навигации (десктоп): «03 / 07».
 * При смене секции цифры меняются вертикальным перелистыванием.
 */
export const SectionCounter = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding-left: clamp(0.75rem, 1.3vw, 1.35rem);
  border-left: 1px solid ${C.line};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  color: ${C.textMuted};
  user-select: none;

  .counter-window {
    position: relative;
    height: 1.25em;
    line-height: 1.25em;
    overflow: hidden;
    display: inline-block;
    width: 2.1ch;
    color: ${C.neon};
    font-weight: 700;
  }

  .counter-reel {
    display: flex;
    flex-direction: column;
    transform: translate3d(0, ${({ $activeIndex }) => -(($activeIndex || 0) * 1.25)}em, 0);
    transition: ${({ $reducedMotion }) =>
      $reducedMotion
        ? 'none'
        : 'transform 0.48s cubic-bezier(0.16, 1, 0.3, 1)'};
    will-change: transform;
  }

  .counter-digit {
    height: 1.25em;
    line-height: 1.25em;
    display: block;
    text-align: right;
  }

  .counter-slash {
    color: ${C.textMuted};
    opacity: 0.7;
  }

  .counter-total {
    color: ${C.textMuted};
  }
`;

/* ============================================================================
 * 3. СПРАВА: КНОПКА «БРОНЬ» (БЕЗ РАМКИ, С ПУЛЬСИРУЮЩЕЙ ТОЧКОЙ И ЗАЛИВКОЙ СНИЗУ)
 * ========================================================================== */

export const RightActionsCluster = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.85rem;
`;

export const BookActionWrap = styled.div`
  display: none;
  will-change: transform, opacity;
  opacity: ${({ $hiddenInContact }) => ($hiddenInContact ? 0 : 1)};
  pointer-events: ${({ $hiddenInContact }) => ($hiddenInContact ? 'none' : 'auto')};
  transform: ${({ $hiddenInContact, $boosted }) => {
    if ($hiddenInContact) {
      return `translate3d(0, ${HEADER_CONFIG.ctaRules.hideTranslateYPx}px, 0) scale(0.96)`;
    }
    if ($boosted) {
      return `translate3d(0, 0, 0) scale(${HEADER_CONFIG.ctaRules.afterPricingScale})`;
    }
    return 'translate3d(0, 0, 0) scale(1)';
  }};
  filter: ${({ $boosted, $hiddenInContact }) =>
    $boosted && !$hiddenInContact
      ? 'drop-shadow(0 0 14px rgba(182, 255, 0, 0.42))'
      : 'none'};
  transition:
    transform 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.34s ease,
    filter 0.42s ease;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: inline-flex;
  }
`;

export const BookActionButton = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.52rem;
  min-height: 36px;
  padding: 0.42rem 0.78rem;
  border: none;
  background: transparent;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: ${C.textPrimary};
  will-change: transform;
  transition:
    color 0.26s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);

  /* Слой салатовой заливки, поднимающейся снизу вверх (clip-path) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${C.neon};
    clip-path: inset(100% 0 0 0);
    transition: clip-path 0.32s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 0;
  }

  .book-dot {
    position: relative;
    z-index: 1;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${C.neon};
    box-shadow: 0 0 10px ${C.neon};
    transition:
      background-color 0.24s ease,
      box-shadow 0.24s ease;
    animation: ${({ $reducedMotion }) =>
      $reducedMotion ? 'none' : css`${dotPulse} 1.9s ease-in-out infinite`};
  }

  .book-text {
    position: relative;
    z-index: 1;
    transition: color 0.24s ease;
  }

  &:hover,
  &:focus-visible {
    outline: none;
    color: ${C.bg};

    &::before {
      clip-path: inset(0% 0 0 0);
    }

    .book-dot {
      background: ${C.bg};
      box-shadow: none;
      animation: none;
    }

    .book-text {
      color: ${C.bg};
    }
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 4px;
  }
`;

/* ============================================================================
 * 4. МОБИЛЬНОЕ МЕНЮ: БУРГЕР ИЗ ДВУХ ЛИНИЙ (БЕЗ РАМОК) + ПОЛНОЭКРАННЫЙ ОВЕРЛЕЙ
 * ========================================================================== */

export const BurgerTwoLineButton = styled.button`
  position: relative;
  z-index: 1210;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${C.textPrimary};

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }

  .burger-line {
    display: block;
    width: 24px;
    height: 2px;
    background: ${({ $isOpen }) => ($isOpen ? C.neon : C.textPrimary)};
    transition:
      transform 0.34s cubic-bezier(0.16, 1, 0.3, 1),
      background-color 0.22s ease;
    will-change: transform;
  }

  .burger-line:first-child {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'translate3d(0, 1px, 0) rotate(45deg)' : 'translate3d(0, -4px, 0)'};
  }

  .burger-line:last-child {
    transform: ${({ $isOpen }) =>
      $isOpen ? 'translate3d(0, -1px, 0) rotate(-45deg)' : 'translate3d(0, 4px, 0)'};
  }

  &:focus-visible {
    outline: 1px solid ${C.neon};
    outline-offset: 3px;
  }
`;

export const MobileFullscreenOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1190;
  background: ${C.bg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(4.75rem + env(safe-area-inset-top, 0px)) ${GUTTER}
    calc(2rem + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition:
    opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1),
    visibility 0.36s;
  overflow-y: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MobileMenuNav = styled.nav`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: auto 0;
`;

export const MobileNavMask = styled.div`
  overflow: hidden;
  overflow: clip;
  border-bottom: 1px solid ${C.line};
`;

export const MobileGiantLink = styled.a`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  min-height: 54px;
  padding: 0.55rem 0;
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(30px, 8.6vw, 48px);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.025em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? C.neon : C.textPrimary)};
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  will-change: transform, opacity;
  transform: ${({ $isOpen }) =>
    $isOpen ? 'translate3d(0, 0%, 0)' : 'translate3d(0, 105%, 0)'};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: ${({ $isOpen, $index }) =>
    $isOpen
      ? `transform 0.48s cubic-bezier(0.22, 1, 0.36, 1) ${($index || 0) * HEADER_CONFIG.animation.mobileItemStaggerSec}s, opacity 0.36s ease ${($index || 0) * HEADER_CONFIG.animation.mobileItemStaggerSec}s, color 0.2s ease`
      : 'transform 0.24s ease, opacity 0.2s ease, color 0.2s ease'};

  .m-left {
    display: inline-flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .m-idx {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    color: ${({ $active }) => ($active ? C.neon : C.textMuted)};
  }

  &:hover,
  &:focus-visible {
    color: ${C.neon};
    outline: none;
  }
`;

export const MobileBottomFooter = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding-top: 1.25rem;
`;

export const MobileLiveStatusRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.textSecondary};

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${({ $isOpen }) => ($isOpen ? C.neon : C.textMuted)};
    box-shadow: ${({ $isOpen }) => ($isOpen ? `0 0 10px ${C.neon}` : 'none')};
    animation: ${({ $isOpen, $reducedMotion }) =>
      $isOpen && !$reducedMotion ? css`${dotPulse} 2s ease-in-out infinite` : 'none'};
  }
`;

export const MobileGiantBookLink = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 54px;
  padding: 0.75rem 0;
  border-top: 1px solid ${C.neon};
  border-bottom: 1px solid ${C.neon};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(24px, 6.8vw, 34px);
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-decoration: none;
  color: ${C.neon};

  .book-left {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
  }

  .book-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${C.neon};
    box-shadow: 0 0 12px ${C.neon};
  }

  svg {
    width: 22px;
    height: 22px;
    display: block;
  }
`;

/* ============================================================================
 * КАСТОМНЫЙ КУРСОР ШАПКИ
 * ========================================================================== */

export const HeaderCursorFollower = styled.div`
  display: none !important;
`;

export const HeaderCursorDot = styled.div`
  display: none !important;
`;
