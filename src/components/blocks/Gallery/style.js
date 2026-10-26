import styled, { keyframes } from 'styled-components';

/**
 * Список параметров WebGL-туннеля «Внутри клуба»:
 * - scrollPinVh: высота закрепления секции при скролле (~500vh)
 * - cameraLerp: плавность следования камеры за скроллом (0..1)
 * - velocityLerp: сглаживание скорости полёта uVelocity
 * - mouseParallax: амплитуда параллакса камеры от мыши (±0.3 ед.)
 * - hoverZOffset: приближение фото по оси Z при наведении (+0.3 ед.)
 * - velocityStretch: сила вытягивания UV при высокой скорости
 * - rgbSplitStrength: сила смещения каналов R/G/B от скорости
 * - rippleStrength: амплитуда волны искажения от курсора на фото
 * - colorGradeIntensity: интенсивность цветокора в шейдере
 * - bloomStrength / bloomRadius / bloomThreshold: параметры UnrealBloomPass
 * - fogDensity / fogDensityFocused: густота экспоненциального тумана FogExp2
 * - desktopFrameCount / mobileFrameCount: число уникальных фото (9 на десктопе, 8 на мобильных)
 * - lazyAheadCount: сколько ближайших кадров впереди камеры подгружать заранее (5)
 * - portalCount: число архитектурных 3D-порталов туннеля (18)
 * - streakCount: число пролетающих салатовых световых полос (InstancedMesh)
 * - particleCount: число 3D-частиц и оптических прицелов (+) в объёме туннеля
 */
export const TUNNEL_PARAMS = {
  colors: {
    bg: '#07070A',
    neon: '#B6FF00',
    textPrimary: '#F2F2F5',
    textSecondary: '#B8B8C2',
    textMuted: '#72727E',
    line: 'rgba(242, 242, 245, 0.14)',
  },
  scrollPinVh: 500,
  cameraLerp: 0.085,
  velocityLerp: 0.12,
  mouseParallax: 0.3,
  hoverZOffset: 0.3,
  velocityStretch: 0.14,
  rgbSplitStrength: 0.03,
  rippleStrength: 0.024,
  colorGradeIntensity: 0.78,
  bloomStrength: 0.62,
  bloomRadius: 0.52,
  bloomThreshold: 0.85,
  fogDensity: 0.019,
  fogDensityFocused: 0.044,
  desktopFrameCount: 9,
  mobileFrameCount: 9,
  lazyAheadCount: 9,
  portalCount: 18,
  streakCount: 40,
  particleCount: 320,
};

const C = TUNNEL_PARAMS.colors;
const GUTTER = ({ theme }) => theme.layout?.gutter || 'clamp(24px, 4.5vw, 56px)';

const pulseDot = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.22; transform: scale(0.8); }
`;

export const GallerySection = styled.section`
  --gallery-bg: ${C.bg};
  --gallery-neon: ${C.neon};
  --gallery-text: ${C.textPrimary};
  --gallery-muted: ${C.textMuted};
  --gallery-line: ${C.line};

  position: relative;
  width: 100%;
  background: ${C.bg};
  color: ${C.textPrimary};
  overflow: hidden;

  @media (hover: hover) and (pointer: fine) {
    cursor: none;

    button,
    a {
      cursor: none;
    }
  }
`;

/**
 * Закрепляемый на ~500vh полноэкранный контейнер WebGL-сцены.
 */
export const TunnelViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 620px;
  background: ${C.bg};
  overflow: hidden;
  user-select: none;
  touch-action: ${({ $isMobileSwipe }) => ($isMobileSwipe ? 'pan-y' : 'auto')};
`;

export const WebGLCanvasWrap = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;

/**
 * Лёгкое плёночное зерно и виньетка поверх WebGL-сцены.
 */
export const FilmGrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 50% 50%,
      transparent 52%,
      rgba(7, 7, 10, 0.42) 85%,
      rgba(7, 7, 10, 0.86) 100%
    ),
    repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.011) 0px,
      rgba(255, 255, 255, 0.011) 1px,
      transparent 1px,
      transparent 3px
    );
