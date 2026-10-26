import styled from 'styled-components';
import { HeaderRow } from '../../ui/SectionHeader';

export const AboutWrapper = styled.section`
  position: relative;
  padding: clamp(4.5rem, 9vw, 8rem) 0 0;
`;

export const AboutContainer = styled.div`
  max-width: ${({ theme }) => theme.layout.containerWidth};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.layout.gutter};
`;

export const AboutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 7fr 5fr;
    gap: clamp(2.5rem, 5vw, 5rem);
  }
`;

export const DesktopHeaderSlot = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: block;
  }
`;

export const MobileHeaderSlot = styled.div`
  display: block;
  width: 100%;

  ${HeaderRow} {
    margin-top: 1.1rem;
    margin-bottom: 1.25rem;
    gap: 0.75rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const AboutVisualColumn = styled.div`
  position: relative;
  width: 100%;
`;

export const AboutImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: clamp(345px, 50vw, 550px);
  background: radial-gradient(
    ellipse 70% 65% at 50% 50%,
    rgba(182, 255, 0, 0.06) 0%,
    rgba(12, 12, 17, 0.38) 55%,
    transparent 100%
  );

  /* HUD-уголки вместо рамки */
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 26px;
    height: 26px;
    z-index: 5;
    pointer-events: none;
    transition: all ${({ theme }) => theme.transitions.normal};
  }

  &::before {
    top: -8px;
    left: -8px;
    border-top: 2px solid ${({ theme }) => theme.colors.signal};
    border-left: 2px solid ${({ theme }) => theme.colors.signal};
  }

  &::after {
    bottom: -8px;
    right: -8px;
    border-bottom: 2px solid ${({ theme }) => theme.colors.signal};
    border-right: 2px solid ${({ theme }) => theme.colors.signal};
  }
`;

export const SceneViewport = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  user-select: none;
  will-change: opacity;
`;

export const CanvasContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
    outline: none;
  }
`;

export const CalloutsSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  overflow: visible;
`;

export const CalloutsLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  overflow: visible;
`;

export const CalloutItem = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.22rem 0.42rem;
  background: rgba(10, 10, 14, 0.88);
  border: 1px solid rgba(182, 255, 0, 0.38);
  border-left: ${({ $align }) =>
    $align === 'left' ? '2px solid #B6FF00' : '1px solid rgba(182, 255, 0, 0.38)'};
  border-right: ${({ $align }) =>
    $align === 'right' ? '2px solid #B6FF00' : '1px solid rgba(182, 255, 0, 0.38)'};
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  text-align: ${({ $align }) => ($align === 'right' ? 'right' : 'left')};
  white-space: nowrap;
  will-change: transform, opacity;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0.3rem 0.55rem;
  }
`;

export const CalloutTitle = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 9px;
  font-weight: 600;
  color: #f2f2f5;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 10px;
    letter-spacing: 0.08em;
  }
`;

export const ImageCaption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const AboutContent = styled.div``;

export const AboutText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.75;
  margin-bottom: 2.25rem;
  max-width: 52ch;
`;

export const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-top: 1px solid ${({ theme }) => theme.colors.line};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const FeatureItem = styled.div`
  position: relative;
  display: flex;
  gap: 1.1rem;
  padding: 1.55rem 0.25rem 1.45rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    &:nth-child(odd) {
      padding-right: 1.5rem;
    }
    &:nth-child(even) {
      padding-left: 1.5rem;
      border-left: 1px solid ${({ theme }) => theme.colors.line};
    }
  }
`;

/* Призрачный номер-гигант за текстом карточки — журнальная слоистость */
export const FeatureIndex = styled.span`
  position: absolute;
  top: -0.06em;
  left: -0.04em;
  z-index: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(88px, 8.5vw, 128px);
  font-weight: 900;
  line-height: 0.7;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  color: rgba(242, 242, 245, 0.12);
  pointer-events: none;
  user-select: none;

  @media (max-width: 767px) {
    font-size: clamp(76px, 22vw, 104px);
    color: rgba(242, 242, 245, 0.1);
  }
`;

export const FeatureText = styled.div`
  position: relative;
  z-index: 1;

  h4 {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    margin-bottom: 0.3rem;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 12px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const Milestones = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  margin-top: clamp(2.5rem, 5vw, 4.5rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const MilestoneCell = styled.div`
  padding: 1.6rem 1.25rem 1.6rem 0;
  border-left: 1px solid ${({ theme }) => theme.colors.line};
  padding-left: 1.25rem;

  &:first-child {
    border-left: none;
    padding-left: 0;
  }
`;

export const MilestoneValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  margin-bottom: 0.5rem;

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const MilestoneLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.14em;
`;
