/* Разработка: flaty7375@gmail.com */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * Единый кастомный курсор всего сайта:
 * 1) В секциях GamingZones (#zones), Pricing (#pricing) и Specs (#specs) —
 *    фирменный КРУГЛЫЙ неоновый курсор (12px точка, раскрывающаяся в круг 84px с текстом внутри:
 *    «смотреть», «выбрать →», «⇄ зона», «бронь ↗»).
 * 2) В остальных секциях (Header, Hero, About, Interlude, Tournaments, Gallery, Contact, Footer) —
 *    квадратная неоновая точка 6x6px + тёмный бейдж с левой салатовой гранью.
 * 3) Обновляется и при движении мыши, и при скролле без движения мыши (через elementFromPoint),
 *    поэтому никогда не залипает между блоками.
 */
const GlobalCursorFollower = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0;
  transition: opacity 0.15s ease;

  .cursor-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.26rem 0.58rem;
    background: rgba(7, 7, 10, 0.92);
    border-left: 2px solid #b6ff00;
    font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #b6ff00;
    transform: translate3d(16px, -50%, 0);
    white-space: nowrap;
  }

  @media (hover: none), (pointer: coarse), (max-width: 1023px) {
    display: none !important;
  }
`;

const GlobalCursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 6px;
  height: 6px;
  background: #b6ff00;
  box-shadow: 0 0 10px #b6ff00;
  pointer-events: none;
  will-change: transform, opacity;
  opacity: 0;
  transition: opacity 0.15s ease;

  @media (hover: none), (pointer: coarse), (max-width: 1023px) {
    display: none !important;
  }
`;

const GlobalRoundCursorWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  will-change: transform;

  @media (hover: none), (pointer: coarse), (max-width: 1023px) {
    display: none !important;
  }
`;

const GlobalRoundCursorCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  margin-top: -6px;
  border-radius: 50%;
  background: #b6ff00;
  color: #07070a;
  opacity: 0;
  transform: scale(0.3);
  transition:
    width 280ms cubic-bezier(0.16, 1, 0.3, 1),
    height 280ms cubic-bezier(0.16, 1, 0.3, 1),
    margin 280ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 160ms ease,
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);

  &[data-visible='true'] {
    opacity: 1;
    transform: scale(1);
  }

  &[data-expanded='true'] {
    width: 84px;
    height: 84px;
    margin-left: -42px;
    margin-top: -42px;
  }

  span {
    font-family: ${({ theme }) => theme.fonts?.mono || 'monospace'};
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    opacity: 0;
    transition: opacity 150ms ease;
    white-space: nowrap;
  }

  &[data-expanded='true'] span {
    opacity: 1;
  }
`;

/**
 * Проверяет, находится ли элемент в одной из секций с круглым курсором (#zones, #pricing, #specs).
 * Возвращает { isRound: true, expanded: boolean, label: string } либо { isRound: false, tag: string }.
 */
