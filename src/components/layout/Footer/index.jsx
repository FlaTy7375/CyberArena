/* Разработка: flaty7375@gmail.com */
import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FOOTER_CONFIG,
  FooterWrapper,
  FooterGrainOverlay,
  BottomAmbientGlow,
  FooterContainer,
  TopEditorialLayout,
  ClubLeadStatement,
  FooterNavGrid,
  NavLineMask,
  NavRowLink,
  TelemetryStrip,
  CompactContactsLine,
  WordmarkBleedViewport,
  WordmarkRow,
  WordmarkChar,
  SrOnlyText,
  BottomBarWrap,
  BottomBarInner,
  CopyrightLabel,
  BottomRightCluster,
  LegalDocLink,
  MagneticRebootButton,
  LegalModalBackdrop,
  LegalModalSheet,
  FooterCursorFollower,
  FooterCursorDot,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * МАССИВЫ НАВИГАЦИИ И ПРАВОВЫХ ДОКУМЕНТОВ В НАЧАЛЕ ФАЙЛА
 * ========================================================================== */

export const FOOTER_NAV_ITEMS = [
  { index: '01', label: 'О клубе', href: '#about' },
  { index: '02', label: 'Игровые залы', href: '#zones' },
  { index: '03', label: 'Цены', href: '#pricing' },
  { index: '04', label: 'Турниры', href: '#tournaments' },
  { index: '05', label: 'Галерея', href: '#gallery' },
  { index: '06', label: 'Контакты', href: '#contact' },
];

export const FOOTER_LEGAL_LINKS = [
  {
    id: 'privacy',
    label: 'Политика конфиденциальности',
    href: 'privacy-policy.html',
    title: 'Политика конфиденциальности CyberArena',
    paragraphs: [
      '1. Компьютерный клуб CyberArena (г. Москва, ул. Киберспортивная, д. 42) обрабатывает персональные данные гостей (имя, номер телефона, адрес электронной почты) исключительно для подтверждения бронирования игровых мест и регистрации на клубные турниры.',
      '2. Данные хранятся на защищённых серверах на территории РФ в соответствии с ФЗ-152 «О персональных данных» и не передаются третьим лицам без согласия пользователя.',
      '3. Вы можете в любой момент запросить удаление своих данных, написав на info@cyberarena.ru или в официальный Telegram-канал клуба.',
    ],
  },
  {
    id: 'rules',
    label: 'Правила клуба',
    href: 'club-rules.html',
    title: 'Правила посещения клуба CyberArena',
    paragraphs: [
      '1. Режим работы клуба — ежедневно с 10:00 до 02:00. В ночное время после 22:00 посещение гостями младше 18 лет допускается только в сопровождении законных представителей.',
      '2. Бронирование места сохраняется за гостем в течение 20 минут от выбранного времени старта. При опоздании предупредите администратора по телефону или в Telegram.',
      '3. На территории игровых залов запрещено использование стороннего ПО, нарушающего работу античит-систем (FACEIT AC, Vanguard), а также бережное отношение к периферии и мониторам является обязательным.',
    ],
  },
];

const WORDMARK_FIRST_HALF = ['C', 'Y', 'B', 'E', 'R'];
const WORDMARK_SECOND_HALF = ['A', 'R', 'E', 'N', 'A'];

const ArrowRightSvg = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M3 9H14.5M10 4.2L15 9L10 13.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

const ArrowUpSvg = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M7 12V2.2M3 6.2L7 2L11 6.2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
    />
  </svg>
);

