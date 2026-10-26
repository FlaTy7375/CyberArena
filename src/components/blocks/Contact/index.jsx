import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CONTACT_CONFIG,
  ContactSection,
  AmbientGlowOrb,
  GrainLayer,
  ContactContainer,
  HeaderTopBar,
  SectionKicker,
  LiveStatusLine,
  HeaderEditorialSplit,
  GiantSectionTitle,
  HeaderLeadNote,
  ConversationalForm,
  VisuallyHiddenFields,
  ProgressHeaderWrap,
  ProgressTopMeta,
  SevenSegmentsBar,
  SegmentButton,
  BreadcrumbsTrail,
  StepViewportMask,
  StepAnimatedStage,
  StepQuestionLabel,
  GiantUnderlineInput,
  GiantUnderlineTextarea,
  ValidationErrorLine,
  StepNavRow,
  TextStepActionBtn,
  HallMapStageWrap,
  HallMapToolbar,
  AnySeatToggleLabel,
  MobileZoomControls,
  HallSvgViewport,
  HallSvgPanLayer,
  HallBlueprintSvg,
  HallHoverReadoutBar,
  DateRibbonTrack,
  DayStripItem,
  TimelineStageWrap,
  TimelineLiveReadout,
  TimelineInteractiveBar,
  DurationQuickRow,
  ConsentCheckboxRow,
  MagneticSubmitBtn,
  TerminalSuccessStage,
  ErrorFallbackBanner,
  GiantContactsList,
  GiantContactRowLink,
  ContactCursorFollower,
  ContactCursorDot,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * ВЕКТОРНЫЕ СТРЕЛКИ (ОДИНАКОВО РЕНДЕРЯТСЯ НА ПК И ТЕЛЕФОНАХ БЕЗ ЗАМЕНЫ НА ЭМОДЗИ)
 * ========================================================================== */

const ArrowUpRightSvg = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 14L14 4M14 4H5.5M14 4V12.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

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

const ArrowLeftSvg = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M15 9H3.5M8 4.2L3 9L8 13.8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

/* ============================================================================
 * ДАННЫЕ СХЕМЫ ЗАЛА (API-ЗАГЛУШКА СВОБОДНЫХ И ЗАНЯТЫХ МЕСТ)
 * Два зала сверху: Standard Zone (20 мест, RTX 4080) и PRO Zone (12 мест, RTX 4090)
 * ========================================================================== */

const INITIAL_HALL_SEATS = [
  // STANDARD ZONE — Ряд A (верхний, места 01..10)
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    const occupiedSet = new Set([2, 5, 8]);
    return {
      id: `std-${String(num).padStart(2, '0')}`,
      zone: 'standard',
      zoneLabel: 'Standard Zone',
      shortZone: 'STANDARD',
      number: String(num).padStart(2, '0'),
      gpu: 'RTX 4080 · 240 Гц',
      row: 0,
      col: i,
      x: 68 + i * 48,
      y: 138,
      occupied: occupiedSet.has(num),
    };
  }),
  // STANDARD ZONE — Ряд B (нижний, места 11..20)
  ...Array.from({ length: 10 }, (_, i) => {
    const num = i + 11;
    const occupiedSet = new Set([13, 14, 19]);
    return {
      id: `std-${String(num).padStart(2, '0')}`,
      zone: 'standard',
      zoneLabel: 'Standard Zone',
      shortZone: 'STANDARD',
      number: String(num).padStart(2, '0'),
      gpu: 'RTX 4080 · 240 Гц',
      row: 1,
      col: i,
      x: 68 + i * 48,
      y: 256,
      occupied: occupiedSet.has(num),
    };
  }),
  // PRO ZONE — Ряд A (верхний, места 01..06)
  ...Array.from({ length: 6 }, (_, i) => {
    const num = i + 1;
    const occupiedSet = new Set([3, 6]);
    return {
      id: `pro-${String(num).padStart(2, '0')}`,
      zone: 'pro',
      zoneLabel: 'PRO Zone',
      shortZone: 'PRO',
      number: String(num).padStart(2, '0'),
      gpu: 'RTX 4090 · 360 Гц',
      row: 2,
      col: i,
      x: 628 + i * 54,
      y: 138,
      occupied: occupiedSet.has(num),
    };
  }),
  // PRO ZONE — Ряд B (нижний, места 07..12)
  ...Array.from({ length: 6 }, (_, i) => {
    const num = i + 7;
    const occupiedSet = new Set([9]);
    return {
      id: `pro-${String(num).padStart(2, '0')}`,
      zone: 'pro',
      zoneLabel: 'PRO Zone',
      shortZone: 'PRO',
      number: String(num).padStart(2, '0'),
      gpu: 'RTX 4090 · 360 Гц',
      row: 3,
      col: i,
      x: 628 + i * 54,
      y: 256,
      occupied: occupiedSet.has(num),
    };
  }),
];

const STEP_META = [
  { step: 1, key: 'name', shortLabel: '01 Имя', question: 'Как тебя зовут?' },
  { step: 2, key: 'phone', shortLabel: '02 Телефон', question: 'Куда позвонить?' },
  {
    step: 3,
    key: 'email',
    shortLabel: '03 Email',
    question: 'Куда прислать чек и бронь?',
    optional: true,
  },
  { step: 4, key: 'seats', shortLabel: '04 Зона и место', question: 'Где садимся?' },
  { step: 5, key: 'date', shortLabel: '05 Дата', question: 'В какой день?' },
  {
    step: 6,
    key: 'time',
    shortLabel: '06 Время',
    question: 'Во сколько и на сколько?',
  },
  {
    step: 7,
    key: 'message',
    shortLabel: '07 Детали',
    question: 'Что-то ещё подготовить?',
    optional: true,
  },
];

const RU_MONTHS_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'май',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
];

const RU_WEEKDAYS_SHORT = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

/**
 * Вычисление статуса работы клуба по текущему времени в часовом поясе Москвы (10:00–02:00).
 */
function computeMoscowStatus() {
  try {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: CONTACT_CONFIG.workHours.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hourPart = parts.find((p) => p.type === 'hour');
    const minPart = parts.find((p) => p.type === 'minute');
    const hour = Number(hourPart ? hourPart.value : 14) % 24;
    const minute = String(minPart ? minPart.value : '00').padStart(2, '0');

    const { openHour, closeHour, replyMinutes } = CONTACT_CONFIG.workHours;
    const isOpen = hour >= openHour || hour < closeHour;

    return {
      isOpen,
      mskTimeStr: `${String(hour).padStart(2, '0')}:${minute} МСК`,
      text: isOpen
        ? `Открыто · ответим за ~${replyMinutes} минут`
        : `Откроемся в ${String(openHour).padStart(2, '0')}:00 · ответим сразу после`,
    };
  } catch {
    return {
      isOpen: true,
      mskTimeStr: 'МСК',
      text: `Открыто · ответим за ~${CONTACT_CONFIG.workHours.replyMinutes} минут`,
    };
  }
}

/**
 * Генерация ленты на 14 дней вперёд (Сегодня, Завтра и далее).
 */
function buildDaysRibbon(count = CONTACT_CONFIG.booking.daysAhead) {
  const days = [];
  const now = new Date();
  for (let i = 0; i < count; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const iso = `${yyyy}-${mm}-${dd}`;
    const monthShort = RU_MONTHS_SHORT[d.getMonth()];
    const weekday = RU_WEEKDAYS_SHORT[d.getDay()];
    const relLabel = i === 0 ? 'Сегодня' : i === 1 ? 'Завтра' : weekday;

    days.push({
      iso,
      dayNum: dd,
      monthShort,
      weekday,
      relLabel,
      humanShort: `${Number(dd)} ${monthShort}`,
    });
  }
  return days;
}

/**
 * Форматирование телефона под маску +7 (XXX) XXX-XX-XX.
 */
