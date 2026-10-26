import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { createGamingPCAssembly, PC_COLORS } from './pcModelBuilder';
import { setupScrollAnimation } from './pcScrollAnimation';
import {
  SceneViewport,
  CanvasContainer,
  CalloutsSvg,
  CalloutsLayer,
  CalloutItem,
  CalloutTitle,
} from './style';

/**
 * Компактные выноски (тонкая линия + подпись возле каждого разлетевшегося компонента)
 */
const CALLOUT_CONFIGS = [
  {
    id: 'cpu',
    title: 'Core i9 + СЖО 360',
    dx: -84,
    dy: -54,
    align: 'right',
    threshold: 0.36,
  },
  {
    id: 'ram',
    title: 'DDR5 RGB RAM',
    dx: 78,
    dy: -48,
    align: 'left',
    threshold: 0.38,
  },
  {
    id: 'motherboard',
    title: 'Z790 Motherboard',
    dx: -92,
    dy: -14,
    align: 'right',
    threshold: 0.42,
  },
  {
    id: 'fans',
    title: '3× ARGB Fans',
    dx: 82,
    dy: 4,
    align: 'left',
    threshold: 0.4,
  },
  {
    id: 'ssd',
    title: 'NVMe M.2 SSD',
    dx: -92,
    dy: 8,
    align: 'right',
    threshold: 0.45,
  },
  {
    id: 'gpu',
    title: 'RTX 4080 / 4090 GPU',
    dx: 78,
    dy: 44,
    align: 'left',
    threshold: 0.32,
  },
  {
    id: 'glass',
    title: 'Tempered Glass',
    dx: -88,
    dy: 24,
    align: 'right',
    threshold: 0.24,
  },
  {
    id: 'psu',
    title: '1000W Modular PSU',
    dx: 72,
    dy: 62,
    align: 'left',
    threshold: 0.48,
  },
];

