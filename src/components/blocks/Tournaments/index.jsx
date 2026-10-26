import { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  TOURNAMENTS_CONFIG,
  TournamentsSection,
  GlowClipper,
  AmbientNodeGlow,
  TournamentArtBackdrop,
  ArtLayer,
  ArtShade,
  TournamentsContainer,
  IntroHeaderGrid,
  IntroLeft,
  SectionKicker,
  SectionMainTitle,
  IntroNote,
  CountdownBanner,
  CountdownMeta,
  CountdownDigitsRow,
  CountdownUnitPair,
  ScreenReaderOnly,
  BracketPathStage,
  BracketSvgOverlay,
  NodesStack,
  TournamentNodeArticle,
  SpineCenterColumn,
  NodeJunctionPoint,
  NodeContentColumn,
  GameVisualShowcase,
  GameArtworkCutout,
  GameVisualSlashAccent,
  GameGhostWatermark,
  GameVisualTechTag,
  NodeInteractiveTrigger,
  FinaleSeasonKicker,
  NodeTopRow,
  GiantOutlineDate,
  StatusInlineText,
  GameHeading,
  EventMonoSubtitle,
  ProportionalPrizeValue,
  SlotsBlock,
  SlotsSquaresRow,
  SlotSquareCell,
  NodeMetaString,
  NodeActionLine,
  MiniBracketDrawer,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/**
 * Данные 6 зимних турниров (2026 год, даты старта в ISO).
 * Закрытие регистрации — за 24 часа до старта.
 */
const TOURNAMENTS_DATA = [
  {
    id: 1,
    isoStart: '2026-11-07T18:00:00+03:00',
    day: '07',
    month: 'ноя',
    monthFull: 'ноября',
    time: '18:00',
    game: 'Counter-Strike 2',
    shortCode: 'CS2',
    techSpec: 'MR12 · 128 TICK · AC LIVE',
    image: 'images/gallery-08.webp',
    name: 'Arena Winter Cup',
    format: '5×5',
    slotsFilled: 9,
    slotsTotal: 16,
    slotsUnit: 'команд',
    prizeAmount: 50000,
    prizeFormatted: '50 000 ₽',
    status: 'open',
    bracketType: 'tree-16',
    alignRight: false,
    glowPos: { x: 24, y: 18 },
    isFinale: false,
  },
  {
    id: 2,
    isoStart: '2026-11-14T16:00:00+03:00',
    day: '14',
    month: 'ноя',
    monthFull: 'ноября',
    time: '16:00',
    game: 'Dota 2',
    shortCode: 'DOTA',
    techSpec: 'CAPTAINS MODE · PATCH 7.38',
    image: 'images/gallery-09.jpg',
    name: 'Midlane Mayhem',
    format: '5×5',
    slotsFilled: 6,
    slotsTotal: 16,
    slotsUnit: 'команд',
    prizeAmount: 75000,
    prizeFormatted: '75 000 ₽',
    status: 'open',
    bracketType: 'tree-16',
    alignRight: true,
    glowPos: { x: 74, y: 32 },
    isFinale: false,
  },
  {
    id: 3,
    isoStart: '2026-11-22T14:00:00+03:00',
    day: '22',
    month: 'ноя',
    monthFull: 'ноября',
    time: '14:00',
    game: 'Valorant',
    shortCode: 'VAL',
    techSpec: 'VCT RULESET · VANGUARD',
    image: 'images/gallery-10.webp',
    name: 'Radiant Rush',
    format: '5×5',
    slotsFilled: 2,
    slotsTotal: 16,
    slotsUnit: 'команд',
    prizeAmount: 40000,
    prizeFormatted: '40 000 ₽',
    status: 'soon',
    bracketType: 'tree-16',
    alignRight: false,
    glowPos: { x: 26, y: 48 },
    isFinale: false,
  },
  {
    id: 4,
    isoStart: '2026-11-29T17:00:00+03:00',
    day: '29',
    month: 'ноя',
    monthFull: 'ноября',
    time: '17:00',
    game: 'FC 25',
    shortCode: 'FC25',
    techSpec: 'PS5 PRO · 120 HZ OLED · 1V1',
    image: 'images/gallery-11.jpg',
    name: 'Москва Клубный Финал',
    format: '1×1',
    slotsFilled: 4,
    slotsTotal: 32,
    slotsUnit: 'участника',
    prizeAmount: 20000,
    prizeFormatted: '20 000 ₽',
    status: 'soon',
    bracketType: 'simple-32',
    alignRight: true,
    glowPos: { x: 72, y: 64 },
    isFinale: false,
  },
  {
    id: 5,
    isoStart: '2026-12-06T15:00:00+03:00',
    day: '06',
    month: 'дек',
    monthFull: 'декабря',
    time: '15:00',
    game: 'Fortnite',
    shortCode: 'FN',
    techSpec: 'ZERO BUILD · 6 DROPS · SOLO',
    image: 'images/gallery-12.jpg',
    name: 'Zero Build Clash',
    format: 'Solo',
    slotsFilled: 5,
    slotsTotal: 40,
    slotsUnit: 'игроков',
    prizeAmount: 30000,
    prizeFormatted: '30 000 ₽',
    status: 'soon',
    bracketType: 'none',
    alignRight: false,
    glowPos: { x: 28, y: 78 },
    isFinale: false,
  },
  {
    id: 6,
    isoStart: '2026-12-13T13:00:00+03:00',
    day: '13',
    month: 'дек',
    monthFull: 'декабря',
    time: '13:00',
    game: 'League of Legends',
    shortCode: 'LOL',
    techSpec: 'TOURNAMENT DRAFT · GRAND FINAL BO3',
    image: 'images/tournament-lol.webp',
    name: 'Rift Rumble',
    format: '5×5',
    slotsFilled: 3,
    slotsTotal: 16,
    slotsUnit: 'команд',
    prizeAmount: 100000,
    prizeFormatted: '100 000 ₽',
    status: 'soon',
    bracketType: 'tree-16',
    alignRight: true,
    glowPos: { x: 52, y: 92 },
    isFinale: true,
  },
];

function formatRuPrize(num) {
  return `${Math.round(num)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;
}

function pad2(n) {
  return String(Math.max(0, n)).padStart(2, '0');
}

/**
 * Изолированный компонент таймера (тикает раз в секунду без перерисовки секции с 6 турнирами).
 */
const CountdownHeaderBanner = memo(({ reducedMotion }) => {
  const secLastDigitRef = useRef(null);
  const minLastDigitRef = useRef(null);

  const upcomingTarget = useMemo(() => {
    const nowMs = Date.now();
    for (const t of TOURNAMENTS_DATA) {
      const closeMs = new Date(t.isoStart).getTime() - 24 * 3600 * 1000;
      if (closeMs > nowMs) {
        return { tournament: t, deadlineMs: closeMs };
      }
    }
    const firstCloseMs =
      new Date(TOURNAMENTS_DATA[0].isoStart).getTime() - 24 * 3600 * 1000;
    return { tournament: TOURNAMENTS_DATA[0], deadlineMs: firstCloseMs };
  }, []);

  const computeTimeLeft = useCallback(() => {
    const diffSec = Math.max(
      0,
      Math.floor((upcomingTarget.deadlineMs - Date.now()) / 1000)
    );
    const days = Math.floor(diffSec / 86400);
    const hours = Math.floor((diffSec % 86400) / 3600);
    const minutes = Math.floor((diffSec % 3600) / 60);
    const seconds = diffSec % 60;
    return {
      dd: pad2(days),
      hh: pad2(hours),
      mm: pad2(minutes),
      ss: pad2(seconds),
    };
  }, [upcomingTarget]);

  const [countdown, setCountdown] = useState(() => computeTimeLeft());
  const prevCountdownRef = useRef(countdown);

  useEffect(() => {
    const tick = () => {
      const next = computeTimeLeft();
      const prev = prevCountdownRef.current;

      if (!reducedMotion) {
        if (next.ss[1] !== prev.ss[1] && secLastDigitRef.current) {
          gsap.fromTo(
            secLastDigitRef.current,
            { y: -8, rotateX: -68, opacity: 0.35 },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.24,
              ease: 'power2.out',
              overwrite: true,
            }
          );
        }
        if (next.mm[1] !== prev.mm[1] && minLastDigitRef.current) {
          gsap.fromTo(
            minLastDigitRef.current,
            { y: -8, rotateX: -68, opacity: 0.35 },
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.24,
              ease: 'power2.out',
              overwrite: true,
            }
          );
        }
      }

      prevCountdownRef.current = next;
      setCountdown(next);
    };

    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [computeTimeLeft, reducedMotion]);

  return (
    <CountdownBanner data-testid="tournaments-countdown">
      <CountdownMeta>
        <span className="label">
          // ДО ЗАКРЫТИЯ РЕГИСТРАЦИИ (СТАРТ − 24 Ч)
        </span>
        <span className="target-name">
          {upcomingTarget.tournament.game} · {upcomingTarget.tournament.name} (
          {upcomingTarget.tournament.day} {upcomingTarget.tournament.monthFull})
        </span>
      </CountdownMeta>

      <ScreenReaderOnly aria-live="polite">
        До закрытия регистрации на турнир {upcomingTarget.tournament.game}:{' '}
        {Number(countdown.dd)} дней, {Number(countdown.hh)} часов,{' '}
        {Number(countdown.mm)} минут, {Number(countdown.ss)} секунд.
      </ScreenReaderOnly>

      <CountdownDigitsRow aria-hidden="true">
        <CountdownUnitPair>
          <span className="digits">
            <span className="digit-char">{countdown.dd[0]}</span>
            <span className="digit-char">{countdown.dd[1]}</span>
          </span>
          <span className="unit-tag">дн</span>
          <span className="colon">:</span>
        </CountdownUnitPair>

        <CountdownUnitPair>
          <span className="digits">
            <span className="digit-char">{countdown.hh[0]}</span>
            <span className="digit-char">{countdown.hh[1]}</span>
          </span>
          <span className="unit-tag">чч</span>
          <span className="colon hide-mobile-break">:</span>
        </CountdownUnitPair>

        <CountdownUnitPair>
          <span className="digits">
            <span className="digit-char">{countdown.mm[0]}</span>
            <span className="digit-char" ref={minLastDigitRef}>
              {countdown.mm[1]}
            </span>
          </span>
          <span className="unit-tag">мм</span>
          <span className="colon">:</span>
        </CountdownUnitPair>

        <CountdownUnitPair>
          <span className="digits">
            <span className="digit-char">{countdown.ss[0]}</span>
            <span className="digit-char sec-last" ref={secLastDigitRef}>
              {countdown.ss[1]}
            </span>
          </span>
          <span className="unit-tag">сс</span>
        </CountdownUnitPair>
      </CountdownDigitsRow>
    </CountdownBanner>
  );
});

CountdownHeaderBanner.displayName = 'CountdownHeaderBanner';

/**
 * Геометрически ровная симметричная схема single elimination (16 -> 8 -> 4 -> 2 -> ФИНАЛ BO3).
 * Для FC 25 (32) — упрощённая схема, для Fortnite (40, Solo) — без схемы.
 */
const MiniBracketSchema = memo(({ bracketType }) => {
  if (bracketType === 'none') return null;

  if (bracketType === 'simple-32') {
    return (
      <MiniBracketDrawer aria-hidden="true">
        <svg viewBox="0 0 420 96">
          <text x="4" y="13" className="bracket-stage-text">
            32 → 16
          </text>
          <text x="114" y="13" className="bracket-stage-text">
            1/4 (8)
          </text>
          <text x="224" y="13" className="bracket-stage-text">
            1/2 (4)
          </text>
          <text x="326" y="13" className="bracket-final-text">
            ФИНАЛ · BO3
          </text>

          {/* Фоновые симметричные вилки */}
          <path
            className="bracket-tree-bg"
            d="M 4 30 H 86 V 44 H 4
               M 4 70 H 86 V 84 H 4
               M 86 37 H 194 V 77 H 86
               M 194 57 H 302 V 57 H 398"
          />

          {/* Салатовый активный путь победителя */}
          <path
            className="bracket-tree-active"
            d="M 4 30 H 86 V 37 H 194 V 57 H 398"
          />

          <rect x="83" y="34" width="5" height="5" className="bracket-node-dot" />
          <rect x="191" y="54" width="5" height="5" className="bracket-node-dot" />
          <rect x="395" y="53" width="7" height="7" className="bracket-node-dot" />
        </svg>
      </MiniBracketDrawer>
    );
  }

  return (
    <MiniBracketDrawer aria-hidden="true">
      <svg viewBox="0 0 430 98">
        <text x="2" y="12" className="bracket-stage-text">
          16
        </text>
        <text x="88" y="12" className="bracket-stage-text">
          8
        </text>
        <text x="176" y="12" className="bracket-stage-text">
          4
        </text>
        <text x="264" y="12" className="bracket-stage-text">
          2
        </text>
        <text x="342" y="12" className="bracket-final-text">
          ФИНАЛ · BO3
        </text>

        {/* Полное симметричное дерево Single Elimination (4 пары -> 2 пары -> 1 пара -> Финал) */}
        <path
          className="bracket-tree-bg"
          d="M 2 22 H 64 V 32 H 2
             M 2 42 H 64 V 52 H 2
             M 2 62 H 64 V 72 H 2
             M 2 82 H 64 V 92 H 2
             M 64 27 H 152 V 47 H 64
             M 64 67 H 152 V 87 H 64
             M 152 37 H 242 V 77 H 152
             M 242 57 H 336 H 410"
        />

        {/* Прорисовывающийся салатовый путь к финалу bo3 */}
        <path
          className="bracket-tree-active"
          d="M 2 22 H 64 V 27 H 152 V 37 H 242 V 57 H 410"
        />

        <rect x="61" y="24" width="5" height="5" className="bracket-node-dot" />
        <rect x="149" y="34" width="5" height="5" className="bracket-node-dot" />
        <rect x="239" y="54" width="5" height="5" className="bracket-node-dot" />
        <rect x="407" y="53" width="7" height="7" className="bracket-node-dot" />
      </svg>
    </MiniBracketDrawer>
  );
});

MiniBracketSchema.displayName = 'MiniBracketSchema';

const Tournaments = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const glowRef = useRef(null);
  const stageRef = useRef(null);
  const svgTrackBgRef = useRef(null);
  const svgTrackGlowRef = useRef(null);
  const svgTrackNeonRef = useRef(null);
  const nodeArticleRefs = useRef([]);
  const junctionRefs = useRef([]);
  const prizeValRefs = useRef([]);
  const slotsContainerRefs = useRef([]);
  const artLayerRefs = useRef([]);
  const animatedNodesRef = useRef(new Set());
  const nodeMetricsRef = useRef([]);
  const segsRef = useRef([]);
  const totalPathLenRef = useRef(0);

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ---------------------------------------------------------------------------
  // Построение змеевидной SVG-трассы по узлам: на десктопе линия между узлами
  // уходит в сторону арта следующего турнира длинным горизонтальным пролётом
  // и возвращается — вместо монотонной вертикали. Для каждой вертикальной и
  // горизонтальной части хранится точная длина (для синхронного загорания).
  // ---------------------------------------------------------------------------
  const rebuildBracketGeometry = useCallback(() => {
    const stageEl = stageRef.current;
    if (!stageEl) return;
    const stageRect = stageEl.getBoundingClientRect();
    const pts = [];

    for (let i = 0; i < TOURNAMENTS_DATA.length; i++) {
      const jEl = junctionRefs.current[i];
      if (!jEl) continue;
      const r = jEl.getBoundingClientRect();
      pts.push({
        x: r.left - stageRect.left + r.width * 0.5,
        y: r.top - stageRect.top + r.height * 0.5,
        cumLen: 0,
      });
    }

    if (pts.length < 2) return;

    const segs = [];

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    let runningLen = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const dy = Math.max(1, next.y - curr.y);
      const parts = [];
      let cx = curr.x;
      let cy = curr.y;

      const addV = (yTo) => {
        d += ` V ${yTo.toFixed(1)}`;
        parts.push({ t: 'V', yFrom: cy, yTo, len: Math.abs(yTo - cy) });
        cy = yTo;
      };
      const addH = (xTo) => {
        d += ` H ${xTo.toFixed(1)}`;
        parts.push({ t: 'H', y: cy, len: Math.abs(xTo - cx) });
        cx = xTo;
      };

      const midY = Math.round(curr.y + dy * 0.5);
      addV(midY);
      addH(next.x);
      addV(next.y);

      for (const p of parts) runningLen += p.len;
      pts[i + 1].cumLen = runningLen;
      segs.push({ y0: curr.y, y1: next.y, cumStart: pts[i].cumLen, parts });
    }

    nodeMetricsRef.current = pts;
    segsRef.current = segs;
    totalPathLenRef.current = runningLen;

    if (svgTrackBgRef.current) svgTrackBgRef.current.setAttribute('d', d);
    if (svgTrackGlowRef.current) {
      svgTrackGlowRef.current.setAttribute('d', d);
      svgTrackGlowRef.current.style.strokeDasharray = `${runningLen}`;
    }
    if (svgTrackNeonRef.current) {
      svgTrackNeonRef.current.setAttribute('d', d);
      svgTrackNeonRef.current.style.strokeDasharray = `${runningLen}`;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Точная синхронизация линии и загорания узлов по вертикальной координате скролла
  // ---------------------------------------------------------------------------
  const syncBracketToScroll = useCallback(() => {
    const pts = nodeMetricsRef.current;
    const totalLen = totalPathLenRef.current;
    const stageEl = stageRef.current;
    if (!pts.length || !stageEl || totalLen <= 0) return;

    if (reducedMotion) {
      if (svgTrackNeonRef.current) svgTrackNeonRef.current.style.strokeDashoffset = '0';
      if (svgTrackGlowRef.current) svgTrackGlowRef.current.style.strokeDashoffset = '0';
      for (let i = 0; i < pts.length; i++) {
        if (nodeArticleRefs.current[i]) nodeArticleRefs.current[i].dataset.lit = 'true';
        if (junctionRefs.current[i]) junctionRefs.current[i].dataset.lit = 'true';
      }
      return;
    }

    const stageRect = stageEl.getBoundingClientRect();
    // Точка чтения в экране (62% высоты окна) — кончик салатовой линии всегда идёт ровно на этом уровне
    const triggerY = window.innerHeight * 0.62 - stageRect.top;

    let drawnLen = 0;
    if (triggerY <= pts[0].y) {
      drawnLen = 0;
    } else if (triggerY >= pts[pts.length - 1].y) {
      drawnLen = totalLen;
    } else {
      // Точный проход по частям трассы: вертикали — по Y, горизонтали — целиком,
      // когда кончик прошёл их уровень. Так узел загорается ровно в момент касания.
      const seg =
        segsRef.current.find((s) => triggerY >= s.y0 && triggerY <= s.y1) ||
        segsRef.current[segsRef.current.length - 1];
      let acc = seg.cumStart;
      for (const p of seg.parts) {
        if (p.t === 'H') {
          if (triggerY >= p.y - 0.5) acc += p.len;
          else break;
        } else {
          if (triggerY >= p.yTo - 0.5) acc += p.len;
          else if (triggerY > p.yFrom) {
            acc += triggerY - p.yFrom;
            break;
          } else break;
        }
      }
      drawnLen = acc;
    }

    const dashOffset = Math.max(0, totalLen - drawnLen).toFixed(1);
    if (svgTrackNeonRef.current) {
      svgTrackNeonRef.current.style.strokeDashoffset = dashOffset;
    }
    if (svgTrackGlowRef.current) {
      svgTrackGlowRef.current.style.strokeDashoffset = dashOffset;
    }

    // Узел загорается ровно в тот момент, когда кончик линии дошёл до его координаты
    let activeIdx = 0;
    for (let i = 0; i < pts.length; i++) {
      const isLit = i === 0 ? triggerY >= pts[0].y - 40 : drawnLen >= pts[i].cumLen - 6;
      if (isLit) activeIdx = i;

      const rowEl = nodeArticleRefs.current[i];
      const jEl = junctionRefs.current[i];
      const litStr = isLit ? 'true' : 'false';

      if (rowEl && rowEl.dataset.lit !== litStr) {
        rowEl.dataset.lit = litStr;
      }
      if (jEl && jEl.dataset.lit !== litStr) {
        jEl.dataset.lit = litStr;
      }
    }

    // Полноэкранный арт активного турнира плавно принимает эстафету
    for (let i = 0; i < artLayerRefs.current.length; i++) {
      const artEl = artLayerRefs.current[i];
      if (artEl) {
        const activeStr = i === activeIdx ? 'true' : 'false';
        if (artEl.dataset.active !== activeStr) {
          artEl.dataset.active = activeStr;
        }
      }
    }

    // Фоновое свечение следует за активным узлом по заранее рассчитанным координатам pts[activeIdx] (без лишнего getBoundingClientRect в кадре скролла)
    if (window.innerWidth >= 768 && glowRef.current && pts[activeIdx]) {
      const gx = pts[activeIdx].x;
      const gy = pts[activeIdx].y;
      glowRef.current.style.transform = `translate3d(${gx.toFixed(
        0
      )}px, ${gy.toFixed(0)}px, 0) translate(-50%, -50%)`;
    }
  }, [reducedMotion]);

  useEffect(() => {
    rebuildBracketGeometry();
    syncBracketToScroll();

    let rafId = 0;
    const onResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        rebuildBracketGeometry();
        syncBracketToScroll();
      });
    };

    const late1 = window.setTimeout(() => {
      rebuildBracketGeometry();
      syncBracketToScroll();
    }, 450);

    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafId) window.cancelAnimationFrame(rafId);
      window.clearTimeout(late1);
    };
  }, [rebuildBracketGeometry, syncBracketToScroll]);

  useEffect(() => {
    if (reducedMotion || !stageRef.current) {
      syncBracketToScroll();
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: syncBracketToScroll,
      onRefresh: () => {
        rebuildBracketGeometry();
        syncBracketToScroll();
      },
    });

    return () => st.kill();
  }, [reducedMotion, rebuildBracketGeometry, syncBracketToScroll]);

  // ---------------------------------------------------------------------------
  // Построчное появление заголовка "Турниры зимой" + каскад слотов и счётчик призовых
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line-inner');
        gsap.fromTo(
          lines,
          { yPercent: 112, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: TOURNAMENTS_CONFIG.animation.easeExpo,
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      TOURNAMENTS_DATA.forEach((t, idx) => {
        const nodeEl = nodeArticleRefs.current[idx];
        const prizeEl = prizeValRefs.current[idx];
        const slotsWrapEl = slotsContainerRefs.current[idx];
        if (!nodeEl) return;

        ScrollTrigger.create({
          trigger: nodeEl,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            if (animatedNodesRef.current.has(t.id)) return;
            animatedNodesRef.current.add(t.id);

            if (prizeEl) {
              const counterObj = { val: 0 };
              gsap.to(counterObj, {
                val: t.prizeAmount,
                duration: TOURNAMENTS_CONFIG.animation.prizeCountDurationSec,
                ease: TOURNAMENTS_CONFIG.animation.easeExpo,
                onUpdate: () => {
                  prizeEl.textContent = formatRuPrize(counterObj.val);
                },
              });
            }

            if (slotsWrapEl) {
              const filledSquares =
                slotsWrapEl.querySelectorAll('[data-filled="true"]');
              if (filledSquares.length > 0) {
                gsap.fromTo(
                  filledSquares,
                  { scale: 0.25, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.32,
                    stagger: TOURNAMENTS_CONFIG.animation.slotStaggerSec,
                    ease: 'back.out(2)',
                  }
                );
              }
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const scrollToContact = useCallback(() => {
    const contactEl = document.querySelector('#contact');
    if (!contactEl) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(contactEl);
    } else {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNodeClick = useCallback(() => {
    scrollToContact();
  }, []);

  return (
    <TournamentsSection
      ref={sectionRef}
      id="tournaments"
      data-testid="section-tournaments"
    >
      {/* Медленно дрейфующее салатовое свечение (обрезано границами секции) */}
      <GlowClipper aria-hidden="true">
        <AmbientNodeGlow ref={glowRef} />
      </GlowClipper>

      {/* Липкий полноэкранный арт активного турнира */}
      <TournamentArtBackdrop aria-hidden="true">
        {TOURNAMENTS_DATA.map((t, i) => (
          <ArtLayer
            key={`art-${t.id}`}
            ref={(el) => {
              artLayerRefs.current[i] = el;
            }}
            data-active={i === 0 ? 'true' : 'false'}
          >
            <img src={t.image} alt="" loading="lazy" decoding="async" />
          </ArtLayer>
        ))}
        <ArtShade />
      </TournamentArtBackdrop>

      <TournamentsContainer>
        {/* Вводный асимметричный заголовок */}
        <IntroHeaderGrid>
          <IntroLeft>
            <SectionKicker>
              <span>04</span> // СОРЕВНОВАНИЯ
            </SectionKicker>
            <SectionMainTitle ref={titleRef} data-testid="tournaments-title">
              <span className="line-mask">
                <span className="line-inner">Турниры</span>
              </span>
              <span className="line-mask">
                <span className="line-inner">
                  <em>зимой</em>
                </span>
              </span>
            </SectionMainTitle>
          </IntroLeft>

          <IntroNote>
            Регистрация закрывается за 24 часа до старта. Формат — single
            elimination, финалы bo3.
          </IntroNote>
        </IntroHeaderGrid>

        {/* Изолированный живой таймер ДД : ЧЧ : ММ : СС */}
        <CountdownHeaderBanner reducedMotion={reducedMotion} />

        {/* Сцена с 90-градусной SVG-линией сетки, 6 узлами и игровыми артами */}
        <BracketPathStage ref={stageRef}>
          <BracketSvgOverlay aria-hidden="true">
            <path ref={svgTrackBgRef} className="track-bg" />
            <path ref={svgTrackGlowRef} className="track-glow" />
            <path ref={svgTrackNeonRef} className="track-neon" />
          </BracketSvgOverlay>

          <NodesStack>
            {TOURNAMENTS_DATA.map((t, idx) => {
              const isOpenStatus = t.status === 'open';
              const fullAriaLabel = `${t.game}, ${t.name}, ${Number(
                t.day
              )} ${t.monthFull} в ${t.time}, формат ${t.format}, занято ${
                t.slotsFilled
              } из ${t.slotsTotal} ${t.slotsUnit}, призовой фонд ${
                t.prizeFormatted
              }, ${
                isOpenStatus
                  ? 'регистрация открыта, зарегистрировать команду'
                  : 'регистрация скоро, напомнить мне'
              }`;

              return (
                <TournamentNodeArticle
                  key={t.id}
                  ref={(el) => {
                    nodeArticleRefs.current[idx] = el;
                  }}
                  data-lit={idx === 0 ? 'true' : 'false'}
                  data-hovered="false"
                  data-dimmed="false"
                  data-testid={`tournament-card-${t.id}`}
                >
                  {/* Центральная ось с узлом-стыком сетки */}
                  <SpineCenterColumn aria-hidden="true">
                    <NodeJunctionPoint
                      ref={(el) => {
                        junctionRefs.current[idx] = el;
                      }}
                      data-lit={idx === 0 ? 'true' : 'false'}
                      $alignRight={t.alignRight}
                      $isFinale={t.isFinale}
                    />
                  </SpineCenterColumn>

                  {/* Со стороны свободного пространства: диагональный игровой арт с контурным кодом дисциплины */}
                  <GameVisualShowcase
                    $alignRight={t.alignRight}
                    aria-hidden="true"
                  >
                    <GameArtworkCutout
                      $alignRight={t.alignRight}
                      $isFinale={t.isFinale}
                    >
                      <img
                        src={t.image}
                        alt={t.game}
                        loading="lazy"
                        decoding="async"
                      />
                      <GameVisualTechTag $alignRight={t.alignRight}>
                        // {t.techSpec}
                      </GameVisualTechTag>
                      <GameVisualSlashAccent $alignRight={t.alignRight} />
                    </GameArtworkCutout>

                    <GameGhostWatermark $alignRight={t.alignRight}>
                      {t.shortCode}
                    </GameGhostWatermark>
                  </GameVisualShowcase>

                  {/* Контентный узел турнира */}
                  <NodeContentColumn $alignRight={t.alignRight}>
                    <NodeInteractiveTrigger
                      type="button"
                      aria-label={fullAriaLabel}
                      $isFinale={t.isFinale}
                      onClick={handleNodeClick}
                    >
                      {t.isFinale && (
                        <FinaleSeasonKicker>
                          ★ // ФИНАЛ СЕЗОНА · ГЛАВНЫЙ ПРИЗ ЗИМЫ
                        </FinaleSeasonKicker>
                      )}

                      {/* Верхняя строка: гигантская контурная дата + статус LIVE / СКОРО */}
                      <NodeTopRow>
                        <GiantOutlineDate $isFinale={t.isFinale}>
                          <span className="day-num">{t.day}</span>
                          <span className="month-tag">{t.month}</span>
                        </GiantOutlineDate>

                        <StatusInlineText>
                          {isOpenStatus ? (
                            <>
                              <span className="live-dot" aria-hidden="true" />
                              <span className="live-label">
                                LIVE · регистрация открыта
                              </span>
                            </>
                          ) : (
                            <span className="soon-label">СКОРО</span>
                          )}
                        </StatusInlineText>
                      </NodeTopRow>

                      {/* Название дисциплины гротеском + название турнира моно-шрифтом */}
                      <GameHeading $isFinale={t.isFinale}>{t.game}</GameHeading>
                      <EventMonoSubtitle>{t.name}</EventMonoSubtitle>

                      {/* Призовой фонд (размер шрифта пропорционален сумме) */}
                      <ProportionalPrizeValue
                        ref={(el) => {
                          prizeValRefs.current[idx] = el;
                        }}
                        $amount={t.prizeAmount}
                        $isFinale={t.isFinale}
                      >
                        {t.prizeFormatted}
                      </ProportionalPrizeValue>

                      {/* Слоты: ряд квадратиков 16 / 32 / 40 + строка формата и времени через "·" */}
                      <SlotsBlock>
                        <SlotsSquaresRow
                          ref={(el) => {
                            slotsContainerRefs.current[idx] = el;
                          }}
                          aria-hidden="true"
                        >
                          {Array.from({ length: t.slotsTotal }).map(
                            (_, sIdx) => {
                              const isFilled = sIdx < t.slotsFilled;
                              return (
                                <SlotSquareCell
                                  key={sIdx}
                                  $filled={isFilled}
                                  data-filled={isFilled ? 'true' : 'false'}
                                />
                              );
                            }
                          )}
                        </SlotsSquaresRow>

                        <NodeMetaString>
                          <span className="slots-count">
                            {t.slotsFilled}/{t.slotsTotal} {t.slotsUnit}
                          </span>
                          <span className="dot">·</span>
                          <span>{t.format}</span>
                          <span className="dot">·</span>
                          <span>{t.time}</span>
                        </NodeMetaString>
                      </SlotsBlock>

                      {/* Текстовое действие со сдвигающейся стрелкой */}
                      <NodeActionLine $open={isOpenStatus}>
                        <span>
                          {isOpenStatus
                            ? 'Зарегистрировать команду'
                            : 'Напомнить мне'}
                        </span>
                        <span className="arrow" aria-hidden="true">
                          <svg
                            viewBox="0 0 14 14"
                            width="12"
                            height="12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ display: 'inline-block', verticalAlign: 'middle' }}
                          >
                            <path
                              d="M2 7H11.5M7.5 3L11.8 7L7.5 11"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="square"
                            />
                          </svg>
                        </span>
                      </NodeActionLine>

                      {/* Геометрически ровная схема single elimination */}
                      <MiniBracketSchema bracketType={t.bracketType} />
                    </NodeInteractiveTrigger>
                  </NodeContentColumn>
                </TournamentNodeArticle>
              );
            })}
          </NodesStack>
        </BracketPathStage>
      </TournamentsContainer>
    </TournamentsSection>
  );
};

export default Tournaments;
