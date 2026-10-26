import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HW_CONFIG,
  HardwareSection,
  SceneGlow,
  HwContainer,
  IntroGrid,
  MonoKicker,
  HwTitle,
  IntroNote,
  SchematicStage,
  StageInner,
  GhostWordStack,
  GhostWord,
  StageTopRow,
  StageMeta,
  ZoneToggle,
  ZoneOption,
  ZoneSwapGlyph,
  SchematicFrame,
  SchematicBox,
  PulseHalo,
  SvgBox,
  DeskSvg,
  MobileDeskSvg,
  CalloutLayer,
  Callout,
  CalloutInner,
  SyncScene,
  SyncHeadline,
  SyncSubRow,
  MachinesRow,
  MachinesGroup,
  MachineUnit,
  FinishLine,
  SyncCaptionRow,
  SyncCaption,
  SyncReadout,
  StatsScene,
  StatsStrip,
  StatItem,
  PartnersLine,
  SrOnly,
  HwCursorFollower,
  HwCursorDot,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * ДАННЫЕ СЕКЦИИ (редактировать здесь)
 * ========================================================================== */

/** Количество одинаковых машин в сцене B (на мобильных делится на 2 ряда). */
const MACHINES_COUNT = 20;

/** До какой отметки заполняется полоска под каждой машиной (0–1). */
const MACHINE_FILL_MARK = 0.86;

/** Зона, активная по умолчанию. */
const DEFAULT_ZONE = 'pro';

const ZONES = {
  standard: { id: 'standard', label: 'Standard', full: 'Standard Zone', ghost: 'STD', sub: 'RTX 4080' },
  pro: { id: 'pro', label: 'PRO', full: 'PRO Zone', ghost: 'PRO', sub: 'RTX 4090' },
};

/**
 * Параметры рабочего места.
 * proWins — PRO выигрывает по параметру (значение подсвечивается, рядом появляется разница diff).
 */
const HARDWARE_PARAMS = [
  { id: 'gpu', device: 'Системный блок', label: 'Видеокарта', pro: 'RTX 4090 · 24 ГБ', standard: 'RTX 4080 · 16 ГБ', proWins: true, diff: '+8 ГБ' },
  { id: 'cpu', device: 'Системный блок', label: 'Процессор', pro: 'Intel i9-14900K', standard: 'Intel i7-14700K', proWins: true, diff: '+4 ядра' },
  { id: 'ram', device: 'Системный блок', label: 'Память', pro: '64 ГБ DDR5-6000', standard: '32 ГБ DDR5-5600', proWins: true, diff: '+32 ГБ' },
  { id: 'monitor', device: 'Монитор', label: 'Монитор', pro: '27" · 360 Гц', standard: '27" · 240 Гц', proWins: true, diff: '+120 Гц' },
  { id: 'headset', device: 'Гарнитура', label: 'Гарнитура', pro: 'HyperX Cloud III', standard: 'HyperX Cloud II', proWins: true, diff: '+1 поколение' },
  { id: 'keyboard', device: 'Клавиатура', label: 'Клавиатура', pro: 'Wooting 60HE', standard: 'Logitech G Pro', proWins: true, diff: 'Rapid Trigger' },
  { id: 'mouse', device: 'Мышь', label: 'Мышь', pro: 'Logitech G Pro X2', standard: 'Razer Viper V2', proWins: true, diff: '2000 Гц · 60 г' },
];

/** Сцена C: полоса цифр (число считается от нуля, prefix/suffix — статичны). */
const STATS_STRIP = [
  { prefix: 'RTX ', value: 4080, suffix: '', decimals: 0, label: 'базовая видеокарта' },
  { prefix: 'i9-', value: 14900, suffix: 'K', decimals: 0, label: 'топовый CPU' },
  { prefix: '', value: 64, suffix: ' ГБ', decimals: 0, label: 'память в PRO' },
  { prefix: '', value: 360, suffix: ' Гц', decimals: 0, label: 'мониторы в PRO' },
  { prefix: '', value: 0.8, suffix: ' мс', decimals: 1, label: 'отклик матриц' },
  { prefix: '', value: 10, suffix: ' Гбит', decimals: 0, label: 'канал клуба' },
];

const PARTNERS = ['NVIDIA', 'Intel', 'ASUS', 'Logitech', 'HyperX', 'SteelSeries', 'BenQ', 'Razer'];