`;

/**
 * Верхняя телеметрия пролёта (глубина Z, активная зона, прогресс).
 */
export const TopTelemetryBar = styled.div`
  position: absolute;
  top: clamp(4.8rem, 8.2vh, 5.8rem);
  left: 0;
  right: 0;
  z-index: 5;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0 ${GUTTER};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  pointer-events: none;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(0.64rem, 0.78vw, 0.74rem);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${C.textMuted};

  .rec-cluster {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: ${C.textSecondary};
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .rec-dot {
    flex-shrink: 0;
    width: 7px;
    height: 7px;
    background: ${C.neon};
    box-shadow: 0 0 10px ${C.neon};
    animation: ${pulseDot} 1.4s ease-in-out infinite;
  }

  .depth-readout {
    flex-shrink: 0;
    color: ${C.neon};
    font-variant-numeric: tabular-nums;
  }
`;

/**
 * Вводный блок поверх входа в туннель:
 * гигантский заголовок «Внутри клуба» построчно маской + моно-подпись.
 */
export const IntroOverlay = styled.div`
  position: absolute;
  top: clamp(6.8rem, 12vh, 8.4rem);
  left: 0;
  right: 0;
  z-index: 4;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0 ${GUTTER};
  pointer-events: none;
  will-change: transform, opacity;
`;

export const SectionKicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(0.68rem, 0.82vw, 0.76rem);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.neon};
  margin-bottom: 0.75rem;

  &::before {
    content: '';
    width: 26px;
    height: 1px;
    background: ${C.neon};
    box-shadow: 0 0 10px ${C.neon};
  }
`;

export const GiantTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 900;
  font-size: clamp(2.5rem, 6.8vw, 6.8rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: ${C.textPrimary};
  max-width: 100%;

  .line-mask {
    display: block;
    overflow: hidden;
    padding-bottom: 0.05em;
  }

  .line-inner {
    display: block;
    will-change: transform;
  }

  .line-offset {
    padding-left: clamp(1rem, 5.5vw, 6rem);
    color: ${C.neon};
    text-shadow: 0 0 34px rgba(182, 255, 0, 0.24);
  }
`;

export const IntroSubtitle = styled.p`
  margin: clamp(0.8rem, 1.5vw, 1.25rem) 0 0;
  max-width: min(48ch, 100%);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(0.74rem, 0.9vw, 0.88rem);
  line-height: 1.58;
  letter-spacing: 0.03em;
  color: ${C.textSecondary};
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.92);
`;

/**
 * Нижняя полоса живого фокуса текущего кадра и прогресса полёта.
 */
export const FlightHudBottom = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(1.25rem, 2.8vh, 2.1rem);
  z-index: 5;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 0 ${GUTTER};
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  pointer-events: none;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;

  .hud-active-frame {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
    max-width: min(68ch, 62vw);
    padding-left: 0.85rem;
    border-left: 2px solid ${C.neon};
    background: linear-gradient(90deg, rgba(7, 7, 10, 0.78) 0%, rgba(7, 7, 10, 0) 100%);
  }

  .hud-active-zone {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.68rem, 0.82vw, 0.78rem);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.neon};
  }

  .hud-active-caption {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.74rem, 0.9vw, 0.86rem);
    line-height: 1.45;
    color: ${C.textPrimary};
    white-space: normal;
  }

  .hud-right-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.45rem;
    flex-shrink: 0;
  }

  .hud-hint {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${C.textMuted};
  }

  .hud-hint strong {
    color: ${C.neon};
    font-weight: 600;
  }

  .hud-progress-wrap {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    min-width: clamp(170px, 20vw, 280px);
  }

  .hud-counter {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.76rem;
    letter-spacing: 0.16em;
    color: ${C.textPrimary};
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .hud-bar-track {
    position: relative;
    flex: 1;
    height: 2px;
    background: rgba(242, 242, 245, 0.16);
    overflow: hidden;
  }

  .hud-bar-fill {
    position: absolute;
    inset: 0;
    background: ${C.neon};
    box-shadow: 0 0 10px ${C.neon};
    transform-origin: left center;
    transform: scaleX(var(--tunnel-progress, 0));
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.65rem;

    .hud-active-frame {
      max-width: 100%;
    }

    .hud-right-col {
      align-items: stretch;
    }

    .hud-progress-wrap {
      width: 100%;
    }
  }
`;

/**
 * Нижняя HTML-подпись при подлёте камеры к выбранному кадру (клик / Enter):
 * зал · время · описание (моно-шрифтом) + счётчик "03 / 09" + стрелки.
 */
export const InspectCaptionBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(1.4rem, 3.2vh, 2.4rem);
  z-index: 8;
  box-sizing: border-box;
  width: 100%;
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
  padding: 1rem ${GUTTER} 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
  border-top: 1px solid rgba(182, 255, 0, 0.42);
  background: linear-gradient(
    180deg,
    rgba(7, 7, 10, 0) 0%,
    rgba(7, 7, 10, 0.88) 35%,
    rgba(7, 7, 10, 0.96) 100%
  );
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transform: translate3d(0, ${({ $visible }) => ($visible ? '0' : '18px')}, 0);
  transition:
    opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);

  .caption-main {
    display: flex;
    flex-direction: column;
    gap: 0.36rem;
    max-width: min(64ch, 100%);
    min-width: 0;
  }

  .caption-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.72rem, 0.88vw, 0.84rem);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${C.neon};
  }

  .caption-text {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.8rem, 1vw, 0.95rem);
    line-height: 1.5;
    letter-spacing: 0.02em;
    color: ${C.textPrimary};
  }

  .caption-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.1rem;
    font-family: ${({ theme }) => theme.fonts.mono};
  }

  .caption-counter {
    font-size: 0.84rem;
    letter-spacing: 0.16em;
    color: ${C.textPrimary};
    font-variant-numeric: tabular-nums;
  }

  .caption-counter strong {
    color: ${C.neon};
  }

  .nav-btn {
    padding: 0.35rem 0;
    background: none;
    border: none;
    border-bottom: 1px solid transparent;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${C.textPrimary};
    transition:
      color 0.2s ease,
      border-color 0.2s ease;

    &:hover,
    &:focus-visible {
      color: ${C.neon};
      border-bottom-color: ${C.neon};
      outline: none;
    }
  }