function resolveCursorState(target) {
  if (!target || typeof target.closest !== 'function') {
    return { isRound: false, tag: 'cyberarena' };
  }

  // Шапка поверх всех секций — всегда использует навигационный бейдж
  if (target.closest('[data-testid="header"]')) {
    const interactive = target.closest('a, button, [role="button"]');
    const localTag = target
      .closest('[data-testid="header"]')
      .querySelector('.cursor-tag')
      ?.textContent?.trim();
    return {
      isRound: false,
      tag: interactive && localTag ? localTag : 'навигация',
    };
  }

  // 1. Секция «Залы» (#zones) — круглый курсор
  const zonesSec = target.closest('#zones');
  if (zonesSec) {
    if (target.closest('[role="tab"]')) {
      return { isRound: true, expanded: false, label: 'смотреть' };
    }
    if (target.closest('a[href="#contact"]')) {
      return { isRound: true, expanded: true, label: 'бронь ↗' };
    }
    if (
      target.closest('[data-testid^="zone-card-"]') ||
      target.closest('[data-testid="zones-counter"]')
    ) {
      return { isRound: true, expanded: true, label: 'смотреть' };
    }
    return { isRound: true, expanded: false, label: 'смотреть' };
  }

  // 2. Секция «Цены» (#pricing) — круглый курсор
  const pricingSec = target.closest('#pricing');
  if (pricingSec) {
    if (target.closest('a[href="#contact"]')) {
      return { isRound: true, expanded: true, label: 'бронь ↗' };
    }
    if (target.closest('[data-testid^="price-card-"]')) {
      return { isRound: true, expanded: true, label: 'выбрать →' };
    }
    return { isRound: true, expanded: false, label: 'выбрать →' };
  }

  // 3. Секция «Железо» (#specs) — круглый курсор
  const specsSec = target.closest('#specs');
  if (specsSec) {
    if (
      target.closest('[role="radiogroup"]') ||
      (target.closest('[data-testid="specs-schematic"]') &&
        target.closest('svg, [data-side]'))
    ) {
      return { isRound: true, expanded: true, label: '⇄ зона' };
    }
    return { isRound: true, expanded: false, label: '⇄ зона' };
  }

  // 4. Остальные секции — квадратная точка + текстовая плашка
  const explicitCursor = target.closest('[data-cursor]');
  if (explicitCursor) {
    const val = explicitCursor.getAttribute('data-cursor');
    if (val) return { isRound: false, tag: val };
  }

  const sectionWithLocalTag = target.closest(
    '#contact, [data-testid="footer"], #gallery'
  );
  if (sectionWithLocalTag) {
    const interactive = target.closest(
      'a, button, [role="button"], input, textarea, [data-seat-id]'
    );
    const localTag = sectionWithLocalTag
      .querySelector('.cursor-tag')
      ?.textContent?.trim();
    if (interactive && localTag) {
      return { isRound: false, tag: localTag };
    }
  }

  const interactiveEl = target.closest(
    'a, button, [role="button"], [role="tab"], [role="radio"], input, textarea, select'
  );
  if (interactiveEl) {
    if (interactiveEl.matches('input, textarea')) {
      return { isRound: false, tag: 'ввод' };
    }
    const label = (
      interactiveEl.getAttribute('data-cursor') ||
      interactiveEl.getAttribute('aria-label') ||
      interactiveEl.textContent ||
      ''
    )
      .replace(/\s+/g, ' ')
      .trim();
    if (label && label.length <= 18) {
      return { isRound: false, tag: label };
    }
    return { isRound: false, tag: 'выбрать' };
  }

  if (target.closest('#hero')) return { isRound: false, tag: 'cyberarena' };
  if (target.closest('[data-testid="about-3d-viewport"]')) {
    return { isRound: false, tag: '3d пк' };
  }
  if (target.closest('#about')) return { isRound: false, tag: '01 // о клубе' };
  if (target.closest('[data-testid="section-interlude"]')) {
    return { isRound: false, tag: 'пинг 2 мс' };
  }
  if (target.closest('#tournaments')) {
    return { isRound: false, tag: '04 // турниры' };
  }
  if (target.closest('#gallery')) return { isRound: false, tag: '06 // галерея' };
  if (target.closest('#contact')) return { isRound: false, tag: '07 // бронь' };
  if (target.closest('[data-testid="footer"]')) {
    return { isRound: false, tag: 'перейти' };
  }

  return { isRound: false, tag: 'cyberarena' };
}

