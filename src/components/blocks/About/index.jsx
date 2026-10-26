import { useEffect, useRef } from 'react';
import SectionHeader from '../../ui/SectionHeader';
import PCSceneCanvas from './PCSceneCanvas';
import { initSmoothScroll } from './pcScrollAnimation';
import {
  AboutWrapper,
  AboutContainer,
  AboutGrid,
  DesktopHeaderSlot,
  MobileHeaderSlot,
  AboutVisualColumn,
  AboutImageWrapper,
  ImageCaption,
  AboutContent,
  AboutText,
  FeaturesList,
  FeatureItem,
  FeatureIndex,
  FeatureText,
} from './style';

const features = [
  {
    index: '01',
    title: 'Железо без компромиссов',
    description: 'RTX 4080 / i9-14900K / 64 ГБ DDR5',
  },
  {
    index: '02',
    title: 'Периферия про-уровня',
    description: 'Logitech · HyperX · SteelSeries',
  },
  {
    index: '03',
    title: 'Турниры каждую неделю',
    description: 'Призовой фонд до 100 000 ₽',
  },
  {
    index: '04',
    title: 'Комьюнити',
    description: 'Discord на 4 000+ игроков',
  },
];

const About = () => {
  const gridRef = useRef(null);
  const visualColRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smoothScroll = initSmoothScroll({ reducedMotion });
    return () => {
      smoothScroll.destroy();
    };
  }, []);

  return (
    <AboutWrapper id="about" data-testid="section-about">
      <AboutContainer>
        <DesktopHeaderSlot>
          <SectionHeader
            index="01"
            kicker="О клубе"
            testId="about-title"
            title={
              <>
                Больше, чем <em>клуб</em>
              </>
            }
            note="Место, где собираются те, для кого игра — это спорт, работа и способ провести ночь."
          />
        </DesktopHeaderSlot>

        <AboutGrid ref={gridRef}>
          <AboutVisualColumn ref={visualColRef}>
            <MobileHeaderSlot>
              <SectionHeader
                index="01"
                kicker="О клубе"
                testId="about-title-mobile"
                title={
                  <>
                    Больше, чем <em>клуб</em>
                  </>
                }
                note="Место, где собираются те, для кого игра — это спорт, работа и способ провести ночь."
              />
            </MobileHeaderSlot>

            <AboutImageWrapper>
              <PCSceneCanvas gridRef={gridRef} visualColRef={visualColRef} />
            </AboutImageWrapper>
            <ImageCaption>
              <span>PRO-линия · 12 мест</span>
              <span>зал 02</span>
            </ImageCaption>
          </AboutVisualColumn>

          <AboutContent>
            <AboutText>
              CyberArena — это пространство для настоящих геймеров.
              Мы собрали машины, на которых не стыдно играть
              на соревновательном
              уровне, выстроили залы под разные форматы — от казуальных
              посиделок до турниров со стримом — и сделали так, чтобы
              сюда хотелось возвращаться.
            </AboutText>

            <FeaturesList>
              {features.map((feature) => (
                <FeatureItem
                  key={feature.title}
                  data-testid={`feature-${feature.title}`}
                >
                  <FeatureIndex>{feature.index}</FeatureIndex>
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