`;

/**
 * Финал пролёта (на 9-м панорамном кадре зала):
 * скорость падает до нуля, появляется надпись «Заходи» и кнопка бронирования.
 */
export const FinaleOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 6;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: clamp(2rem, 4vw, 4rem) ${GUTTER} clamp(4.2rem, 7.5vh, 5.8rem);
  background: linear-gradient(
    180deg,
    rgba(7, 7, 10, 0) 0%,
    rgba(7, 7, 10, 0.16) 45%,
    rgba(7, 7, 10, 0.86) 100%
  );
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};
  transform: translate3d(0, ${({ $visible }) => ($visible ? '0' : '22px')}, 0);
  transition:
    opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);

  .finale-inner {
    width: 100%;
    max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
    margin: 0 auto;
  }

  .finale-kicker {
    display: block;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.68rem, 0.85vw, 0.78rem);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${C.neon};
    margin-bottom: 0.45rem;
  }

  .finale-title {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 900;
    font-size: clamp(2.8rem, 7.6vw, 7.6rem);
    line-height: 0.9;
    letter-spacing: -0.04em;
    text-transform: uppercase;
    color: ${C.textPrimary};
    text-shadow: 0 0 42px rgba(7, 7, 10, 0.92);
  }

  .finale-row {
    margin-top: clamp(0.9rem, 1.8vw, 1.5rem);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1.5rem;
  }

  .finale-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.75rem 0;
    background: none;
    border: none;
    border-bottom: 2px solid ${C.neon};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.82rem, 1.02vw, 1rem);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.neon};
    text-decoration: none;
    text-shadow: 0 0 18px rgba(182, 255, 0, 0.45);
    transition:
      transform 0.25s ease,
      color 0.25s ease;

    &:hover,
    &:focus-visible {
      color: #ffffff;
      transform: translate3d(6px, 0, 0);
      outline: none;
    }
  }

  .finale-note {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: clamp(0.7rem, 0.84vw, 0.78rem);
    letter-spacing: 0.08em;
    color: ${C.textSecondary};
  }
`;

/**
 * Доступная клавиатурная панель (Tab по кадрам, Enter открывает, стрелки листают, Esc закрывает).
 */
export const KeyboardFrameNav = styled.nav`
  position: absolute;
  top: 4.5rem;
  left: ${GUTTER};
  z-index: 9;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  pointer-events: none;

  button {
    pointer-events: auto;
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;

    &:focus-visible {
      position: static;
      width: auto;
      height: auto;
      margin: 0;
      padding: 0.35rem 0.65rem;
      overflow: visible;
      clip: auto;
      background: ${C.bg};
      color: ${C.neon};
      border: 1px solid ${C.neon};
      font-family: ${({ theme }) => theme.fonts.mono};
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      outline: none;
    }
  }
`;

/**
 * Скрытый семантический список всех кадров с alt и подписями для скринридеров и SEO.
 */