const Footer = () => {
  const footerRef = useRef(null);
  const navRef = useRef(null);
  const wordmarkWrapRef = useRef(null);
  const charRefs = useRef([]);
  const charFillRefs = useRef([]);
  const rebootBtnRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [activeLegalDoc, setActiveLegalDoc] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Слушаем переходы по якорю #privacy-policy из формы бронирования
  useEffect(() => {
    const onHashOrClick = (e) => {
      const link = e.target?.closest?.('a[href="#privacy-policy"]');
      if (link) {
        e.preventDefault();
        setActiveLegalDoc(FOOTER_LEGAL_LINKS[0]);
      }
    };
    document.addEventListener('click', onHashOrClick);
    return () => document.removeEventListener('click', onHashOrClick);
  }, []);

  const setCursorLabel = useCallback((label) => {
    const el = cursorFollowerRef.current?.querySelector('.cursor-tag');
    if (el) el.textContent = label;
  }, []);

  // Анимация входа навигации (построчно маской, stagger 60 мс)
  // и побуквенной заливки логотипа CYBERARENA снизу вверх с последующим затуханием до мягкого свечения
  useEffect(() => {
    const fills = charFillRefs.current.filter(Boolean);
    const navItems = navRef.current
      ? Array.from(navRef.current.querySelectorAll('.nav-row-item'))
      : [];

    if (reducedMotion) {
      fills.forEach((el) => {
        el.style.clipPath = 'inset(0% 0 0 0)';
        el.style.opacity = '0.26';
      });
      navItems.forEach((el) => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      return undefined;
    }

    let hasTriggered = false;
    const runEntranceAnimation = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      if (navItems.length) {
        gsap.fromTo(
          navItems,
          { yPercent: 108, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: FOOTER_CONFIG.animation.navRevealDurationSec,
            stagger: FOOTER_CONFIG.animation.navStaggerSec,
            ease: 'expo.out',
            overwrite: 'auto',
          }
        );
      }

      if (fills.length) {
        const tl = gsap.timeline();
        tl.fromTo(
          fills,
          { clipPath: 'inset(100% 0 0 0)', opacity: 1 },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: FOOTER_CONFIG.animation.logoFillDurationSec,
            stagger: FOOTER_CONFIG.animation.logoLetterStaggerSec,
            ease: 'power3.out',
          }
        ).to(
          fills,
          {
            opacity: 0.24,
            duration: FOOTER_CONFIG.animation.logoFadeDurationSec,
            stagger: FOOTER_CONFIG.animation.logoLetterStaggerSec * 0.6,
            ease: 'power2.out',
          },
          '-=0.25'
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          runEntranceAnimation();
        }
      },
      { threshold: 0.12 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion]);

  // Волновая реакция букв CYBERARENA при наведении курсора (±6px под курсором, соседи слабее)
  const handleLetterHover = useCallback(
    (hoveredIdx) => {
      if (reducedMotion) return;
      const maxLift = FOOTER_CONFIG.animation.letterMaxLiftPx;

      charRefs.current.forEach((charEl, idx) => {
        const fillEl = charFillRefs.current[idx];
        if (!charEl || !fillEl) return;

        const dist = Math.abs(idx - hoveredIdx);
        if (dist === 0) {
          charEl.style.transform = `translate3d(0, -${maxLift}px, 0)`;
          charEl.style.webkitTextStrokeColor = FOOTER_CONFIG.colors.neon;
          gsap.to(fillEl, {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 0.96,
            duration: 0.18,
            overwrite: 'auto',
          });
        } else if (dist === 1) {
          charEl.style.transform = `translate3d(0, -${(maxLift * 0.55).toFixed(1)}px, 0)`;
          charEl.style.webkitTextStrokeColor = 'rgba(182, 255, 0, 0.72)';
          gsap.to(fillEl, {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 0.56,
            duration: 0.22,
            overwrite: 'auto',
          });
        } else if (dist === 2) {
          charEl.style.transform = `translate3d(0, -${(maxLift * 0.25).toFixed(1)}px, 0)`;
          charEl.style.webkitTextStrokeColor = 'rgba(242, 242, 245, 0.48)';
          gsap.to(fillEl, {
            clipPath: 'inset(0% 0 0 0)',
            opacity: 0.34,
            duration: 0.25,
            overwrite: 'auto',
          });
        } else {
          charEl.style.transform = 'translate3d(0, 0, 0)';
          charEl.style.webkitTextStrokeColor = 'rgba(242, 242, 245, 0.34)';
          gsap.to(fillEl, {
            opacity: 0.22,
            duration: 0.3,
            overwrite: 'auto',
          });
        }
      });
    },
    [reducedMotion]
  );

  const handleWordmarkLeave = useCallback(() => {
    if (reducedMotion) return;
    charRefs.current.forEach((charEl, idx) => {
      const fillEl = charFillRefs.current[idx];
      if (charEl) {
        charEl.style.transform = 'translate3d(0, 0, 0)';
        charEl.style.webkitTextStrokeColor = 'rgba(242, 242, 245, 0.34)';
      }
      if (fillEl) {
        gsap.to(fillEl, {
          clipPath: 'inset(0% 0 0 0)',
          opacity: 0.24,
          duration: 0.38,
          overwrite: 'auto',
        });
      }
    });
  }, [reducedMotion]);

  // Плавная прокрутка к секции при клике по навигации футера
  const handleNavClick = useCallback((e, href) => {
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (window.__lenis) {
      window.__lenis.scrollTo(target, { offset: -64 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Магнитный hover и плавный скролл к началу страницы (~1.5 с, expo.out) для кнопки «Перезагрузить ↑»
  const handleRebootMagneticMove = (e) => {
    if (reducedMotion || !rebootBtnRef.current) return;
    const rect = rebootBtnRef.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width * 0.5);
    const dy = e.clientY - (rect.top + rect.height * 0.5);
    rebootBtnRef.current.style.transform = `translate3d(${(dx * 0.22).toFixed(1)}px, ${(
      dy * 0.28
    ).toFixed(1)}px, 0)`;
  };

  const handleRebootMagneticLeave = () => {
    if (!rebootBtnRef.current) return;
    rebootBtnRef.current.style.transform = 'translate3d(0, 0, 0)';
  };

  const handleScrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, {
        duration: reducedMotion ? 0 : FOOTER_CONFIG.animation.scrollTopDurationSec,
        easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  return (
    <FooterWrapper
      ref={footerRef}
      $reducedMotion={reducedMotion}
      data-testid="footer"
    >
      {/* Кастомный курсор футера */}
      <FooterCursorFollower ref={cursorFollowerRef} aria-hidden="true">
        <span className="cursor-tag">перейти</span>
      </FooterCursorFollower>
      <FooterCursorDot ref={cursorDotRef} aria-hidden="true" />

      {/* Фоновое зерно и дрейфующее салатовое свечение у нижнего края */}
      <FooterGrainOverlay aria-hidden="true" />
      <BottomAmbientGlow $reducedMotion={reducedMotion} aria-hidden="true" />

      <FooterContainer>
        {/* 1. Верх: краткое описание клуба слева (до 3 строк) + 2. Навигация в 2 колонки с номерами */}
        <TopEditorialLayout>
          <ClubLeadStatement>
            Премиальный компьютерный клуб нового поколения: мощные ПК, комфортная
            атмосфера и киберспортивные турниры каждую неделю.
          </ClubLeadStatement>

          <FooterNavGrid
            ref={navRef}
            aria-label="Основная навигация"
            data-testid="footer-nav"
          >
            {FOOTER_NAV_ITEMS.map((item) => (
              <NavLineMask key={item.index}>
                <NavRowLink
                  href={item.href}
                  className="nav-row-item"
                  onClick={(e) => handleNavClick(e, item.href)}
                  onPointerEnter={() => setCursorLabel(item.index)}
                  onPointerLeave={() => setCursorLabel('перейти')}
                >
                  <span className="nav-left">
                    <span className="nav-idx">{item.index}</span>
                    <span className="nav-label">{item.label}</span>
                  </span>
                  <span className="nav-arrow" aria-hidden="true">
                    <ArrowRightSvg />
                  </span>
                </NavRowLink>
              </NavLineMask>
            ))}
          </FooterNavGrid>
        </TopEditorialLayout>

        {/* 3. Компактные контакты моно-шрифтом */}
        <TelemetryStrip>
          <CompactContactsLine>
            <span>Москва, ул. Киберспортивная, 42</span>
            <span className="sep-dot" aria-hidden="true">
              ·
            </span>
            <a
              href="tel:+74951234567"
              onPointerEnter={() => setCursorLabel('звонок')}
              onPointerLeave={() => setCursorLabel('перейти')}
            >
              +7 (495) 123-45-67
            </a>
            <span className="sep-dot" aria-hidden="true">
              ·
            </span>
            <a
              href="mailto:info@cyberarena.ru"
              onPointerEnter={() => setCursorLabel('почта')}
              onPointerLeave={() => setCursorLabel('перейти')}
            >
              info@cyberarena.ru
            </a>
            <span className="sep-dot" aria-hidden="true">
              ·
            </span>
            <span>{FOOTER_CONFIG.workHours.scheduleLabel}</span>
          </CompactContactsLine>
        </TelemetryStrip>
      </FooterContainer>

      {/* 5. Гигантский логотип CYBERARENA на всю ширину экрана (срезан нижним краем на ~12%) */}
      <WordmarkBleedViewport
        ref={wordmarkWrapRef}
        onPointerLeave={handleWordmarkLeave}
      >
        <SrOnlyText>CyberArena</SrOnlyText>

        <WordmarkRow aria-hidden="true" data-testid="footer-wordmark">
          <span className="word-group">
            {WORDMARK_FIRST_HALF.map((ch, idx) => (
              <WordmarkChar
                key={`c1-${idx}`}
                ref={(el) => {
                  charRefs.current[idx] = el;
                }}
                onPointerEnter={() => {
                  handleLetterHover(idx);
                  setCursorLabel('cyber');
                }}
              >
                {ch}
                <span
                  className="char-fill"
                  ref={(el) => {
                    charFillRefs.current[idx] = el;
                  }}
                >
                  {ch}
                </span>
              </WordmarkChar>
            ))}
          </span>

          <span className="word-group">
            {WORDMARK_SECOND_HALF.map((ch, i) => {
              const globalIdx = WORDMARK_FIRST_HALF.length + i;
              return (
                <WordmarkChar
                  key={`c2-${i}`}
                  ref={(el) => {
                    charRefs.current[globalIdx] = el;
                  }}
                  onPointerEnter={() => {
                    handleLetterHover(globalIdx);
                    setCursorLabel('arena');
                  }}
                >
                  {ch}
                  <span
                    className="char-fill"
                    ref={(el) => {
                      charFillRefs.current[globalIdx] = el;
                    }}
                  >
                    {ch}
                  </span>
                </WordmarkChar>
              );
            })}
          </span>
        </WordmarkRow>
      </WordmarkBleedViewport>

      {/* 6. Нижняя строка: копирайт слева, политика + правила + кнопка «Перезагрузить ↑» справа */}
      <BottomBarWrap>
        <BottomBarInner>
          <CopyrightLabel>
            <span className="brand-slashes" aria-hidden="true">
              //
            </span>
            <span className="copy-year">© 2026</span>
            <span className="copy-brand">CyberArena</span>
            <span className="copy-dot" aria-hidden="true">
              ·
            </span>
            <span className="copy-city">Москва</span>
          </CopyrightLabel>

          <BottomRightCluster>
            {FOOTER_LEGAL_LINKS.map((doc) => (
              <LegalDocLink
                key={doc.id}
                href={doc.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveLegalDoc(doc);
                }}
                onPointerEnter={() => setCursorLabel('документ')}
                onPointerLeave={() => setCursorLabel('перейти')}
                data-testid={`footer-legal-${doc.id}`}
              >
                {doc.label}
              </LegalDocLink>
            ))}

            <MagneticRebootButton
              ref={rebootBtnRef}
              type="button"
              onClick={handleScrollToTop}
              onPointerMove={handleRebootMagneticMove}
              onPointerLeave={() => {
                handleRebootMagneticLeave();
                setCursorLabel('перейти');
              }}
              onPointerEnter={() => setCursorLabel('наверх')}
              data-testid="footer-reboot-top"
            >
              <span>Перезагрузить</span>
              <span className="up-arrow" aria-hidden="true">
                <ArrowUpSvg />
              </span>
            </MagneticRebootButton>
          </BottomRightCluster>
        </BottomBarInner>
      </BottomBarWrap>

      {/* Модальное окно правовых документов (открывается по клику на Политику / Правила) */}
      {activeLegalDoc && (
        <LegalModalBackdrop
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          onClick={() => setActiveLegalDoc(null)}
        >
          <LegalModalSheet onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h3 id="legal-modal-title">{activeLegalDoc.title}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveLegalDoc(null)}
              >
                ✕ Закрыть
              </button>
            </div>
            <div className="modal-body">
              {activeLegalDoc.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </LegalModalSheet>
        </LegalModalBackdrop>
      )}
    </FooterWrapper>
  );
};

export default Footer;
