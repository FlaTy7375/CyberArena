import { StyledCard, CardImage, CardTitle, CardDescription } from './style';

const Card = ({ 
  children, 
  hoverable = false, 
  glowing = false,
  className = '' 
}) => {
  return (
    <StyledCard 
      $hoverable={hoverable} 
      $glowing={glowing}
      className={className}
    >
      {children}
    </StyledCard>
  );
};

Card.Image = CardImage;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;