export const VisuallyHiddenSeoList = styled.div`
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
 * Fallback-лента со scroll-snap для prefers-reduced-motion и устройств без WebGL.
 */
export const FallbackSectionWrap = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: clamp(5rem, 9vw, 8rem) ${GUTTER};
  max-width: ${({ theme }) => theme.layout?.containerWidth || '1360px'};
  margin: 0 auto;
`;

export const FallbackStrip = styled.div`
  margin-top: clamp(2.5rem, 5vw, 4rem);
  display: flex;
  align-items: flex-start;
  gap: clamp(1.5rem, 3.5vw, 3rem);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1.5rem;
  scrollbar-width: thin;
  scrollbar-color: ${C.neon} rgba(255, 255, 255, 0.08);

  .fallback-frame {
    flex: 0 0 min(82vw, 560px);
    scroll-snap-align: start;
    margin: 0;
  }

  .fallback-frame:nth-child(even) {
    margin-top: 2.2rem;
  }

  .fallback-img-wrap {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #0d0d12;
  }

  .fallback-img-wrap img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: cover;
    filter: contrast(1.08) saturate(0.86) brightness(0.92);
  }

  .fallback-caption {
    margin-top: 0.75rem;
    padding-top: 0.55rem;
    border-top: 1px solid ${C.line};
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.76rem;
    color: ${C.textSecondary};
  }

  .fallback-zone {
    color: ${C.neon};
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
`;

/**
 * Кастомный курсор секции (салатовая метка «смотреть» при наведении на фото в 3D).
 */
export const GalleryCursorFollower = styled.div`
  display: none !important;
`;

export const GalleryCursorDot = styled.div`
  display: none !important;
`;

/* ============================================================================
 * МОБИЛЬНАЯ ИНТЕРАКТИВНАЯ HUD-ВИТРИНА (max-width: 767px)
 * Без скролл-джекинга: быстрый выбор зоны + тактильная свайп-колода 9 кадров + лайтбокс
 * ========================================================================== */

export const MobileShowcaseWrap = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 4.25rem 0 4.5rem;
  background:
    radial-gradient(circle at 82% 14%, rgba(182, 255, 0, 0.08) 0%, transparent 52%),
    ${C.bg};
  overflow: hidden;

  .mob-header-container {
    box-sizing: border-box;
    width: 100%;
    padding: 0 ${GUTTER};
  }

  .mob-top-telemetry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-bottom: 0.85rem;
    margin-bottom: 1.15rem;
    border-bottom: 1px solid ${C.line};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.textSecondary};
  }

  .mob-rec {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    color: ${C.textPrimary};
    font-weight: 600;
  }

  .mob-rec-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${C.neon};
    box-shadow: 0 0 8px ${C.neon};
    animation: ${pulseDot} 2s ease-in-out infinite;
  }

  .mob-counter-badge {
    color: ${C.neon};
    font-weight: 700;
  }
`;

export const MobileZoneFilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 1.35rem ${GUTTER} 0.9rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  .zone-chip {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.78rem;
    background: rgba(16, 16, 22, 0.88);
    border: 1px solid rgba(242, 242, 245, 0.14);
    color: ${C.textSecondary};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;
  }

  .zone-chip .chip-num {
    color: ${C.textMuted};
    font-weight: 700;
  }

  .zone-chip[data-active='true'] {
    background: rgba(182, 255, 0, 0.12);
    border-color: ${C.neon};
    color: ${C.textPrimary};
    box-shadow: 0 0 16px rgba(182, 255, 0, 0.18);
  }

  .zone-chip[data-active='true'] .chip-num {
    color: ${C.neon};
  }
`;