const PCSceneCanvas = ({ gridRef, visualColRef }) => {
  const viewportRef = useRef(null);
  const canvasHostRef = useRef(null);
  const labelRefs = useRef({});
  const lineRefs = useRef({});
  const dotRefs = useRef({});

  useEffect(() => {
    const container = canvasHostRef.current;
    const viewportEl = viewportRef.current;
    if (!container || !viewportEl) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Важно: 1024px совпадает с theme.breakpoints.lg, где AboutGrid переключается с 1 колонки на 2 колонки
    const isMobile = window.innerWidth < 1024;

    // -------------------------------------------------------------------------
    // 1. СЦЕНА, КАМЕРА И РЕНДЕРЕР (стабильные 60 FPS без лагов + чёткая картинка на телефонах)
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    // Золотая середина стартовой дистанции камеры (~70% заполнения витрины в начале)
    const baseCameraPos = new THREE.Vector3(
      0.0,
      0.06,
      isMobile ? 10.2 : 9.45
    );
    camera.position.copy(baseCameraPos);
    camera.lookAt(0, -0.04, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      });
    } catch {
      return undefined;
    }

    // Оптимальный DPR <= 1.5 на всех устройствах: чёткая Retina-графика без перегрузки видеопамяти телефона
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = false;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------------------
    // 2. HDRI ENVIRONMENT (RoomEnvironment) + СБАЛАНСИРОВАННЫЙ СТУДИЙНЫЙ СВЕТ
    // -------------------------------------------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const ambientLight = new THREE.AmbientLight(0x181c26, 0.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf4f7ff, 1.75);
    keyLight.position.set(4.5, 6.5, 5.5);
    scene.add(keyLight);

    const rimLightLime = new THREE.SpotLight(
      PC_COLORS.neonPrimary,
      1.85,
      16,
      Math.PI / 3,
      0.75,
      1.5
    );
    rimLightLime.position.set(-4.8, 3.2, -3.6);
    scene.add(rimLightLime);

    const accentLight = new THREE.PointLight(PC_COLORS.neonSecondary, 0.85, 10, 1.8);
    accentLight.position.set(2.8, -2.4, 3.4);
    scene.add(accentLight);

    const coolFillLight = new THREE.DirectionalLight(0x7a96ff, 0.95);
    coolFillLight.position.set(-3.8, -1.5, 4.5);
    scene.add(coolFillLight);

    // -------------------------------------------------------------------------
    // 3. ПОСТОБРАБОТКА (на ПК — лёгкий EffectComposer без двойного DPR;
    // на мобильных — прямой аппаратный рендер с MSAA без 12 лишних FBO-буферов в VRAM)
    // -------------------------------------------------------------------------
    let renderTarget = null;
    let composer = null;
    let bloomPass = null;
    let outputPass = null;

    if (!isMobile) {
      renderTarget = new THREE.WebGLRenderTarget(width, height, {
        format: THREE.RGBAFormat,
        samples: 2,
      });

      composer = new EffectComposer(renderer, renderTarget);
      composer.setPixelRatio(dpr);
      const renderPass = new RenderPass(scene, camera);
      renderPass.clearAlpha = 0;
      composer.addPass(renderPass);

      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(Math.max(1, Math.floor(width * 0.5)), Math.max(1, Math.floor(height * 0.5))),
        0.09,
        0.14,
        0.94
      );
      composer.addPass(bloomPass);

      outputPass = new OutputPass();
      composer.addPass(outputPass);
    }

    // -------------------------------------------------------------------------
    // 4. СБОРКА 3D-МОДЕЛИ ПК (8 групп компонентов)
    // -------------------------------------------------------------------------
    const idleWrapper = new THREE.Group();
    idleWrapper.name = 'idleParallaxWrapper';
    scene.add(idleWrapper);

    const entranceWrapper = new THREE.Group();
    entranceWrapper.name = 'scrollEntranceWrapper';
    idleWrapper.add(entranceWrapper);

    // Сбалансированный масштаб: не мелкий и не слишком огромный
    const baseScale = isMobile ? 0.78 : 0.86;
    const explodedScale = isMobile ? 0.72 : 0.8;

    const assembly = createGamingPCAssembly({ isMobile: false });
    assembly.rootGroup.scale.setScalar(baseScale);
    entranceWrapper.add(assembly.rootGroup);

    // -------------------------------------------------------------------------
    // 5. АНИМАЦИЯ ПОЯВЛЕНИЯ И РАЗЛЁТА ПРИ СКРОЛЛЕ (GSAP ScrollTrigger)
    // -------------------------------------------------------------------------
    const scrollState = {
      progress: 0,
      calloutAlpha: 0,
    };

    const scrollAnim = setupScrollAnimation({
      gridEl: gridRef?.current,
      visualColEl: visualColRef?.current,
      viewportEl,
      entranceWrapper,
      assembly,
      camera,
      baseCameraPos,
      baseScale,
      explodedScale,
      isMobile,
      reducedMotion,
      scrollState,
    });

    // -------------------------------------------------------------------------
    // 6. MOUSE PARALLAX, INTERSECTION OBSERVER & RENDER LOOP (60 FPS)
    // -------------------------------------------------------------------------
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const handlePointerMove = (e) => {
      if (reducedMotion || isMobile) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerTarget.x = nx;
      pointerTarget.y = ny;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let isVisible = true;
    const visibilityObserver =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
            },
            { rootMargin: '0px' }
          )
        : null;
    if (visibilityObserver) {
      visibilityObserver.observe(viewportEl);
    }

    const tempWorldVec = new THREE.Vector3();
    const tempNdcVec = new THREE.Vector3();

    let rafId = 0;
    let lastTime = performance.now();
    let smoothedProgress = 0;

    const animate = (now) => {
      rafId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      if (!isVisible) return;

      const elapsed = now * 0.001;

      const lerpFactor = 1 - Math.exp(-dt * 15);
      smoothedProgress += (scrollState.progress - smoothedProgress) * lerpFactor;

      if (!reducedMotion) {
        if (!isMobile) {
          const mouseLerp = 1 - Math.exp(-dt * 4.5);
          pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * mouseLerp;
          pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * mouseLerp;
          idleWrapper.rotation.y = pointerCurrent.x * 0.11;
          idleWrapper.rotation.x = pointerCurrent.y * 0.06;
        }

        idleWrapper.position.y = Math.sin(elapsed * 1.25) * 0.04;

        // Вращение вентиляторов (3 на видеокарте + 3 корпусных)
        const fanSpeedBoost = 1 + smoothedProgress * 0.55;
        for (let i = 0; i < assembly.allFanRotors.length; i++) {
          const rotor = assembly.allFanRotors[i];
          const speed = (rotor.userData.spinSpeed || 7) * fanSpeedBoost;
          if (rotor.parent?.userData?.fanIndex !== undefined) {
            rotor.rotation.x += speed * dt;
          } else {
            rotor.rotation.y += speed * dt;
          }
        }

        // Мягкая пульсация салатовой подсветки без пересвета
        const pulseWave = Math.sin(elapsed * 2.1) * 0.06 + Math.sin(elapsed * 4.6) * 0.02;
        for (let i = 0; i < assembly.resources.pulsingMaterials.length; i++) {
          const mat = assembly.resources.pulsingMaterials[i];
          mat.emissiveIntensity = mat.userData.baseIntensity + pulseWave;
        }
      }

      if (composer) {
        composer.render(dt);
      } else {
        renderer.render(scene, camera);
      }

      // Обновление выносок (тонкие линии + подписи возле разлетевшихся деталей)
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (cw > 0 && ch > 0) {
        for (let i = 0; i < CALLOUT_CONFIGS.length; i++) {
          const cfg = CALLOUT_CONFIGS[i];
          const partGroup = assembly.components[cfg.id];
          const labelEl = labelRefs.current[cfg.id];
          const lineEl = lineRefs.current[cfg.id];
          const dotEl = dotRefs.current[cfg.id];

          if (!partGroup || !labelEl || !lineEl || !dotEl) continue;

          const rawProgress = THREE.MathUtils.clamp(
            (smoothedProgress - cfg.threshold) / 0.25,
            0,
            1
          );
          const localProgress = rawProgress * rawProgress * (3 - 2 * rawProgress);

          if (localProgress <= 0.005 || reducedMotion) {
            if (labelEl.style.opacity !== '0') {
              labelEl.style.opacity = '0';
              lineEl.style.opacity = '0';
              dotEl.style.opacity = '0';
            }
            continue;
          }

          tempWorldVec.copy(partGroup.userData.anchorLocal);
          partGroup.localToWorld(tempWorldVec);
          tempNdcVec.copy(tempWorldVec).project(camera);

          const ax = (tempNdcVec.x * 0.5 + 0.5) * cw;
          const ay = (-tempNdcVec.y * 0.5 + 0.5) * ch;

          const scaleOffset = isMobile ? 0.56 : 1.0;
          const elbowY = ay + cfg.dy * scaleOffset;

          // Учитываем реальную ширину каждой таблички, чтобы левые выноски (CPU, Motherboard)
          // при translate(-100%, -50%) никогда не выходили за левый край контейнера
          const labelW = labelEl.offsetWidth || (isMobile ? 120 : 150);
          const edgePad = isMobile ? 4 : 12;
          const minX = cfg.align === 'right' ? labelW + edgePad : edgePad;
          const maxX = cfg.align === 'left' ? cw - labelW - edgePad : cw - edgePad;
          const lx = THREE.MathUtils.clamp(
            ax + cfg.dx * scaleOffset,
            minX,
            Math.max(minX, maxX)
          );
          const elbowX = ax + (lx - ax) * 0.55;
          const ly = THREE.MathUtils.clamp(elbowY, 20, ch - 20);

          dotEl.setAttribute('cx', ax.toFixed(1));
          dotEl.setAttribute('cy', ay.toFixed(1));
          dotEl.style.opacity = localProgress.toFixed(3);

          lineEl.setAttribute(
            'points',
            `${ax.toFixed(1)},${ay.toFixed(1)} ${elbowX.toFixed(1)},${ly.toFixed(1)} ${lx.toFixed(1)},${ly.toFixed(1)}`
          );
          lineEl.style.opacity = (localProgress * 0.85).toFixed(3);

          labelEl.style.opacity = localProgress.toFixed(3);
          labelEl.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0) translate(${
            cfg.align === 'right' ? '-100%' : '0%'
          }, -50%) translateY(${((1 - localProgress) * 6).toFixed(1)}px)`;
        }
      }
    };

    rafId = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    // 7. RESIZE & DISPOSE
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 640;
      const newH = container.clientHeight || 520;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();

      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(nextDpr);
      renderer.setSize(newW, newH);
      if (composer) {
        composer.setPixelRatio(nextDpr);
        composer.setSize(newW, newH);
      }
      if (bloomPass) {
        bloomPass.resolution.set(
          Math.max(1, Math.floor(newW * 0.5)),
          Math.max(1, Math.floor(newH * 0.5))
        );
      }
    };

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(handleResize)
        : null;
    if (resizeObserver) {
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (visibilityObserver) visibilityObserver.disconnect();

      scrollAnim.kill();
      assembly.resources.disposeAll();
      envTarget.dispose();
      if (renderTarget) renderTarget.dispose();
      if (bloomPass) bloomPass.dispose();
      if (outputPass) outputPass.dispose();
      if (composer) composer.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gridRef, visualColRef]);

  return (
    <SceneViewport ref={viewportRef} data-testid="about-3d-viewport">
      <CanvasContainer ref={canvasHostRef} data-testid="about-3d-canvas" />

      <CalloutsSvg aria-hidden="true">
        {CALLOUT_CONFIGS.map((cfg) => (
          <g key={cfg.id}>
            <polyline
              ref={(el) => {
                lineRefs.current[cfg.id] = el;
              }}
              fill="none"
              stroke="#B6FF00"
              strokeWidth="1"
              style={{ opacity: 0 }}
            />
            <circle
              ref={(el) => {
                dotRefs.current[cfg.id] = el;
              }}
              r="2.8"
              fill="#B6FF00"
              stroke="#0a0a0a"
              strokeWidth="1"
              style={{ opacity: 0 }}
            />
          </g>
        ))}
      </CalloutsSvg>

      <CalloutsLayer aria-hidden="true">
        {CALLOUT_CONFIGS.map((cfg) => (
          <CalloutItem
            key={cfg.id}
            $align={cfg.align}
            data-testid={`pc-callout-${cfg.id}`}
            ref={(el) => {
              labelRefs.current[cfg.id] = el;
            }}
            style={{ opacity: 0 }}
          >
            <CalloutTitle>{cfg.title}</CalloutTitle>
          </CalloutItem>
        ))}
      </CalloutsLayer>
    </SceneViewport>
  );
};

export default PCSceneCanvas;
