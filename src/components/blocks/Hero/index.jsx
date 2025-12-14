import Button from '../../ui/CustomButton';
import {
  HeroWrapper,
  HeroBackground,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
} from './style';

const stats = [
  { value: '50+', label: 'Игровых ПК', delay: '0s' },
  { value: '24/7', label: 'Доступ', delay: '0.5s' },
  { value: '240Hz', label: 'Мониторы', delay: '1s' },
  { value: 'RTX 4080', label: 'Видеокарты', delay: '1.5s' },
];

const Hero = () => {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroWrapper id="hero" data-testid="section-hero">
      <HeroBackground>
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
          alt="Gaming arena"
        />
      </HeroBackground>

      <HeroContent>
        <HeroTitle data-testid="hero-title">
          Добро пожаловать в
          <span>CyberArena</span>
        </HeroTitle>

        <HeroSubtitle data-testid="hero-subtitle">
          Премиальный компьютерный клуб нового поколения. 
          Мощные ПК, VR-зона, киберспортивные турниры и атмосфера настоящего геймерского комьюнити.
        </HeroSubtitle>

        <HeroButtons>
          <Button 
            variant="primary" 
            size="lg"
            onClick={(e) => handleNavClick(e, '#contact')}
            data-testid="button-hero-book"
          >
            Забронировать место
          </Button>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={(e) => handleNavClick(e, '#pricing')}
            data-testid="button-hero-prices"
          >
            Узнать цены
          </Button>
        </HeroButtons>

        <StatsGrid>
          {stats.map((stat) => (
            <StatCard key={stat.label} $delay={stat.delay} data-testid={`stat-${stat.label}`}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </HeroContent>
    </HeroWrapper>
  );
};

export default Hero;
