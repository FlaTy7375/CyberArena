import styled from 'styled-components';

import Reveal from '../Reveal';

export const HeaderTop = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`;

export const HeaderIndex = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.16em;

  &::before {
    content: '[ ';
    color: ${({ theme }) => theme.colors.primary};
  }
  &::after {
    content: ' ]';
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HeaderKicker = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.75rem;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: 3rem;
  }
`;

export const Title = styled.h2`
  font-size: clamp(30px, 4.6vw, 58px);
  font-weight: 700;
  letter-spacing: -0.015em;
  max-width: 14ch;

  em {
    font-style: normal;
    color: transparent;
    -webkit-text-stroke: 1.5px ${({ theme }) => theme.colors.textPrimary};
  }
`;

export const Note = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.65;
  max-width: 340px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-bottom: 0.5rem;
    text-align: right;
  }
`;

const SectionHeader = ({ index, kicker, title, note, testId }) => (
  <Reveal>
    <HeaderTop>
      <HeaderIndex>{index}</HeaderIndex>
      <HeaderKicker>{kicker}</HeaderKicker>
    </HeaderTop>
    <HeaderRow>
      <Title data-testid={testId}>{title}</Title>
      {note && <Note>{note}</Note>}
    </HeaderRow>
  </Reveal>
);

export default SectionHeader;