/**
 * Геометрия выносок на ПК-схеме (координаты viewBox 1400×780).
 * pts — ломаная от устройства к подписи (углы 90°), последняя точка — якорь подписи.
 */
const CALLOUT_GEOMETRY = {
  gpu: { side: 'left', pts: [[370, 232], [340, 232], [340, 150], [306, 150]] },
  cpu: { side: 'left', pts: [[370, 290], [306, 290]] },
  ram: { side: 'left', pts: [[370, 345], [348, 345], [348, 420], [306, 420]] },
  headset: { side: 'left', pts: [[360, 500], [340, 500], [340, 590], [306, 590]] },
  monitor: { side: 'right', pts: [[940, 229], [990, 229], [990, 150], [1094, 150]] },
  keyboard: { side: 'right', pts: [[830, 446], [852, 446], [852, 350], [1094, 350]] },
  mouse: { side: 'right', pts: [[985, 490], [1052, 490], [1052, 520], [1094, 520]] },
};

/* ============================================================================
 * УТИЛИТЫ
 * ========================================================================== */

const pad2 = (n) => String(n).padStart(2, '0');

const formatStat = (v, decimals) =>
  decimals ? v.toFixed(decimals) : String(Math.round(v));

const SCRAMBLE_GLYPHS = 'ABCDEFGHKLMNPRSTUVXYZ0123456789#%/<>_';
const SCRAMBLE_KEEP = new Set([' ', '·', '"', '-']);

/**
 * Scramble-перебор символов к финальному тексту. Возвращает функцию отмены.
 */
