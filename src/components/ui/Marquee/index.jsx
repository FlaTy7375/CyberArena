import styled, { keyframes } from 'styled-components';

const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

export const MarqueeWrapper = styled.div`
  position: relative;
  z-index: 5;
  overflow: hidden;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.base};
  padding: 15px 0;
`;

export const Track = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  animation: ${scroll} 30s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Item = styled.span`
  display: flex;
  align-items: center;
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;

  &::after {
    content: '//';
    margin: 0 26px;
    color: ${({ theme }) => theme.colors.signal};
    font-weight: 700;
  }
`;

const Marquee = ({ items = [] }) => {
  const doubled = [...items, ...items];
  return (
    <MarqueeWrapper aria-hidden="true">
      <Track>
        {doubled.map((item, i) => (
          <Item key={`${item}-${i}`}>{item}</Item>
        ))}
      </Track>
    </MarqueeWrapper>
  );
};

export default Marquee;
