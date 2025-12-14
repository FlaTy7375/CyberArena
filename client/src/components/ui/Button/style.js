import styled, { css } from 'styled-components';

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.gradientPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid transparent;
    
    &:hover {
      box-shadow: ${({ theme }) => theme.colors.neonGlow};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.primary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.textPrimary};
      box-shadow: ${({ theme }) => theme.colors.neonGlow};
    }
  `,
  ghost: css`
    background: rgba(168, 85, 247, 0.1);
    color: ${({ theme }) => theme.colors.primaryLight};
    border: 1px solid rgba(168, 85, 247, 0.3);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(168, 85, 247, 0.2);
      border-color: ${({ theme }) => theme.colors.primary};
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.5rem 1rem;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  `,
  md: css`
    padding: 0.75rem 1.5rem;
    font-size: ${({ theme }) => theme.fontSizes.base};
  `,
  lg: css`
    padding: 1rem 2rem;
    font-size: ${({ theme }) => theme.fontSizes.lg};
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;
  
  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    width: 1.25em;
    height: 1.25em;
  }
`;
