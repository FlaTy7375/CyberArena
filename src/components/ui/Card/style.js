import styled, { css } from 'styled-components';

export const StyledCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;

  ${({ $hoverable }) => $hoverable && css`
    cursor: pointer;

    &:hover {
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.shadows.glow};
      transform: translateY(-4px);
    }
  `}

  ${({ $glowing }) => $glowing && css`
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.glow};
  `}

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 2rem;
  }
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  margin: -1.5rem -1.5rem 1.5rem;
  width: calc(100% + 3rem);
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform ${({ theme }) => theme.transitions.slow};
  }

  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(transparent, ${({ theme }) => theme.colors.bgCard});
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: -2rem -2rem 1.5rem;
    width: calc(100% + 4rem);
  }
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.base};
  line-height: 1.6;
`;
