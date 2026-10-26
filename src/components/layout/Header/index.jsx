/* Разработка: flaty7375@gmail.com */
import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HEADER_CONFIG,
  SkipToContentLink,
  HeaderWrapper,
  HeaderGrainLayer,
  HeaderContainer,
  EntranceMask,
  LogoLink,
  CenterNavArea,
  NavList,
  NavItemMask,
  NavLinkItem,
  SectionCounter,
  RightActionsCluster,
  BookActionWrap,
  BookActionButton,
  BurgerTwoLineButton,
  MobileFullscreenOverlay,
  MobileMenuNav,
  MobileNavMask,
  MobileGiantLink,
  MobileBottomFooter,
  MobileLiveStatusRow,
  MobileGiantBookLink,
  HeaderCursorFollower,
  HeaderCursorDot,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * МАССИВ ПУНКТОВ НАВИГАЦИИ И СЕКЦИЙ В НАЧАЛЕ ФАЙЛА
 * ========================================================================== */

export const HEADER_NAV_ITEMS = [
  { id: 'about', label: 'О клубе', href: '#about', mobileIndex: '01', sectionNumber: 2 },
  { id: 'zones', label: 'Залы', href: '#zones', mobileIndex: '02', sectionNumber: 3 },
  { id: 'pricing', label: 'Цены', href: '#pricing', mobileIndex: '03', sectionNumber: 4 },
  { id: 'tournaments', label: 'Турниры', href: '#tournaments', mobileIndex: '04', sectionNumber: 5 },
  { id: 'gallery', label: 'Галерея', href: '#gallery', mobileIndex: '05', sectionNumber: 6 },
  { id: 'contact', label: 'Контакты', href: '#contact', mobileIndex: '06', sectionNumber: 7 },
];

export const HEADER_SECTIONS = [
  { id: 'hero', counter: '01' },
  { id: 'about', counter: '02' },
  { id: 'zones', counter: '03' },
  { id: 'pricing', counter: '04' },
  { id: 'tournaments', counter: '05' },
  { id: 'gallery', counter: '06' },
  { id: 'contact', counter: '07' },
];

const SCRAMBLE_GLYPHS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789//';

const ArrowRightSvg = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M3.5 10H16M11 4.5L16.5 10L11 15.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

/**
 * Вычисляет живой статус работы клуба по московскому времени (10:00–02:00)
 * для мобильного полноэкранного меню.
 */
function getMoscowClubStatus() {
  try {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: HEADER_CONFIG.workHours.timeZone,
      hour: '2-digit',
      hour12: false,
    });
    const hourNum = Number(formatter.format(new Date())) % 24;
    const { openHour, closeHour } = HEADER_CONFIG.workHours;
    const isOpen = hourNum >= openHour || hourNum < closeHour;
    return {
      isOpen,
      label: isOpen
        ? `Открыто · до ${String(closeHour).padStart(2, '0')}:00`
        : `Откроемся в ${String(openHour).padStart(2, '0')}:00`,
    };
  } catch {
    return { isOpen: true, label: 'Открыто · до 02:00' };
  }
}

/**
 * Вычисляет реальные координаты начала и конца секции на странице
 * с учётом GSAP ScrollTrigger pin-spacer обёрток.
 */
function getSectionScrollBounds(sectionEl) {
  if (!sectionEl) return { start: 0, end: 1 };

  const scrollY = window.scrollY || window.pageYOffset || 0;
  const boxEl = sectionEl.closest('.pin-spacer') || sectionEl;
  const rect = boxEl.getBoundingClientRect();
  const start = rect.top + scrollY;
  const end = start + Math.max(rect.height, 1);

  return { start, end };
}

