import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  INTERLUDE_CONFIG,
  InterludeSection,
  PingFlashAura,
  ExcusesStage,
  ExcuseGhostWord,
  InterludeContainer,
  LeftEditorialColumn,
  StatementHeading,
  PingValueWrap,
  ZeroBloomValue,
  ExcusesLabelText,
  BottomSpecsLine,
  RightTerminalColumn,
  RawTerminalOutput,
  BlinkingCursor,
  PacketTraceTrack,
  PacketPulseBeam,
} from './style';

gsap.registerPlugin(ScrollTrigger);

const EXCUSE_WORDS = [
  {
    text: '«лагает»',
    fromX: -220,
    fromY: -80,
    outX: -360,
    outY: -150,
  },
  {
    text: '«интернет упал»',
    fromX: 240,
    fromY: -70,
    outX: 380,
    outY: -140,
  },
  {
    text: '«мышка»',
    fromX: -210,
    fromY: 90,
    outX: -350,
    outY: 160,
  },
  {
    text: '«тиммейты»',
    fromX: 230,
    fromY: 85,
    outX: 370,
    outY: 155,
  },
];

const SPECS_TOKENS = ['Москва', '·', '10 Гбит/с', '·', 'Cisco'];

const Interlude = () => {
  const sectionRef = useRef(null);
  const auraRef = useRef(null);
  const pingLineRef = useRef(null);
  const pingNumWrapRef = useRef(null);
  const pingNumTextRef = useRef(null);
  const excusesLineRef = useRef(null);
  const zeroBloomRef = useRef(null);
  const terminalRef = useRef(null);
  const pulseBeamRef = useRef(null);
  const specsLineRef = useRef(null);
  const excuseWordRefs = useRef([]);

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

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return undefined;

    const ctx = gsap.context(() => {
      const termLines = terminalRef.current
        ? terminalRef.current.querySelectorAll('.term-line')
        : [];
      const specChars = specsLineRef.current
        ? specsLineRef.current.querySelectorAll('.spec-char')
        : [];
      const excuseEls = excuseWordRefs.current.filter(Boolean);

      // Начальные состояния: первая строка терминала и "Пинг — 0 мс." уже встречают пользователя при подходе к секции,
      // а сам сценарий запускается только когда блок встаёт по центру экрана (pin: true, start: 'top top')
      const firstTermLine = termLines[0] || null;
      const replyTermLines = Array.from(termLines).slice(1);

      if (firstTermLine) {
        gsap.set(firstTermLine, { opacity: 1, y: 0 });
      }
      gsap.set(replyTermLines, { opacity: 0, y: 10 });
      gsap.set(pingLineRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(excusesLineRef.current, { yPercent: 115, opacity: 0 });
      gsap.set(specChars, { opacity: 0, y: 8 });
      if (pingNumTextRef.current) {
        pingNumTextRef.current.textContent = '0';
      }

      excuseEls.forEach((el, i) => {
        const cfg = EXCUSE_WORDS[i];
        gsap.set(el, {
          opacity: 0,
          x: cfg.fromX,
          y: cfg.fromY,
          scale: 0.82,
          filter: 'blur(6px)',
        });
      });

      // Фоновый бесконечный импульс пакета по линии
      if (pulseBeamRef.current) {
        gsap.to(pulseBeamRef.current, {
          x: 520,
          duration: 1.35,
          ease: 'power2.inOut',
          repeat: -1,
          repeatDelay: 0.4,
        });
      }

      // Главный 5-шаговый сценарий с закреплением секции (pin), чтобы анимация
      // не начиналась раньше времени и шла плавно по мере скролла
      if (pingLineRef.current?.parentElement) {
        pingLineRef.current.parentElement.dataset.unclipped = 'true';
      }
      if (excusesLineRef.current?.parentElement) {
        excusesLineRef.current.parentElement.dataset.unclipped = 'true';
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => (window.innerWidth < 768 ? '+=155%' : '+=190%'),
          pin: true,
          scrub: 0.9,
          anticipatePin: 0,
          invalidateOnRefresh: true,
        },
      });

      // 1. Ответы терминала моно-шрифтом + отсчёт пинга 0 -> 2 мс
      tl.to(
        replyTermLines,
        {
          opacity: 1,
          y: 0,
          duration: 0.14,
          stagger: 0.06,
          ease: 'power2.out',
        },
        0.02
      );

      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 2,
          duration: 0.16,
          ease: 'steps(2)',
          onUpdate: () => {
            if (pingNumTextRef.current) {
              pingNumTextRef.current.textContent = String(Math.round(counterObj.val));
            }
          },
        },
        0.04
      );

      tl.fromTo(
        pingNumWrapRef.current,
        {
          scale: 1.24,
          textShadow: '0 0 38px rgba(212, 255, 63, 0.95), 0 0 72px rgba(212, 255, 63, 0.55)',
        },
        {
          scale: 1,
          textShadow: '0 0 22px rgba(212, 255, 63, 0.55), 0 0 54px rgba(212, 255, 63, 0.26)',
          duration: 0.14,
          ease: 'back.out(2.4)',
        },
        0.16
      );

      tl.fromTo(
        auraRef.current,
        { opacity: 0.65, scale: 1.08 },
        {
          opacity: 0.24,
          scale: 0.9,
          duration: 0.2,
          ease: 'power2.out',
        },
        0.16
      );

      // 2. Слова-отговорки вылетают по очереди, дольше держатся на экране (дрожат) и разлетаются
      excuseEls.forEach((el, i) => {
        const cfg = EXCUSE_WORDS[i];
        const startAt = 0.16 + i * 0.065;

        tl.to(
          el,
          {
            opacity: 0.92,
            x: 0,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.12,
            ease: 'power2.out',
          },
          startAt
        )
          .to(
            el,
            {
              keyframes: [
                { x: -9, y: 3, skewX: -12, color: '#D4FF3F', duration: 0.045 },
                { x: 11, y: -4, skewX: 14, color: '#F2F2F5', duration: 0.045 },
                { x: -6, y: -2, skewX: -8, color: '#D4FF3F', duration: 0.045 },
                { x: 4, y: 2, skewX: 6, color: '#F2F2F5', duration: 0.045 },
              ],
              ease: 'none',
            },
            startAt + 0.12
          )
          .to(
            el,
            {
              opacity: 0,
              x: cfg.outX,
              y: cfg.outY,
              scale: 1.24,
              filter: 'blur(10px)',
              duration: 0.14,
              ease: 'power2.in',
            },
            startAt + 0.3
          );
      });

      // 3. Крупно появляется "Отговорки — 0."
      tl.to(
        excusesLineRef.current,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.18,
          ease: 'power3.out',
        },
        0.58
      );

      tl.fromTo(
        zeroBloomRef.current,
        {
          scale: 1.24,
          textShadow: '0 0 44px rgba(212, 255, 63, 1), 0 0 90px rgba(212, 255, 63, 0.7)',
        },
        {
          scale: 1,
          textShadow: '0 0 24px rgba(212, 255, 63, 0.65), 0 0 58px rgba(212, 255, 63, 0.32)',
          duration: 0.16,
          ease: 'back.out(2.2)',
        },
        0.68
      );

      // 4. Характеристики внизу одной строкой через разделитель
      tl.to(
        specChars,
        {
          opacity: 1,
          y: 0,
          duration: 0.12,
          stagger: 0.005,
          ease: 'power2.out',
        },
        0.72
      );

      // 5. Пауза-фиксация перед выходом из пина, чтобы финальный кадр спокойно считывался
      tl.to({}, { duration: 0.18 }, 0.84);
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <InterludeSection ref={sectionRef} data-testid="section-interlude">
      <PingFlashAura ref={auraRef} aria-hidden="true" />

      {/* Разлетающиеся слова-отговорки (при prefers-reduced-motion остаются скрытыми) */}
      <ExcusesStage aria-hidden="true">
        {EXCUSE_WORDS.map((item, idx) => (
          <ExcuseGhostWord
            key={item.text}
            ref={(el) => {
              excuseWordRefs.current[idx] = el;
            }}
          >
            {item.text}
          </ExcuseGhostWord>
        ))}
      </ExcusesStage>

      <InterludeContainer>
        {/* Левая часть: крупное асимметричное высказывание + моно-строка характеристик */}
        <LeftEditorialColumn>
          <StatementHeading>
            <span className="line-mask">
              <span className="line-inner" ref={pingLineRef}>
                Пинг —{' '}
                <PingValueWrap ref={pingNumWrapRef}>
                  <span ref={pingNumTextRef} data-testid="interlude-ping-value">
                    2
                  </span>
                </PingValueWrap>{' '}
                мс.
              </span>
            </span>

            <span className="line-mask">
              <span className="line-inner" ref={excusesLineRef}>
                <ExcusesLabelText>Отговорки —</ExcusesLabelText>{' '}
                <ZeroBloomValue ref={zeroBloomRef} data-testid="interlude-excuses-zero">
                  0.
                </ZeroBloomValue>
              </span>
            </span>
          </StatementHeading>

          {/* Характеристики одной строкой через разделитель со stagger по символам */}
          <BottomSpecsLine
            ref={specsLineRef}
            aria-label="Москва · 10 Гбит/с · Cisco"
            data-testid="interlude-specs-line"
          >
            {SPECS_TOKENS.map((token, tIdx) =>
              token === '·' ? (
                <span key={tIdx} className="spec-char spec-dot" aria-hidden="true">
                  ·
                </span>
              ) : (
                <span key={tIdx} aria-hidden="true">
                  {Array.from(token).map((ch, cIdx) => (
                    <span key={cIdx} className="spec-char">
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  ))}
                </span>
              )
            )}
          </BottomSpecsLine>
        </LeftEditorialColumn>

        {/* Правая часть: живая деталь — терминал (2 строки на мобильных) + импульс пакета */}
        <RightTerminalColumn>
          <RawTerminalOutput ref={terminalRef} data-testid="interlude-terminal">
            <span className="term-line">
              <span className="prompt">&gt;</span>
              <span className="cmd">ping moscow-dc.local</span>
            </span>

            <span className="term-line">
              <span className="reply-token">
                time=<span className="ms-val">2ms</span>
              </span>
              <span className="reply-token">
                time=<span className="ms-val">2ms</span>
              </span>
              <span className="reply-token">
                time=<span className="ms-val">2ms</span>
              </span>
              <span className="reply-token">
                time=<span className="ms-val">2ms</span>
              </span>
              <BlinkingCursor aria-hidden="true" />
            </span>

            <span className="term-line desktop-only-line">
              0% packet loss · jitter <span className="ms-val">0.04ms</span> · direct-ix
            </span>
          </RawTerminalOutput>

          <PacketTraceTrack aria-hidden="true">
            <PacketPulseBeam ref={pulseBeamRef} />
          </PacketTraceTrack>
        </RightTerminalColumn>
      </InterludeContainer>
    </InterludeSection>
  );
};

export default Interlude;
