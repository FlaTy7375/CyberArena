import { Monitor, Headphones, Trophy, Users } from 'lucide-react';
import {
  AboutWrapper,
  AboutContainer,
  AboutGrid,
  AboutImageWrapper,
  AboutContent,
  AboutLabel,
  AboutTitle,
  AboutText,
  FeaturesList,
  FeatureItem,
  FeatureText,
} from './style';

const features = [
  {
    icon: Monitor,
    title: 'Топовое железо',
    description: 'RTX 4080, Intel i9, 32GB RAM',
  },
  {
    icon: Headphones,
    title: 'Премиум периферия',
    description: 'Logitech, HyperX, SteelSeries',
  },
  {
    icon: Trophy,
    title: 'Турниры',
    description: 'Еженедельные соревнования',
  },
  {
    icon: Users,
    title: 'Комьюнити',
    description: 'Дружное геймерское сообщество',
  },
];

const About = () => {
  return (
    <AboutWrapper id="about" data-testid="section-about">
      <AboutContainer>
        <AboutGrid>
          <AboutImageWrapper>
            <img
              src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1000&q=80"
              alt="Gaming setup"
            />
          </AboutImageWrapper>

          <AboutContent>
            <AboutLabel>О нас</AboutLabel>
            <AboutTitle data-testid="about-title">
              Больше чем просто <span>компьютерный клуб</span>
            </AboutTitle>
            <AboutText>
              CyberArena — это пространство для настоящих геймеров. 
              Мы создали место, где можно погрузиться в любимые игры на 
              мощных ПК, встретиться с единомышленниками и принять участие 
              в киберспортивных турнирах с денежными призами.
            </AboutText>

            <FeaturesList>
              {features.map((feature) => (
                <FeatureItem 
                  key={feature.title}
                  data-testid={`feature-${feature.title}`}
                >
                  <feature.icon />
                  <FeatureText>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </FeatureText>
                </FeatureItem>
              ))}
            </FeaturesList>
          </AboutContent>
        </AboutGrid>
      </AboutContainer>
    </AboutWrapper>
  );
};

export default About;
