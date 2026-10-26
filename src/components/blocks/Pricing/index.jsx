import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  PRICING_CONFIG,
  PricingSection,
  PricingContainer,
  BoardHeaderGrid,
  HeaderLeft,
  HeaderKicker,
  HeaderTitle,
  HeaderNote,
  CalculatorStrip,
  SliderControlGroup,
  SliderLabel,
  RangeInputWrap,
  HoursRangeInput,
  CalculatorSummary,
  PricingBoard,
  BoardRowItem,
  RowTriggerButton,
  RowIndexCode,
  RowTitleWrap,
  HitBlinkDot,
  RowZoneMeta,
  RowKeySpec,
  RowPriceCluster,
  SplitFlapPriceWrap,
  SplitFlapDigitCell,
  PriceUnitText,
  SelectActionText,
  ExpandableDetailsPanel,
  ExpandableInner,
  FullSpecsLine,
  QuickBookLink,
  BottomPromoMarquee,
  PromoMarqueeTrack,
  PromoMarqueeItem,
  BoardCursorFollower,
  BoardCursorDot,
} from './style';

gsap.registerPlugin(ScrollTrigger);

const TARIFF_ROWS = [
  {
    id: 1,
    code: '01',
    name: 'Базовый',
    zone: 'Standard Zone',
    keySpec: 'RTX 4080',
    features: ['RTX 4080', 'библиотека игр', 'Wi-Fi'],
    priceStr: '150',
    unit: '₽/час',
    hourlyRate: 150,
    isHit: false,
  },
  {
    id: 2,
    code: '02',
    name: 'ПроХит',
    zone: 'PRO Zone',
    keySpec: 'RTX 4090 · 240 Гц',
    features: ['RTX 4090', '240 Гц', 'напитки', 'приоритет брони'],
    priceStr: '250',
    unit: '₽/час',
    hourlyRate: 250,
    isHit: true,
  },
  {
    id: 3,
    code: '03',
    name: 'Ночь',
    zone: '23:00–08:00',
    keySpec: 'PRO Zone · напитки',
    features: ['PRO Zone', 'безлимит напитков', 'завтрак'],
    priceStr: '900',
    unit: '₽/ночь',
    flatCost: 900,
    isHit: false,
  },
  {
    id: 4,
    code: '04',
    name: 'VIP',
    zone: 'Безлимит',
    keySpec: '24/7 · шкафчик',
    features: ['24/7', 'шкафчик', 'скидка 20% в баре', 'турниры бесплатно'],
    priceStr: '5 000',
    unit: '₽/мес',
    flatCost: 5000,
    isHit: false,
  },
];

const MARQUEE_ITEMS = [
  'Студентам −15% по будням до 18:00',
  'Компании от 5 человек −10%',
  'День рождения — час в подарок',
];