function runScramble(el, finalText, { duration, delay }) {
  const fromLen = (el.textContent || '').length;
  const maxLen = Math.max(fromLen, finalText.length);
  let startTs = null;
  let lastStep = -1;
  let rafId = 0;

  const tick = (now) => {
    if (startTs === null) startTs = now + delay;
    const elapsed = now - startTs;
    if (elapsed < 0) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    const t = elapsed / duration;
    if (t >= 1) {
      el.textContent = finalText;
      return;
    }
    // Смена глифов раз в ~40 мс — читаемее, чем каждый кадр
    const step = Math.floor(elapsed / 40);
    if (step !== lastStep) {
      lastStep = step;
      let out = '';
      for (let i = 0; i < maxLen; i++) {
        const target = finalText[i] ?? '';
        const resolveAt = 0.2 + 0.8 * (i / maxLen);
        if (t >= resolveAt) {
          out += target;
        } else if (SCRAMBLE_KEEP.has(target)) {
          out += target;
        } else {
          out += SCRAMBLE_GLYPHS[(Math.random() * SCRAMBLE_GLYPHS.length) | 0];
        }
      }
      el.textContent = out;
    }
    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

/* ============================================================================
 * SVG-СХЕМЫ (только контуры, без заливок; pathLength=1 для stroke-dashoffset)
 * ========================================================================== */

const DeskSchematic = ({ svgRef }) => {
  const { deskViewW: W, deskViewH: H } = HW_CONFIG.layout;
  return (
    <DeskSvg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      {/* Столешница */}
      <path className="draw draw--soft" pathLength="1" d="M 350 170 H 1050 L 1070 190 V 590 L 1050 610 H 350 L 330 590 V 190 Z" />
      <circle className="draw draw--soft" pathLength="1" cx="860" cy="198" r="8" />

      {/* Системный блок (вид сверху: два верхних вентилятора, лицевая панель к игроку) */}
      <rect className="draw" pathLength="1" x="370" y="200" width="96" height="170" />
      <circle className="draw" pathLength="1" cx="418" cy="250" r="30" />
      <circle className="draw" pathLength="1" cx="418" cy="250" r="6" />
      <circle className="draw" pathLength="1" cx="418" cy="318" r="30" />
      <circle className="draw" pathLength="1" cx="418" cy="318" r="6" />
      <path className="draw" pathLength="1" d="M 370 360 H 466" />

      {/* Кабель к монитору вдоль задней кромки */}
      <path className="draw draw--soft" pathLength="1" d="M 440 200 V 186 H 720 V 222" />

      {/* Монитор */}
      <rect className="draw" pathLength="1" x="500" y="222" width="440" height="14" />
      <path className="draw" pathLength="1" d="M 700 236 V 258 M 740 236 V 258" />
      <path className="draw" pathLength="1" d="M 660 258 H 780 L 765 292 H 675 Z" />

      {/* Гарнитура (оголовье + чашки) */}
      <path className="draw" pathLength="1" d="M 380 470 C 380 405 500 405 500 470" />
      <ellipse className="draw" pathLength="1" cx="380" cy="500" rx="20" ry="34" />
      <ellipse className="draw" pathLength="1" cx="500" cy="500" rx="20" ry="34" />

      {/* Клавиатура 60% */}
      <rect className="draw" pathLength="1" x="570" y="430" width="260" height="90" />
      <path className="draw draw--soft" pathLength="1" d="M 584 450 H 816" />
      <path className="draw draw--soft" pathLength="1" d="M 584 468 H 816" />
      <path className="draw draw--soft" pathLength="1" d="M 584 486 H 816" />
      <rect className="draw" pathLength="1" x="650" y="496" width="110" height="14" />

      {/* Коврик и мышь */}
      <rect className="draw draw--soft" pathLength="1" x="870" y="410" width="160" height="150" />
      <path className="draw" pathLength="1" d="M 950 440 C 975 440 985 462 985 490 C 985 518 970 532 950 532 C 930 532 915 518 915 490 C 915 462 925 440 950 440 Z" />
      <path className="draw" pathLength="1" d="M 950 440 V 474" />
      <rect className="draw" pathLength="1" x="946" y="452" width="8" height="14" />

      {/* Кресло */}
      <path className="draw draw--soft" pathLength="1" d="M 590 668 Q 690 722 790 668" />
      <path className="draw draw--soft" pathLength="1" d="M 612 650 Q 690 694 768 650" />

      {/* Выноски */}
      {HARDWARE_PARAMS.map((p, i) => {
        const g = CALLOUT_GEOMETRY[p.id];
        const d = `M ${g.pts.map((pt) => pt.join(' ')).join(' L ')}`;
        const [sx, sy] = g.pts[0];
        const [ex, ey] = g.pts[g.pts.length - 1];
        return (
          <g key={p.id}>
            <path className="leader" pathLength="1" d={d} data-leader-path={i} />
            <circle className="leader-dot" cx={sx} cy={sy} r="3.5" data-leader-dot={i} />
            <rect className="leader-dot" x={ex - 3} y={ey - 3} width="6" height="6" data-leader-dot={i} />
          </g>
        );
      })}
    </DeskSvg>
  );
};

const MobileDeskSchematic = ({ svgRef }) => {
  const { mobileViewW: W, mobileViewH: H } = HW_CONFIG.layout;
  return (
    <MobileDeskSvg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <path className="draw draw--soft" pathLength="1" d="M 30 20 H 330 L 345 35 V 435 L 330 450 H 30 L 15 435 V 35 Z" />

      {/* Монитор */}
      <rect className="draw" pathLength="1" x="70" y="52" width="220" height="10" />
      <path className="draw" pathLength="1" d="M 170 62 V 76 M 190 62 V 76" />
      <path className="draw" pathLength="1" d="M 150 76 H 210 L 202 94 H 158 Z" />

      {/* Системный блок */}
      <rect className="draw" pathLength="1" x="50" y="130" width="70" height="120" />
      <circle className="draw" pathLength="1" cx="85" cy="165" r="22" />
      <circle className="draw" pathLength="1" cx="85" cy="218" r="22" />

      {/* Гарнитура */}
      <path className="draw" pathLength="1" d="M 220 175 C 220 128 310 128 310 175" />
      <ellipse className="draw" pathLength="1" cx="220" cy="200" rx="15" ry="26" />
      <ellipse className="draw" pathLength="1" cx="310" cy="200" rx="15" ry="26" />

      {/* Клавиатура */}
      <rect className="draw" pathLength="1" x="60" y="300" width="190" height="66" />
      <path className="draw draw--soft" pathLength="1" d="M 72 316 H 238" />
      <path className="draw draw--soft" pathLength="1" d="M 72 332 H 238" />
      <rect className="draw" pathLength="1" x="115" y="342" width="80" height="14" />

      {/* Мышь */}
      <rect className="draw draw--soft" pathLength="1" x="266" y="292" width="64" height="104" />
      <path className="draw" pathLength="1" d="M 299 312 C 314 312 320 326 320 344 C 320 362 311 372 299 372 C 287 372 278 362 278 344 C 278 326 284 312 299 312 Z" />
      <path className="draw" pathLength="1" d="M 299 312 V 334" />

      {/* Номера устройств — совпадают с номерами выносок в списке */}
      <text className="device-tag" x="300" y="48">04</text>
      <text className="device-tag" x="128" y="146">01–03</text>
      <text className="device-tag" x="236" y="252">05</text>
      <text className="device-tag" x="60" y="388">06</text>
      <text className="device-tag" x="266" y="418">07</text>
    </MobileDeskSvg>
  );
};

/** Один силуэт ПК, переиспользуемый всеми машинами сцены B через <use>. */
const MachineSymbolDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <symbol id="hw-machine" viewBox="0 0 40 64">
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
        <rect x="2" y="2" width="36" height="58" />
        <path d="M 2 13 H 38" />
        <rect x="29" y="5.5" width="4" height="4" />
        <circle cx="20" cy="36" r="10" />
        <circle cx="20" cy="36" r="2.5" />
        <path d="M 7 60 V 63 M 33 60 V 63" />
      </g>
    </symbol>
  </svg>
);

/* ============================================================================
 * КОМПОНЕНТ
 * ========================================================================== */

const Specs = () => {
  const [zone, setZone] = useState(DEFAULT_ZONE);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stageRef = useRef(null);
  const svgBoxRef = useRef(null);
  const haloRef = useRef(null);
  const deskSvgRef = useRef(null);
  const mobileSvgRef = useRef(null);
  const calloutLayerRef = useRef(null);
  const calloutInnerRefs = useRef([]);
  const valueVisualRefs = useRef([]);
  const radioRefs = useRef({});
  const syncHeadlineRef = useRef(null);
  const machinesRowRef = useRef(null);
  const syncCaptionRef = useRef(null);
  const statsStripRef = useRef(null);
  const statLiveRefs = useRef([]);
  const scrambleCancelsRef = useRef([]);
  const isFirstZoneRef = useRef(true);

  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const cursorLabelRef = useRef(null);

  const perRowMobile = Math.ceil(MACHINES_COUNT / 2);
  const machineGroups = [
    Array.from({ length: perRowMobile }, (_, i) => i + 1),
    Array.from({ length: MACHINES_COUNT - perRowMobile }, (_, i) => i + 1 + perRowMobile),
  ].filter((g) => g.length);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* ---------- Кастомный курсор (прямые DOM-обновления, без ре-рендеров) ---------- */

  const setCursorDOM = useCallback(({ visible, expanded, label }) => {
    const dot = cursorDotRef.current;
    if (!dot) return;
    if (visible !== undefined) dot.dataset.visible = visible ? 'true' : 'false';
    if (expanded !== undefined) dot.dataset.expanded = expanded ? 'true' : 'false';
    if (label !== undefined && cursorLabelRef.current) cursorLabelRef.current.textContent = label;
  }, []);

  /* ---------- Тумблер зон ---------- */

  const toggleZone = useCallback(() => {
    setZone((z) => (z === 'pro' ? 'standard' : 'pro'));
  }, []);

  const onRadioKeyDown = (e) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const next = zone === 'pro' ? 'standard' : 'pro';
    setZone(next);
    requestAnimationFrame(() => radioRefs.current[next]?.focus());
  };

  const onSchematicClick = () => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) toggleZone();
  };

  // Начальные значения выносок (визуальный слой управляется только через DOM)
  useLayoutEffect(() => {
    HARDWARE_PARAMS.forEach((p, i) => {
      const el = valueVisualRefs.current[i];
      if (el) el.textContent = p[DEFAULT_ZONE];
    });
  }, []);

  // Смена зоны: scramble значений со stagger + лёгкая пульсация схемы
  useEffect(() => {
    if (isFirstZoneRef.current) {
      isFirstZoneRef.current = false;
      return undefined;
    }

    scrambleCancelsRef.current.forEach((cancel) => cancel());
    scrambleCancelsRef.current = [];

    HARDWARE_PARAMS.forEach((p, i) => {
      const el = valueVisualRefs.current[i];
      if (!el) return;
      const text = p[zone];
      if (reducedMotion) {
        el.textContent = text;
        return;
      }
      const duration = 320 + ((i * 53) % 170); // 320–490 мс
      scrambleCancelsRef.current.push(runScramble(el, text, { duration, delay: i * 55 }));
    });

    if (!reducedMotion) {
      if (svgBoxRef.current) {
        gsap.fromTo(
          svgBoxRef.current,
          { scale: 1 },
          { scale: 1.014, duration: 0.16, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true }
        );
      }
      if (haloRef.current) {
        gsap.fromTo(
          haloRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: true }
        );
      }
    }

    return undefined;
  }, [zone, reducedMotion]);

  useEffect(
    () => () => scrambleCancelsRef.current.forEach((cancel) => cancel()),
    []
  );

  /* ---------- Скролл-анимации (gsap.matchMedia: ПК / мобильные / reduced motion) ---------- */

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return undefined;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, reduce } = context.conditions;
        // Reduced motion: CSS по умолчанию уже показывает финальный статичный вид
        if (reduce) return undefined;

        const maskReveal = (rootEl, start = 'top 85%') => {
          if (!rootEl) return;
          gsap.fromTo(
            rootEl.querySelectorAll('.line-inner'),
            { yPercent: 112, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.95,
              stagger: 0.12,
              ease: 'expo.out',
              scrollTrigger: { trigger: rootEl, start, once: true },
            }
          );
        };

        maskReveal(titleRef.current);

        if (syncHeadlineRef.current) {
          gsap.fromTo(
            syncHeadlineRef.current.querySelectorAll('.line-inner'),
            { yPercent: 112, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: syncHeadlineRef.current,
                start: 'top 90%',
                end: 'top 52%',
                scrub: 0.5,
              },
            }
          );
        }

        /* --- Сцена A --- */
        const callouts = calloutInnerRefs.current.filter(Boolean);

        if (isDesktop && deskSvgRef.current && stageRef.current) {
          const svg = deskSvgRef.current;
          const deskPaths = svg.querySelectorAll('.draw');

          gsap.set(deskPaths, { strokeDashoffset: 1 });
          gsap.set(svg.querySelectorAll('[data-leader-path]'), { strokeDashoffset: 1 });
          gsap.set(svg.querySelectorAll('[data-leader-dot]'), { opacity: 0 });
          gsap.set(callouts, { opacity: 0, y: 12 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stageRef.current,
              start: 'top top',
              end: '+=180%',
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.to(deskPaths, { strokeDashoffset: 0, duration: 0.55, stagger: 0.032 });

          HARDWARE_PARAMS.forEach((_, i) => {
            const path = svg.querySelector(`[data-leader-path="${i}"]`);
            const dots = svg.querySelectorAll(`[data-leader-dot="${i}"]`);
            const label = calloutInnerRefs.current[i];
            // Выноски строго по очереди: линия → точки → подпись, следующая стартует в конце подписи
            const mark = `callout-${i}`;
            tl.addLabel(mark, i === 0 ? '>-0.1' : '>-0.08');
            if (path) tl.to(path, { strokeDashoffset: 0, duration: 0.24 }, mark);
            if (dots.length) tl.to(dots, { opacity: 1, duration: 0.06 }, mark);
            if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, `${mark}+=0.16`);
          });

          tl.to({}, { duration: 1.05 }); // пауза: схема держится собранной перед разпином
        } else if (mobileSvgRef.current) {
          const mPaths = mobileSvgRef.current.querySelectorAll('.draw');
          const mTags = mobileSvgRef.current.querySelectorAll('.device-tag');
          gsap.set(mPaths, { strokeDashoffset: 1 });
          gsap.set(mTags, { opacity: 0 });

          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: mobileSvgRef.current,
                start: 'top 85%',
                end: 'bottom 50%',
                scrub: 1,
              },
            })
            .to(mPaths, { strokeDashoffset: 0, duration: 1, stagger: 0.05 })
            .to(mTags, { opacity: 1, duration: 0.3, stagger: 0.05 }, '>-0.3');

          if (callouts.length && calloutLayerRef.current) {
            gsap.fromTo(
              callouts,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.07,
                ease: 'power3.out',
                scrollTrigger: { trigger: calloutLayerRef.current, start: 'top 88%', once: true },
              }
            );
          }
        }

        /* --- Сцена B: все машины загораются СИНХРОННО от скролла (scrub, без ожидания по таймеру) --- */
        const rowEl = machinesRowRef.current;
        if (rowEl) {
          const lit = rowEl.querySelectorAll('.sil-lit');
          const glows = rowEl.querySelectorAll('.sil-glow');
          const fills = rowEl.querySelectorAll('.bar-fill');
          const finish = rowEl.querySelectorAll('[data-finish]');
          const captionLines = syncCaptionRef.current
            ? syncCaptionRef.current.querySelectorAll('.line-inner')
            : [];
          const lights = [...lit, ...glows];

          gsap.set(lights, { opacity: 0 });
          gsap.set(fills, { scaleX: 0 });
          gsap.set(finish, { scaleX: 0 });
          gsap.set(captionLines, { yPercent: 112, opacity: 0 });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: rowEl,
                start: 'top 86%',
                end: 'bottom 38%',
                scrub: 0.55,
              },
            })
            .to(lights, { opacity: 1, duration: 0.08, ease: 'none' })
            .to(lights, { opacity: 0.3, duration: 0.06, ease: 'none' })
            .to(lights, { opacity: 1, duration: 0.22, ease: 'power2.out' })
            .to(fills, { scaleX: MACHINE_FILL_MARK, duration: 0.45, ease: 'none' }, '>-0.05')
            .to(finish, { scaleX: 1, duration: 0.28, ease: 'power2.out' }, '>-0.1')
            .to(
              captionLines,
              { yPercent: 0, opacity: 1, duration: 0.3, stagger: 0.06, ease: 'power3.out' },
              '>-0.2'
            );
        }

        /* --- Сцена C: счётчики от нуля --- */
        const stripEl = statsStripRef.current;
        const liveEls = statLiveRefs.current.filter(Boolean);
        if (stripEl && liveEls.length) {
          const items = stripEl.querySelectorAll('li');
          liveEls.forEach((el, i) => {
            el.textContent = formatStat(0, STATS_STRIP[i].decimals);
          });
          gsap.set(items, { opacity: 0, y: 18 });

          ScrollTrigger.create({
            trigger: stripEl,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
              liveEls.forEach((el, i) => {
                const s = STATS_STRIP[i];
                const obj = { v: 0 };
                gsap.to(obj, {
                  v: s.value,
                  duration: 1.6,
                  delay: i * 0.08,
                  ease: 'expo.out',
                  onUpdate: () => {
                    el.textContent = formatStat(obj.v, s.decimals);
                  },
                });
              });
            },
          });
        }

        // Возвращаем финальные значения при смене условий (resize / reduced motion)
        return () => {
          statLiveRefs.current.forEach((el, i) => {
            if (el) el.textContent = formatStat(STATS_STRIP[i].value, STATS_STRIP[i].decimals);
          });
        };
      },
      sectionEl
    );

    return () => mm.revert();
  }, []);

  /* ---------- Рендер ---------- */

  const activeZone = ZONES[zone];

  return (
    <HardwareSection
      id="specs"
      ref={sectionRef}
      data-testid="section-specs"
      aria-labelledby="hw-title"
      onPointerEnter={() => setCursorDOM({ visible: true })}
      onPointerLeave={() => setCursorDOM({ visible: false, expanded: false })}
    >
      <MachineSymbolDefs />

      <HwCursorFollower ref={cursorRef} aria-hidden="true">
        <HwCursorDot ref={cursorDotRef} data-visible="false" data-expanded="false">
          <span ref={cursorLabelRef}>⇄ зона</span>
        </HwCursorDot>
      </HwCursorFollower>

      <SceneGlow $x={18} $y={6} $duration={26} aria-hidden="true" />

      {/* Вводный блок */}
      <HwContainer>
        <IntroGrid>
          <div>
            <MonoKicker>
              <b>05</b> // Железо
            </MonoKicker>
            <HwTitle id="hw-title" ref={titleRef} data-testid="specs-title">
              <span className="line-mask">
                <span className="line-inner">Железо</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>без компромиссов</em>
                </span>
              </span>
            </HwTitle>
          </div>
          <IntroNote>
            Одинаковые конфигурации внутри каждого зала — машина №1 не быстрее
            машины №{pad2(MACHINES_COUNT)}.
          </IntroNote>
        </IntroGrid>
      </HwContainer>

      {/* Сцена A: схема рабочего места (pin на ПК) */}
      <SchematicStage ref={stageRef} data-testid="specs-schematic">
        <SceneGlow $x={70} $y={52} $duration={22} aria-hidden="true" />

        <GhostWordStack aria-hidden="true">
          {Object.values(ZONES).map((z) => (
            <GhostWord key={z.id} $pro={z.id === 'pro'} data-active={zone === z.id ? 'true' : 'false'}>
              {z.ghost}
            </GhostWord>
          ))}
        </GhostWordStack>

        <StageInner>
          <StageTopRow>
            <div>
              <MonoKicker>
                <b>A</b> / Схема стола — вид сверху
              </MonoKicker>
              <ZoneToggle
                role="radiogroup"
                aria-label="Конфигурация зоны"
                onPointerEnter={() => setCursorDOM({ expanded: true, label: '⇄ зона' })}
                onPointerLeave={() => setCursorDOM({ expanded: false })}
              >
                <ZoneOption
                  type="button"
                  role="radio"
                  aria-checked={zone === 'standard'}
                  tabIndex={zone === 'standard' ? 0 : -1}
                  ref={(el) => {
                    radioRefs.current.standard = el;
                  }}
                  onClick={() => setZone('standard')}
                  onKeyDown={onRadioKeyDown}
                  data-testid="zone-toggle-standard"
                >
                  <span className="zone-mark" aria-hidden="true" />
                  Standard Zone
                </ZoneOption>
                <ZoneSwapGlyph aria-hidden="true" data-zone={zone} onClick={toggleZone}>
                  ⇄
                </ZoneSwapGlyph>
                <ZoneOption
                  type="button"
                  role="radio"
                  $pro
                  aria-checked={zone === 'pro'}
                  tabIndex={zone === 'pro' ? 0 : -1}
                  ref={(el) => {
                    radioRefs.current.pro = el;
                  }}
                  onClick={() => setZone('pro')}
                  onKeyDown={onRadioKeyDown}
                  data-testid="zone-toggle-pro"
                >
                  <span className="zone-mark" aria-hidden="true" />
                  PRO Zone
                </ZoneOption>
              </ZoneToggle>
            </div>
            <StageMeta aria-hidden="true">
              {HARDWARE_PARAMS.length} параметров · {activeZone.sub}
              <br />
              одинаково на каждом месте · ← → / клик
            </StageMeta>
          </StageTopRow>

          <SrOnly aria-live="polite">Показаны характеристики {activeZone.full}.</SrOnly>

          <SchematicFrame>
            <SchematicBox
              onClick={onSchematicClick}
              onPointerEnter={() => setCursorDOM({ expanded: true, label: '⇄ зона' })}
              onPointerLeave={() => setCursorDOM({ expanded: false })}
            >
              <PulseHalo ref={haloRef} aria-hidden="true" />
              <SvgBox ref={svgBoxRef}>
                <DeskSchematic svgRef={deskSvgRef} />
                <MobileDeskSchematic svgRef={mobileSvgRef} />
              </SvgBox>

              <CalloutLayer ref={calloutLayerRef}>
                {HARDWARE_PARAMS.map((p, i) => {
                  const g = CALLOUT_GEOMETRY[p.id];
                  const [ex, ey] = g.pts[g.pts.length - 1];
                  const { deskViewW, deskViewH } = HW_CONFIG.layout;
                  const anchorX = g.side === 'left' ? ex - 8 : ex + 8;
                  const isWin = zone === 'pro' && p.proWins;
                  return (
                    <Callout
                      key={p.id}
                      data-side={g.side}
                      style={{
                        '--x': ((anchorX / deskViewW) * 100).toFixed(2),
                        '--y': ((ey / deskViewH) * 100).toFixed(2),
                      }}
                    >
                      <CalloutInner
                        ref={(el) => {
                          calloutInnerRefs.current[i] = el;
                        }}
                        data-win={isWin ? 'true' : 'false'}
                      >
                        <span className="callout-head">
                          <span className="callout-idx" aria-hidden="true">{pad2(i + 1)}</span>
                          <span>{p.label}</span>
                          {p.proWins && (
                            <span className="callout-diff" aria-hidden={!isWin}>
                              {p.diff}
                            </span>
                          )}
                        </span>
                        <span className="callout-value">
                          <SrOnly as="span">{p[zone]}</SrOnly>
                          <span
                            aria-hidden="true"
                            ref={(el) => {
                              valueVisualRefs.current[i] = el;
                            }}
                          />
                        </span>
                      </CalloutInner>
                    </Callout>
                  );
                })}
              </CalloutLayer>
            </SchematicBox>
          </SchematicFrame>
        </StageInner>
      </SchematicStage>

      {/* Полная таблица параметров для скринридеров */}
      <SrOnly>
        <table>
          <caption>Сравнение конфигураций PRO Zone и Standard Zone</caption>
          <thead>
            <tr>
              <th scope="col">Параметр</th>
              <th scope="col">PRO Zone</th>
              <th scope="col">Standard Zone</th>
            </tr>
          </thead>
          <tbody>
            {HARDWARE_PARAMS.map((p) => (
              <tr key={p.id}>
                <th scope="row">{p.label}</th>
                <td>{p.pro}</td>
                <td>{p.standard}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SrOnly>

      {/* Сцена B: машина №1 = машина №20 */}
      <SyncScene>
        <SceneGlow $x={28} $y={62} $duration={28} aria-hidden="true" />
        <HwContainer>
          <MonoKicker>
            <b>B</b> / Синхронный старт
          </MonoKicker>
          <SyncHeadline ref={syncHeadlineRef} aria-label={`Машина №1 равна машине №${MACHINES_COUNT}`}>
            <span className="line-mask" aria-hidden="true">
              <span className="line-inner">
                <span className="outline">№01</span>
                <span className="eq">=</span>
                <span>№{pad2(MACHINES_COUNT)}</span>
              </span>
            </span>
          </SyncHeadline>
          <SyncSubRow>
            <p>
              {MACHINES_COUNT} одинаковых сборок в каждом зале. Один образ системы,
              одни драйверы, одна и та же частота кадров — у всех сразу.
            </p>
          </SyncSubRow>

          <MachinesRow ref={machinesRowRef} aria-hidden="true">
            {machineGroups.map((group, gIdx) => (
              <MachinesGroup key={gIdx} $cols={group.length}>
                {group.map((n) => (
                  <MachineUnit key={n} style={{ '--mark': MACHINE_FILL_MARK }}>
                    <div className="sil">
                      <span className="sil-glow" />
                      <svg className="sil-dim" viewBox="0 0 40 64">
                        <use href="#hw-machine" />
                      </svg>
                      <svg className="sil-lit" viewBox="0 0 40 64">
                        <use href="#hw-machine" />
                      </svg>
                    </div>
                    <div className="bar">
                      <span className="bar-fill" />
                    </div>
                    <span className="num">{pad2(n)}</span>
                  </MachineUnit>
                ))}
                <FinishLine data-finish $bridge={gIdx < machineGroups.length - 1} />
              </MachinesGroup>
            ))}
          </MachinesRow>

          <SyncCaptionRow>
            <SyncCaption ref={syncCaptionRef}>
              <span className="line-mask">
                <span className="line-inner">Все приходят</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">вместе.</span>
              </span>
            </SyncCaption>
            <SyncReadout>
              <b>{MACHINES_COUNT}/{MACHINES_COUNT}</b> · загрузка {Math.round(MACHINE_FILL_MARK * 100)}% · Δ 0 fps
            </SyncReadout>
          </SyncCaptionRow>
        </HwContainer>
      </SyncScene>

      {/* Сцена C: полоса цифр */}
      <StatsScene>
        <SceneGlow $x={82} $y={70} $size="48vw" $duration={20} aria-hidden="true" />
        <HwContainer>
          <MonoKicker $tight>
            <b>C</b> / В цифрах
          </MonoKicker>
          <StatsStrip ref={statsStripRef}>
            {STATS_STRIP.map((s, i) => {
              const finalNum = formatStat(s.value, s.decimals);
              return (
                <StatItem key={s.label} data-testid={`spec-card-${s.label}`}>
                  <span className="stat-value">
                    <SrOnly as="span">
                      {s.prefix}
                      {finalNum}
                      {s.suffix}
                    </SrOnly>
                    <span aria-hidden="true">
                      {s.prefix}
                      <span className="stat-num">
                        <span className="ghost">{finalNum}</span>
                        <span
                          className="live"
                          ref={(el) => {
                            statLiveRefs.current[i] = el;
                          }}
                        >
                          {finalNum}
                        </span>
                      </span>
                      {s.suffix}
                    </span>
                  </span>
                  <span className="stat-label">{s.label}</span>
                </StatItem>
              );
            })}
          </StatsStrip>

          <PartnersLine>
            <b>Партнёры клуба</b>
            <span className="sep" aria-hidden="true">—</span>
            {PARTNERS.map((name, i) => (
              <span key={name}>
                {name}
                {i < PARTNERS.length - 1 && (
                  <span className="sep" aria-hidden="true">·</span>
                )}
              </span>
            ))}
          </PartnersLine>
        </HwContainer>
      </StatsScene>
    </HardwareSection>
  );
};

export default Specs;
