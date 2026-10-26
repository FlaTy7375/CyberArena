import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Инициализирует плавный инерционный скролл Lenis и синхронизирует его с GSAP ScrollTrigger.
 */
export function initSmoothScroll({ reducedMotion = false } = {}) {
  if (reducedMotion || typeof window === 'undefined') {
    return {
      lenis: null,
      destroy: () => {},
    };
  }

  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.2,
  });

  window.__lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);

  const tickerCallback = (time) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    },
  };
}

/**
 * Настраивает двухфазную скролл-анимацию для второго экрана (About):
 * - Пинится вся сетка `gridEl` (`AboutGrid`):
 *   - На десктопе (>= 1024px): в точке `'center-=35 center'`, когда заголовок над сеткой уже ушёл вверх.
 *   - На мобильных (< 1024px): в точке `'top 76px'` (сразу под шапкой), благодаря чему заголовок над сценой,
 *     сама 3D-сцена и описание под сценой (`AboutContent`) стоят на своих местах как единое целое и не разъезжаются.
 */
export function setupScrollAnimation({
  gridEl,
  visualColEl,
  viewportEl,
  entranceWrapper,
  assembly,
  camera,
  baseCameraPos,
  baseScale = 0.86,
  explodedScale = 0.8,
  isMobile = false,
  reducedMotion = false,
  scrollState,
}) {
  const targetPinEl = gridEl || visualColEl;

  if (!targetPinEl || !assembly || reducedMotion) {
    if (scrollState) {
      scrollState.progress = 0;
      scrollState.calloutAlpha = 0;
    }
    if (viewportEl) {
      viewportEl.style.opacity = '1';
    }
    return {
      kill: () => {},
    };
  }

  const { rootGroup, initialRotation, components } = assembly;
  const distScale = isMobile ? 0.72 : 1.0;

  // На ПК стопаем на 60px раньше ('center-=35 center' вместо 'center+=25 center')
  const entranceEnd = isMobile ? 'top 115px' : 'center-=75 center';
  const pinStart = isMobile ? 'top 76px' : 'center-=35 center';

  rootGroup.scale.setScalar(baseScale);
  rootGroup.position.set(0, 0, 0);
  rootGroup.rotation.copy(initialRotation);

  // Начальное состояние обёртки входа (Фаза А работает только с entranceWrapper)
  if (entranceWrapper) {
    entranceWrapper.scale.setScalar(0.88);
    entranceWrapper.position.y = -0.22;
    entranceWrapper.rotation.set(0.04, -0.2, 0);
  }

  if (viewportEl) {
    viewportEl.style.opacity = '0';
  }

  // ---------------------------------------------------------------------------
  // ФАЗА А: Аккуратное появление ПК при подходе ко второму экрану
  // (заканчивается чуть раньше точки pinStart, чтобы не конфликтовать с Фазой Б)
  // ---------------------------------------------------------------------------
  const entranceTl = gsap.timeline({
    scrollTrigger: {
      trigger: targetPinEl,
      start: 'top 94%',
      end: entranceEnd,
      scrub: 0.75,
      invalidateOnRefresh: true,
    },
  });

  if (viewportEl) {
    entranceTl.fromTo(
      viewportEl,
      { opacity: 0 },
      { opacity: 1, ease: 'sine.out', duration: 0.65 },
      0.0
    );
  }

  if (entranceWrapper) {
    entranceTl.to(
      entranceWrapper.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        ease: 'power2.out',
        duration: 1.0,
      },
      0.0
    );

    entranceTl.to(
      entranceWrapper.position,
      {
        y: 0,
        ease: 'power2.out',
        duration: 1.0,
      },
      0.0
    );

    entranceTl.to(
      entranceWrapper.rotation,
      {
        x: 0,
        y: 0,
        z: 0,
        ease: 'power2.out',
        duration: 1.0,
      },
      0.0
    );
  }

  // ---------------------------------------------------------------------------
  // ФАЗА Б: Закрепление (pin) и плавный разлёт ПК на комплектующие
  // ---------------------------------------------------------------------------
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: targetPinEl,
      start: pinStart,
      end: isMobile ? '+=155%' : '+=210%',
      pin: targetPinEl,
      scrub: isMobile ? 0.85 : 1.1,
      anticipatePin: 0,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (scrollState) {
          scrollState.progress = self.progress;
        }
      },
    },
  });

  // 1. Боковая стеклянная панель плавно отъезжает первой (0.02 -> 0.32)
  const glass = components.glass;
  tl.to(
    glass.position,
    {
      x: glass.userData.basePos.x + glass.userData.explodePos.x * distScale,
      y: glass.userData.basePos.y + glass.userData.explodePos.y * distScale,
      z: glass.userData.basePos.z + glass.userData.explodePos.z * distScale,
      ease: 'power2.inOut',
      duration: 0.3,
    },
    0.02
  );

  tl.to(
    glass.rotation,
    {
      x: glass.userData.baseRot.x + glass.userData.explodeRot.x,
      y: glass.userData.baseRot.y + glass.userData.explodeRot.y,
      z: glass.userData.baseRot.z + glass.userData.explodeRot.z,
      ease: 'power2.inOut',
      duration: 0.3,
    },
    0.02
  );

  // 2. Плавный разворот всей модели и деликатный отъезд камеры при разлёте
  tl.to(
    rootGroup.rotation,
    {
      x: initialRotation.x + 0.07,
      y: initialRotation.y - 0.4,
      z: initialRotation.z + 0.02,
      ease: 'sine.inOut',
      duration: 0.92,
    },
    0.04
  );

  tl.to(
    rootGroup.scale,
    {
      x: explodedScale,
      y: explodedScale,
      z: explodedScale,
      ease: 'sine.inOut',
      duration: 0.88,
    },
    0.06
  );

  tl.to(
    camera.position,
    {
      z: baseCameraPos.z + (isMobile ? 0.85 : 0.95),
      y: baseCameraPos.y + 0.04,
      ease: 'sine.inOut',
      duration: 0.88,
    },
    0.06
  );

  // 3. Мягкий разлёт остальных комплектующих (power2.inOut / sine.inOut)
  const schedulePartExplosion = (part, startTime, duration, ease = 'power2.inOut') => {
    const { basePos, baseRot, explodePos, explodeRot } = part.userData;
    tl.to(
      part.position,
      {
        x: basePos.x + explodePos.x * distScale,
        y: basePos.y + explodePos.y * distScale,
        z: basePos.z + explodePos.z * distScale,
        ease,
        duration,
      },
      startTime
    );

    tl.to(
      part.rotation,
      {
        x: baseRot.x + explodeRot.x,
        y: baseRot.y + explodeRot.y,
        z: baseRot.z + explodeRot.z,
        ease,
        duration,
      },
      startTime
    );
  };

  schedulePartExplosion(components.gpu, 0.12, 0.76, 'power2.inOut');
  schedulePartExplosion(components.fans, 0.14, 0.76, 'power2.inOut');

  const fanUnits = components.fans.userData.fanUnits || [];
  fanUnits.forEach((unit, idx) => {
    const spreadY = (1 - idx) * 0.34 * distScale;
    const spreadZ = (idx - 1) * 0.22 * distScale;
    tl.to(
      unit.position,
      {
        y: unit.userData.baseY + spreadY,
        z: spreadZ,
        ease: 'sine.inOut',
        duration: 0.7,
      },
      0.18
    );
  });

  schedulePartExplosion(components.ram, 0.16, 0.74, 'power2.inOut');

  const ramSticks = components.ram.userData.sticks || [];
  ramSticks.forEach((stick, idx) => {
    const offset = idx === 0 ? -0.14 : 0.14;
    tl.to(
      stick.position,
      {
        x: stick.userData.baseX + offset * distScale,
        z: idx === 0 ? -0.08 : 0.12,
        ease: 'sine.inOut',
        duration: 0.68,
      },
      0.22
    );
  });

  schedulePartExplosion(components.cpu, 0.18, 0.74, 'power2.inOut');
  schedulePartExplosion(components.ssd, 0.2, 0.72, 'power2.inOut');
  schedulePartExplosion(components.psu, 0.2, 0.72, 'power2.inOut');
  schedulePartExplosion(components.motherboard, 0.15, 0.76, 'power2.inOut');
  schedulePartExplosion(components.case, 0.12, 0.78, 'sine.inOut');

  if (scrollState) {
    tl.to(
      scrollState,
      {
        calloutAlpha: 1,
        ease: 'sine.inOut',
        duration: 0.45,
      },
      0.38
    );
  }

  tl.to({}, { duration: 0.06 }, 0.94);

  return {
    entranceTimeline: entranceTl,
    timeline: tl,
    kill: () => {
      if (entranceTl.scrollTrigger) entranceTl.scrollTrigger.kill();
      entranceTl.kill();
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    },
  };
}