const Pricing = () => {
  const sectionRef = useRef(null);
  const boardRef = useRef(null);
  const rowRefs = useRef([]);
  const panelRefs = useRef([]);
  const digitRefs = useRef({});
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorLabelRef = useRef(null);

  // На мобильных первая строка открыта сразу, чтобы было понятно как устроено табло
  const [activeRowId, setActiveRowId] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : null
  );
  const [hours, setHours] = useState(3);
  const [sliderTouched, setSliderTouched] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // ---------------------------------------------------------------------------
  // Расчёт самого выгодного тарифа и суммы в рублях по ползунку (1–10 часов)
  // Компактная строка одинаковой длины, чтобы ничего не прыгало при > 3 ч
  // ---------------------------------------------------------------------------
  const calculation = useMemo(() => {
    const baseTotal = hours * 150;
    const proTotal = hours * 250;
    const nightFixed = 900;

    if (hours >= 4) {
      const savedVsPro = proTotal - nightFixed;
      return {
        bestRowId: 3,
        bestName: 'Ночь',
        totalRub: nightFixed,
        compareNote: `выгода ${savedVsPro} ₽ vs PRO`,
      };
    }

    if (hours === 3) {
      return {
        bestRowId: 2,
        bestName: 'ПроХит',
        totalRub: proTotal,
        compareNote: `Standard: ${baseTotal} ₽`,
      };
    }

    return {
      bestRowId: 1,
      bestName: 'Базовый',
      totalRub: baseTotal,
      compareNote: `PRO: ${proTotal} ₽`,
    };
  }, [hours]);

  // ---------------------------------------------------------------------------
  // Прямое управление кастомным курсором без ре-рендеров React
  // ---------------------------------------------------------------------------
  const setCursorDOM = useCallback(({ visible, expanded, label }) => {
    const dotEl = cursorDotRef.current;
    if (!dotEl) return;
    if (visible !== undefined) {
      dotEl.dataset.visible = visible ? 'true' : 'false';
    }
    if (expanded !== undefined) {
      dotEl.dataset.expanded = expanded ? 'true' : 'false';
    }
    if (label !== undefined && cursorLabelRef.current) {
      cursorLabelRef.current.textContent = label;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ---------------------------------------------------------------------------
  // Плавное раскрытие (height: auto через GSAP) полной строки характеристик
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reducedMotion) return;

    TARIFF_ROWS.forEach((row, idx) => {
      const panelEl = panelRefs.current[idx];
      if (!panelEl) return;
      const isExpanded = activeRowId === row.id;

      gsap.to(panelEl, {
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
        duration: PRICING_CONFIG.animation.accordionDurationSec,
        ease: PRICING_CONFIG.animation.easeOut,
        overwrite: 'auto',
      });
    });
  }, [activeRowId, reducedMotion]);

  // ---------------------------------------------------------------------------
  // Вход секции:
  // - На ПК: механическое перелистывание цифр (split-flap 0–9 с rotateX) + маска названий
  // - На мобильных: простой плавный fade без split-flap для 60 FPS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reducedMotion || !boardRef.current) return undefined;

    const isMobile = window.innerWidth < 768;
    const timers = [];

    const ctx = gsap.context(() => {
      const titleInners = boardRef.current.querySelectorAll('.title-inner');

      if (isMobile) {
        const rows = rowRefs.current.filter(Boolean);
        gsap.fromTo(
          rows,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: PRICING_CONFIG.animation.easeOut,
            scrollTrigger: {
              trigger: boardRef.current,
              start: 'top 86%',
              once: true,
            },
          }
        );
        return;
      }

      gsap.set(titleInners, { yPercent: 110, opacity: 0 });

      ScrollTrigger.create({
        trigger: boardRef.current,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          // 1. Маска-reveal названий тарифов построчно
          gsap.to(titleInners, {
            yPercent: 0,
            opacity: 1,
            duration: 0.72,
            stagger: PRICING_CONFIG.animation.rowStaggerSec,
            ease: PRICING_CONFIG.animation.easeExpo,
          });

          // 2. Split-flap перебор цифр 0–9 с rotateX для каждой ячейки цены
          TARIFF_ROWS.forEach((row, rIdx) => {
            const chars = Array.from(row.priceStr);
            chars.forEach((targetChar, cIdx) => {
              if (targetChar === ' ') return;
              const cellKey = `${row.id}-${cIdx}`;
              const cellEl = digitRefs.current[cellKey];
              if (!cellEl) return;

              const totalFlips =
                PRICING_CONFIG.animation.flapCyclesBase + rIdx * 2 + cIdx;
              const startDelayMs =
                rIdx * PRICING_CONFIG.animation.rowStaggerSec * 1000 + cIdx * 45;

              const startTimer = window.setTimeout(() => {
                let step = 0;
                const interval = window.setInterval(() => {
                  step += 1;
                  const isLast = step >= totalFlips;
                  cellEl.textContent = isLast
                    ? targetChar
                    : String((step + rIdx + cIdx) % 10);

                  gsap.fromTo(
                    cellEl,
                    {
                      rotateX: -78,
                      opacity: 0.65,
                    },
                    {
                      rotateX: 0,
                      opacity: 1,
                      duration: PRICING_CONFIG.animation.flapStepMs / 1000,
                      ease: 'power2.out',
                      overwrite: true,
                    }
                  );

                  if (isLast) {
                    window.clearInterval(interval);
                  }
                }, PRICING_CONFIG.animation.flapStepMs);

                timers.push(interval);
              }, startDelayMs);

              timers.push(startTimer);
            });
          });
        },
      });
    }, sectionRef);

    return () => {
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      ctx.revert();
    };
  }, [reducedMotion]);

  const scrollToContact = useCallback((e) => {
    if (e) e.stopPropagation();
    const contactEl = document.querySelector('#contact');
    if (!contactEl) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(contactEl);
    } else {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleRowClick = (rowId) => {
    const isDesktopBoard =
      window.innerWidth >= 1024 &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isDesktopBoard) {
      // На ПК строка уже раскрыта по hover — клик по строке сразу ведёт к бронированию
      scrollToContact();
    } else {
      // На мобильных и планшетах — тап раскрывает/закрывает строку
      setActiveRowId((prev) => (prev === rowId ? null : rowId));
    }
  };

  const sliderPct = ((hours - 1) / 9) * 100;

  return (
    <PricingSection
      ref={sectionRef}
      id="pricing"
      data-testid="section-pricing"
      onPointerEnter={() => setCursorDOM({ visible: true })}
      onPointerLeave={() => setCursorDOM({ visible: false, expanded: false })}
    >
      {/* Кастомный курсор над тарифной доской */}
      <BoardCursorFollower ref={cursorRef} aria-hidden="true">
        <BoardCursorDot
          ref={cursorDotRef}
          data-visible="false"
          data-expanded="false"
        >
          <span ref={cursorLabelRef}>выбрать →</span>
        </BoardCursorDot>
      </BoardCursorFollower>

      <PricingContainer>
        {/* Асимметричная шапка секции 03 */}
        <BoardHeaderGrid>
          <HeaderLeft>
            <HeaderKicker>
              <span>03</span> // ЦЕНЫ
            </HeaderKicker>
            <HeaderTitle data-testid="pricing-title">
              Тарифная <em>доска</em>
            </HeaderTitle>
          </HeaderLeft>

          <HeaderNote>
            Почасовая оплата на кассе или по брони. Ночь и VIP — сразу на всё,
            кроме бара.
          </HeaderNote>
        </BoardHeaderGrid>

        {/* Ползунок "Сколько часов играешь?" (1–10) с фиксированной шириной без переноса */}
        <CalculatorStrip>
          <SliderControlGroup>
            <SliderLabel htmlFor="pricing-hours-range">
              <span>Сколько часов играешь?</span>
              <strong>{hours} ч</strong>
            </SliderLabel>

            <RangeInputWrap>
              <HoursRangeInput
                id="pricing-hours-range"
                type="range"
                min={1}
                max={10}
                step={1}
                value={hours}
                $pct={sliderPct}
                aria-label="Сколько часов играешь"
                data-testid="pricing-hours-slider"
                onChange={(e) => {
                  const nextHours = Number(e.target.value);
                  setHours(nextHours);
                  setSliderTouched(true);
                }}
                onPointerEnter={() =>
                  setCursorDOM({
                    visible: true,
                    expanded: false,
                    label: `${hours} ч`,
                  })
                }
              />
            </RangeInputWrap>
          </SliderControlGroup>

          <CalculatorSummary aria-live="polite" data-testid="pricing-calc-summary">
            <span>
              Выгодно: <span className="highlight">{calculation.bestName}</span>
            </span>
            <span className="sep">//</span>
            <span>
              Итог: <span className="total-rub">{calculation.totalRub} ₽</span>
            </span>
            <span className="sep">·</span>
            <span>{calculation.compareNote}</span>
          </CalculatorSummary>
        </CalculatorStrip>

        {/* Табло из 4 горизонтальных строк на всю ширину */}
        <PricingBoard
          ref={boardRef}
          role="region"
          aria-label="Тарифная доска"
          onPointerLeave={() => {
            if (
              window.innerWidth >= 1024 &&
              window.matchMedia('(hover: hover) and (pointer: fine)').matches
            ) {
              setActiveRowId(null);
              setCursorDOM({ expanded: false });
            }
          }}
        >
          {TARIFF_ROWS.map((row, idx) => {
            const isExpanded = activeRowId === row.id;
            const isDesktopHover =
              typeof window !== 'undefined' && window.innerWidth >= 1024;
            const isDimmed =
              isDesktopHover && activeRowId !== null && activeRowId !== row.id;
            const isBestValue = sliderTouched && calculation.bestRowId === row.id;

            return (
              <BoardRowItem
                key={row.id}
                ref={(el) => {
                  rowRefs.current[idx] = el;
                }}
                $dimmed={isDimmed}
                $isHit={row.isHit}
                $isBestValue={isBestValue}
                data-testid={`price-card-${row.id}`}
                onPointerEnter={() => {
                  if (
                    window.innerWidth >= 1024 &&
                    window.matchMedia('(hover: hover) and (pointer: fine)').matches
                  ) {
                    setActiveRowId(row.id);
                    setCursorDOM({
                      visible: true,
                      expanded: true,
                      label: 'выбрать →',
                    });
                  }
                }}
              >
                <RowTriggerButton
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`tariff-panel-${row.id}`}
                  data-testid={`button-select-${row.id}`}
                  onClick={() => handleRowClick(row.id)}
                  onFocus={() => {
                    if (window.innerWidth >= 1024) {
                      setActiveRowId(row.id);
                    }
                  }}
                  onBlur={(e) => {
                    if (
                      window.innerWidth >= 1024 &&
                      !e.currentTarget.parentElement?.contains(e.relatedTarget)
                    ) {
                      setActiveRowId(null);
                    }
                  }}
                >
                  {/* 1. Номер 01–04 (на мобильных рядом сразу пишется зона) */}
                  <RowIndexCode $active={isExpanded || row.isHit || isBestValue}>
                    <span>{row.code}</span>
                    <span className="mobile-zone-inline">// {row.zone}</span>
                  </RowIndexCode>

                  {/* 2. Гигантское название тарифа + мигающая точка у ПроХит */}
                  <RowTitleWrap>
                    <span className="title-mask">
                      <span className="title-inner">{row.name}</span>
                    </span>
                    {row.isHit && (
                      <HitBlinkDot
                        title="Популярный выбор"
                        aria-label="Популярный выбор"
                      />
                    )}
                  </RowTitleWrap>

                  {/* 3. Зона / время моно-шрифтом (на ПК отдельная колонка) */}
                  <RowZoneMeta>{row.zone}</RowZoneMeta>

                  {/* 4. Ключевая характеристика (на ПК отдельная колонка) */}
                  <RowKeySpec>{row.keySpec}</RowKeySpec>

                  {/* 5. Цена (на ПК справа, на мобильных — ровно под названием тарифа) */}
                  <RowPriceCluster>
                    <SplitFlapPriceWrap
                      $glow={isExpanded || row.isHit || isBestValue}
                      aria-label={`${row.priceStr} ${row.unit}`}
                    >
                      {Array.from(row.priceStr).map((ch, cIdx) => (
                        <SplitFlapDigitCell
                          key={cIdx}
                          ref={(el) => {
                            digitRefs.current[`${row.id}-${cIdx}`] = el;
                          }}
                          $isSpace={ch === ' '}
                          aria-hidden="true"
                        >
                          {ch}
                        </SplitFlapDigitCell>
                      ))}
                    </SplitFlapPriceWrap>
                    <PriceUnitText>{row.unit}</PriceUnitText>
                  </RowPriceCluster>

                  {/* 6. Справа действие: на ПК "Выбрать →", на телефоне понятный индикатор раскрытия */}
                  <SelectActionText $active={isExpanded}>
                    <span className="desktop-label">Выбрать</span>
                    <span className="mobile-label">
                      {isExpanded ? 'Свернуть' : 'Состав'}
                    </span>
                    <span className="arrow" aria-hidden="true">
                      <svg
                        viewBox="0 0 14 14"
                        width="12"
                        height="12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          transform: isExpanded ? 'rotate(90deg)' : 'none',
                          transition: 'transform 0.25s ease',
                        }}
                      >
                        <path
                          d="M2 7H11.5M7.5 3L11.8 7L7.5 11"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="square"
                        />
                      </svg>
                    </span>
                  </SelectActionText>
                </RowTriggerButton>

                {/* Раскрывающаяся панель с полным списком характеристик через разделитель "·" */}
                <ExpandableDetailsPanel
                  id={`tariff-panel-${row.id}`}
                  ref={(el) => {
                    panelRefs.current[idx] = el;
                  }}
                  role="region"
                  aria-label={`Характеристики тарифа ${row.name}`}
                  $reducedMotion={reducedMotion}
                  $expanded={isExpanded}
                >
                  <ExpandableInner>
                    <FullSpecsLine>
                      {row.features.map((feat, fIdx) => (
                        <span key={feat}>
                          {feat}
                          {fIdx < row.features.length - 1 && (
                            <span className="dot-sep">·</span>
                          )}
                        </span>
                      ))}
                    </FullSpecsLine>

                    <QuickBookLink href="#contact" onClick={scrollToContact}>
                      <span>Забронировать {row.name}</span>
                      <svg
                        viewBox="0 0 14 14"
                        width="12"
                        height="12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        style={{ display: 'inline-block', verticalAlign: 'middle' }}
                      >
                        <path
                          d="M2 7H11.5M7.5 3L11.8 7L7.5 11"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="square"
                        />
                      </svg>
                    </QuickBookLink>
                  </ExpandableInner>
                </ExpandableDetailsPanel>
              </BoardRowItem>
            );
          })}
        </PricingBoard>

        {/* Бегущая строка внизу (marquee, моно-шрифт, разделитель "//") */}
        <BottomPromoMarquee aria-label="Акции и скидки">
          <PromoMarqueeTrack $reducedMotion={reducedMotion}>
            {(reducedMotion
              ? MARQUEE_ITEMS
              : [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
            ).map((text, idx) => (
              <PromoMarqueeItem key={idx}>
                <span>{text}</span>
                <span className="slashes" aria-hidden="true">
                  //
                </span>
              </PromoMarqueeItem>
            ))}
          </PromoMarqueeTrack>
        </BottomPromoMarquee>
      </PricingContainer>
    </PricingSection>
  );
};

export default Pricing;
