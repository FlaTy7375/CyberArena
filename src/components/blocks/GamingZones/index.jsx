import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ZONES_CONFIG,
  ZonesSection,
  IntroBlock,
  IntroLeft,
  IntroKicker,
  ZonesTitle,
  IntroNote,
  FullscreenStage,
  AmbientDriftGlow,
  SvgNoiseOverlay,
  StageTopHud,
  CounterReadout,
  MinimalSegments,
  SegmentTick,
  SegmentTickFill,
  HallSceneLayer,
  HallPhotoBg,
  GiantBleedNumber,
  HallContentLayout,
  HallEditorialGroup,
  HallFormatKicker,
  HallMassiveTitle,
  HallBottomRow,
  HallDescription,
  HallMetaRight,
  HallSpecsString,
  HallActionGroup,
  HallTariffText,
  HallBookLink,
  CustomCursorFollower,
  CursorCircle,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/**
 * 6 полноэкранных залов-сцен (100vh) с новыми фото zal1–zal6.
 * У каждого зала — своё асимметричное положение гигантского номера (38vw),
 * своя координата дрейфующего салатового свечения и свой угол диагональной clip-path шторки.
 */
const ZONES_SCENES = [
  {
    id: 1,
    code: '01',
    name: 'PRO Zone',
    badge: 'Флагманский сектор',
    description:
      'Двенадцать изолированных мест вдоль неоновой стены для тех, кто считает каждый кадр. Максимальное железо, кастомная периферия, идеальная тишина и никого за спиной.',
    image: 'images/zal1.jpg',
    mobileImage: 'images/zal1-mob.jpg',
    price: 250,
    numberPos: 'bottom-right',
    offsetLeft: '0',
    glowPos: { x: 68, y: 24 },
    wipeType: 'diagonal-right',
    specs: [
      { text: 'RTX 4090 · i9-14900K' },
      { countTarget: 360, suffix: ' ГЦ OLED' },
      { countTarget: 12, suffix: ' МЕСТ' },
    ],
  },
  {
    id: 2,
    code: '02',
    name: 'Standard',
    badge: 'Основной зал',
    description:
      'Просторный двухрядный зал для ежедневных каток и командных тренировок: стабильные 240+ FPS во всех соревновательных дисциплинах, эргономичные кресла и быстрый отклик.',
    image: 'images/zal2.jpg',
    mobileImage: 'images/zal2-mob.jpg',
    price: 150,
    numberPos: 'top-right',
    offsetLeft: '3vw',
    glowPos: { x: 22, y: 58 },
    wipeType: 'diagonal-bottom',
    specs: [
      { text: 'RTX 4080 · i7-14700K' },
      { countTarget: 240, suffix: ' ГЦ IPS' },
      { countTarget: 24, suffix: ' МЕСТА' },
    ],
  },
  {
    id: 3,
    code: '03',
    name: 'VR Arena',
    badge: 'Полное погружение',
    description:
      'Выделенный полигон свободного перемещения без проводов и препятствий: беспроводные шлемы Quest 3 и Valve Index, точный трекинг в масштабе комнаты и кооператив до 4 игроков.',
    image: 'images/zal3.jpg',
    mobileImage: 'images/zal3-mob.jpg',
    price: 300,
    numberPos: 'bottom-left',
    offsetLeft: '5vw',
    glowPos: { x: 74, y: 66 },
    wipeType: 'diagonal-left',
    specs: [
      { text: 'QUEST 3 · VALVE INDEX' },
      { countTarget: 120, suffix: ' ГЦ OPTICS' },
      { countTarget: 4, suffix: ' СЛОТА · 20 М²' },
    ],
  },
  {
    id: 4,
    code: '04',
    name: 'Console',
    badge: 'Приватный лаунж',
    description:
      'Закрытая лаунж-зона с глубокими угловыми диванами, приглушённым светом, 65-дюймовыми 4K OLED-панелями и библиотекой главных хитов на PS5 Pro и Xbox Series X.',
    image: 'images/zal4.jpg',
    mobileImage: 'images/zal4-mob.jpg',
    price: 200,
    numberPos: 'mid-right',
    offsetLeft: '0',
    glowPos: { x: 28, y: 30 },
    wipeType: 'diagonal-right',
    specs: [
      { text: 'PS5 PRO · SERIES X' },
      { countTarget: 65, suffix: '" 4K OLED' },
      { countTarget: 16, suffix: ' МЕСТ' },
    ],
  },
  {
    id: 5,
    code: '05',
    name: 'Arena Hall',
    badge: 'Киберспортивная сцена',
    description:
      'Большой турнирный амфитеатр с командной рассадкой 5×5, зрительскими рядами, огромным светодиодным экраном и выделенной аппаратной для проведения LAN-финалов.',
    image: 'images/zal5.jpg',
    mobileImage: 'images/zal5-mob.jpg',
    price: 200,
    numberPos: 'top-right',
    offsetLeft: '4vw',
    glowPos: { x: 64, y: 34 },
    wipeType: 'diagonal-bottom',
    specs: [
      { text: 'RTX 4080 · СЦЕНА 5×5' },
      { countTarget: 360, suffix: ' ГЦ ZOWIE' },
      { countTarget: 20, suffix: ' МЕСТ + КАСТ' },
    ],
  },
  {
    id: 6,
    code: '06',
    name: 'Stream Lab',
    badge: 'Изолированная студия',
    description:
      'Акустически подготовленная комната эфира: двухмониторный сетап с вертикальным дисплеем чата, микрофон Shure на пантографе, микшер GoXLR, Stream Deck и ключевой свет.',
    image: 'images/zal6.jpg',
    mobileImage: 'images/zal6-mob.jpg',
    price: 350,
    numberPos: 'bottom-right',
    offsetLeft: '2vw',
    glowPos: { x: 42, y: 24 },
    wipeType: 'diagonal-left',
    specs: [
      { text: 'DUAL PC · GOXLR · ELGATO' },
      { countTarget: 240, suffix: ' ГЦ + 4K CAM' },
      { countTarget: 2, suffix: ' МЕСТА' },
    ],
  },
];