const CustomCursor = () => {
  const followerRef = useRef(null);
  const dotRef = useRef(null);
  const tagRef = useRef(null);
  const roundWrapRef = useRef(null);
  const roundCircleRef = useRef(null);
  const roundLabelRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const followerEl = followerRef.current;
    const dotEl = dotRef.current;
    const tagEl = tagRef.current;
    const roundWrapEl = roundWrapRef.current;
    const roundCircleEl = roundCircleRef.current;
    const roundLabelEl = roundLabelRef.current;
    if (
      !followerEl ||
      !dotEl ||
      !tagEl ||
      !roundWrapEl ||
      !roundCircleEl ||
      !roundLabelEl
    ) {
      return undefined;
    }

    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;
    let isVisible = false;
    let currentIsRound = false;
    let rafId = 0;
    let scrollRafId = 0;

    const applyCursorStateFromTarget = (target) => {
      const state = resolveCursorState(target);
      currentIsRound = state.isRound;

      if (state.isRound) {
        followerEl.style.opacity = '0';
        dotEl.style.opacity = '0';
        roundCircleEl.dataset.visible = isVisible ? 'true' : 'false';
        roundCircleEl.dataset.expanded = state.expanded ? 'true' : 'false';
        if (state.label && roundLabelEl.textContent !== state.label) {
          roundLabelEl.textContent = state.label;
        }
      } else {
        roundCircleEl.dataset.visible = 'false';
        roundCircleEl.dataset.expanded = 'false';
        if (isVisible) {
          followerEl.style.opacity = '1';
          dotEl.style.opacity = '1';
        }
        if (state.tag && tagEl.textContent !== state.tag) {
          tagEl.textContent = state.tag;
        }
      }
    };

    const tickFollower = () => {
      const dx = mouseX - followerX;
      const dy = mouseY - followerY;
      followerX += dx * 0.36;
      followerY += dy * 0.36;

      const pos = `translate3d(${followerX.toFixed(1)}px, ${followerY.toFixed(1)}px, 0)`;
      followerEl.style.transform = pos;
      roundWrapEl.style.transform = pos;

      if (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15) {
        rafId = window.requestAnimationFrame(tickFollower);
      } else {
        followerX = mouseX;
        followerY = mouseY;
        const finalPos = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        followerEl.style.transform = finalPos;
        roundWrapEl.style.transform = finalPos;
        rafId = 0;
      }
    };

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch' || window.innerWidth < 1024) {
        if (isVisible) {
          isVisible = false;
          followerEl.style.opacity = '0';
          dotEl.style.opacity = '0';
          roundCircleEl.dataset.visible = 'false';
        }
        return;
      }

      mouseX = e.clientX;
      mouseY = e.clientY;

      dotEl.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      if (!isVisible) {
        isVisible = true;
        followerX = mouseX;
        followerY = mouseY;
        const initPos = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        followerEl.style.transform = initPos;
        roundWrapEl.style.transform = initPos;
      } else if (!rafId) {
        rafId = window.requestAnimationFrame(tickFollower);
      }

      applyCursorStateFromTarget(e.target);
    };

    // При скролле страницы без движения мыши определяем новый блок под курсором через elementFromPoint
    const onScroll = () => {
      if (!isVisible || scrollRafId || mouseX < 0 || mouseY < 0) return;
      scrollRafId = window.requestAnimationFrame(() => {
        scrollRafId = 0;
        const elUnderPointer = document.elementFromPoint(mouseX, mouseY);
        if (elUnderPointer) {
          applyCursorStateFromTarget(elUnderPointer);
        }
      });
    };

    const onMouseLeaveWindow = () => {
      isVisible = false;
      currentIsRound = false;
      followerEl.style.opacity = '0';
      dotEl.style.opacity = '0';
      roundCircleEl.dataset.visible = 'false';
      roundCircleEl.dataset.expanded = 'false';
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      if (rafId) window.cancelAnimationFrame(rafId);
      if (scrollRafId) window.cancelAnimationFrame(scrollRafId);
    };
  }, []);

  return (
    <>
      <GlobalCursorFollower
        ref={followerRef}
        aria-hidden="true"
        data-testid="global-custom-cursor"
      >
        <span className="cursor-tag" ref={tagRef}>
          cyberarena
        </span>
      </GlobalCursorFollower>
      <GlobalCursorDot ref={dotRef} aria-hidden="true" />
      <GlobalRoundCursorWrap ref={roundWrapRef} aria-hidden="true">
        <GlobalRoundCursorCircle
          ref={roundCircleRef}
          data-visible="false"
          data-expanded="false"
        >
          <span ref={roundLabelRef}>смотреть</span>
        </GlobalRoundCursorCircle>
      </GlobalRoundCursorWrap>
    </>
  );
};

export default CustomCursor;
