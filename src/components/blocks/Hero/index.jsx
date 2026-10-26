import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Button from '../../ui/CustomButton';
import Reveal from '../../ui/Reveal';
import {
  HeroWrapper,
  HeroBackground,
  HeroContent,
  HeroKicker,
  KickerItem,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  KineticWrap,
  KineticWindow,
  KineticSlide,
  KineticLabel,
  KineticValue,
  KineticUnit,
  KineticMeta,
  KineticProgress,
  KineticIndex,
} from './style';

const SLIDES = [
  { id: 'gpu', label: 'Видеокарты RTX', value: '4080', unit: '' },
  { id: 'display', label: 'Матрицы', value: '240', unit: 'Гц' },
  { id: 'ping', label: 'Пинг до серверов', value: '2', unit: 'мс' },
  { id: 'seats', label: 'Игровых мест', value: '50', unit: 'ПК' },
];

const HERO_FIRST_WORD = ['C', 'y', 'b', 'e', 'r'];
const HERO_SECOND_WORD = ['A', 'r', 'e', 'n', 'a'];

const SLIDE_MS = 3400;
const START_DELAY_MS = 900;

const Hero = () => {
  const [slide, setSlide] = useState(0);
  const prevRef = useRef(null);
  const charRefs = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    const cleanup = { timer: null };
    const start = setTimeout(() => {
      const id = setInterval(() => {
        setSlide((s) => {
          prevRef.current = s;
          return (s + 1) % SLIDES.length;
        });
      }, SLIDE_MS);
      cleanup.timer = id;
    }, START_DELAY_MS);
    return () => {
      clearTimeout(start);
      if (cleanup.timer) clearInterval(cleanup.timer);
    };
  }, []);

  const handleCharEnter = useCallback((hoveredIdx) => {
    charRefs.current.forEach((el, idx) => {
      if (!el) return;
      const dist = Math.abs(idx - hoveredIdx);
      if (dist === 0) {
        el.setAttribute('data-lit', 'true');
        el.removeAttribute('data-neighbor');
      } else if (dist === 1) {
        el.removeAttribute('data-lit');
        el.setAttribute('data-neighbor', 'true');
      } else {
        el.removeAttribute('data-lit');
        el.removeAttribute('data-neighbor');
      }
    });
  }, []);

  const handleTitleLeave = useCallback(() => {
    charRefs.current.forEach((el) => {
      if (!el) return;
      el.removeAttribute('data-lit');
      el.removeAttribute('data-neighbor');
    });
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      if (window.__lenis) {
        window.__lenis.scrollTo(element, { offset: -64 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <HeroWrapper id="hero" data-testid="section-hero">
      <HeroBackground>
        <img
          src="images/hero-bg.jpg"
          srcSet="images/hero-bg-mob.jpg 960w, images/hero-bg.jpg 1920w"
          sizes="(max-width: 767px) 320px, 100vw"
          alt="Киберспортивная арена CyberArena"
          loading="eager"
          decoding="async"
        />
      </HeroBackground>

      <HeroContent>
        <Reveal>
          <HeroKicker>
            <KickerItem>ПК-клуб // Москва</KickerItem>
            <KickerItem className="dim">est. 2019</KickerItem>
          </HeroKicker>
        </Reveal>

        <Reveal delay={90}>
          <HeroTitle
            onPointerLeave={handleTitleLeave}
            data-testid="hero-title"
          >
            <span className="solid">
              {HERO_FIRST_WORD.map((ch, idx) => (
                <span
                  key={`hc1-${idx}`}
                  className="hero-char"
                  ref={(el) => {
                    charRefs.current[idx] = el;
                  }}
                  onPointerEnter={() => handleCharEnter(idx)}
                  data-cursor="cyber"
                >
                  {ch}
                  <span className="hero-char-fill" aria-hidden="true">
                    {ch}
                  </span>
                </span>
              ))}
            </span>
            <span className="outline">
              {HERO_SECOND_WORD.map((ch, i) => {
                const globalIdx = HERO_FIRST_WORD.length + i;
                return (
                  <span
                    key={`hc2-${i}`}
                    className="hero-char"
                    ref={(el) => {
                      charRefs.current[globalIdx] = el;
                    }}
                    onPointerEnter={() => handleCharEnter(globalIdx)}
                    data-cursor="arena"
                  >
                    {ch}
                    <span className="hero-char-fill" aria-hidden="true">
                      {ch}
                    </span>
                  </span>
                );
              })}
            </span>
          </HeroTitle>
        </Reveal>

        <Reveal delay={180}>
          <HeroSubtitle data-testid="hero-subtitle">
            Полсотни машин уровня RTX 4080, турниры каждую неделю
            и комьюнити, которое остаётся до утра.
          </HeroSubtitle>
        </Reveal>

        <Reveal delay={260}>
          <HeroButtons>
            <Button
              variant="primary"
              size="lg"
              onClick={(e) => handleNavClick(e, '#contact')}
              data-cursor="бронь"
              data-testid="button-hero-book"
            >
              Забронировать место
              <ArrowUpRight />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={(e) => handleNavClick(e, '#pricing')}
              data-cursor="тарифы"
              data-testid="button-hero-prices"
            >
              Тарифы
            </Button>
          </HeroButtons>
        </Reveal>

        <KineticWrap aria-label="Ключевые параметры клуба">
          <KineticWindow aria-hidden="true">
            {SLIDES.map((item, i) => {
              const state =
                i === slide ? 'active' : i === prevRef.current ? 'prev' : 'idle';
              return (
                <KineticSlide
                  key={item.id}
                  $state={state}
                  data-testid={`stat-${item.id}`}
                >
                  <KineticLabel>{item.label}</KineticLabel>
                  <KineticValue>
                    {item.value}
                    {item.unit && <KineticUnit>{item.unit}</KineticUnit>}
                  </KineticValue>
                </KineticSlide>
              );
            })}
          </KineticWindow>

          <KineticMeta>
            <KineticProgress $duration={SLIDE_MS} aria-hidden="true">
              <i key={slide} />
            </KineticProgress>
            <KineticIndex>
              <b>{String(slide + 1).padStart(2, '0')}</b> /{' '}
              {String(SLIDES.length).padStart(2, '0')}
            </KineticIndex>
          </KineticMeta>
        </KineticWrap>
      </HeroContent>
    </HeroWrapper>
  );
};

export default Hero;