/**
 * Вычисляет аппаратно-ускоренный 4-точечный polygon clip-path для переходов между залами.
 * 4-вершинный polygon обрабатывается GPU-композитором без программной растеризации маски.
 */
function computeSceneClipPath(wipeType, localProgress) {
  const p = Math.max(0, Math.min(1, localProgress));
  if (p <= 0.002) {
    return 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';
  }
  if (p >= 0.998) {
    return 'none';
  }

  const slant = ZONES_CONFIG.animation.diagonalSlantPct;

  if (wipeType === 'diagonal-bottom') {
    const leftY = Math.max(0, Math.min(100, (1 - p) * (100 + slant)));
    const rightY = Math.max(0, Math.min(100, (1 - p) * (100 + slant) - slant));
    return `polygon(0% ${leftY.toFixed(1)}%, 100% ${rightY.toFixed(1)}%, 100% 100%, 0% 100%)`;
  }

  if (wipeType === 'diagonal-left') {
    const topRightX = Math.max(0, Math.min(100, p * (100 + slant)));
    const bottomRightX = Math.max(0, Math.min(100, p * (100 + slant) - slant));
    return `polygon(0% 0%, ${topRightX.toFixed(1)}% 0%, ${bottomRightX.toFixed(1)}% 100%, 0% 100%)`;
  }

  // Острая диагональная шторка справа-налево
  const topX = Math.max(0, Math.min(100, (1 - p) * (100 + slant)));
  const bottomX = Math.max(0, Math.min(100, (1 - p) * (100 + slant) - slant));
  return `polygon(${topX.toFixed(1)}% 0%, 100% 0%, 100% 100%, ${bottomX.toFixed(1)}% 100%)`;
}