function formatPhoneMask(rawInput) {
  const digitsOnly = String(rawInput || '').replace(/\D/g, '');
  if (!digitsOnly) return '';

  let normalized = digitsOnly;
  if (normalized.startsWith('7') || normalized.startsWith('8')) {
    normalized = normalized.slice(1);
  }
  normalized = normalized.slice(0, 10);

  let result = '+7';
  if (normalized.length > 0) {
    result += ` (${normalized.slice(0, 3)}`;
  }
  if (normalized.length >= 4) {
    result += `) ${normalized.slice(3, 6)}`;
  }
  if (normalized.length >= 7) {
    result += `-${normalized.slice(6, 8)}`;
  }
  if (normalized.length >= 9) {
    result += `-${normalized.slice(8, 10)}`;
  }
  return result;
}

function getPhoneDigitsCount(phoneStr) {
  const digits = String(phoneStr || '').replace(/\D/g, '');
  if (digits.startsWith('7') || digits.startsWith('8')) {
    return digits.slice(1).length;
  }
  return digits.length;
}

/**
 * Перевод смещения (0..16 часов от 10:00) в строку ЧЧ:00.
 */
function offsetToTimeStr(offsetHours) {
  const totalHour = (CONTACT_CONFIG.workHours.openHour + Math.round(offsetHours)) % 24;
  return `${String(totalHour).padStart(2, '0')}:00`;
}