export const MobileDeckTrack = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.9rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: ${GUTTER};
  padding: 0.4rem ${GUTTER} 1.1rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const MobileSlideCard = styled.article`
  position: relative;
  flex: 0 0 85vw;
  max-width: 420px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  background: #0c0c12;
  border: 1px solid
    ${({ $active }) => ($active ? 'rgba(182, 255, 0, 0.65)' : 'rgba(242, 242, 245, 0.14)')};
  box-shadow: ${({ $active }) =>
    $active ? '0 12px 34px rgba(0, 0, 0, 0.65), 0 0 22px rgba(182, 255, 0, 0.1)' : 'none'};
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease;

  /* Угловые видоискатели HUD */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    pointer-events: none;
    z-index: 4;
    border-color: ${({ $active }) => ($active ? C.neon : 'rgba(242, 242, 245, 0.35)')};
    border-style: solid;
  }

  &::before {
    top: -1px;
    left: -1px;
    border-width: 2px 0 0 2px;
  }

  &::after {
    bottom: -1px;
    right: -1px;
    border-width: 0 2px 2px 0;
  }

  .slide-media {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: #08080c;
    cursor: pointer;
  }

  .slide-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: contrast(1.05) saturate(0.96);
  }

  .slide-media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(7, 7, 10, 0.58) 0%,
      transparent 32%,
      transparent 64%,
      rgba(7, 7, 10, 0.72) 100%
    );
    pointer-events: none;
  }

  .slide-top-hud {
    position: absolute;
    top: 0.65rem;
    left: 0.75rem;
    right: 0.75rem;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    pointer-events: none;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .slide-badge-zone {
    padding: 0.24rem 0.52rem;
    background: rgba(7, 7, 10, 0.82);
    border-left: 2px solid ${C.neon};
    color: ${C.textPrimary};
    font-weight: 700;
  }

  .slide-badge-zone strong {
    color: ${C.neon};
  }

  .slide-badge-time {
    padding: 0.22rem 0.48rem;
    background: rgba(7, 7, 10, 0.76);
    color: ${C.textSecondary};
  }

  .slide-zoom-btn {
    position: absolute;
    right: 0.7rem;
    bottom: 0.65rem;
    z-index: 3;
    padding: 0.34rem 0.62rem;
    background: rgba(7, 7, 10, 0.86);
    border: 1px solid rgba(182, 255, 0, 0.55);
    color: ${C.neon};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.64rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .slide-body {
    padding: 0.95rem 1rem 1.05rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    border-top: 1px solid rgba(242, 242, 245, 0.09);
  }

  .slide-zone-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: ${C.neon};
  }

  .slide-ratio-tag {
    font-size: 0.64rem;
    font-weight: 500;
    color: ${C.textMuted};
  }

  .slide-caption {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.8rem;
    line-height: 1.48;
    color: ${C.textPrimary};
  }
`;

export const MobileDeckControls = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 0.5rem ${GUTTER} 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;

  .deck-nav-btn {
    flex: 0 0 auto;
    min-height: 42px;
    padding: 0 0.95rem;
    background: rgba(16, 16, 22, 0.92);
    border: 1px solid rgba(242, 242, 245, 0.2);
    color: ${C.textPrimary};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease;

    &:active {
      border-color: ${C.neon};
      color: ${C.neon};
    }
  }

  .deck-segments {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 4px;
    align-items: center;
  }

  .deck-seg {
    height: 3px;
    background: rgba(242, 242, 245, 0.16);
    border: none;
    padding: 0;
    cursor: pointer;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
  }

  .deck-seg[data-active='true'] {
    background: ${C.neon};
    box-shadow: 0 0 8px ${C.neon};
  }
`;

export const MobileFinaleBanner = styled.div`
  box-sizing: border-box;
  margin: 1.75rem ${GUTTER} 0;
  padding: 1.15rem 1.1rem;
  background: linear-gradient(135deg, rgba(182, 255, 0, 0.09) 0%, rgba(14, 14, 20, 0.95) 100%);
  border: 1px solid rgba(182, 255, 0, 0.32);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .mob-finale-kicker {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.66rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${C.neon};
  }

  .mob-finale-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .mob-finale-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.85rem 1.2rem;
    background: ${C.neon};
    color: #07070a;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
  }
`;

export const MobileLightboxModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(5, 5, 8, 0.97);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: calc(1.25rem + env(safe-area-inset-top, 0px)) ${GUTTER}
    calc(1.4rem + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;

  .lb-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.74rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${C.neon};
  }

  .lb-close {
    padding: 0.48rem 0.85rem;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(242, 242, 245, 0.25);
    color: ${C.textPrimary};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .lb-media {
    position: relative;
    width: 100%;
    max-height: 62vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(182, 255, 0, 0.35);
    background: #07070a;
  }

  .lb-media img {
    width: 100%;
    max-height: 62vh;
    object-fit: contain;
    display: block;
  }

  .lb-bottom {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  .lb-caption {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.82rem;
    line-height: 1.48;
    color: ${C.textPrimary};
  }

  .lb-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
  }

  .lb-btn {
    min-height: 44px;
    background: rgba(16, 16, 22, 0.95);
    border: 1px solid rgba(242, 242, 245, 0.22);
    color: ${C.textPrimary};
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
  }
`;