const GamingZones = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const stageRef = useRef(null);
  const glowRef = useRef(null);
  const noiseRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorCircleRef = useRef(null);
  const cursorLabelRef = useRef(null);
  const counterCurrentRef = useRef(null);

  const sceneRefs = useRef([]);
  const photoRefs = useRef([]);
  const numberRefs = useRef([]);
  const segmentBtnRefs = useRef([]);
  const segmentFillRefs = useRef([]);
  const visibleCacheRef = useRef([]);
  const clipCacheRef = useRef([]);
  const txCacheRef = useRef([]);
  const animatedOnceRef = useRef(new Set());
  const scrollTriggerRef = useRef(null);
  const activeIdxRef = useRef(0);

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // ---------------------------------------------------------------------------
  // Прямое обновление кастомного курсора через DOM (0 ре-рендеров React)
  // ---------------------------------------------------------------------------
  const setCursorDOM = useCallback(({ visible, expanded, label }) => {
    const circleEl = cursorCircleRef.current;
    if (!circleEl) return;
    if (visible !== undefined) {
      circleEl.dataset.visible = visible ? 'true' : 'false';
    }
    if (expanded !== undefined) {
      circleEl.dataset.expanded = expanded ? 'true' : 'false';
    }
    if (label !== undefined && cursorLabelRef.current) {
      cursorLabelRef.current.textContent = label;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Однократная генерация лёгкого тайла кинематографичного зерна (только ПК)
  // и предварительное декодирование 6 фото залов для отсутствия фризов при скролле
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isMob = window.innerWidth < 768;

    // 1. Генерируем статический 128×128 тайл шума только на ПК
    if (!isMob && noiseRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const imgData = ctx.createImageData(128, 128);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        noiseRef.current.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
      }
    }

    // 2. На ПК заранее декодируем изображения залов в фоновом потоке;
    // на мобильных декодирование выполняют сами <img> с mobileImage без дублирования в памяти
    if (!isMob) {
      ZONES_SCENES.forEach((scene) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = scene.image;
        if (img.decode) {
          img.decode().catch(() => {});
        }
      });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Каскадное появление типографики только для первого зала (остальные открываются шторкой без мерцания)
  // ---------------------------------------------------------------------------
  const triggerFirstSceneEntrance = useCallback(() => {
    if (reducedMotion || animatedOnceRef.current.has(0)) return;
    const firstSceneEl = sceneRefs.current[0];
    if (!firstSceneEl) return;

    animatedOnceRef.current.add(0);

    const staggerItems = firstSceneEl.querySelectorAll('.scene-stagger');
    if (staggerItems.length > 0) {
      gsap.fromTo(
        staggerItems,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: ZONES_CONFIG.animation.staggerSec,
          ease: ZONES_CONFIG.animation.easeOut,
          overwrite: 'auto',
        }
      );
    }

    const countEls = firstSceneEl.querySelectorAll('[data-count-target]');
    countEls.forEach((el) => {
      const target = Number(el.getAttribute('data-count-target') || 0);
      const counterObj = { val: 0 };
      gsap.to(counterObj, {
        val: target,
        duration: ZONES_CONFIG.animation.counterDurationSec,
        ease: ZONES_CONFIG.animation.easeExpo,
        overwrite: 'auto',
        onUpdate: () => {
          el.textContent = String(Math.round(counterObj.val));
        },
      });
    });
  }, [reducedMotion]);

  // ---------------------------------------------------------------------------
  // Обновление активного индекса напрямую в DOM без вызова React re-render
  // ---------------------------------------------------------------------------
  const updateActiveHallDOM = useCallback((nextIdx) => {
    activeIdxRef.current = nextIdx;
    const scene = ZONES_SCENES[nextIdx] || ZONES_SCENES[0];

    if (counterCurrentRef.current) {
      counterCurrentRef.current.textContent = scene.code;
    }

    for (let i = 0; i < ZONES_SCENES.length; i++) {
      const btn = segmentBtnRefs.current[i];
      if (btn) {
        btn.setAttribute('aria-selected', i === nextIdx ? 'true' : 'false');
      }
      const sEl = sceneRefs.current[i];
      if (sEl) {
        sEl.dataset.active = i === nextIdx ? 'true' : 'false';
      }
    }
  }, []);

  useEffect(() => {
    if (reducedMotion || !stageRef.current) return undefined;
    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top 82%',
      once: true,
      onEnter: () => triggerFirstSceneEntrance(),
    });
    return () => st.kill();
  }, [reducedMotion, triggerFirstSceneEntrance]);

  // ---------------------------------------------------------------------------
  // Быстрое обновление шторок
  // На мобильных: слои постоянно живут в GPU-памяти (без переключения visibility hidden/visible,
  // которое вызывает выгрузку текстур и просадку до 10 FPS в мобильном Safari/Chrome).
  // ---------------------------------------------------------------------------
  const applyScrollProgress = useCallback((totalProgress) => {
    const count = ZONES_SCENES.length; // 6 залов
    const transitions = count - 1; // 5 непрерывных переходов
    const clampedP = Math.max(0, Math.min(1, totalProgress));

    // Непрерывное равномерное движение сцен (0..5) без «прилипаний» и мёртвых зон
    const continuous = clampedP * transitions;
    const baseIdx = Math.min(transitions - 1, Math.floor(continuous));
    const localWipeP = Math.max(0, Math.min(1, continuous - baseIdx));

    // Счётчик (01..06) и 6 полосок прогресса делят скролл на 6 равных глав (0..6) с гистерезисом
    const hudFloat = clampedP * count; // 0 .. 6
    const prevIdx = activeIdxRef.current;
    let activeIdx = prevIdx;
    if (hudFloat >= prevIdx + 1.06) {
      activeIdx = Math.min(transitions, Math.floor(hudFloat));
    } else if (hudFloat <= prevIdx - 0.06) {
      activeIdx = Math.max(0, Math.floor(hudFloat - 0.06));
    }
    if (activeIdx !== prevIdx) {
      updateActiveHallDOM(activeIdx);
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // 1. Сегменты прогресса (01..06): каждый из 6 сегментов плавно заполняется в своей 1/6 скролла
    for (let i = 0; i < count; i++) {
      const fillEl = segmentFillRefs.current[i];
      if (!fillEl) continue;
      let fill = 0;
      if (i < activeIdx) {
        fill = 1;
      } else if (i === activeIdx) {
        const segLocal = Math.max(0, Math.min(1, hudFloat - i));
        fill = Math.max(i === 0 ? 0.22 : 0.12, segLocal);
      }
      if (clampedP >= 0.99 && i === count - 1) {
        fill = 1;
      }
      fillEl.style.transform = `scaleX(${fill.toFixed(3)})`;
    }

    if (isMobile) {
      // На мобильных: плавный непрерывный свайп вверх с субпиксельной точностью (toFixed(2))
      for (let i = 0; i < count; i++) {
        const sceneEl = sceneRefs.current[i];
        if (!sceneEl) continue;

        if (visibleCacheRef.current[i] !== true) {
          visibleCacheRef.current[i] = true;
          sceneEl.style.visibility = 'visible';
        }
        if (clipCacheRef.current[i] !== 'none') {
          clipCacheRef.current[i] = 'none';
          sceneEl.style.clipPath = 'none';
        }

        let ty = 100;
        if (i < baseIdx) {
          ty = -18;
        } else if (i === baseIdx) {
          ty = -localWipeP * 18;
        } else if (i === baseIdx + 1) {
          ty = (1 - localWipeP) * 100;
        }

        const tyKey = ty.toFixed(2);
        if (txCacheRef.current[i] !== tyKey) {
          txCacheRef.current[i] = tyKey;
          sceneEl.style.transform = `translate3d(0, ${tyKey}%, 0)`;
        }
      }
      return continuous;
    }

    // 2. На десктопе: отсечение невидимых сцен + диагональный clip-path и внутренний параллакс
    for (let i = 0; i < count; i++) {
      const sceneEl = sceneRefs.current[i];
      if (!sceneEl) continue;

      const isBaseVisible = i === baseIdx && localWipeP < 0.998;
      const isIncomingVisible = i === baseIdx + 1 && localWipeP > 0.002;
      const shouldBeVisible = isBaseVisible || isIncomingVisible;

      if (visibleCacheRef.current[i] !== shouldBeVisible) {
        visibleCacheRef.current[i] = shouldBeVisible;
        sceneEl.style.visibility = shouldBeVisible ? 'visible' : 'hidden';
      }

      if (!shouldBeVisible) continue;

      if (txCacheRef.current[i] !== 'none') {
        txCacheRef.current[i] = 'none';
        sceneEl.style.transform = 'none';
      }

      const nextClip =
        i === baseIdx || localWipeP >= 0.998
          ? 'none'
          : computeSceneClipPath(ZONES_SCENES[i].wipeType, localWipeP);

      if (clipCacheRef.current[i] !== nextClip) {
        clipCacheRef.current[i] = nextClip;
        sceneEl.style.clipPath = nextClip;
      }

      // Параллакс фото и гигантского номера на десктопе
      const rel = continuous - i;
      const photoEl = photoRefs.current[i];
      if (photoEl) {
        const scale = 1.0 + Math.abs(rel) * 0.055;
        const shiftX = Math.max(-36, Math.min(36, -rel * 28));
        photoEl.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0) scale(${scale.toFixed(3)})`;
      }

      const numEl = numberRefs.current[i];
      if (numEl) {
        const numShiftX = Math.max(-75, Math.min(75, rel * 52));
        const numShiftY = Math.max(-32, Math.min(32, -rel * 22));
        numEl.style.transform = `translate3d(${numShiftX.toFixed(1)}px, ${numShiftY.toFixed(1)}px, 0)`;
      }
    }

    // 3. Дрейфующее салатовое свечение (только на десктопе)
    if (glowRef.current) {
      const posA = ZONES_SCENES[baseIdx].glowPos;
      const posB = ZONES_SCENES[baseIdx + 1].glowPos;
      const gx = posA.x + (posB.x - posA.x) * localWipeP;
      const gy = posA.y + (posB.y - posA.y) * localWipeP;
      glowRef.current.style.transform = `translate3d(${gx.toFixed(1)}vw, ${gy.toFixed(1)}vh, 0) translate(-50%, -50%)`;
    }
    return continuous;
  }, [updateActiveHallDOM]);

  // ---------------------------------------------------------------------------
  // Отслеживание prefers-reduced-motion
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // ---------------------------------------------------------------------------
  // Построчное появление заголовка при входе секции
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reducedMotion || !titleRef.current) return undefined;
    const lines = titleRef.current.querySelectorAll('.line-inner');
    if (!lines.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: 112, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: ZONES_CONFIG.animation.easeExpo,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // ---------------------------------------------------------------------------
  // Закрепление полноэкранной сцены (100vh) и смена залов
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reducedMotion) {
      for (let i = 0; i < ZONES_SCENES.length; i++) {
        const sEl = sceneRefs.current[i];
        if (sEl) {
          sEl.style.visibility = 'visible';
          sEl.style.clipPath = 'none';
          sEl.style.transform = 'none';
        }
      }
      return undefined;
    }

    applyScrollProgress(0);
    if (!stageRef.current) return undefined;

    const progressObj = { p: 0 };
    const isMobile = window.innerWidth < 768;
    const count = ZONES_SCENES.length;

    const tween = gsap.to(progressObj, {
      p: 1,
      ease: 'none',
      onUpdate: () => {
        applyScrollProgress(progressObj.p);
      },
      scrollTrigger: {
        trigger: stageRef.current,
        start: 'top top',
        end: () => {
          const perScene = window.innerWidth < 768 ? 64 : ZONES_CONFIG.animation.scrollVhPerScene;
          return `+=${(count - 1) * perScene}%`;
        },
        pin: stageRef.current,
        scrub: isMobile ? 0.55 : ZONES_CONFIG.animation.scrub,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    scrollTriggerRef.current = tween.scrollTrigger;

    return () => {
      scrollTriggerRef.current = null;
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [reducedMotion, applyScrollProgress]);

  const handleSegmentClick = (index) => {
    updateActiveHallDOM(index);
    const st = scrollTriggerRef.current;
    if (!st) return;
    const maxIdx = Math.max(1, ZONES_SCENES.length - 1);
    const targetProgress = Math.min(1, index / maxIdx);
    const targetScroll = st.start + (st.end - st.start) * targetProgress;
    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll);
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  return (
    <ZonesSection
      ref={sectionRef}
      id="zones"
      data-testid="section-zones"
      onPointerEnter={() => setCursorDOM({ visible: true })}
      onPointerLeave={() => setCursorDOM({ visible: false, expanded: false })}
    >
      {/* Кастомный курсор: салатовая точка, раскрывается над сценой и показывает "смотреть" */}
      <CustomCursorFollower ref={cursorRef} aria-hidden="true">
        <CursorCircle
          ref={cursorCircleRef}
          data-visible="false"
          data-expanded="false"
        >
          <span ref={cursorLabelRef}>смотреть</span>
        </CursorCircle>
      </CustomCursorFollower>

      {/* Асимметричный пролог секции */}
      <IntroBlock>
        <IntroLeft>
          <IntroKicker>
            <span>02</span> // ИГРОВЫЕ ПРОСТРАНСТВА
          </IntroKicker>
          <ZonesTitle ref={titleRef} data-testid="zones-title">
            <span className="line-mask">
              <span className="line-inner">
                <span className="neon-word">Шесть</span> залов —
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner">
                <span className="neon-word">шесть</span> <em>форматов</em>
              </span>
            </span>
          </ZonesTitle>
        </IntroLeft>

        <IntroNote>
          От казуального вечера с друзьями до квалификации на турнир. Цены — за час, без звёздочек.
        </IntroNote>
      </IntroBlock>

      {/* Полноэкранная сцена 100vh с диагональными clip-path шторками */}
      <FullscreenStage
        ref={stageRef}
        $reducedMotion={reducedMotion}
        onPointerEnter={() =>
          setCursorDOM({ visible: true, expanded: true, label: 'смотреть' })
        }
        onPointerLeave={() => setCursorDOM({ expanded: false })}
      >
        {/* Дрейфующее салатовое свечение (своя точка у каждого зала) */}
        <AmbientDriftGlow ref={glowRef} aria-hidden="true" />

        {/* Статический тайл кинематографичного зерна (без нагрузки на GPU при скролле) */}
        <SvgNoiseOverlay ref={noiseRef} aria-hidden="true" />

        {/* Минималистичный счётчик 01 / 06 + 6 штрихов прогресса поверх кадра */}
        <StageTopHud>
          <CounterReadout aria-live="polite" data-testid="zones-counter">
            <span className="current" ref={counterCurrentRef}>
              01
            </span>
            <span className="slash">/</span>
            <span className="total">06</span>
          </CounterReadout>

          <MinimalSegments role="tablist" aria-label="Выбор зала">
            {ZONES_SCENES.map((scene, idx) => (
              <SegmentTick
                key={scene.id}
                ref={(el) => {
                  segmentBtnRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                aria-selected={idx === 0}
                aria-label={`Зал ${scene.code}: ${scene.name}`}
                onClick={() => handleSegmentClick(idx)}
                onPointerEnter={() =>
                  setCursorDOM({
                    visible: true,
                    expanded: false,
                    label: scene.code,
                  })
                }
                onPointerLeave={() =>
                  setCursorDOM({
                    visible: true,
                    expanded: true,
                    label: 'смотреть',
                  })
                }
              >
                <SegmentTickFill
                  ref={(el) => {
                    segmentFillRefs.current[idx] = el;
                  }}
                  $fill={idx === 0 ? 1 : 0}
                />
              </SegmentTick>
            ))}
          </MinimalSegments>
        </StageTopHud>

        {/* 6 полноэкранных залов, раскрывающихся друг поверх друга через clip-path */}
        {ZONES_SCENES.map((scene, idx) => (
          <HallSceneLayer
            key={scene.id}
            ref={(el) => {
              sceneRefs.current[idx] = el;
            }}
            data-testid={`zone-card-${scene.id}`}
            data-active={idx === 0 ? 'true' : 'false'}
            $index={idx}
            $reducedMotion={reducedMotion}
          >
            {/* Полноэкранное фото зала с параллаксом */}
            <HallPhotoBg
              ref={(el) => {
                photoRefs.current[idx] = el;
              }}
            >
              <img
                src={scene.mobileImage}
                srcSet={`${scene.mobileImage} 840w, ${scene.image} 1672w`}
                sizes="(max-width: 767px) 240px, 100vw"
                alt={scene.name}
                loading="eager"
                decoding="async"
              />
            </HallPhotoBg>

            {/* Огромный контурный номер до 38vw, выходящий за край экрана */}
            <GiantBleedNumber
              ref={(el) => {
                numberRefs.current[idx] = el;
              }}
              $pos={scene.numberPos}
              aria-hidden="true"
            >
              {scene.code}
            </GiantBleedNumber>

            {/* Асимметричная типографика поверх кадра с широким описанием зала */}
            <HallContentLayout>
              <HallEditorialGroup $offsetLeft={scene.offsetLeft}>
                <HallFormatKicker className="scene-stagger">
                  /{scene.code} — {scene.badge}
                </HallFormatKicker>

                <HallMassiveTitle className="scene-stagger">
                  {scene.name}
                </HallMassiveTitle>

                <HallDescription className="scene-stagger">
                  {scene.description}
                </HallDescription>

                <HallBottomRow className="scene-stagger">
                  <HallMetaRight>
                    {/* Характеристики строкой текста через разделитель (без плашек) */}
                    <HallSpecsString>
                      {scene.specs.map((spec, sIdx) => (
                        <span key={sIdx} className="spec-item">
                          {spec.countTarget !== undefined ? (
                            <>
                              <span
                                className="spec-num"
                                data-count-target={spec.countTarget}
                              >
                                {spec.countTarget}
                              </span>
                              {spec.suffix}
                            </>
                          ) : (
                            spec.text
                          )}
                          {sIdx < scene.specs.length - 1 && (
                            <span className="spec-sep">/</span>
                          )}
                        </span>
                      ))}
                    </HallSpecsString>

                    <HallActionGroup>
                      <HallTariffText>
                        от <strong>{scene.price}</strong> ₽/ч
                      </HallTariffText>

                      <HallBookLink
                        href="#contact"
                        aria-label={`Забронировать ${scene.name}`}
                        onPointerEnter={() =>
                          setCursorDOM({
                            visible: true,
                            expanded: true,
                            label: 'бронь ↗',
                          })
                        }
                        onPointerLeave={() =>
                          setCursorDOM({
                            visible: true,
                            expanded: true,
                            label: 'смотреть',
                          })
                        }
                      >
                        <span>Забронировать</span>
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M3.5 12.5L12.5 3.5M12.5 3.5H5.5M12.5 3.5V10.5"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="square"
                          />
                        </svg>
                      </HallBookLink>
                    </HallActionGroup>
                  </HallMetaRight>
                </HallBottomRow>
              </HallEditorialGroup>
            </HallContentLayout>
          </HallSceneLayer>
        ))}
      </FullscreenStage>
    </ZonesSection>
  );
};

export default GamingZones;