const Header = () => {
  const headerRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const burgerBtnRef = useRef(null);
  const entranceRefs = useRef([]);
  const navLinkRefs = useRef({});
  const navLabelRefs = useRef({});
  const scrambleTimersRef = useRef({});
  const cursorFollowerRef = useRef(null);
  const cursorDotRef = useRef(null);

  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0); // 0..6 -> 01..07
  const [sectionTheme, setSectionTheme] = useState('dark');
  const [boostBookCta, setBoostBookCta] = useState(false);
  const [hideBookCtaInContact, setHideBookCtaInContact] = useState(false);
  const [clubStatus, setClubStatus] = useState(() => getMoscowClubStatus());

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Слушаем переключение prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  // Обновляем статус клуба раз в минуту
  useEffect(() => {
    const id = window.setInterval(() => {
      setClubStatus(getMoscowClubStatus());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  // Анимация загрузки страницы: логотип, пункты, счётчик и «Бронь» последней появляются маской (stagger 60 мс)
  useEffect(() => {
    const nodes = entranceRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;

    if (reducedMotion) {
      nodes.forEach((el) => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
      return undefined;
    }

    const tween = gsap.fromTo(
      nodes,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: HEADER_CONFIG.animation.entranceDurationSec,
        stagger: HEADER_CONFIG.animation.entranceStaggerSec,
        ease: 'expo.out',
        overwrite: 'auto',
      }
    );

    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  const setCursorTag = useCallback((text) => {
    const tagEl = cursorFollowerRef.current?.querySelector('.cursor-tag');
    if (tagEl) tagEl.textContent = text;
  }, []);

  // Единый высокопроизводительный обработчик скролла с кэшированием границ секций (0 layout-чтений во время скролла)
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let lastY = window.scrollY || 0;
    let rafId = 0;
    let lastBoundsUpdateTs = 0;

    const sectionElements = HEADER_SECTIONS.map((s) => ({
      ...s,
      el: document.getElementById(s.id),
      start: 0,
      end: 1,
      theme: 'dark',
    }));

    let heroBottomCached = (window.innerHeight || 800) * 0.75;
    let pricingEndCached = Infinity;
    let contactStartCached = Infinity;

    const refreshBoundsCache = () => {
      lastBoundsUpdateTs = performance.now();
      const viewportH = window.innerHeight || 800;

      sectionElements.forEach((sec) => {
        if (!sec.el) {
          sec.el = document.getElementById(sec.id);
        }
        if (sec.el) {
          const b = getSectionScrollBounds(sec.el);
          sec.start = b.start;
          sec.end = b.end;
          sec.theme = sec.el.getAttribute('data-theme') || 'dark';
        }
      });

      const heroSec = sectionElements[0];
      heroBottomCached = heroSec?.el
        ? heroSec.start + Math.max(heroSec.end - heroSec.start - 80, 120)
        : viewportH * 0.75;

      const pricingSec = sectionElements.find(
        (s) => s.id === HEADER_CONFIG.ctaRules.boostAfterSectionId
      );
      if (pricingSec) {
        pricingEndCached = pricingSec.end;
      }

      const contactSec = sectionElements.find(
        (s) => s.id === HEADER_CONFIG.ctaRules.hideInSectionId
      );
      if (contactSec) {
        contactStartCached = contactSec.start;
      }
    };

    const evaluateScroll = () => {
      rafId = 0;
      const now = performance.now();
      if (now - lastBoundsUpdateTs > 900) {
        refreshBoundsCache();
      }

      const currentY = window.scrollY || window.pageYOffset || 0;
      const delta = currentY - lastY;
      const viewportH = window.innerHeight || 800;

      // 1. Определяем направление скролла (порог 8 px)
      if (currentY <= HEADER_CONFIG.scroll.alwaysVisibleTopPx) {
        setHidden((prev) => (prev ? false : prev));
      } else if (Math.abs(delta) >= HEADER_CONFIG.scroll.directionDeltaThresholdPx) {
        const shouldHide = delta > 0;
        setHidden((prev) => (prev !== shouldHide ? shouldHide : prev));
        lastY = currentY;
      }

      // 2. Проверяем выход из Hero для включения backdrop-filter: blur(12px) и нижней линии
      const isPastHero = currentY > heroBottomCached;
      setPastHero((prev) => (prev !== isPastHero ? isPastHero : prev));

      // 3. Определяем активную секцию (01..07) и прогресс её прокрутки (0..1) по кэшированным координатам
      const probeY = currentY + viewportH * 0.34;
      let chosenIdx = 0;

      for (let i = 0; i < sectionElements.length; i += 1) {
        const { el, start, end } = sectionElements[i];
        if (!el) continue;
        if (probeY >= start && probeY <= end) {
          chosenIdx = i;
          break;
        }
        if (probeY > end) {
          chosenIdx = i;
        }
      }

      setActiveSectionIndex((prev) => (prev !== chosenIdx ? chosenIdx : prev));

      const activeSec = sectionElements[chosenIdx];
      if (activeSec) {
        setSectionTheme((prev) => (prev !== activeSec.theme ? activeSec.theme : prev));
      }

      // Обновляем CSS-переменную --section-progress напрямую на DOM-узлах пунктов без re-render
      for (let i = 0; i < HEADER_NAV_ITEMS.length; i += 1) {
        const item = HEADER_NAV_ITEMS[i];
        const linkNode = navLinkRefs.current[item.id];
        if (!linkNode) continue;
        const secIdx = item.sectionNumber - 1;
        const secObj = sectionElements[secIdx];
        if (secIdx === chosenIdx && secObj?.el) {
          const rawProgress = (probeY - secObj.start) / Math.max(secObj.end - secObj.start, 1);
          const clamped = Math.max(0.04, Math.min(1, rawProgress));
          linkNode.style.setProperty('--section-progress', clamped.toFixed(3));
        } else if (linkNode.style.getPropertyValue('--section-progress') !== '0') {
          linkNode.style.setProperty('--section-progress', '0');
        }
      }

      // 4. Правила кнопки «Бронь»
      const shouldBoost = probeY > pricingEndCached - viewportH * 0.25;
      setBoostBookCta((prev) => (prev !== shouldBoost ? shouldBoost : prev));

      const shouldHideCta = probeY >= contactStartCached - viewportH * 0.18;
      setHideBookCtaInContact((prev) => (prev !== shouldHideCta ? shouldHideCta : prev));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(evaluateScroll);
      }
    };

    const onRefreshOrResize = () => {
      refreshBoundsCache();
      onScroll();
    };

    refreshBoundsCache();
    evaluateScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onRefreshOrResize, { passive: true });
    ScrollTrigger.addEventListener('refresh', onRefreshOrResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onRefreshOrResize);
      ScrollTrigger.removeEventListener('refresh', onRefreshOrResize);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Если меню открыто или фокус внутри шапки — шапка не прячется
  const isHeaderHidden = hidden && !mobileMenuOpen && !focusWithin && !reducedMotion;

  // Блокировка скролла страницы, focus-trap и закрытие по Escape при открытом мобильном меню
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let focusTimer = 0;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.__lenis?.stop?.();

      // Переводим фокус без прокрутки контейнера после завершения выезда первого пункта,
      // чтобы браузер не сдвигал scrollTop внутри маски на 60-й миллисекунде анимации
      focusTimer = window.setTimeout(() => {
        const firstLink = mobileOverlayRef.current?.querySelector('a, button');
        firstLink?.focus?.({ preventScroll: true });
      }, 520);
    } else {
      document.body.style.overflow = '';
      window.__lenis?.start?.();
    }

    const onKeyDown = (e) => {
      if (!mobileMenuOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        burgerBtnRef.current?.focus?.();
        return;
      }

      if (e.key === 'Tab') {
        const overlayFocusable = mobileOverlayRef.current
          ? Array.from(mobileOverlayRef.current.querySelectorAll('a[href], button:not([disabled])'))
          : [];
        const focusable = [burgerBtnRef.current, ...overlayFocusable].filter(Boolean);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      if (focusTimer) window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      window.__lenis?.start?.();
    };
  }, [mobileMenuOpen]);

  // Scramble-эффект (250–350 мс) при наведении на пункт навигации
  const triggerScramble = useCallback(
    (id, originalLabel) => {
      if (reducedMotion) return;
      const labelEl = navLabelRefs.current[id];
      if (!labelEl) return;

      if (scrambleTimersRef.current[id]) {
        window.clearInterval(scrambleTimersRef.current[id]);
      }

      const totalSteps = Math.round(
        HEADER_CONFIG.animation.scrambleDurationMs / HEADER_CONFIG.animation.scrambleStepMs
      );
      let step = 0;

      scrambleTimersRef.current[id] = window.setInterval(() => {
        step += 1;
        if (step >= totalSteps) {
          window.clearInterval(scrambleTimersRef.current[id]);
          scrambleTimersRef.current[id] = null;
          labelEl.textContent = originalLabel;
          return;
        }

        const revealCount = Math.floor((step / totalSteps) * originalLabel.length);
        let nextStr = '';
        for (let i = 0; i < originalLabel.length; i += 1) {
          const ch = originalLabel[i];
          if (ch === ' ') {
            nextStr += ' ';
          } else if (i < revealCount) {
            nextStr += ch;
          } else {
            nextStr += SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          }
        }
        labelEl.textContent = nextStr;
      }, HEADER_CONFIG.animation.scrambleStepMs);
    },
    [reducedMotion]
  );

  useEffect(() => {
    const timers = scrambleTimersRef.current;
    return () => {
      Object.values(timers).forEach((t) => {
        if (t) window.clearInterval(t);
      });
    };
  }, []);

  // Лёгкое магнитное притяжение к курсору (±6 px)
  const handleMagneticMove = useCallback(
    (e) => {
      if (reducedMotion) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const maxShift = HEADER_CONFIG.animation.magneticMaxShiftPx;
      const nx = ((e.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.5)) * maxShift;
      const ny = ((e.clientY - (rect.top + rect.height * 0.5)) / (rect.height * 0.5)) * maxShift;
      const clampedX = Math.max(-maxShift, Math.min(maxShift, nx));
      const clampedY = Math.max(-maxShift, Math.min(maxShift, ny));
      el.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px, 0)`;
    },
    [reducedMotion]
  );

  const handleMagneticLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
  }, []);

  /**
   * Плавный скролл к секции (Lenis scrollTo, expo.out, ~1.4 c)
   * с точным учётом GSAP ScrollTrigger pin-секций.
   */
  const handleNavigate = useCallback(
    (e, href) => {
      e.preventDefault();
      const wasMobileOpen = mobileMenuOpen;
      if (wasMobileOpen) {
        setMobileMenuOpen(false);
        document.body.style.overflow = '';
        window.__lenis?.start?.();
      }

      const performScroll = () => {
        if (href === '#' || href === '#hero') {
          if (window.__lenis) {
            window.__lenis.scrollTo(0, {
              duration: reducedMotion ? 0 : HEADER_CONFIG.scroll.scrollToDurationSec,
              easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
            });
          } else {
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
          }
          return;
        }

        const sectionEl = document.querySelector(href);
        if (!sectionEl) return;

        // Рассчитываем точную стартовую координату с учётом pin-spacer и ScrollTrigger
        const { start } = getSectionScrollBounds(sectionEl);
        const targetY = Math.max(0, start - HEADER_CONFIG.scroll.headerHeightOffsetPx);

        if (window.__lenis) {
          window.__lenis.scrollTo(targetY, {
            duration: reducedMotion ? 0 : HEADER_CONFIG.scroll.scrollToDurationSec,
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({
            top: targetY,
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
      };

      if (wasMobileOpen) {
        window.setTimeout(performScroll, 80);
      } else {
        performScroll();
      }
    },
    [mobileMenuOpen, reducedMotion]
  );

  return (
    <>
      <SkipToContentLink href="#main-content" data-testid="skip-to-content">
        Перейти к содержимому
      </SkipToContentLink>

      <HeaderWrapper
        ref={headerRef}
        $pastHero={pastHero}
        $hidden={isHeaderHidden}
        $menuOpen={mobileMenuOpen}
        $reducedMotion={reducedMotion}
        data-section-theme={sectionTheme}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setFocusWithin(false);
          }
        }}
        data-testid="header"
      >
        <HeaderGrainLayer $visible={pastHero || mobileMenuOpen} aria-hidden="true" />

        <HeaderCursorFollower ref={cursorFollowerRef} aria-hidden="true">
          <span className="cursor-tag">навигация</span>
        </HeaderCursorFollower>
        <HeaderCursorDot ref={cursorDotRef} aria-hidden="true" />

        <HeaderContainer>
          {/* Слева: логотип CYBERARENA (ссылка на верх страницы, контур заливается салатовым слева направо) */}
          <EntranceMask>
            <div
              className="entrance-inner"
              ref={(el) => {
                entranceRefs.current[0] = el;
              }}
            >
              <LogoLink
                href="#hero"
                onClick={(e) => handleNavigate(e, '#hero')}
                onPointerEnter={() => setCursorTag('наверх')}
                data-testid="logo"
                aria-label="CyberArena — на верх страницы"
              >
                <span className="logo-word">
                  <span className="logo-base">CYBERARENA</span>
                  <span className="logo-fill" aria-hidden="true">
                    CYBERARENA
                  </span>
                </span>
              </LogoLink>
            </div>
          </EntranceMask>

          {/* По центру: основная навигация + счётчик секций 03 / 07 справа от навигации */}
          <CenterNavArea>
            <NavList aria-label="Основная навигация" data-testid="header-nav">
              {HEADER_NAV_ITEMS.map((item, idx) => {
                const isActive = activeSectionIndex === item.sectionNumber - 1;
                return (
                  <NavItemMask key={item.id}>
                    <div
                      className="entrance-inner"
                      ref={(el) => {
                        entranceRefs.current[idx + 1] = el;
                      }}
                    >
                      <NavLinkItem
                        ref={(el) => {
                          navLinkRefs.current[item.id] = el;
                        }}
                        href={item.href}
                        $active={isActive}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={(e) => handleNavigate(e, item.href)}
                        onPointerEnter={() => {
                          triggerScramble(item.id, item.label);
                          setCursorTag(`0${item.sectionNumber}`);
                        }}
                        onPointerMove={handleMagneticMove}
                        onPointerLeave={handleMagneticLeave}
                        data-testid={`nav-link-${item.id}`}
                      >
                        <span className="label-sizer" aria-hidden="true">
                          {item.label}
                        </span>
                        <span
                          className="label-live"
                          ref={(el) => {
                            navLabelRefs.current[item.id] = el;
                          }}
                        >
                          {item.label}
                        </span>
                        <span className="progress-track" aria-hidden="true">
                          <span className="progress-bar" />
                        </span>
                      </NavLinkItem>
                    </div>
                  </NavItemMask>
                );
              })}
            </NavList>

            <EntranceMask>
              <div
                className="entrance-inner"
                ref={(el) => {
                  entranceRefs.current[HEADER_NAV_ITEMS.length + 1] = el;
                }}
              >
                <SectionCounter
                  $activeIndex={activeSectionIndex}
                  $reducedMotion={reducedMotion}
                  aria-label={`Секция ${HEADER_SECTIONS[activeSectionIndex]?.counter} из 07`}
                  data-testid="header-section-counter"
                >
                  <span className="counter-window" aria-hidden="true">
                    <span className="counter-reel">
                      {HEADER_SECTIONS.map((sec) => (
                        <span key={sec.id} className="counter-digit">
                          {sec.counter}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="counter-slash" aria-hidden="true">
                    /
                  </span>
                  <span className="counter-total" aria-hidden="true">
                    07
                  </span>
                </SectionCounter>
              </div>
            </EntranceMask>
          </CenterNavArea>

          {/* Справа: кнопка «Бронь» (десктоп) и двухлинейный бургер (мобильные) */}
          <RightActionsCluster>
            <BookActionWrap
              $boosted={boostBookCta}
              $hiddenInContact={hideBookCtaInContact}
              data-testid="button-book-wrap"
            >
              <EntranceMask>
                <div
                  className="entrance-inner"
                  ref={(el) => {
                    entranceRefs.current[HEADER_NAV_ITEMS.length + 2] = el;
                  }}
                >
                  <BookActionButton
                    href="#contact"
                    $reducedMotion={reducedMotion}
                    tabIndex={hideBookCtaInContact ? -1 : 0}
                    onClick={(e) => handleNavigate(e, '#contact')}
                    onPointerEnter={() => setCursorTag('бронь')}
                    onPointerMove={handleMagneticMove}
                    onPointerLeave={handleMagneticLeave}
                    data-testid="button-book"
                  >
                    <span className="book-dot" aria-hidden="true" />
                    <span className="book-text">Бронь</span>
                  </BookActionButton>
                </div>
              </EntranceMask>
            </BookActionWrap>

            <BurgerTwoLineButton
              ref={burgerBtnRef}
              type="button"
              $isOpen={mobileMenuOpen}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-fullscreen-menu"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              data-testid="button-mobile-menu"
            >
              <span className="burger-line" aria-hidden="true" />
              <span className="burger-line" aria-hidden="true" />
            </BurgerTwoLineButton>
          </RightActionsCluster>
        </HeaderContainer>
      </HeaderWrapper>

      {/* Полноэкранный мобильный оверлей */}
      <MobileFullscreenOverlay
        id="mobile-fullscreen-menu"
        ref={mobileOverlayRef}
        $isOpen={mobileMenuOpen}
        aria-hidden={!mobileMenuOpen}
        data-testid="mobile-fullscreen-menu"
      >
        <HeaderGrainLayer $visible={mobileMenuOpen} aria-hidden="true" />

        <MobileMenuNav aria-label="Мобильная навигация">
          {HEADER_NAV_ITEMS.map((item, idx) => {
            const isActive = activeSectionIndex === item.sectionNumber - 1;
            return (
              <MobileNavMask key={item.id}>
                <MobileGiantLink
                  href={item.href}
                  $isOpen={mobileMenuOpen}
                  $index={idx}
                  $active={isActive}
                  aria-current={isActive ? 'true' : undefined}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  onClick={(e) => handleNavigate(e, item.href)}
                  data-testid={`mobile-nav-link-${item.id}`}
                >
                  <span className="m-left">
                    <span className="m-idx">{item.mobileIndex}</span>
                    <span>{item.label}</span>
                  </span>
                </MobileGiantLink>
              </MobileNavMask>
            );
          })}
        </MobileMenuNav>

        <MobileBottomFooter>
          <MobileLiveStatusRow
            $isOpen={clubStatus.isOpen}
            $reducedMotion={reducedMotion}
            data-testid="mobile-menu-live-status"
          >
            <span className="status-dot" aria-hidden="true" />
            <span>{clubStatus.label}</span>
          </MobileLiveStatusRow>

          <MobileGiantBookLink
            href="#contact"
            tabIndex={mobileMenuOpen ? 0 : -1}
            onClick={(e) => handleNavigate(e, '#contact')}
            data-testid="button-mobile-book"
          >
            <span className="book-left">
              <span className="book-dot" aria-hidden="true" />
              <span>Бронь</span>
            </span>
            <ArrowRightSvg />
          </MobileGiantBookLink>
        </MobileBottomFooter>
      </MobileFullscreenOverlay>
    </>
  );
};

export default Header;
