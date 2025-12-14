import { StyledContainer } from './style';

const Container = ({ children, className = '' }) => {
  return (
    <StyledContainer className={className}>
      {children}
    </StyledContainer>
  );
};

export default Container;
