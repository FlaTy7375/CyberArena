import { StyledSection, SectionTitle, SectionSubtitle } from './style';

const Section = ({ 
  children, 
  title, 
  subtitle, 
  id,
  className = '' 
}) => {
  return (
    <StyledSection id={id} className={className}>
      {title && <SectionTitle>{title}</SectionTitle>}
      {subtitle && <SectionSubtitle>{subtitle}</SectionSubtitle>}
      {children}
    </StyledSection>
  );
};

export default Section;
