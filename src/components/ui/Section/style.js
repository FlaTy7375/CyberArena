import styled from 'styled-components';

export const StyledSection = styled.section`
  padding: 4rem 0;
  position: relative;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 6rem 0;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 8rem 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  text-align: center;
  margin-bottom: 1rem;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes['5xl']};
  }
`;

export const SectionSubtitle = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 600px;
  margin: 0 auto 3rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-bottom: 4rem;
  }
`;
