import styled, { css } from 'styled-components';

/*
  Новая кнопочная система: без градиентов и свечения.
  primary — белая заливка с чёрным текстом (главный CTA)
  secondary — контурная
  accent — сигнальный лайм (для живых/статусных действий)
  ghost — прозрачная с тонкой рамкой
*/
const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.textPrimary};
    color: #07070A;
    border: 1px solid ${({ theme }) => theme.colors.textPrimary};

    &:hover {
      background: #ffffff;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.lineStrong};

    &:hover {
      border-color: ${({ theme }) => theme.colors.textPrimary};
      background: rgba(255, 255, 255, 0.04);
    }
  `,
  accent: css`
    background: ${({ theme }) => theme.colors.signal};
    color: #07070A;
    border: 1px solid ${({ theme }) => theme.colors.signal};

    &:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }
  `,
  ghost: css`
    background: rgba(255, 255, 255, 0.03);
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid ${({ theme }) => theme.colors.line};

    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
      border-color: ${({ theme }) => theme.colors.lineStrong};
    }
  `,
};

const sizes = {
  sm: css`
    padding: 0.6rem 1rem;
    font-size: 10px;
  `,
  md: css`
    padding: 0.8rem 1.4rem;
    font-size: 11px;
  `,
  lg: css`
    padding: 1.05rem 1.9rem;
    font-size: 12px;
  `,
};

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;

  ${({ $variant }) => variants[$variant] || variants.primary}
  ${({ $size }) => sizes[$size] || sizes.md}

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    width: 1.1em;
    height: 1.1em;
    transition: transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }
`;
