import styled, { css, keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

export const HeroWrapper = styled.section`
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
`;

export const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: saturate(0.85) contrast(1.05);
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(7, 7, 10, 0.94) 0%,
      rgba(7, 7, 10, 0.72) 38%,
      rgba(7, 7, 10, 0.3) 75%,
      rgba(7, 7, 10, 0.55) 100%
    );
    z-index: 1;

    @media (max-width: 767px) {
      background: linear-gradient(
        180deg,
        rgba(7, 7, 10, 0.45) 0%,
        rgba(7, 7, 10, 0.25) 38%,
        rgba(7, 7, 10, 0.72) 78%,
        rgba(7, 7, 10, 0.92) 100%
      );
    }
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(7, 7, 10, 0.6) 0%,
      transparent 30%,
      transparent 55%,
      ${({ theme }) => theme.colors.base} 100%
    );
    z-index: 2;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 9rem ${({ theme }) => theme.layout.gutter} 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* Мобильный компакт: весь hero должен влезать в 100svh */
  @media (max-width: 767px) {
    padding-top: 5.75rem;
    padding-bottom: 0.75rem;
  }
`;

export const HeroKicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: clamp(1.5rem, 3vw, 2.5rem);
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 767px) {
    gap: 0.9rem;
    margin-bottom: 0.9rem;
    font-size: 9.5px;
  }
`;

export const KickerItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.55rem;

  &.live {
    color: ${({ theme }) => theme.colors.signal};

    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      animation: ${pulse} 2s ease-in-out infinite;
    }
  }

  &.dim {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const HeroTitle = styled.h1`
  font-size: clamp(52px, 11.5vw, 158px);
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.025em;
  margin-bottom: clamp(1.25rem, 2.5vw, 2rem);
  text-transform: uppercase;

  @media (max-width: 767px) {
    font-size: clamp(42px, 12.5vw, 60px);
    margin-bottom: 0.85rem;
  }

  .outline {
    display: block;
    color: transparent;
    -webkit-text-stroke: 2px ${({ theme }) => theme.colors.textPrimary};
  }

  .solid {
    display: block;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .hero-char {
    position: relative;
    display: inline-block;
    transition:
      transform 0.24s cubic-bezier(0.16, 1, 0.3, 1),
      -webkit-text-stroke-color 0.24s ease;
    will-change: transform;
  }

  .hero-char-fill {
    position: absolute;
    inset: 0;
    color: #b6ff00;
    -webkit-text-stroke: 2px #b6ff00;
    text-shadow: 0 0 26px rgba(182, 255, 0, 0.38);
    clip-path: inset(100% 0 0 0);
    transition:
      clip-path 0.34s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.28s ease;
    pointer-events: none;
  }

  .hero-char[data-lit='true'] {
    transform: translate3d(0, -5px, 0);
    -webkit-text-stroke-color: #b6ff00;

    .hero-char-fill {
      clip-path: inset(0% 0 0 0);
      opacity: 1;
    }
  }

  .hero-char[data-neighbor='true'] {
    transform: translate3d(0, -2.5px, 0);

    .hero-char-fill {
      clip-path: inset(35% 0 0 0);
      opacity: 0.65;
    }
  }
`;

export const HeroSubtitle = styled.p`
  font-size: clamp(15px, 1.4vw, 18px);
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: clamp(1.75rem, 3vw, 2.5rem);

  @media (max-width: 767px) {
    font-size: 13.5px;
    line-height: 1.55;
    margin-bottom: 1.15rem;
  }
`;

export const HeroButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-bottom: clamp(3.5rem, 7vh, 6rem);

  @media (max-width: 767px) {
    gap: 0.55rem;
    margin-bottom: 1rem;

    button {
      padding: 0.8rem 1.1rem;
      font-size: 10.5px;
      letter-spacing: 0.1em;
    }
  }
`;

export const KineticWrap = styled.div`
  width: 100%;
  max-width: 720px;
  margin-top: clamp(1rem, 3vh, 2.5rem);
  text-align: right;
  text-shadow: 0 2px 28px rgba(7, 7, 10, 0.8);

  @media (max-width: 767px) {
    margin-top: 0.6rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    position: absolute;
    right: ${({ theme }) => theme.layout.gutter};
    bottom: clamp(4rem, 9vh, 6.5rem);
    width: 100%;
    max-width: none;
    margin: 0;
  }
`;

export const KineticWindow = styled.div`
  position: relative;
  overflow: hidden;
  height: clamp(110px, 12vw, 170px);

  @media (max-width: 767px) {
    height: clamp(76px, 21vw, 110px);
  }
`;

export const KineticSlide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.55rem;
  pointer-events: none;
  will-change: transform, opacity, filter;

  opacity: 0;
  transform: translateY(52%);
  filter: blur(14px);
  transition: none;

  ${({ $state }) =>
    $state === 'prev' &&
    css`
      opacity: 0;
      transform: translateY(-52%);
      filter: blur(14px);
      transition:
        transform 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19),
        opacity 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19),
        filter 0.6s cubic-bezier(0.55, 0.06, 0.68, 0.19);
    `}

  ${({ $state }) =>
    $state === 'active' &&
    css`
      opacity: 1;
      transform: none;
      filter: blur(0);
      transition:
        transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
        filter 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    `}
`;

export const KineticLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.signal};

  @media (max-width: 767px) {
    font-size: 9.5px;
    letter-spacing: 0.18em;
  }
`;

export const KineticValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 900;
  font-size: clamp(64px, 10.3vw, 142px);
  line-height: 0.82;
  letter-spacing: -0.035em;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 0.75rem;

  @media (max-width: 767px) {
    font-size: clamp(48px, 17vw, 76px);
  }
`;

export const KineticUnit = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(14px, 1.4vw, 20px);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.colors.signal};
  text-transform: uppercase;

  @media (max-width: 767px) {
    font-size: 12px;
  }
`;

const fillLine = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

export const KineticMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.4rem;
  margin-top: 1.4rem;

  @media (max-width: 767px) {
    gap: 0.9rem;
    margin-top: 0.8rem;
  }
`;

export const KineticProgress = styled.span`
  display: block;
  width: min(280px, 46%);
  height: 1px;
  background: ${({ theme }) => theme.colors.lineStrong};
  position: relative;
  overflow: hidden;

  i {
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.signal};
    transform-origin: left;
    animation: ${fillLine} ${({ $duration }) => $duration}ms linear forwards;
  }
`;

export const KineticIndex = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  b {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 700;
  }
`;