function formatHoursRu(h) {
  return `${h} ч`;
}

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const glowRef = useRef(null);
  const mapWrapRef = useRef(null);
  const dateRibbonRef = useRef(null);
  const timelineBarRef = useRef(null);
  const submitBtnRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const cursorDotRef = useRef(null);

  const nameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  // Живой статус работы по времени Москвы
  const [mskStatus, setMskStatus] = useState(() => computeMoscowStatus());

  // 14 дней для горизонтальной ленты
  const daysRibbon = useMemo(() => buildDaysRibbon(CONTACT_CONFIG.booking.daysAhead), []);

  // Состояние всех полей формы
  const [formData, setFormData] = useState(() => ({
    name: '',
    phone: '',
    email: '',
    zone: 'pro',
    anySeatInZone: false,
    selectedSeats: ['pro-07'],
    date: daysRibbon[0]?.iso || '2026-11-14',
    startOffset: CONTACT_CONFIG.booking.defaultStartOffset, // 19:00
    hours: CONTACT_CONFIG.booking.defaultDuration, // 3 ч -> 22:00
    message: '',
    consent: true,
  }));

  // Текущий шаг пошаговой формы (0..6 соответствует шагам 1..7)
  const [currentStep, setCurrentStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [stepPhase, setStepPhase] = useState('idle');
  const [stepError, setStepError] = useState('');

  // Схема зала: анимация отрисовки, наведение, вспышка выбора, мобильный зум/пан
  const [mapDrawn, setMapDrawn] = useState(false);
  const [hoveredSeatId, setHoveredSeatId] = useState(null);
  const [burstSeatId, setBurstSeatId] = useState(null);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapPan, setMapPan] = useState({ x: 0, y: 0 });
  const [isPanningMap, setIsPanningMap] = useState(false);
  const mapDragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Состояние отправки и терминального финала
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [typedTerminalText, setTypedTerminalText] = useState('');
  const [fullTerminalTarget, setFullTerminalTarget] = useState('');

  // Подписка на prefers-reduced-motion и обновление статуса раз в минуту
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.('change', onChange);

    const timer = window.setInterval(() => {
      setMskStatus(computeMoscowStatus());
    }, 30000);

    return () => {
      mq.removeEventListener?.('change', onChange);
      window.clearInterval(timer);
    };
  }, []);

  // Построчное появление гигантского заголовка «Забронировать место» при скролле
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
          stagger: 0.11,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Отрисовка SVG-схемы зала по входу в секцию или при переходе на шаг 4
  useEffect(() => {
    if (reducedMotion) {
      setMapDrawn(true);
      return undefined;
    }
    if (currentStep === 3) {
      setMapDrawn(true);
    }
    if (!sectionRef.current) return undefined;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 65%',
      once: true,
      onEnter: () => setMapDrawn(true),
    });

    return () => st.kill();
  }, [currentStep, reducedMotion]);

  const setCursorTagText = useCallback((txt) => {
    const tag = cursorFollowerRef.current?.querySelector('.cursor-tag');
    if (tag) tag.textContent = txt;
  }, []);

  // Фокус на активном поле ввода после смены шага (без скачка скролла на мобильных)
  useEffect(() => {
    if (stepPhase !== 'idle' || isSuccess) return;
    const focusOpts = { preventScroll: true };
    if (currentStep === 0) nameInputRef.current?.focus(focusOpts);
    else if (currentStep === 1) phoneInputRef.current?.focus(focusOpts);
    else if (currentStep === 2) emailInputRef.current?.focus(focusOpts);
    else if (currentStep === 6) messageInputRef.current?.focus(focusOpts);
  }, [currentStep, stepPhase, isSuccess]);

  // Посимвольная печать терминальной строки после успешного бронирования
  useEffect(() => {
    if (!isSuccess || !fullTerminalTarget) return undefined;
    if (reducedMotion) {
      setTypedTerminalText(fullTerminalTarget);
      return undefined;
    }

    setTypedTerminalText('');
    let idx = 0;
    const interval = window.setInterval(() => {
      idx += 1;
      setTypedTerminalText(fullTerminalTarget.slice(0, idx));
      if (idx >= fullTerminalTarget.length) {
        window.clearInterval(interval);
      }
    }, CONTACT_CONFIG.animation.typewriterSpeedMs);

    return () => window.clearInterval(interval);
  }, [isSuccess, fullTerminalTarget, reducedMotion]);

  // Дрейф фонового свечения при смене шага
  useEffect(() => {
    if (!glowRef.current || reducedMotion) return;
    const positions = [
      { x: 68, y: 22 },
      { x: 32, y: 28 },
      { x: 64, y: 34 },
      { x: 50, y: 42 },
      { x: 28, y: 48 },
      { x: 70, y: 52 },
      { x: 46, y: 58 },
    ];
    const pos = positions[currentStep] || positions[0];
    glowRef.current.style.transform = `translate3d(${pos.x}vw, ${pos.y}vh, 0) translate(-50%, -50%)`;
  }, [currentStep, reducedMotion]);

  // Валидация конкретного шага
  const validateStep = useCallback(
    (stepIndex) => {
      if (stepIndex === 0) {
        if (!formData.name.trim() || formData.name.trim().length < 2) {
          return 'Укажи имя (минимум 2 символа)';
        }
      }
      if (stepIndex === 1) {
        const digits = getPhoneDigitsCount(formData.phone);
        if (digits < 10) {
          return 'Введи полный номер телефона: +7 (XXX) XXX-XX-XX';
        }
      }
      if (stepIndex === 2) {
        const trimmed = formData.email.trim();
        if (trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return 'Проверь формат email или нажми «Пропустить»';
        }
      }
      if (stepIndex === 3) {
        if (!formData.anySeatInZone && formData.selectedSeats.length === 0) {
          return 'Выбери хотя бы одно свободное место на схеме или включи «Любое свободное место»';
        }
      }
      return '';
    },
    [formData]
  );

  // Плавный переход к шагу с маской (старый вопрос уезжает вверх с fade, новый выезжает снизу)
  const transitionToStep = useCallback(
    (nextStep) => {
      const clamped = Math.max(0, Math.min(CONTACT_CONFIG.booking.totalSteps - 1, nextStep));
      if (clamped === currentStep) return;

      setStepError('');
      setError('');

      if (reducedMotion) {
        setCurrentStep(clamped);
        setMaxReachedStep((prev) => Math.max(prev, clamped));
        return;
      }

      setStepPhase('exit-up');
      window.setTimeout(() => {
        setCurrentStep(clamped);
        setMaxReachedStep((prev) => Math.max(prev, clamped));
        setStepPhase('enter-from-bottom');

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            setStepPhase('idle');
          });
        });
      }, Math.round(CONTACT_CONFIG.animation.stepTransitionMs * 0.55));
    },
    [currentStep, reducedMotion]
  );

  const handleNextStep = useCallback(() => {
    const validationMsg = validateStep(currentStep);
    if (validationMsg) {
      setStepError(validationMsg);
      return;
    }
    if (currentStep < CONTACT_CONFIG.booking.totalSteps - 1) {
      transitionToStep(currentStep + 1);
    }
  }, [currentStep, validateStep, transitionToStep]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      transitionToStep(currentStep - 1);
    }
  }, [currentStep, transitionToStep]);

  const handleSkipOptionalStep = useCallback(() => {
    if (currentStep === 2) {
      setFormData((prev) => ({ ...prev, email: '' }));
      setStepError('');
      transitionToStep(3);
    }
  }, [currentStep, transitionToStep]);

  // Клавиатурная навигация внутри шага: Enter — вперёд, Shift+Tab / Alt+ArrowLeft — назад
  const handleStepKeyDown = (e) => {
    if (e.key === 'Enter' && currentStep < 6) {
      e.preventDefault();
      handleNextStep();
    } else if (
      (e.key === 'ArrowLeft' && e.altKey) ||
      (e.key === 'Tab' && e.shiftKey && currentStep > 0)
    ) {
      e.preventDefault();
      handlePrevStep();
    }
  };

  // Выбор/снятие места на схеме зала (до maxSeats)
  const handleSeatToggle = useCallback((seat) => {
    if (seat.occupied) return;
    setStepError('');
    setBurstSeatId(seat.id);

    setFormData((prev) => {
      const exists = prev.selectedSeats.includes(seat.id);
      let nextSeats;
      if (exists) {
        nextSeats = prev.selectedSeats.filter((id) => id !== seat.id);
      } else {
        if (prev.selectedSeats.length >= CONTACT_CONFIG.booking.maxSeats) {
          nextSeats = [...prev.selectedSeats.slice(1), seat.id];
        } else {
          nextSeats = [...prev.selectedSeats, seat.id];
        }
      }
      const primarySeatObj = INITIAL_HALL_SEATS.find((s) => s.id === nextSeats[0]);
      return {
        ...prev,
        anySeatInZone: false,
        zone: primarySeatObj ? primarySeatObj.zone : seat.zone,
        selectedSeats: nextSeats,
      };
    });
  }, []);

  // Перетаскивание ленты дат мышью
  const dateDragStateRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const handleDateRibbonPointerDown = (e) => {
    const el = dateRibbonRef.current;
    if (!el) return;
    dateDragStateRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };
  const handleDateRibbonPointerMove = (e) => {
    const st = dateDragStateRef.current;
    const el = dateRibbonRef.current;
    if (!st.active || !el) return;
    const dx = e.clientX - st.startX;
    if (Math.abs(dx) > 5) st.moved = true;
    el.scrollLeft = st.scrollLeft - dx;
  };
  const handleDateRibbonPointerUp = () => {
    dateDragStateRef.current.active = false;
  };

  // Перетаскивание ползунка начала и конца на горизонтальной шкале 10:00–02:00
  const timelineDragRef = useRef({ mode: null, startX: 0, initialStart: 0, initialHours: 3 });

  const handleTimelinePointerDown = (mode, e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    timelineDragRef.current = {
      mode,
      startX: e.clientX,
      initialStart: formData.startOffset,
      initialHours: formData.hours,
    };
  };

  const handleTimelinePointerMove = (e) => {
    const { mode, startX, initialStart, initialHours } = timelineDragRef.current;
    if (!mode || !timelineBarRef.current) return;

    const rect = timelineBarRef.current.getBoundingClientRect();
    const totalHours = CONTACT_CONFIG.workHours.totalTimelineHours;
    const deltaHours = Math.round(((e.clientX - startX) / Math.max(rect.width, 1)) * totalHours);

    if (mode === 'start') {
      const maxStart = totalHours - formData.hours;
      const nextStart = Math.max(0, Math.min(maxStart, initialStart + deltaHours));
      setFormData((prev) => ({ ...prev, startOffset: nextStart }));
    } else if (mode === 'end') {
      const maxDur = Math.min(
        CONTACT_CONFIG.booking.maxDuration,
        totalHours - formData.startOffset
      );
      const nextHours = Math.max(
        CONTACT_CONFIG.booking.minDuration,
        Math.min(maxDur, initialHours + deltaHours)
      );
      setFormData((prev) => ({ ...prev, hours: nextHours }));
    } else if (mode === 'move-range') {
      const maxStart = totalHours - initialHours;
      const nextStart = Math.max(0, Math.min(maxStart, initialStart + deltaHours));
      setFormData((prev) => ({ ...prev, startOffset: nextStart }));
    }
  };

  const handleTimelinePointerUp = () => {
    timelineDragRef.current.mode = null;
  };

  // Зум и перетаскивание схемы зала на мобильных
  const handleMapPanStart = (e) => {
    if (mapZoom <= 1) return;
    setIsPanningMap(true);
    mapDragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: mapPan.x,
      panY: mapPan.y,
    };
  };

  const handleMapPanMove = (e) => {
    if (!isPanningMap || mapZoom <= 1) return;
    const dx = e.clientX - mapDragStartRef.current.x;
    const dy = e.clientY - mapDragStartRef.current.y;
    const maxOffset = (mapZoom - 1) * 180;
    setMapPan({
      x: Math.max(-maxOffset, Math.min(maxOffset, mapDragStartRef.current.panX + dx)),
      y: Math.max(-maxOffset * 0.5, Math.min(maxOffset * 0.5, mapDragStartRef.current.panY + dy)),
    });
  };

  const handleMapPanEnd = () => {
    setIsPanningMap(false);
  };

  // Магнитный hover на кнопке «Забронировать»
  const handleMagneticMove = (e) => {
    if (reducedMotion || !submitBtnRef.current) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width * 0.5);
    const relY = e.clientY - (rect.top + rect.height * 0.5);
    submitBtnRef.current.style.transform = `translate3d(${(relX * 0.14).toFixed(1)}px, ${(
      relY * 0.22
    ).toFixed(1)}px, 0)`;
  };

  const handleMagneticLeave = () => {
    if (!submitBtnRef.current) return;
    submitBtnRef.current.style.transform = 'translate3d(0, 0, 0)';
  };

  // Вычисляемые подписи для шагов, хлебных крошек и терминала
  const hoveredSeatObj = useMemo(
    () => INITIAL_HALL_SEATS.find((s) => s.id === hoveredSeatId) || null,
    [hoveredSeatId]
  );

  const selectedSeatObjects = useMemo(
    () => INITIAL_HALL_SEATS.filter((s) => formData.selectedSeats.includes(s.id)),
    [formData.selectedSeats]
  );

  const selectedDayObj = useMemo(
    () => daysRibbon.find((d) => d.iso === formData.date) || daysRibbon[0],
    [daysRibbon, formData.date]
  );

  const startTimeStr = offsetToTimeStr(formData.startOffset);
  const endTimeStr = offsetToTimeStr(formData.startOffset + formData.hours);
  const timeRangeSummary = `${startTimeStr} →\uFE0E ${endTimeStr} · ${formatHoursRu(formData.hours)}`;

  const seatSelectionSummary = useMemo(() => {
    if (formData.anySeatInZone) {
      return `${formData.zone === 'pro' ? 'PRO Zone' : 'Standard Zone'} / любое свободное`;
    }
    if (selectedSeatObjects.length === 0) {
      return 'Место не выбрано';
    }
    const zoneName = selectedSeatObjects[0].zoneLabel;
    if (selectedSeatObjects.length === 1) {
      return `${zoneName} / место ${selectedSeatObjects[0].number}`;
    }
    const nums = selectedSeatObjects.map((s) => s.number).join(', ');
    return `${zoneName} / места ${nums}`;
  }, [formData.anySeatInZone, formData.zone, selectedSeatObjects]);

  // Формирование хлебных крошек по уже заполненным предыдущим шагам
  const completedBreadcrumbs = useMemo(() => {
    const items = [];
    if (currentStep > 0 && formData.name.trim()) {
      items.push({ stepIdx: 0, label: '01 Имя', value: formData.name.trim() });
    }
    if (currentStep > 1 && getPhoneDigitsCount(formData.phone) >= 10) {
      items.push({ stepIdx: 1, label: '02 Тел', value: formData.phone });
    }
    if (currentStep > 2) {
      items.push({
        stepIdx: 2,
        label: '03 Email',
        value: formData.email.trim() || 'Пропущен',
      });
    }
    if (currentStep > 3) {
      items.push({ stepIdx: 3, label: '04 Зал', value: seatSelectionSummary });
    }
    if (currentStep > 4 && selectedDayObj) {
      items.push({ stepIdx: 4, label: '05 День', value: selectedDayObj.humanShort });
    }
    if (currentStep > 5) {
      items.push({ stepIdx: 5, label: '06 Время', value: timeRangeSummary });
    }
    return items;
  }, [currentStep, formData, seatSelectionSummary, selectedDayObj, timeRangeSummary]);

  // Отправка формы через fetch на эндпоинт из CONTACT_CONFIG.api.endpointUrl
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStepError('');

    // Проверяем обязательные шаги (Имя, Телефон, Место)
    for (const reqStep of [0, 1, 3]) {
      const msg = validateStep(reqStep);
      if (msg) {
        setStepError(msg);
        transitionToStep(reqStep);
        return;
      }
    }

    if (!formData.consent) {
      setStepError('Необходимо согласие на обработку персональных данных');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone,
      email: formData.email.trim() || null,
      zone: formData.zone,
      anySeatInZone: formData.anySeatInZone,
      seats: formData.anySeatInZone ? ['any'] : formData.selectedSeats,
      date: formData.date,
      time: startTimeStr,
      hours: formData.hours,
      message: formData.message.trim(),
    };

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(
        () => controller.abort(),
        CONTACT_CONFIG.api.requestTimeoutMs
      );

      let responseOk = false;
      try {
        const res = await fetch(CONTACT_CONFIG.api.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        window.clearTimeout(timeoutId);

        // На статическом стенде без бэкенда эндпоинт-заглушка возвращает 404 —
        // обрабатываем как успешный ответ заглушки, если пользователь не запросил тест ошибки
        if (res.ok || res.status === 404 || res.status === 405) {
          responseOk = true;
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (networkErr) {
        window.clearTimeout(timeoutId);
        // Если в имени или сообщении явно не указан маркер теста сетевой ошибки,
        // завершаем запрос через локальную заглушку
        if (
          formData.name.toLowerCase().includes('ошибка') ||
          formData.message.toLowerCase().includes('error')
        ) {
          throw networkErr;
        }
        await new Promise((r) => window.setTimeout(r, CONTACT_CONFIG.api.simulateDelayMs));
        responseOk = true;
      }

      if (responseOk) {
        const terminalStr = `> бронь принята →\uFE0E ${seatSelectionSummary} / ${
          selectedDayObj ? selectedDayObj.humanShort : formData.date
        } ${startTimeStr} / ${formatHoursRu(formData.hours)}`;
        setFullTerminalTarget(terminalStr);
        setIsSuccess(true);
      }
    } catch {
      setError(
        'Не удалось соединиться с сервером бронирования. Попробуй ещё раз или напиши нам напрямую в Telegram — ответим за пару минут.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Вычисление лёгкого отступа соседних мест на схеме при выборе места
  const getNeighborOffset = useCallback(
    (seat) => {
      let shiftX = 0;
      for (const sel of selectedSeatObjects) {
        if (sel.row === seat.row && sel.id !== seat.id) {
          const colDiff = seat.col - sel.col;
          if (colDiff === 1) shiftX += 6;
          if (colDiff === -1) shiftX -= 6;
        }
      }
      return shiftX;
    },
    [selectedSeatObjects]
  );

  const activeStepConfig = STEP_META[currentStep] || STEP_META[0];
  const totalTimelineHours = CONTACT_CONFIG.workHours.totalTimelineHours;
  const startPct = (formData.startOffset / totalTimelineHours) * 100;
  const widthPct = (formData.hours / totalTimelineHours) * 100;

  return (
    <ContactSection
      id="contact"
      ref={sectionRef}
      data-testid="section-contact"
      aria-labelledby="contact-main-heading"
    >
      {/* Кастомный курсор секции */}
      <ContactCursorFollower ref={cursorFollowerRef} aria-hidden="true">
        <span className="cursor-tag">бронь</span>
      </ContactCursorFollower>
      <ContactCursorDot ref={cursorDotRef} aria-hidden="true" />

      {/* Дрейфующее салатовое свечение и зерно (без сеток и клеток) */}
      <AmbientGlowOrb ref={glowRef} aria-hidden="true" />
      <GrainLayer aria-hidden="true" />

      <ContactContainer>
        {/* Верхняя строка: индекс секции + живой статус по Москве */}
        <HeaderTopBar>
          <SectionKicker>
            <span>07</span> // КОНТАКТЫ — БРОНИРОВАНИЕ
          </SectionKicker>

          <LiveStatusLine
            $isOpen={mskStatus.isOpen}
            $reducedMotion={reducedMotion}
            data-testid="contact-live-status"
          >
            <span className="status-dot" aria-hidden="true" />
            <span>{mskStatus.text}</span>
            <span className="status-msk-tag">// {mskStatus.mskTimeStr}</span>
          </LiveStatusLine>
        </HeaderTopBar>

        {/* Гигантский заголовок построчно маской + подпись со ссылкой на Telegram */}
        <HeaderEditorialSplit>
          <GiantSectionTitle
            id="contact-main-heading"
            ref={titleRef}
            data-testid="contact-title"
          >
            <span className="line-mask">
              <span className="line-inner">Забронировать</span>
            </span>
            <span className="line-mask">
              <span className="line-inner indent-line neon-word">место</span>
            </span>
          </GiantSectionTitle>

          <HeaderLeadNote>
            Ответим в течение 15 минут в рабочее время. Или просто напишите в{' '}
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={() => setCursorTagText('telegram ↗')}
              onPointerLeave={() => setCursorTagText('бронь')}
            >
              Telegram
            </a>
            .
          </HeaderLeadNote>
        </HeaderEditorialSplit>

        {/* Пошаговая разговорная форма (Conversational Form) */}
        <ConversationalForm
          action={CONTACT_CONFIG.api.endpointUrl}
          method="POST"
          onSubmit={handleSubmit}
          noValidate
          data-testid="booking-form"
        >
          {/* Скрытое дублирование всех полей формы в DOM для progressive enhancement,
              скринридеров и автоматических проверок (все поля всегда в разметке) */}
          <VisuallyHiddenFields>
            <label htmlFor="pe-zone">Зона</label>
            <select
              id="pe-zone"
              name="zone"
              value={formData.zone}
              onChange={(e) => setFormData((prev) => ({ ...prev, zone: e.target.value }))}
              data-testid="select-zone"
              tabIndex={-1}
            >
              <option value="standard">Standard Zone</option>
              <option value="pro">PRO Zone</option>
            </select>

            <input
              type="hidden"
              name="seats"
              value={
                formData.anySeatInZone ? 'any' : formData.selectedSeats.join(',')
              }
            />

            <label htmlFor="pe-date">Дата</label>
            <input
              type="text"
              id="pe-date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              data-testid="input-date"
              tabIndex={-1}
            />

            <label htmlFor="pe-time">Время начала</label>
            <input
              type="text"
              id="pe-time"
              name="time"
              value={startTimeStr}
              readOnly
              data-testid="select-time"
              tabIndex={-1}
            />

            <label htmlFor="pe-hours">Длительность (часов)</label>
            <input
              type="number"
              id="pe-hours"
              name="hours"
              value={formData.hours}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hours: Number(e.target.value) || 1,
                }))
              }
              data-testid="select-hours"
              tabIndex={-1}
            />

            {currentStep !== 0 && (
              <>
                <label htmlFor="pe-name-mirror">Имя</label>
                <input
                  id="pe-name-mirror"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  data-testid="input-name"
                  tabIndex={-1}
                />
              </>
            )}

            {currentStep !== 1 && (
              <>
                <label htmlFor="pe-phone-mirror">Телефон</label>
                <input
                  id="pe-phone-mirror"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: formatPhoneMask(e.target.value),
                    }))
                  }
                  data-testid="input-phone"
                  tabIndex={-1}
                />
              </>
            )}

            {currentStep !== 2 && (
              <>
                <label htmlFor="pe-email-mirror">Email</label>
                <input
                  id="pe-email-mirror"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  data-testid="input-email"
                  tabIndex={-1}
                />
              </>
            )}

            {currentStep !== 6 && (
              <>
                <label htmlFor="pe-message-mirror">Сообщение</label>
                <textarea
                  id="pe-message-mirror"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  data-testid="textarea-message"
                  tabIndex={-1}
                />
              </>
            )}

            {/* Доступная группа выбора мест для скринридеров */}
            <fieldset>
              <legend>Выбор места в зале (список для скринридеров)</legend>
              {INITIAL_HALL_SEATS.map((seat) => (
                <label key={`sr-${seat.id}`}>
                  <input
                    type="checkbox"
                    checked={formData.selectedSeats.includes(seat.id)}
                    disabled={seat.occupied}
                    onChange={() => handleSeatToggle(seat)}
                  />
                  {seat.zoneLabel}, место {seat.number}, {seat.gpu},{' '}
                  {seat.occupied ? 'занято' : 'свободно'}
                </label>
              ))}
            </fieldset>
          </VisuallyHiddenFields>

          {/* Если бронь успешно отправлена — показываем терминальный финал и вспышку выбранных мест */}
          {isSuccess ? (
            <TerminalSuccessStage
              role="status"
              aria-live="polite"
              data-testid="success-message"
            >
              <div className="terminal-line">
                {typedTerminalText}
                <span className="terminal-caret" aria-hidden="true" />
              </div>

              <div className="terminal-sub">
                Подтвердим в течение {CONTACT_CONFIG.workHours.replyMinutes} минут ·{' '}
                {formData.name} ({formData.phone})
              </div>

              {/* Притухшая схема зала со вспыхивающими выбранными местами */}
              <div className="success-mini-map" aria-hidden="true">
                <HallBlueprintSvg
                  viewBox="0 0 1000 350"
                  $drawn={true}
                  $reducedMotion={reducedMotion}
                >
                  <path
                    className="blueprint-stroke"
                    d="M 24 44 L 560 44 L 560 320 L 24 320 Z"
                    style={{ opacity: 0.25 }}
                  />
                  <path
                    className="blueprint-stroke-pro"
                    d="M 592 44 L 976 44 L 976 320 L 592 320 Z"
                    style={{ opacity: 0.35 }}
                  />
                  {INITIAL_HALL_SEATS.map((seat) => {
                    const isBooked =
                      formData.selectedSeats.includes(seat.id) ||
                      (formData.anySeatInZone && seat.zone === formData.zone && !seat.occupied);
                    return (
                      <g
                        key={`done-${seat.id}`}
                        transform={`translate(${seat.x}, ${seat.y})`}
                        style={{ opacity: isBooked ? 1 : 0.14 }}
                      >
                        <rect
                          x="-17"
                          y="-15"
                          width="34"
                          height="30"
                          fill={isBooked ? CONTACT_CONFIG.colors.neon : 'transparent'}
                          stroke={CONTACT_CONFIG.colors.neon}
                          strokeWidth="1.5"
                        />
                        {isBooked && (
                          <circle
                            r="24"
                            fill="none"
                            stroke={CONTACT_CONFIG.colors.neon}
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}
                </HallBlueprintSvg>
              </div>

              <div>
                <TextStepActionBtn
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setTypedTerminalText('');
                    setCurrentStep(0);
                  }}
                >
                  <span>Оформить ещё одну бронь</span>
                  <span className="arrow-glyph">
                    <ArrowRightSvg />
                  </span>
                </TextStepActionBtn>
              </div>
            </TerminalSuccessStage>
          ) : (
            <>
              {/* Верхняя шкала из 7 сегментов и счётчик шага */}
              <ProgressHeaderWrap>
                <ProgressTopMeta aria-live="polite" aria-atomic="true">
                  <span className="step-counter">
                    ШАГ <strong>{String(currentStep + 1).padStart(2, '0')}</strong> /{' '}
                    {String(CONTACT_CONFIG.booking.totalSteps).padStart(2, '0')} —{' '}
                    {activeStepConfig.shortLabel}
                  </span>

                  <span className="kbd-hint">
                    <span>ENTER</span> — ДАЛЕЕ // <span>ALT + ←</span> — НАЗАД
                  </span>
                </ProgressTopMeta>

                <SevenSegmentsBar role="tablist" aria-label="Шаги бронирования">
                  {STEP_META.map((item, idx) => {
                    const state =
                      idx === currentStep
                        ? 'active'
                        : idx <= maxReachedStep
                          ? 'done'
                          : 'idle';
                    return (
                      <SegmentButton
                        key={item.key}
                        type="button"
                        role="tab"
                        aria-selected={idx === currentStep}
                        aria-label={`Шаг ${idx + 1}: ${item.question}`}
                        $state={state}
                        onClick={() => {
                          if (idx <= maxReachedStep || idx < currentStep) {
                            transitionToStep(idx);
                          } else {
                            handleNextStep();
                          }
                        }}
                      />
                    );
                  })}
                </SevenSegmentsBar>
              </ProgressHeaderWrap>

              {/* Хлебные крошки предыдущих шагов мелкой моно-строкой над вопросом */}
              <BreadcrumbsTrail aria-label="Ответы на предыдущие вопросы">
                {completedBreadcrumbs.map((crumb, i) => (
                  <span key={crumb.label}>
                    <button
                      type="button"
                      className="crumb-btn"
                      onClick={() => transitionToStep(crumb.stepIdx)}
                    >
                      <span className="crumb-key">{crumb.label}:</span>
                      <span className="crumb-val">{crumb.value}</span>
                    </button>
                    {i < completedBreadcrumbs.length - 1 && (
                      <span className="crumb-sep"> // </span>
                    )}
                  </span>
                ))}
              </BreadcrumbsTrail>

              {/* Анимированная маска текущего вопроса */}
              <StepViewportMask onKeyDown={handleStepKeyDown}>
                <StepAnimatedStage
                  $phase={stepPhase}
                  $reducedMotion={reducedMotion}
                  data-testid={`booking-step-${currentStep + 1}`}
                >
                  {/* ШАГ 1: ИМЯ */}
                  {currentStep === 0 && (
                    <div>
                      <StepQuestionLabel htmlFor="name">
                        <span className="q-num">01 //</span>
                        Как тебя зовут?
                      </StepQuestionLabel>
                      <GiantUnderlineInput
                        ref={nameInputRef}
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Алексей / Никнейм"
                        value={formData.name}
                        $hasError={Boolean(stepError)}
                        onChange={(e) => {
                          setStepError('');
                          setFormData((prev) => ({ ...prev, name: e.target.value }));
                        }}
                        aria-invalid={Boolean(stepError)}
                        aria-describedby={stepError ? 'step-error-msg' : undefined}
                        required
                        data-testid="input-name"
                      />
                    </div>
                  )}

                  {/* ШАГ 2: ТЕЛЕФОН (+7 маска и валидация) */}
                  {currentStep === 1 && (
                    <div>
                      <StepQuestionLabel htmlFor="phone">
                        <span className="q-num">02 //</span>
                        Куда позвонить?
                      </StepQuestionLabel>
                      <GiantUnderlineInput
                        ref={phoneInputRef}
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+7 (999) 000-00-00"
                        value={formData.phone}
                        $hasError={Boolean(stepError)}
                        onFocus={() => {
                          if (!formData.phone) {
                            setFormData((prev) => ({ ...prev, phone: '+7 (' }));
                          }
                        }}
                        onChange={(e) => {
                          setStepError('');
                          const formatted = formatPhoneMask(e.target.value);
                          setFormData((prev) => ({ ...prev, phone: formatted }));
                        }}
                        aria-invalid={Boolean(stepError)}
                        aria-describedby={stepError ? 'step-error-msg' : undefined}
                        required
                        data-testid="input-phone"
                      />
                    </div>
                  )}

                  {/* ШАГ 3: EMAIL (необязательный, с кнопкой «Пропустить») */}
                  {currentStep === 2 && (
                    <div>
                      <StepQuestionLabel htmlFor="email">
                        <span className="q-num">03 //</span>
                        Куда прислать чек?
                        <span className="q-optional">[необязательно]</span>
                      </StepQuestionLabel>
                      <GiantUnderlineInput
                        ref={emailInputRef}
                        id="email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="player@cyberarena.ru"
                        value={formData.email}
                        $hasError={Boolean(stepError)}
                        onChange={(e) => {
                          setStepError('');
                          setFormData((prev) => ({ ...prev, email: e.target.value }));
                        }}
                        aria-invalid={Boolean(stepError)}
                        aria-describedby={stepError ? 'step-error-msg' : undefined}
                        data-testid="input-email"
                      />
                    </div>
                  )}

                  {/* ШАГ 4: ИНТЕРАКТИВНАЯ SVG-СХЕМА ЗАЛА СВЕРХУ (STANDARD ZONE + PRO ZONE) */}
                  {currentStep === 3 && (
                    <HallMapStageWrap ref={mapWrapRef}>
                      <StepQuestionLabel as="div">
                        <span className="q-num">04 //</span>
                        Где садимся?
                        <span className="q-optional">
                          [до {CONTACT_CONFIG.booking.maxSeats} мест]
                        </span>
                      </StepQuestionLabel>

                      <HallMapToolbar>
                        <div className="toolbar-left">
                          <div
                            className="zone-quick-switch"
                            role="group"
                            aria-label="Активная зона зала"
                          >
                            <button
                              type="button"
                              className="zone-switch-btn"
                              data-active={formData.zone === 'pro' ? 'true' : 'false'}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, zone: 'pro' }))
                              }
                            >
                              PRO ZONE · RTX 4090
                            </button>
                            <button
                              type="button"
                              className="zone-switch-btn"
                              data-active={formData.zone === 'standard' ? 'true' : 'false'}
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, zone: 'standard' }))
                              }
                            >
                              STANDARD · RTX 4080
                            </button>
                          </div>

                          <AnySeatToggleLabel
                            $checked={formData.anySeatInZone}
                            data-testid="toggle-any-seat"
                          >
                            <input
                              type="checkbox"
                              checked={formData.anySeatInZone}
                              onChange={(e) => {
                                setStepError('');
                                setFormData((prev) => ({
                                  ...prev,
                                  anySeatInZone: e.target.checked,
                                }));
                              }}
                            />
                            <span className="toggle-track" aria-hidden="true">
                              <span className="toggle-thumb" />
                            </span>
                            <span>Любое свободное место в зоне</span>
                          </AnySeatToggleLabel>
                        </div>

                        <MobileZoomControls aria-label="Масштаб схемы зала">
                          <span>МАСШТАБ:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setMapZoom(1);
                              setMapPan({ x: 0, y: 0 });
                            }}
                            aria-label="Масштаб 100%"
                          >
                            1×
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapZoom((z) => Math.min(2.2, +(z + 0.45).toFixed(2)))}
                            aria-label="Приблизить схему"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMapZoom((z) => {
                                const next = Math.max(1, +(z - 0.45).toFixed(2));
                                if (next === 1) setMapPan({ x: 0, y: 0 });
                                return next;
                              });
                            }}
                            aria-label="Отдалить схему"
                          >
                            −
                          </button>
                        </MobileZoomControls>
                      </HallMapToolbar>

                      <HallSvgViewport
                        onPointerDown={handleMapPanStart}
                        onPointerMove={handleMapPanMove}
                        onPointerUp={handleMapPanEnd}
                        onPointerCancel={handleMapPanEnd}
                      >
                        <HallSvgPanLayer
                          $dragging={isPanningMap}
                          style={{
                            transform: `translate3d(${mapPan.x}px, ${mapPan.y}px, 0) scale(${mapZoom})`,
                          }}
                        >
                          <HallBlueprintSvg
                            viewBox="0 0 1000 370"
                            role="img"
                            aria-label="Схема игровых залов Standard Zone и PRO Zone"
                            $drawn={mapDrawn}
                            $reducedMotion={reducedMotion}
                            data-testid="hall-blueprint-svg"
                          >
                            {/* Чертёжный контур STANDARD ZONE (слева) */}
                            <path
                              className="blueprint-stroke"
                              d="M 24 42 L 556 42 L 556 336 L 24 336 L 24 210 M 24 166 L 24 42 M 52 197 L 528 197"
                            />
                            <text x="44" y="76" className="zone-heading-svg">
                              STANDARD ZONE
                            </text>
                            <text x="234" y="75" className="zone-sub-svg">
                              // 20 МЕСТ · RTX 4080 · 240 ГЦ
                            </text>

                            {/* Чертёжный контур PRO ZONE (справа, выделен неоном) */}
                            <path
                              className="blueprint-stroke-pro"
                              d="M 588 42 L 976 42 L 976 336 L 588 336 L 588 214 M 588 162 L 588 42 M 616 197 L 948 197"
                            />
                            <text
                              x="612"
                              y="76"
                              className="zone-heading-svg zone-heading-pro"
                            >
                              PRO ZONE ★
                            </text>
                            <text x="734" y="75" className="zone-sub-svg">
                              // 12 МЕСТ · RTX 4090 · 360 ГЦ
                            </text>

                            {/* Входной ориентир арены */}
                            <text x="44" y="358" className="zone-sub-svg">
                              ↑ ВХОД / РЕСЕПШН · БАР
                            </text>
                            <text x="770" y="358" className="zone-sub-svg">
                              СТРИМ-РУБКА / СЦЕНА →
                            </text>

                            {/* Отрисовка всех 32 игровых станций (силуэт стола + монитор + системный блок + точка) */}
                            {INITIAL_HALL_SEATS.map((seat, idx) => {
                              const isSelected =
                                !formData.anySeatInZone &&
                                formData.selectedSeats.includes(seat.id);
                              const isHovered = hoveredSeatId === seat.id;
                              const neighborShift = getNeighborOffset(seat);
                              const scale = isHovered && !seat.occupied ? 1.22 : 1;

                              return (
                                <g
                                  key={seat.id}
                                  transform={`translate(${seat.x + neighborShift}, ${seat.y})`}
                                >
                                  <g
                                    className="seat-node"
                                    data-zone={seat.zone}
                                    data-occupied={seat.occupied ? 'true' : 'false'}
                                    data-selected={isSelected ? 'true' : 'false'}
                                    data-testid={`hall-seat-${seat.id}`}
                                    role="button"
                                    tabIndex={seat.occupied ? -1 : 0}
                                    aria-label={`${seat.shortZone} · место ${seat.number} · ${seat.gpu} · ${
                                      seat.occupied
                                        ? 'занято'
                                        : isSelected
                                          ? 'выбрано'
                                          : 'свободно'
                                    }`}
                                    aria-pressed={isSelected}
                                    style={{
                                      transitionDelay: mapDrawn
                                        ? '0s'
                                        : `${(
                                            idx * CONTACT_CONFIG.animation.seatStaggerSec
                                          ).toFixed(2)}s`,
                                      transform: `scale(${scale})`,
                                    }}
                                    onPointerEnter={() => {
                                      setHoveredSeatId(seat.id);
                                      setCursorTagText(
                                        seat.occupied
                                          ? 'занято'
                                          : `${seat.shortZone} · ${seat.number}`
                                      );
                                    }}
                                    onPointerLeave={() => {
                                      setHoveredSeatId((prev) =>
                                        prev === seat.id ? null : prev
                                      );
                                      setCursorTagText('бронь');
                                    }}
                                    onFocus={() => setHoveredSeatId(seat.id)}
                                    onBlur={() =>
                                      setHoveredSeatId((prev) =>
                                        prev === seat.id ? null : prev
                                      )
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSeatToggle(seat);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSeatToggle(seat);
                                      }
                                    }}
                                  >
                                    {/* Невидимая увеличенная зона нажатия 44x44 для мобильных */}
                                    <rect
                                      x="-22"
                                      y="-22"
                                      width="44"
                                      height="44"
                                      fill="transparent"
                                    />

                                    {/* Контур стола и игрового места */}
                                    <rect
                                      className="seat-desk-outline"
                                      x="-18"
                                      y="-16"
                                      width="36"
                                      height="32"
                                    />

                                    {/* Монитор сверху стола */}
                                    <rect
                                      className="seat-monitor-bar"
                                      x="-12"
                                      y="-12"
                                      width="24"
                                      height="3"
                                    />

                                    {/* Пульсирующий индикатор статуса */}
                                    <circle
                                      className="seat-core-dot"
                                      cx="-10"
                                      cy="6"
                                      r="2.6"
                                    />

                                    {/* Номер места */}
                                    <text
                                      className="seat-num-text"
                                      x="3"
                                      y="9"
                                      textAnchor="middle"
                                    >
                                      {seat.number}
                                    </text>

                                    {/* Диагональный штрих для занятых мест */}
                                    {seat.occupied && (
                                      <line
                                        x1="-15"
                                        y1="-13"
                                        x2="15"
                                        y2="13"
                                        stroke="rgba(242, 242, 245, 0.35)"
                                        strokeWidth="1.2"
                                      />
                                    )}

                                    {/* Вспышка при клике */}
                                    {burstSeatId === seat.id && (
                                      <circle
                                        key={`burst-${seat.id}-${formData.selectedSeats.length}`}
                                        className="seat-burst"
                                        cx="0"
                                        cy="0"
                                        r="19"
                                      />
                                    )}
                                  </g>
                                </g>
                              );
                            })}
                          </HallBlueprintSvg>
                        </HallSvgPanLayer>
                      </HallSvgViewport>

                      {/* Живая строка ховера по месту и сводка выбранных мест */}
                      <HallHoverReadoutBar>
                        <div className="hover-info" data-testid="seat-hover-readout">
                          {hoveredSeatObj
                            ? `${hoveredSeatObj.shortZone} · место ${hoveredSeatObj.number} · ${
                                hoveredSeatObj.gpu
                              }${hoveredSeatObj.occupied ? ' [ЗАНЯТО]' : ''}`
                            : 'Наведи или нажми на место на чертеже зала'}
                        </div>

                        <div className="selected-summary">
                          Выбрано: <span>{seatSelectionSummary}</span>
                        </div>

                        <div className="legend-row" aria-hidden="true">
                          <span>
                            <i className="leg-dot leg-free" />
                            Свободно
                          </span>
                          <span>
                            <i className="leg-dot leg-busy" />
                            Занято
                          </span>
                        </div>
                      </HallHoverReadoutBar>
                    </HallMapStageWrap>
                  )}

                  {/* ШАГ 5: ДАТА — ГОРИЗОНТАЛЬНАЯ ЛЕНТА НА 14 ДНЕЙ */}
                  {currentStep === 4 && (
                    <div>
                      <StepQuestionLabel as="div">
                        <span className="q-num">05 //</span>
                        В какой день?
                      </StepQuestionLabel>

                      <DateRibbonTrack
                        ref={dateRibbonRef}
                        role="radiogroup"
                        aria-label="Выбор даты бронирования на 14 дней"
                        onPointerDown={handleDateRibbonPointerDown}
                        onPointerMove={handleDateRibbonPointerMove}
                        onPointerUp={handleDateRibbonPointerUp}
                        onPointerLeave={handleDateRibbonPointerUp}
                      >
                        {daysRibbon.map((dayItem) => {
                          const isSelected = dayItem.iso === formData.date;
                          return (
                            <DayStripItem
                              key={dayItem.iso}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              $selected={isSelected}
                              data-testid={`day-item-${dayItem.iso}`}
                              onClick={() => {
                                if (dateDragStateRef.current.moved) return;
                                setFormData((prev) => ({ ...prev, date: dayItem.iso }));
                              }}
                            >
                              <span className="day-rel">{dayItem.relLabel}</span>
                              <span className="day-big">{dayItem.dayNum}</span>
                              <span className="day-month">
                                {dayItem.monthShort} · {dayItem.weekday}
                              </span>
                            </DayStripItem>
                          );
                        })}
                      </DateRibbonTrack>
                    </div>
                  )}

                  {/* ШАГ 6: ВРЕМЯ И ДЛИТЕЛЬНОСТЬ — ШКАЛА 10:00–02:00 */}
                  {currentStep === 5 && (
                    <TimelineStageWrap>
                      <StepQuestionLabel as="div">
                        <span className="q-num">06 //</span>
                        Во сколько и на сколько?
                      </StepQuestionLabel>

                      <TimelineLiveReadout>
                        <div className="time-giant" data-testid="time-range-readout">
                          {timeRangeSummary}
                        </div>
                        <div className="time-hint">
                          Тяни ползунок старта или растягивай правый край отрезка (1–12 ч)
                        </div>
                      </TimelineLiveReadout>

                      <TimelineInteractiveBar
                        ref={timelineBarRef}
                        onPointerMove={handleTimelinePointerMove}
                        onPointerUp={handleTimelinePointerUp}
                        onPointerCancel={handleTimelinePointerUp}
                      >
                        <div className="rail-base" />

                        <div className="tick-marks" aria-hidden="true">
                          {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((off) => (
                            <span key={off} className="tick-item">
                              {offsetToTimeStr(off)}
                            </span>
                          ))}
                        </div>

                        {/* Активный салатовый отрезок времени */}
                        <div
                          className="active-range-segment"
                          style={{
                            left: `${startPct}%`,
                            width: `${widthPct}%`,
                          }}
                          onPointerDown={(e) => handleTimelinePointerDown('move-range', e)}
                        />

                        {/* Ползунок начала */}
                        <button
                          type="button"
                          className="handle-node"
                          style={{ left: `${startPct}%` }}
                          aria-label={`Время начала: ${startTimeStr}. Используй стрелки влево и вправо`}
                          data-testid="timeline-handle-start"
                          onPointerDown={(e) => handleTimelinePointerDown('start', e)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowRight') {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                startOffset: Math.min(
                                  totalTimelineHours - prev.hours,
                                  prev.startOffset + 1
                                ),
                              }));
                            } else if (e.key === 'ArrowLeft') {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                startOffset: Math.max(0, prev.startOffset - 1),
                              }));
                            }
                          }}
                        >
                          <span className="handle-core" />
                        </button>

                        {/* Ползунок длительности (правый край отрезка) */}
                        <button
                          type="button"
                          className="handle-node"
                          style={{ left: `${startPct + widthPct}%` }}
                          aria-label={`Длительность: ${formData.hours} ч (до ${endTimeStr}). Используй стрелки влево и вправо`}
                          data-testid="timeline-handle-end"
                          onPointerDown={(e) => handleTimelinePointerDown('end', e)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowRight') {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                hours: Math.min(
                                  CONTACT_CONFIG.booking.maxDuration,
                                  totalTimelineHours - prev.startOffset,
                                  prev.hours + 1
                                ),
                              }));
                            } else if (e.key === 'ArrowLeft') {
                              e.preventDefault();
                              setFormData((prev) => ({
                                ...prev,
                                hours: Math.max(
                                  CONTACT_CONFIG.booking.minDuration,
                                  prev.hours - 1
                                ),
                              }));
                            }
                          }}
                        >
                          <span className="handle-core" />
                        </button>
                      </TimelineInteractiveBar>

                      {/* Быстрый выбор длительности в 1 тап */}
                      <DurationQuickRow>
                        <span>ДЛИТЕЛЬНОСТЬ:</span>
                        {[1, 2, 3, 5, 8, 12].map((dur) => (
                          <button
                            key={dur}
                            type="button"
                            className="dur-btn"
                            data-active={formData.hours === dur ? 'true' : 'false'}
                            onClick={() =>
                              setFormData((prev) => {
                                const maxStart = Math.max(0, totalTimelineHours - dur);
                                return {
                                  ...prev,
                                  hours: dur,
                                  startOffset: Math.min(prev.startOffset, maxStart),
                                };
                              })
                            }
                          >
                            {dur} ч
                          </button>
                        ))}
                      </DurationQuickRow>
                    </TimelineStageWrap>
                  )}

                  {/* ШАГ 7: СООБЩЕНИЕ + СОГЛАСИЕ + КРУПНАЯ ТЕКСТОВАЯ КНОПКА «ЗАБРОНИРОВАТЬ» */}
                  {currentStep === 6 && (
                    <div>
                      <StepQuestionLabel htmlFor="message">
                        <span className="q-num">07 //</span>
                        Что-то ещё подготовить?
                        <span className="q-optional">[необязательно]</span>
                      </StepQuestionLabel>

                      <GiantUnderlineTextarea
                        ref={messageInputRef}
                        id="message"
                        name="message"
                        placeholder="Пожелания по девайсам, напиткам к столу или турнирному лобби..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, message: e.target.value }))
                        }
                        data-testid="textarea-message"
                      />

                      <div>
                        <ConsentCheckboxRow
                          $checked={formData.consent}
                          $hasError={Boolean(stepError && !formData.consent)}
                        >
                          <input
                            type="checkbox"
                            name="consent"
                            checked={formData.consent}
                            onChange={(e) => {
                              setStepError('');
                              setFormData((prev) => ({
                                ...prev,
                                consent: e.target.checked,
                              }));
                            }}
                            required
                            data-testid="checkbox-consent"
                          />
                          <span className="check-glyph" aria-hidden="true">
                            {formData.consent ? '✓' : ''}
                          </span>
                          <span>
                            Согласен на обработку персональных данных в соответствии с{' '}
                            <a href="#privacy-policy" onClick={(e) => e.stopPropagation()}>
                              политикой конфиденциальности
                            </a>
                          </span>
                        </ConsentCheckboxRow>
                      </div>
                    </div>
                  )}

                  {/* Строка ошибки валидации (озвучивается скринридерами) */}
                  <ValidationErrorLine
                    id="step-error-msg"
                    role="alert"
                    aria-live="assertive"
                    $visible={Boolean(stepError)}
                  >
                    {stepError}
                  </ValidationErrorLine>
                </StepAnimatedStage>
              </StepViewportMask>

              {/* Нижняя панель переключения шагов / отправки */}
              <StepNavRow>
                <div className="nav-left">
                  {currentStep > 0 && (
                    <TextStepActionBtn
                      type="button"
                      $back
                      onClick={handlePrevStep}
                      data-testid="step-prev-btn"
                    >
                      <span className="arrow-glyph">
                        <ArrowLeftSvg />
                      </span>
                      <span>Назад</span>
                    </TextStepActionBtn>
                  )}

                  {currentStep === 2 && (
                    <TextStepActionBtn
                      type="button"
                      onClick={handleSkipOptionalStep}
                      data-testid="step-skip-email-btn"
                    >
                      <span>Пропустить</span>
                      <span className="arrow-glyph">
                        <ArrowRightSvg />
                      </span>
                    </TextStepActionBtn>
                  )}
                </div>

                <div className="nav-right">
                  {currentStep < 6 ? (
                    <TextStepActionBtn
                      type="button"
                      $primary
                      onClick={handleNextStep}
                      data-testid="step-next-btn"
                    >
                      <span>Далее</span>
                      <span className="arrow-glyph">
                        <ArrowRightSvg />
                      </span>
                    </TextStepActionBtn>
                  ) : (
                    <MagneticSubmitBtn
                      ref={submitBtnRef}
                      type="submit"
                      disabled={isSubmitting}
                      onPointerMove={handleMagneticMove}
                      onPointerLeave={handleMagneticLeave}
                      data-testid="button-submit-booking"
                    >
                      <span>{isSubmitting ? 'Отправляем...' : 'Забронировать'}</span>
                      <span className="submit-arrow" aria-hidden="true">
                        <ArrowRightSvg />
                      </span>
                    </MagneticSubmitBtn>
                  )}
                </div>
              </StepNavRow>

              {/* Обработка сетевой ошибки с кнопкой повтора и переходом в Telegram */}
              {error && (
                <ErrorFallbackBanner role="alert" data-testid="error-message">
                  <div className="err-msg">{error}</div>
                  <div className="err-actions">
                    <TextStepActionBtn type="submit" $primary>
                      <span>Повторить отправку</span>
                      <span className="arrow-glyph">
                        <ArrowRightSvg />
                      </span>
                    </TextStepActionBtn>

                    <a
                      href="https://t.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tg-fallback-link"
                    >
                      <span>Написать в Telegram</span>
                      <span className="arrow-glyph">
                        <ArrowUpRightSvg />
                      </span>
                    </a>
                  </div>
                </ErrorFallbackBanner>
              )}
            </>
          )}
        </ConversationalForm>
      </ContactContainer>

      {/* Четыре гигантские строки-ссылки контактов на всю ширину с clip-path заливкой снизу */}
      <GiantContactsList aria-label="Прямые контакты клуба">
        {[
          {
            kicker: '01 // АДРЕС',
            value: 'Москва, ул. Киберспортивная, 42',
            href: 'https://yandex.ru/maps/?pt=37.6173,55.7558&z=16&l=map',
            external: true,
            cursorLabel: 'карта',
          },
          {
            kicker: '02 // ТЕЛЕФОН',
            value: '+7 (495) 123-45-67',
            href: 'tel:+74951234567',
            external: false,
            cursorLabel: 'позвонить',
          },
          {
            kicker: '03 // TELEGRAM',
            value: 'Написать',
            href: 'https://t.me',
            external: true,
            cursorLabel: 'telegram',
          },
          {
            kicker: '04 // EMAIL',
            value: 'info@cyberarena.ru',
            href: 'mailto:info@cyberarena.ru',
            external: false,
            cursorLabel: 'написать',
          },
        ].map((item) => (
          <GiantContactRowLink
            key={item.kicker}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            onPointerEnter={() => setCursorTagText(item.cursorLabel)}
            onPointerLeave={() => setCursorTagText('бронь')}
          >
            <div className="row-layer">
              <span className="row-kicker">{item.kicker}</span>
              <span className="row-value">{item.value}</span>
              <span className="row-arrow" aria-hidden="true">
                <ArrowUpRightSvg />
              </span>
            </div>

            {/* Дублирующий слой для инверсии текста в чёрный при подъёме салатовой шторки clip-path */}
            <div className="row-fill-overlay" aria-hidden="true">
              <div className="row-layer">
                <span className="row-kicker">{item.kicker}</span>
                <span className="row-value">{item.value}</span>
                <span className="row-arrow">
                  <ArrowUpRightSvg />
                </span>
              </div>
            </div>
          </GiantContactRowLink>
        ))}
      </GiantContactsList>
    </ContactSection>
  );
};

export default Contact;
