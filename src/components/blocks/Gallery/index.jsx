import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  TUNNEL_PARAMS,
  GallerySection,
  TunnelViewport,
  WebGLCanvasWrap,
  FilmGrainOverlay,
  IntroOverlay,
  SectionKicker,
  GiantTitle,
  IntroSubtitle,
  TopTelemetryBar,
  FlightHudBottom,
  InspectCaptionBar,
  FinaleOverlay,
  KeyboardFrameNav,
  VisuallyHiddenSeoList,
  FallbackSectionWrap,
  FallbackStrip,
  GalleryCursorFollower,
  GalleryCursorDot,
  MobileShowcaseWrap,
  MobileZoneFilterRow,
  MobileDeckTrack,
  MobileSlideCard,
  MobileDeckControls,
  MobileFinaleBanner,
  MobileLightboxModal,
} from './style';

gsap.registerPlugin(ScrollTrigger);

/* ============================================================================
 * ДАННЫЕ КАДРОВ В НАЧАЛЕ ФАЙЛА ({ src, alt, ratio, zone, time, caption })
 * Строго 9 уникальных фотографий gal1–gal9 из корня проекта (без повторов).
 * Кадр №09 (gal7.webp — главный амфитеатр) завершает пролёт как панорамный финал.
 * ========================================================================== */

export const GALLERY_FRAMES = [
  {
    src: 'images/gal1.webp',
    mobileSrc: 'images/gal1-sm.webp',
    alt: 'Турнирный ряд мест 27–31 с верхними сетчатыми боксами системных блоков и зелёным неоном',
    ratio: '3:2',
    zone: 'PRO ZONE',
    time: '14:32',
    caption: 'Линия №27–31 · RTX 4090 в верхних вентилируемых боксах',
  },
  {
    src: 'images/gal2.webp',
    mobileSrc: 'images/gal2-sm.webp',
    alt: 'Приватный лаунж-бокс с диваном перед большим экраном и двумя игровыми станциями',
    ratio: '16:11',
    zone: 'VIP DUO LOUNGE',
    time: '15:18',
    caption: 'Закрытый бокс на двоих · лаунж-диван и 2 станции 240 Гц',
  },
  {
    src: 'images/gal3.webp',
    mobileSrc: 'images/gal3-sm.webp',
    alt: 'Проекционный зал с гигантским экраном Cyber Arena, пуфами и контурной подсветкой пола',
    ratio: '16:9',
    zone: 'PS5 CINEMA',
    time: '16:40',
    caption: 'Экран 150 дюймов · трансляции мейджоров и консольные турниры',
  },
  {
    src: 'images/gal4.webp',
    mobileSrc: 'images/gal4-sm.webp',
    alt: 'Свободный полигон виртуальной реальности с неоновой разметкой игровых секторов на полу',
    ratio: '4:3',
    zone: 'VR ARENA',
    time: '17:25',
    caption: 'Беспроводной VR-полигон · разметка 4 активных секторов',
  },
  {
    src: 'images/gal5.webp',
    mobileSrc: 'images/gal5-sm.webp',
    alt: 'Игровой зал в салатовом свете с кастомной настенной графикой и рядом системных блоков сверху',
    ratio: '4:3',
    zone: 'STANDARD ZONE',
    time: '18:10',
    caption: 'Основной зал · 20 синхронных машин без перепадов пинга',
  },
  {
    src: 'images/gal6.webp',
    mobileSrc: 'images/gal6-sm.webp',
    alt: 'Стрим-студия с вертикальным монитором чата, микрофоном на пантографе и окном в зал',
    ratio: '16:9',
    zone: 'STREAM STUDIO',
    time: '19:05',
    caption: 'Эфирная рубка · двухмониторный пост, XLR-тракт и звукоизоляция',
  },
  {
    src: 'images/gal8.webp',
    mobileSrc: 'images/gal8-sm.webp',
    alt: 'Уединённая кабина на два игровых места с акустическими перегородками и тёплым светом',
    ratio: '3:2',
    zone: 'DUO BOOTCAMP',
    time: '21:45',
    caption: 'Парный кокпит · глубокие акустические перегородки и тихий климат',
  },
  {
    src: 'images/gal9.webp',
    mobileSrc: 'images/gal9-sm.webp',
    alt: 'Командный тренировочный ряд из пяти станций с прозрачными корпусами ПК на верхней полке',
    ratio: '4:3',
    zone: 'BOOTCAMP 5×5',
    time: '22:50',
    caption: 'Тренировочная комната команды · 5 машин в одну линию',
  },
  {
    src: 'images/gal7.webp',
    mobileSrc: 'images/gal7-sm.webp',
    alt: 'Главный киберспортивный амфитеатр Cyber Arena со сценой, трибуной и большим LED-экраном',
    ratio: '16:9',
    zone: 'MAIN ARENA',
    time: '23:40',
    caption: 'Турнирный амфитеатр · сцена 5×5, трибуна и балкон лаунж-бара',
  },
];

/* ============================================================================
 * СПИРАЛЬНАЯ / ЗИГЗАГООБРАЗНАЯ РАСКЛАДКА 9 УНИКАЛЬНЫХ КАДРОВ ВДОЛЬ ОСИ -Z
 * 9-й кадр (индекс 8, gal7.webp) — панорамный финал в конце туннеля.
 * ========================================================================== */

const SPIRAL_SLOTS = [
  { x: 1.75, y: -0.32, z: -5.5, rotY: -0.18, rotZ: 0.016, baseScale: 1.04 },
  { x: -1.92, y: -0.58, z: -19.0, rotY: 0.19, rotZ: -0.018, baseScale: 1.02 },
  { x: 1.68, y: 0.72, z: -32.5, rotY: -0.16, rotZ: 0.015, baseScale: 1.06 },
  { x: -1.78, y: 0.48, z: -46.0, rotY: 0.17, rotZ: -0.016, baseScale: 1.0 },
  { x: 1.88, y: -0.52, z: -59.5, rotY: -0.19, rotZ: -0.014, baseScale: 1.04 },
  { x: -1.65, y: 0.68, z: -73.0, rotY: 0.15, rotZ: 0.018, baseScale: 1.08 },
  { x: 1.78, y: -0.46, z: -86.5, rotY: -0.17, rotZ: 0.016, baseScale: 1.02 },
  { x: -1.72, y: 0.36, z: -100.0, rotY: 0.16, rotZ: -0.015, baseScale: 1.02 },
  // 9-й кадр — панорамный финал амфитеатра по центру выхода из туннеля
  { x: 0.0, y: 0.12, z: -116.5, rotY: 0.0, rotZ: 0.0, baseScale: 1.68, isFinale: true },
];

function parseRatioDimensions(ratioStr, scaleMul = 1) {
  const parts = String(ratioStr || '16:9')
    .split(':')
    .map(Number);
  const rw = parts[0] || 16;
  const rh = parts[1] || 9;
  const aspect = rw / rh;
  const baseArea = 10.2;
  const height = Math.sqrt(baseArea / aspect) * scaleMul;
  const width = height * aspect;
  return { width, height, aspect };
}

/**
 * Кривая удержания фокуса на каждом кадре:
 * при переходе между кадром k и k+1 камера слегка задерживает взгляд на кадре,
 * а затем плавно перелетает к следующему.
 */
function smoothFocusStep(t) {
  const clamped = Math.max(0, Math.min(1, t));
  // Комбинация плавного плато в начале/конце и S-кривой в середине
  return clamped * clamped * (3 - 2 * clamped);
}

/* ============================================================================
 * GLSL ШЕЙДЕРЫ ДЛЯ ПЛОСКОСТЕЙ ФОТОГРАФИЙ (ShaderMaterial)
 * Uniforms: uTexture, uVelocity, uHover, uFocus, uMouse, uTime
 * ========================================================================== */

const PHOTO_VERTEX_SHADER = /* glsl */ `
  uniform float uVelocity;
  uniform float uHover;
  uniform float uFocus;
  uniform float uTime;

  varying vec2 vUv;
  varying float vViewDepth;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // При высокой скорости пролёта плоскость слегка прогибается от встречного потока
    float edgeMask = sin(uv.x * 3.14159265) * sin(uv.y * 3.14159265);
    float speedBend = clamp(uVelocity * 0.20, -0.34, 0.34) * edgeMask;
    pos.z -= speedBend;

    // Лёгкое дыхание плоскости в фокусе или при наведении
    pos.z += sin(uTime * 2.8 + uv.x * 3.5) * 0.014 * max(uHover, uFocus * 0.6);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PHOTO_FRAGMENT_SHADER_DESKTOP = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uFocus;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uRippleAge;
  uniform float uOpacity;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uGradeIntensity;
  uniform float uStretchStrength;
  uniform float uRgbSplitStrength;
  uniform float uRippleStrength;

  varying vec2 vUv;
  varying float vViewDepth;

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;

    // 1. Вытягивание UV по направлению полёта при высокой скорости скролла
    float speedMag = clamp(abs(uVelocity), 0.0, 2.4);
    float stretch = speedMag * uStretchStrength;
    uv.y = 0.5 + centered.y * (1.0 - stretch * 0.38);
    uv.x = 0.5 + centered.x * (1.0 - stretch * 0.16 * (0.5 + abs(centered.y)));

    // 2. Hover-волна (ripple) от точки курсора (raycaster -> uv), затухает по радиусу и времени
    vec2 toMouse = uv - uMouse;
    float dist = length(toMouse);
    float timeDecay = exp(-uRippleAge * 1.35);
    float radialDecay = exp(-dist * 5.8);
    float wave = sin(dist * 36.0 - uTime * 10.5) * radialDecay * timeDecay * uHover;
    vec2 dir = dist > 0.0001 ? (toMouse / dist) : vec2(0.0);
    uv += dir * wave * uRippleStrength;

    uv = clamp(uv, 0.002, 0.998);

    // 3. RGB-split пропорционально скорости uVelocity + сдвиг на волне ripple
    vec2 rgbShift = centered * (speedMag * uRgbSplitStrength)
                  + vec2(0.0, uVelocity * uRgbSplitStrength * 0.32)
                  + dir * (wave * 0.006);

    float r = texture2D(uTexture, clamp(uv + rgbShift, 0.002, 0.998)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, clamp(uv - rgbShift, 0.002, 0.998)).b;
    vec3 color = vec3(r, g, b);

    // 4. Единый цветокор в шейдере: холодные тени, салатовый оттенок в светах
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 coldShadow = vec3(0.025, 0.055, 0.095);
    vec3 neonHighlight = vec3(0.714, 1.0, 0.0); // #B6FF00

    vec3 graded = color * 0.92;
    graded = (graded - 0.5) * 1.08 + 0.5;
    graded = mix(graded, coldShadow + graded * 0.66, (1.0 - smoothstep(0.0, 0.46, luma)) * 0.48);
    float highlightMask = smoothstep(0.54, 0.96, luma);
    graded = mix(graded, graded * vec3(0.90, 1.05, 0.76) + neonHighlight * 0.10, highlightMask * 0.58);

    color = mix(color, clamp(graded, 0.0, 0.88), uGradeIntensity);

    // Фокус на текущем кадре: активный кадр ярче и чище, дальние чуть приглушены
    float focusBoost = mix(0.72, 1.08, clamp(uFocus + uHover * 0.5, 0.0, 1.0));
    color *= focusBoost;

    // 5. Виньетка по краям кадра
    vec2 vigUv = vUv * (1.0 - vUv.yx);
    float vig = pow(clamp(vigUv.x * vigUv.y * 16.0, 0.0, 1.0), 0.24);
    color *= mix(0.46, 1.0, vig);

    // Салатовые уголки и тонкий контур видоискателя (загораются при фокусе и hover)
    float activeGlow = clamp(uFocus * 0.75 + uHover * 0.85, 0.0, 1.0);
    vec2 edgeDist = min(vUv, 1.0 - vUv);
    float cornerLen = mix(0.045, 0.09, activeGlow);
    float cornerThick = 0.0045;
    float isCorner = step(edgeDist.x, cornerLen) * step(edgeDist.y, cornerThick)
                   + step(edgeDist.y, cornerLen) * step(edgeDist.x, cornerThick);
    isCorner = clamp(isCorner, 0.0, 1.0);
    vec3 cornerNeon = vec3(0.82, 1.18, 0.08) * mix(0.35, 1.3, activeGlow);
    color = mix(color, cornerNeon, isCorner * 0.9);

    // 6. Чёрный экспоненциальный туман FogExp2
    float fogFactor = 1.0 - exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
    fogFactor = clamp(fogFactor, 0.0, 1.0);

    vec3 finalColor = mix(color, uFogColor, fogFactor);
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

const PHOTO_FRAGMENT_SHADER_MOBILE = /* glsl */ `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform float uVelocity;
  uniform float uHover;
  uniform float uFocus;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uGradeIntensity;

  varying vec2 vUv;
  varying float vViewDepth;

  void main() {
    vec2 uv = vUv;
    float stretch = clamp(abs(uVelocity) * 0.08, 0.0, 0.16);
    uv.y = 0.5 + (uv.y - 0.5) * (1.0 - stretch);

    vec3 color = texture2D(uTexture, clamp(uv, 0.002, 0.998)).rgb;
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    vec3 graded = color * 0.92;
    graded = mix(graded, vec3(0.03, 0.06, 0.10) + graded * 0.66, (1.0 - luma) * 0.36);
    graded += vec3(0.714, 1.0, 0.0) * smoothstep(0.58, 0.95, luma) * 0.06;
    color = mix(color, graded, uGradeIntensity);
    color *= mix(0.78, 1.06, clamp(uFocus, 0.0, 1.0));

    vec2 vigUv = vUv * (1.0 - vUv.yx);
    float vig = pow(clamp(vigUv.x * vigUv.y * 15.0, 0.0, 1.0), 0.24);
    color *= mix(0.46, 1.0, vig);

    float fogFactor = 1.0 - exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
    vec3 finalColor = mix(color, uFogColor, clamp(fogFactor, 0.0, 1.0));
    gl_FragColor = vec4(finalColor, uOpacity);
  }
`;

/* ============================================================================
 * ШЕЙДЕРЫ ДЛЯ 3D АРХИТЕКТУРНЫХ ПОРТАЛОВ И ОПТИЧЕСКИХ ЧАСТИЦ ТУННЕЛЯ
 * ========================================================================== */

const PORTAL_VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldPos;
  varying float vViewDepth;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = viewMatrix * worldPos;
    vViewDepth = -mvPos.z;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const PORTAL_FRAGMENT_SHADER = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uCameraZ;
  uniform float uVelocity;
  uniform float uFogDensity;

  varying vec3 vWorldPos;
  varying float vViewDepth;

  void main() {
    // Бегущий сканирующий импульс вдоль рёбер архитектурного туннеля
    float wave = 0.5 + 0.5 * sin(vWorldPos.z * 0.22 + uTime * 3.2 + abs(vWorldPos.x) * 0.6);
    wave = pow(wave, 3.0);

    // Порталы рядом с камерой (в фокусе пролёта) подсвечиваются салатовым
    float distToCam = abs(vWorldPos.z - (uCameraZ - 7.5));
    float nearBand = exp(-distToCam * 0.14);

    vec3 baseGraphite = vec3(0.16, 0.20, 0.24);
    vec3 neonColor = vec3(0.85, 1.25, 0.08); // HDR #B6FF00

    float speedGlow = clamp(abs(uVelocity) * 0.6, 0.0, 0.6);
    float neonMix = clamp(wave * 0.55 + nearBand * 0.65 + speedGlow, 0.0, 1.0);
    vec3 col = mix(baseGraphite, neonColor, neonMix);

    float fogFactor = exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
    float alpha = (0.18 + neonMix * 0.52) * fogFactor;
    gl_FragColor = vec4(col * fogFactor, alpha);
  }
`;

/**
 * Создание геометрии одного скошенного архитектурного портала + направляющих рельс
 * и объединение 18 порталов вдоль туннеля в единый BufferGeometry (1 draw call).
 */
function createArchitecturalTunnelGeometry(portalCount, startZ, stepZ) {
  const vertices = [];

  const pushSeg = (x1, y1, z1, x2, y2, z2) => {
    vertices.push(x1, y1, z1, x2, y2, z2);
  };

  let prevRing = null;

  for (let i = 0; i < portalCount; i += 1) {
    const z = startZ - i * stepZ;
    // Лёгкое смещение и поворот порталов вдоль змейки туннеля
    const swayX = Math.sin(i * 0.65) * 0.55;
    const swayY = Math.cos(i * 0.5) * 0.22;
    const w = 6.2 + (i % 2) * 0.45;
    const h = 3.65 + (i % 3) * 0.22;
    const cut = 1.05; // скос углов 45°

    // 8 вершин восьмиугольного портала
    const pts = [
      [-w + cut + swayX, h + swayY, z],
      [w - cut + swayX, h + swayY, z],
      [w + swayX, h - cut + swayY, z],
      [w + swayX, -h + cut + swayY, z],
      [w - cut + swayX, -h + swayY, z],
      [-w + cut + swayX, -h + swayY, z],
      [-w + swayX, -h + cut + swayY, z],
      [-w + swayX, h - cut + swayY, z],
    ];

    for (let k = 0; k < 8; k += 1) {
      const a = pts[k];
      const b = pts[(k + 1) % 8];
      pushSeg(a[0], a[1], a[2], b[0], b[1], b[2]);
    }

    // Внутренние технические засечки по бокам и на полу портала
    pushSeg(-w - 0.35 + swayX, swayY, z, -w + 0.32 + swayX, swayY, z);
    pushSeg(w - 0.32 + swayX, swayY, z, w + 0.35 + swayX, swayY, z);
    pushSeg(swayX - 0.8, -h + swayY, z, swayX - 0.4, -h + 0.28 + swayY, z);
    pushSeg(swayX + 0.8, -h + swayY, z, swayX + 0.4, -h + 0.28 + swayY, z);

    // Продольные направляющие рельсы, соединяющие соседние порталы
    if (prevRing) {
      for (let k = 0; k < 8; k += 2) {
        pushSeg(
          prevRing[k][0],
          prevRing[k][1],
          prevRing[k][2],
          pts[k][0],
          pts[k][1],
          pts[k][2]
        );
      }
    }
    prevRing = pts;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  return geom;
}

/**
 * Создание 3D технической рамки-видоискателя и подвесных тросов вокруг каждого кадра.
 */
function createFrameRigGeometry(w, h, anchorSideX) {
  const hw = w * 0.53;
  const hh = h * 0.53;
  const bracketW = w * 0.14;
  const bracketH = h * 0.16;
  const zFront = 0.08;
  const zBack = -0.12;

  const verts = [];
  const seg = (x1, y1, z1, x2, y2, z2) => verts.push(x1, y1, z1, x2, y2, z2);

  // 4 передних L-образных уголка на выносе +0.08 по Z
  // Top-Left
  seg(-hw, hh, zFront, -hw + bracketW, hh, zFront);
  seg(-hw, hh, zFront, -hw, hh - bracketH, zFront);
  // Top-Right
  seg(hw, hh, zFront, hw - bracketW, hh, zFront);
  seg(hw, hh, zFront, hw, hh - bracketH, zFront);
  // Bottom-Right
  seg(hw, -hh, zFront, hw - bracketW, -hh, zFront);
  seg(hw, -hh, zFront, hw, -hh + bracketH, zFront);
  // Bottom-Left
  seg(-hw, -hh, zFront, -hw + bracketW, -hh, zFront);
  seg(-hw, -hh, zFront, -hw, -hh + bracketH, zFront);

  // Задний технический контур и диагональные распорки к стене туннеля
  seg(-hw * 0.96, hh * 0.96, zBack, hw * 0.96, hh * 0.96, zBack);
  seg(-hw * 0.96, -hh * 0.96, zBack, hw * 0.96, -hh * 0.96, zBack);

  const wallX = anchorSideX >= 0 ? hw + 2.4 : -hw - 2.4;
  seg(anchorSideX >= 0 ? hw : -hw, hh * 0.85, zBack, wallX, hh + 1.1, zBack - 1.2);
  seg(anchorSideX >= 0 ? hw : -hw, -hh * 0.85, zBack, wallX, -hh - 0.9, zBack - 1.2);

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  return geom;
}

/**
 * Создание лёгкой процедурной текстуры-плейсхолдера до ленивой подгрузки WebP.
 */
function createPlaceholderTexture(index, zoneLabel) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0B0C10';
  ctx.fillRect(0, 0, 256, 160);

  ctx.strokeStyle = 'rgba(182, 255, 0, 0.28)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 240, 144);

  ctx.fillStyle = 'rgba(182, 255, 0, 0.72)';
  ctx.font = 'bold 22px monospace';
  ctx.fillText(String(index + 1).padStart(2, '0'), 22, 42);

  ctx.fillStyle = 'rgba(242, 242, 245, 0.45)';
  ctx.font = '12px monospace';
  ctx.fillText(zoneLabel || 'CYBER ARENA', 22, 134);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function checkWebGLSupport() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

const Gallery = () => {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const canvasMountRef = useRef(null);
  const introOverlayRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const cursorDotRef = useRef(null);
  const depthReadoutRef = useRef(null);
  const hudCounterRef = useRef(null);
  const hudFillRef = useRef(null);
  const hudActiveZoneRef = useRef(null);
  const hudActiveCaptionRef = useRef(null);

  const [useFallback, setUseFallback] = useState(false);
  const [isMobileMode, setIsMobileMode] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  );
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [isAtFinale, setIsAtFinale] = useState(false);

  // Состояние мобильной интерактивной витрины (9 уникальных кадров)
  const [mobileActiveIdx, setMobileActiveIdx] = useState(0);
  const [mobileLightboxIdx, setMobileLightboxIdx] = useState(null);
  const mobileDeckRef = useRef(null);
  const mobileChipRefs = useRef([]);
  const mobileCardRefs = useRef([]);

  const sceneControllerRef = useRef({
    focusFrame: () => {},
    closeFocus: () => {},
    stepFocus: () => {},
  });

  const activeFrameCount = isMobileMode
    ? TUNNEL_PARAMS.mobileFrameCount
    : TUNNEL_PARAMS.desktopFrameCount;

  const activeFrames = GALLERY_FRAMES.slice(0, activeFrameCount);
  const inspectedFrame =
    focusedIndex !== null && activeFrames[focusedIndex] ? activeFrames[focusedIndex] : null;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 767px)');

    const updateModes = () => {
      const hasWebGL = checkWebGLSupport();
      setUseFallback(reducedMotionQuery.matches || !hasWebGL);
      setIsMobileMode(mobileQuery.matches);
    };

    updateModes();
    reducedMotionQuery.addEventListener?.('change', updateModes);
    mobileQuery.addEventListener?.('change', updateModes);

    return () => {
      reducedMotionQuery.removeEventListener?.('change', updateModes);
      mobileQuery.removeEventListener?.('change', updateModes);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    const ctx = gsap.context(() => {
      const lines = sectionRef.current.querySelectorAll('.line-inner');
      if (lines.length) {
        gsap.fromTo(
          lines,
          { yPercent: 112 },
          {
            yPercent: 0,
            duration: 0.95,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 82%',
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [useFallback]);

  // Основная WebGL-сцена (только для десктопа/планшетов >= 768px)
  useEffect(() => {
    if (useFallback || isMobileMode) return undefined;
    const mountEl = canvasMountRef.current;
    const viewportEl = viewportRef.current;
    const sectionEl = sectionRef.current;
    if (!mountEl || !viewportEl || !sectionEl) return undefined;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const frameCount = isMobile
      ? TUNNEL_PARAMS.mobileFrameCount
      : TUNNEL_PARAMS.desktopFrameCount;
    const framesData = GALLERY_FRAMES.slice(0, frameCount);

    // 1. Сцена, Чёрный FogExp2 и Перспективная камера
    const scene = new THREE.Scene();
    const bgHex = 0x07070a;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, TUNNEL_PARAMS.fogDensity);

    const width = mountEl.clientWidth || window.innerWidth;
    const height = mountEl.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(isMobile ? 58 : 50, width / height, 0.1, 175);

    // 2. Рендерер (pixelRatio <= 1.5 для стабильных 60–120 FPS на Retina/4K)
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      powerPreference: 'high-performance',
      alpha: false,
    });
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    mountEl.innerHTML = '';
    mountEl.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('data-testid', 'gallery-canvas');

    const maxAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy() || 1);

    // 3. Постобработка: UnrealBloomPass в half-res на десктопе (визуально идентично, в 4 раза легче для GPU)
    let composer = null;
    let bloomPass = null;
    if (!isMobile) {
      composer = new EffectComposer(renderer);
      composer.setPixelRatio(dpr);
      composer.addPass(new RenderPass(scene, camera));
      bloomPass = new UnrealBloomPass(
        new THREE.Vector2(Math.max(1, Math.floor(width * 0.5)), Math.max(1, Math.floor(height * 0.5))),
        TUNNEL_PARAMS.bloomStrength,
        TUNNEL_PARAMS.bloomRadius,
        TUNNEL_PARAMS.bloomThreshold
      );
      composer.addPass(bloomPass);
    }

    // 4. Архитектурный 3D-каркас туннеля (18 восьмиугольных порталов + направляющие рельсы)
    const tunnelArchitectureGeom = createArchitecturalTunnelGeometry(
      TUNNEL_PARAMS.portalCount,
      3.5,
      7.4
    );
    const tunnelArchitectureMat = new THREE.ShaderMaterial({
      vertexShader: PORTAL_VERTEX_SHADER,
      fragmentShader: PORTAL_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uCameraZ: { value: 3.0 },
        uVelocity: { value: 0 },
        uFogDensity: { value: TUNNEL_PARAMS.fogDensity },
      },
    });
    const tunnelArchitectureLines = new THREE.LineSegments(
      tunnelArchitectureGeom,
      tunnelArchitectureMat
    );
    scene.add(tunnelArchitectureLines);

    // 5. 3D оптические прицелы (+) и боке-частицы в объёме туннеля
    const pCount = isMobile ? 140 : TUNNEL_PARAMS.particleCount;
    const pPositions = new Float32Array(pCount * 3);
    const pSeeds = new Float32Array(pCount);
    for (let i = 0; i < pCount; i += 1) {
      const angle = (i * 2.39996) % (Math.PI * 2);
      const radius = 1.6 + ((i * 0.37) % 4.6);
      pPositions[i * 3] = Math.cos(angle) * radius * 1.25;
      pPositions[i * 3 + 1] = Math.sin(angle) * radius * 0.78;
      pPositions[i * 3 + 2] = 4.0 - ((i * 0.42) % 128.0);
      pSeeds[i] = (i % 10) * 0.1;
    }
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeom.setAttribute('aSeed', new THREE.BufferAttribute(pSeeds, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uFogDensity: { value: TUNNEL_PARAMS.fogDensity },
        uPixelRatio: { value: dpr },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vViewDepth;
        varying float vSeed;

        void main() {
          vSeed = aSeed;
          vec3 pos = position;
          pos.y += sin(uTime * 0.9 + aSeed * 18.0) * 0.14;
          pos.x += cos(uTime * 0.7 + aSeed * 14.0) * 0.12;
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vViewDepth = -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = clamp((24.0 * uPixelRatio) / max(vViewDepth, 1.0), 2.5, 11.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform float uFogDensity;
        varying float vViewDepth;
        varying float vSeed;

        void main() {
          vec2 p = abs(gl_PointCoord - 0.5);
          // Рисуем тонкий оптический крестик (+) или точку видоискателя
          float isCross = step(p.x, 0.09) * step(p.y, 0.42) + step(p.y, 0.09) * step(p.x, 0.42);
          float isDot = 1.0 - smoothstep(0.0, 0.35, length(gl_PointCoord - 0.5));
          float shape = vSeed > 0.45 ? clamp(isCross, 0.0, 1.0) : isDot;
          if (shape < 0.05) discard;

          float fog = exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
          vec3 col = mix(vec3(0.55, 0.65, 0.60), vec3(0.75, 1.15, 0.05), step(0.5, vSeed));
          gl_FragColor = vec4(col * fog, shape * 0.48 * fog);
        }
      `,
    });
    const particlePoints = new THREE.Points(particleGeom, particleMat);
    scene.add(particlePoints);

    // 6. Переиспользуемая единичная геометрия плоскости для всех 9 фотографий
    const sharedPlaneGeometry = new THREE.PlaneGeometry(
      1,
      1,
      isMobile ? 12 : 24,
      isMobile ? 12 : 24
    );
    const baseShaderMaterial = new THREE.ShaderMaterial({
      vertexShader: PHOTO_VERTEX_SHADER,
      fragmentShader: isMobile ? PHOTO_FRAGMENT_SHADER_MOBILE : PHOTO_FRAGMENT_SHADER_DESKTOP,
      transparent: true,
      depthWrite: true,
      uniforms: {
        uTexture: { value: null },
        uVelocity: { value: 0 },
        uHover: { value: 0 },
        uFocus: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uTime: { value: 0 },
        uRippleAge: { value: 10 },
        uOpacity: { value: 1 },
        uFogColor: { value: new THREE.Color(bgHex) },
        uFogDensity: { value: TUNNEL_PARAMS.fogDensity },
        uGradeIntensity: { value: TUNNEL_PARAMS.colorGradeIntensity },
        uStretchStrength: { value: TUNNEL_PARAMS.velocityStretch },
        uRgbSplitStrength: { value: TUNNEL_PARAMS.rgbSplitStrength },
        uRippleStrength: { value: TUNNEL_PARAMS.rippleStrength },
      },
    });

    // 7. Создание 9 уникальных плоскостей фото + их 3D технических подвесов и путевых точек фокуса камеры
    const photoMeshes = [];
    const rigGeometries = [];
    const rigMaterials = [];
    const placeholderTextures = [];
    const loadedTextures = new Map();
    const loadingIndices = new Set();
    const textureLoader = new THREE.TextureLoader();
    const stageWaypoints = [];
    let isDisposed = false;

    framesData.forEach((item, idx) => {
      const slot = SPIRAL_SLOTS[idx];
      const dims = parseRatioDimensions(
        item.ratio,
        slot.baseScale * (isMobile ? (slot.isFinale ? 0.72 : 0.78) : 1.0)
      );

      const placeholder = createPlaceholderTexture(idx, item.zone);
      placeholderTextures.push(placeholder);

      const mat = baseShaderMaterial.clone();
      mat.uniforms.uTexture.value = placeholder;

      const mesh = new THREE.Mesh(sharedPlaneGeometry, mat);
      const posX = isMobile ? slot.x * 0.48 : slot.x;
      const posY = isMobile ? slot.y * 0.62 : slot.y;

      mesh.position.set(posX, posY, slot.z);
      mesh.rotation.set(0, slot.rotY, slot.rotZ);
      mesh.scale.set(dims.width, dims.height, 1);

      // Внешний 3D технический подвес/рамка вокруг каждого фото
      const rigGeom = createFrameRigGeometry(dims.width, dims.height, posX);
      const rigMat = new THREE.LineBasicMaterial({
        color: 0xb6ff00,
        transparent: true,
        opacity: 0.25,
      });
      const rigLines = new THREE.LineSegments(rigGeom, rigMat);
      rigLines.position.set(posX, posY, slot.z);
      rigLines.rotation.set(0, slot.rotY, slot.rotZ);
      scene.add(rigLines);
      rigGeometries.push(rigGeom);
      rigMaterials.push(rigMat);

      mesh.userData = {
        index: idx,
        baseX: posX,
        baseY: posY,
        baseZ: slot.z,
        rotY: slot.rotY,
        rotZ: slot.rotZ,
        width: dims.width,
        height: dims.height,
        isFinale: Boolean(slot.isFinale),
        rigLines,
        rigMat,
        currentHover: 0,
        targetHover: 0,
        currentZOffset: 0,
        targetZOffset: 0,
        rippleAge: 10,
        targetOpacity: 1,
        targetFog: TUNNEL_PARAMS.fogDensity,
      };

      scene.add(mesh);
      photoMeshes.push(mesh);

      // Путевая точка камеры для мягкого фокуса на этом кадре при скролле
      const viewDist = slot.isFinale ? (isMobile ? 7.4 : 6.9) : isMobile ? 6.4 : 6.0;
      const camPoint = new THREE.Vector3(
        posX * (slot.isFinale ? 0.0 : 0.72),
        posY * (slot.isFinale ? 0.2 : 0.62),
        slot.z + viewDist
      );
      const lookPoint = new THREE.Vector3(
        posX * (slot.isFinale ? 0.0 : 0.95),
        posY * (slot.isFinale ? 0.5 : 0.9),
        slot.z
      );
      stageWaypoints.push({ camPoint, lookPoint, z: slot.z });
    });

    // Начальная точка входа в туннель (чуть перед первым кадром, чтобы заголовок и кадр №01 читались вместе)
    const entryCamPoint = new THREE.Vector3(
      -0.35,
      0.08,
      stageWaypoints[0].camPoint.z + 2.2
    );
    const entryLookPoint = new THREE.Vector3(
      stageWaypoints[0].lookPoint.x * 0.72,
      stageWaypoints[0].lookPoint.y * 0.72,
      stageWaypoints[0].lookPoint.z
    );

    // 8. Ленивая подгрузка текстур: грузим ближайшие 5 кадров впереди камеры
    const loadFrameTexture = (idx) => {
      if (idx < 0 || idx >= framesData.length) return;
      if (loadedTextures.has(idx) || loadingIndices.has(idx)) return;

      loadingIndices.add(idx);
      const item = framesData[idx];
      const url = isMobile && item.mobileSrc ? item.mobileSrc : item.src;

      textureLoader.load(
        url,
        (tex) => {
          if (isDisposed) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.anisotropy = maxAnisotropy;
          loadedTextures.set(idx, tex);
          if (photoMeshes[idx]) {
            photoMeshes[idx].material.uniforms.uTexture.value = tex;
          }
        },
        undefined,
        () => loadingIndices.delete(idx)
      );
    };

    const ensureTexturesAhead = (_camZ, activeFocusIdx) => {
      // Подгружаем все 9 уникальных текстур сразу, чтобы ни один кадр в туннеле не оставался тёмным
      for (let i = 0; i < photoMeshes.length; i += 1) {
        loadFrameTexture(i);
      }
      if (activeFocusIdx !== null) {
        loadFrameTexture(activeFocusIdx);
      }
    };

    ensureTexturesAhead(entryCamPoint.z, null);

    // 9. Салатовые световые полосы (InstancedMesh с высокой яркостью для UnrealBloomPass)
    const streakCount = isMobile ? 20 : TUNNEL_PARAMS.streakCount;
    const streakGeometry = new THREE.BoxGeometry(0.022, 0.022, 4.4);
    const streakMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color(1.22, 1.72, 0.08) },
        uFogDensity: { value: TUNNEL_PARAMS.fogDensity },
      },
      vertexShader: /* glsl */ `
        varying float vViewDepth;
        void main() {
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vViewDepth = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        precision mediump float;
        uniform vec3 uColor;
        uniform float uFogDensity;
        varying float vViewDepth;
        void main() {
          float fogFactor = exp(-(uFogDensity * vViewDepth) * (uFogDensity * vViewDepth));
          gl_FragColor = vec4(uColor * fogFactor, 0.76 * fogFactor);
        }
      `,
    });

    const streakInstanced = new THREE.InstancedMesh(
      streakGeometry,
      streakMaterial,
      streakCount
    );
    const streakDummy = new THREE.Object3D();
    const streakData = [];
    const tunnelSpanZ = 132;

    for (let i = 0; i < streakCount; i += 1) {
      const angle = (i / streakCount) * Math.PI * 2 + (i % 3) * 0.45;
      const radius = 3.5 + (i % 5) * 1.1;
      const x = Math.cos(angle) * radius * 1.22;
      const y = Math.sin(angle) * radius * 0.74;
      const z = 4.0 - ((i * 6.8) % tunnelSpanZ);
      const speed = 4.8 + (i % 7) * 1.6;
      const scaleZ = 0.65 + (i % 4) * 0.42;

      streakData.push({ x, y, z, speed, scaleZ });
      streakDummy.position.set(x, y, z);
      streakDummy.scale.set(1, 1, scaleZ);
      streakDummy.updateMatrix();
      streakInstanced.setMatrixAt(i, streakDummy.matrix);
    }
    streakInstanced.instanceMatrix.needsUpdate = true;
    scene.add(streakInstanced);

    // 10. Состояние полёта камеры, фокуса на кадрах и Raycaster
    const flightState = {
      targetProgress: 0,
      smoothProgress: 0,
      velocity: 0,
      mouseNormX: 0,
      mouseNormY: 0,
      smoothMouseX: 0,
      smoothMouseY: 0,
      hoveredIdx: null,
      focusedIdx: null,
      activeStageIdx: -1,
      inspectBlend: 0,
      inspectCamX: 0,
      inspectCamY: 0,
      inspectCamZ: entryCamPoint.z,
      inspectLookX: 0,
      inspectLookY: 0,
      inspectLookZ: -10,
      finaleTriggered: false,
      isInViewport: true,
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(-10, -10);
    const tempCamPos = new THREE.Vector3();
    const tempLookPos = new THREE.Vector3();

    // Плавный подлёт камеры к выбранному кадру по клику (GSAP, expo.inOut)
    const focusFrame = (idx) => {
      if (idx < 0 || idx >= photoMeshes.length) return;
      const mesh = photoMeshes[idx];
      const { baseX, baseY, baseZ, rotY, isFinale } = mesh.userData;

      flightState.focusedIdx = idx;
      setFocusedIndex(idx);
      ensureTexturesAhead(baseZ + 6, idx);

      const dist = isFinale ? (isMobile ? 6.4 : 5.8) : isMobile ? 4.35 : 3.6;
      const normalX = Math.sin(rotY);
      const normalZ = Math.cos(rotY);
      const targetCamX = baseX + normalX * dist;
      const targetCamY = baseY;
      const targetCamZ = baseZ + normalZ * dist;

      photoMeshes.forEach((m, mIdx) => {
        m.userData.targetOpacity = mIdx === idx ? 1.0 : 0.12;
        m.userData.targetFog =
          mIdx === idx ? TUNNEL_PARAMS.fogDensity * 0.42 : TUNNEL_PARAMS.fogDensityFocused;
      });

      gsap.killTweensOf(flightState);
      gsap.to(flightState, {
        inspectBlend: 1,
        inspectCamX: targetCamX,
        inspectCamY: targetCamY,
        inspectCamZ: targetCamZ,
        inspectLookX: baseX,
        inspectLookY: baseY,
        inspectLookZ: baseZ,
        duration: 1.15,
        ease: 'expo.inOut',
      });
    };

    const closeFocus = () => {
      if (flightState.focusedIdx === null) return;
      flightState.focusedIdx = null;
      setFocusedIndex(null);

      photoMeshes.forEach((m) => {
        m.userData.targetOpacity = 1.0;
        m.userData.targetFog = TUNNEL_PARAMS.fogDensity;
      });

      gsap.killTweensOf(flightState);
      gsap.to(flightState, {
        inspectBlend: 0,
        duration: 0.9,
        ease: 'expo.inOut',
      });
    };

    const stepFocus = (dir) => {
      const current = flightState.focusedIdx ?? 0;
      const next = (current + dir + photoMeshes.length) % photoMeshes.length;
      focusFrame(next);
    };

    sceneControllerRef.current = {
      focusFrame,
      closeFocus,
      stepFocus,
    };

    window.__galleryTunnel = {
      focusFrame,
      closeFocus,
      stepFocus,
      setProgress: (p) => {
        flightState.targetProgress = THREE.MathUtils.clamp(p, 0, 1);
      },
    };

    // 11. ScrollTrigger с pin на ~500vh (десктоп) ИЛИ управление свайпом (мобильные)
    let scrollTriggerInstance = null;
    if (!isMobile) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: sectionEl,
        pin: viewportEl,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (TUNNEL_PARAMS.scrollPinVh / 100))}`,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          flightState.targetProgress = self.progress;
          if (flightState.focusedIdx !== null && Math.abs(self.getVelocity()) > 160) {
            closeFocus();
          }
        },
      });
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e) => {
      const t = e.touches[0];
      if (!t) return;
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      lastTouchY = t.clientY;
    };

    const handleTouchMove = (e) => {
      const t = e.touches[0];
      if (!t) return;
      if (isMobile && flightState.focusedIdx === null) {
        const dy = lastTouchY - t.clientY;
        const dx = touchStartX - t.clientX;
        lastTouchY = t.clientY;
        const delta = (Math.abs(dx) > Math.abs(dy) ? dx * 0.08 : dy) * 0.0024;
        flightState.targetProgress = THREE.MathUtils.clamp(
          flightState.targetProgress + delta,
          0,
          1
        );
      }
    };

    const handleTouchEnd = (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;

      if (flightState.focusedIdx !== null && Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
        stepFocus(dx < 0 ? 1 : -1);
      }
    };

    viewportEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    viewportEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    viewportEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 12. Мышь: параллакс камеры (±0.3 ед.), Raycaster hover + клик по кадру
    const handlePointerMove = (e) => {
      const rect = viewportEl.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      flightState.mouseNormX = (relX - 0.5) * 2;
      flightState.mouseNormY = -(relY - 0.5) * 2;

      pointerNdc.x = relX * 2 - 1;
      pointerNdc.y = -(relY * 2 - 1);

      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '1';
        cursorDotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
      if (cursorFollowerRef.current) {
        cursorFollowerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (isMobile) return;

      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(photoMeshes, false);

      if (hits.length > 0 && !flightState.finaleTriggered) {
        const hit = hits[0];
        const hitIdx = hit.object.userData.index;
        flightState.hoveredIdx = hitIdx;

        photoMeshes.forEach((m, idx) => {
          if (idx === hitIdx) {
            m.userData.targetHover = 1;
            m.userData.targetZOffset = TUNNEL_PARAMS.hoverZOffset;
            m.userData.rippleAge = 0;
            if (hit.uv) {
              m.material.uniforms.uMouse.value.copy(hit.uv);
            }
          } else {
            m.userData.targetHover = 0;
            m.userData.targetZOffset = 0;
          }
        });

        if (cursorFollowerRef.current) {
          cursorFollowerRef.current.style.opacity = '1';
        }
      } else {
        flightState.hoveredIdx = null;
        photoMeshes.forEach((m) => {
          m.userData.targetHover = 0;
          m.userData.targetZOffset = 0;
        });
        if (cursorFollowerRef.current) {
          cursorFollowerRef.current.style.opacity = '0';
        }
      }
    };

    const handlePointerLeave = () => {
      flightState.mouseNormX = 0;
      flightState.mouseNormY = 0;
      flightState.hoveredIdx = null;
      photoMeshes.forEach((m) => {
        m.userData.targetHover = 0;
        m.userData.targetZOffset = 0;
      });
      if (cursorFollowerRef.current) cursorFollowerRef.current.style.opacity = '0';
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = '0';
    };

    const handleCanvasClick = (e) => {
      const rect = viewportEl.getBoundingClientRect();
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(photoMeshes, false);

      if (hits.length > 0 && !flightState.finaleTriggered) {
        const hitIdx = hits[0].object.userData.index;
        if (flightState.focusedIdx === hitIdx) {
          closeFocus();
        } else {
          focusFrame(hitIdx);
        }
      } else if (flightState.focusedIdx !== null) {
        closeFocus();
      }
    };

    const canvasEl = renderer.domElement;
    viewportEl.addEventListener('pointermove', handlePointerMove, { passive: true });
    viewportEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    canvasEl.addEventListener('click', handleCanvasClick);

    // 13. IntersectionObserver: рендер ТОЛЬКО когда секция в viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          flightState.isInViewport = entry.isIntersecting;
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(sectionEl);

    const handleResize = () => {
      if (!mountEl) return;
      const w = mountEl.clientWidth || window.innerWidth;
      const h = mountEl.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (composer) composer.setSize(w, h);
      if (bloomPass) {
        bloomPass.resolution.set(
          Math.max(1, Math.floor(w * 0.5)),
          Math.max(1, Math.floor(h * 0.5))
        );
      }
    };
    window.addEventListener('resize', handleResize);

    // 14. Главный цикл рендера (60 FPS)
    let rafId = 0;
    let prevTime = performance.now() * 0.001;
    const totalStages = stageWaypoints.length;

    const tick = () => {
      rafId = window.requestAnimationFrame(tick);
      if (!flightState.isInViewport) return;

      const now = performance.now() * 0.001;
      const dt = Math.min(now - prevTime, 0.05);
      prevTime = now;

      // Сглаживание прогресса скролла (lerp) и расчёт скорости полёта uVelocity
      const prevSmooth = flightState.smoothProgress;
      flightState.smoothProgress +=
        (flightState.targetProgress - flightState.smoothProgress) * TUNNEL_PARAMS.cameraLerp;

      const rawVel = (flightState.smoothProgress - prevSmooth) / Math.max(dt, 0.008);
      const finaleDamp =
        flightState.smoothProgress > 0.9 ? 1 - (flightState.smoothProgress - 0.9) * 10 : 1;
      const targetVel = rawVel * 2.3 * Math.max(0, finaleDamp);
      flightState.velocity += (targetVel - flightState.velocity) * TUNNEL_PARAMS.velocityLerp;

      // Сглаженный параллакс мыши (±0.3 ед.)
      flightState.smoothMouseX += (flightState.mouseNormX - flightState.smoothMouseX) * 0.08;
      flightState.smoothMouseY += (flightState.mouseNormY - flightState.smoothMouseY) * 0.08;
      const parallaxX = flightState.smoothMouseX * TUNNEL_PARAMS.mouseParallax;
      const parallaxY = flightState.smoothMouseY * TUNNEL_PARAMS.mouseParallax;

      // Направляемая траектория с фокусом на каждом из кадров (0 -> 1..N)
      // В самом начале (0..0.08) плавно переходим от вводного экрана к 1-му кадру,
      // далее (0.08..1.0) камера поочерёдно фокусируется на каждом из кадров 1..9
      let stageFloat = 0;
      if (flightState.smoothProgress <= 0.08) {
        const tIntro = smoothFocusStep(flightState.smoothProgress / 0.08);
        tempCamPos.lerpVectors(entryCamPoint, stageWaypoints[0].camPoint, tIntro);
        tempLookPos.lerpVectors(entryLookPoint, stageWaypoints[0].lookPoint, tIntro);
        stageFloat = 0;
      } else {
        const norm = (flightState.smoothProgress - 0.08) / 0.92;
        stageFloat = norm * (totalStages - 1);
        const idxA = Math.min(totalStages - 1, Math.floor(stageFloat));
        const idxB = Math.min(totalStages - 1, idxA + 1);
        const localT = smoothFocusStep(stageFloat - idxA);

        tempCamPos.lerpVectors(
          stageWaypoints[idxA].camPoint,
          stageWaypoints[idxB].camPoint,
          localT
        );
        tempLookPos.lerpVectors(
          stageWaypoints[idxA].lookPoint,
          stageWaypoints[idxB].lookPoint,
          localT
        );
      }

      // Смешиваем траекторию туннеля и прямой подлёт по клику (inspectBlend)
      const b = flightState.inspectBlend;
      camera.position.set(
        THREE.MathUtils.lerp(
          tempCamPos.x + parallaxX,
          flightState.inspectCamX + parallaxX * 0.16,
          b
        ),
        THREE.MathUtils.lerp(
          tempCamPos.y + parallaxY,
          flightState.inspectCamY + parallaxY * 0.16,
          b
        ),
        THREE.MathUtils.lerp(tempCamPos.z, flightState.inspectCamZ, b)
      );

      camera.lookAt(
        THREE.MathUtils.lerp(tempLookPos.x + parallaxX * 0.35, flightState.inspectLookX, b),
        THREE.MathUtils.lerp(tempLookPos.y + parallaxY * 0.35, flightState.inspectLookY, b),
        THREE.MathUtils.lerp(tempLookPos.z, flightState.inspectLookZ, b)
      );

      // Лёгкий кинематографичный крен (banking roll) камеры при перелёте между левыми и правыми кадрами
      const bankAngle =
        THREE.MathUtils.clamp(-tempCamPos.x * 0.018 * (1 + Math.abs(flightState.velocity)), -0.05, 0.05) *
        (1 - b);
      camera.rotation.z += bankAngle;

      // Ленивая подгрузка ближайших 5 текстур впереди камеры
      ensureTexturesAhead(camera.position.z, flightState.focusedIdx);

      // Плавное скрытие вводного заголовка по мере влёта к 1-му кадру
      if (introOverlayRef.current) {
        const introFade = Math.max(0, 1 - flightState.smoothProgress * 8.5) * (1 - b);
        introOverlayRef.current.style.opacity = introFade.toFixed(3);
        introOverlayRef.current.style.transform = `translate3d(0, ${(-flightState.smoothProgress * 110).toFixed(1)}px, 0)`;
      }

      // Проверка выхода к финальному 9-му панорамному кадру зала
      const nowFinale = flightState.smoothProgress >= 0.92 && flightState.focusedIdx === null;
      if (nowFinale !== flightState.finaleTriggered) {
        flightState.finaleTriggered = nowFinale;
        setIsAtFinale(nowFinale);
      }

      // Определяем текущий кадр в фокусе и обновляем живую HUD-строку без ре-рендера React
      const currentStageIdx = Math.min(
        framesData.length - 1,
        Math.max(0, Math.round(stageFloat))
      );
      if (currentStageIdx !== flightState.activeStageIdx) {
        flightState.activeStageIdx = currentStageIdx;
        const activeItem = framesData[currentStageIdx];
        if (activeItem) {
          if (hudActiveZoneRef.current) {
            hudActiveZoneRef.current.textContent = `${String(currentStageIdx + 1).padStart(
              2,
              '0'
            )} // ${activeItem.zone} · ${activeItem.time}`;
          }
          if (hudActiveCaptionRef.current) {
            hudActiveCaptionRef.current.textContent = activeItem.caption;
          }
        }
      }

      if (depthReadoutRef.current) {
        const zFormatted = Math.abs(camera.position.z - entryCamPoint.z)
          .toFixed(1)
          .padStart(5, '0');
        depthReadoutRef.current.textContent = `Z-DEPTH // -${zFormatted}M`;
      }
      if (hudFillRef.current) {
        hudFillRef.current.style.setProperty(
          '--tunnel-progress',
          flightState.smoothProgress.toFixed(3)
        );
      }
      if (hudCounterRef.current) {
        hudCounterRef.current.textContent = `${String(currentStageIdx + 1).padStart(
          2,
          '0'
        )} / ${String(framesData.length).padStart(2, '0')}`;
      }

      // Обновление плоскостей фото, их 3D-подвесов и шейдерных uniforms
      for (let i = 0; i < photoMeshes.length; i += 1) {
        const m = photoMeshes[i];
        const ud = m.userData;

        // Степень фокуса камеры на данном кадре (1.0 когда кадр сейчас перед нами)
        const stageDist = Math.abs(stageFloat - i);
        const focusWeight =
          flightState.focusedIdx === i
            ? 1.0
            : Math.exp(-stageDist * stageDist * 1.65);

        ud.currentHover += (ud.targetHover - ud.currentHover) * 0.12;
        ud.currentZOffset += (ud.targetZOffset - ud.currentZOffset) * 0.12;
        ud.rippleAge += dt;

        const zPos = ud.baseZ + ud.currentZOffset + focusWeight * 0.14;
        m.position.z = zPos;

        // Внешняя 3D-рамка расширяется и светится ярче, когда кадр в фокусе или под курсором
        const rigScale = 1.0 + focusWeight * 0.035 + ud.currentHover * 0.04;
        ud.rigLines.position.z = zPos;
        ud.rigLines.scale.set(rigScale, rigScale, 1);
        ud.rigMat.opacity =
          (0.14 + focusWeight * 0.48 + ud.currentHover * 0.35) * m.material.uniforms.uOpacity.value;

        const u = m.material.uniforms;
        u.uTime.value = now;
        u.uVelocity.value = flightState.velocity * (1 - b);
        u.uHover.value = ud.currentHover;
        u.uFocus.value = focusWeight;
        u.uRippleAge.value = ud.rippleAge;
        u.uOpacity.value += (ud.targetOpacity - u.uOpacity.value) * 0.12;
        u.uFogDensity.value += (ud.targetFog - u.uFogDensity.value) * 0.12;
      }

      // Обновление архитектурных порталов и оптических частиц туннеля
      tunnelArchitectureMat.uniforms.uTime.value = now;
      tunnelArchitectureMat.uniforms.uCameraZ.value = camera.position.z;
      tunnelArchitectureMat.uniforms.uVelocity.value = flightState.velocity;
      particleMat.uniforms.uTime.value = now;

      // Движение салатовых световых полос (InstancedMesh) мимо камеры
      const speedBoost = 1 + Math.abs(flightState.velocity) * 14.0;
      for (let i = 0; i < streakCount; i += 1) {
        const s = streakData[i];
        s.z += s.speed * speedBoost * dt;
        if (s.z > camera.position.z + 8) {
          s.z -= tunnelSpanZ;
        }
        streakDummy.position.set(s.x, s.y, s.z);
        streakDummy.scale.set(1, 1, s.scaleZ * (1 + Math.abs(flightState.velocity) * 1.4));
        streakDummy.updateMatrix();
        streakInstanced.setMatrixAt(i, streakDummy.matrix);
      }
      streakInstanced.instanceMatrix.needsUpdate = true;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    // 15. Корректный dispose всех геометрий, материалов, текстур и пассов
    return () => {
      isDisposed = true;
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      viewportEl.removeEventListener('pointermove', handlePointerMove);
      viewportEl.removeEventListener('pointerleave', handlePointerLeave);
      viewportEl.removeEventListener('touchstart', handleTouchStart);
      viewportEl.removeEventListener('touchmove', handleTouchMove);
      viewportEl.removeEventListener('touchend', handleTouchEnd);
      canvasEl.removeEventListener('click', handleCanvasClick);

      if (scrollTriggerInstance) scrollTriggerInstance.kill();
      gsap.killTweensOf(flightState);

      sharedPlaneGeometry.dispose();
      baseShaderMaterial.dispose();
      photoMeshes.forEach((m) => m.material.dispose());
      rigGeometries.forEach((g) => g.dispose());
      rigMaterials.forEach((m) => m.dispose());

      tunnelArchitectureGeom.dispose();
      tunnelArchitectureMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();

      streakGeometry.dispose();
      streakMaterial.dispose();
      streakInstanced.dispose();

      placeholderTextures.forEach((t) => t.dispose());
      loadedTextures.forEach((t) => t.dispose());

      if (composer) {
        composer.passes.forEach((pass) => pass.dispose?.());
      }
      renderer.dispose();
    };
  }, [useFallback, isMobileMode]);

  // Плавная прокрутка мобильной колоды к выбранному кадру (01..09)
  const scrollToMobileSlide = useCallback((targetIdx) => {
    const total = GALLERY_FRAMES.length;
    const wrapped = ((targetIdx % total) + total) % total;
    setMobileActiveIdx(wrapped);

    const trackEl = mobileDeckRef.current;
    const cardEl = mobileCardRefs.current[wrapped];
    if (trackEl && cardEl) {
      const targetLeft = cardEl.offsetLeft - trackEl.offsetLeft - 16;
      trackEl.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }

    const chipEl = mobileChipRefs.current[wrapped];
    if (chipEl && chipEl.parentElement) {
      const parent = chipEl.parentElement;
      const chipLeft = chipEl.offsetLeft - parent.clientWidth * 0.35;
      parent.scrollTo({ left: Math.max(0, chipLeft), behavior: 'smooth' });
    }
  }, []);

  const handleMobileDeckScroll = useCallback(() => {
    const trackEl = mobileDeckRef.current;
    if (!trackEl) return;
    const center = trackEl.scrollLeft + trackEl.clientWidth * 0.42;
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < mobileCardRefs.current.length; i += 1) {
      const el = mobileCardRefs.current[i];
      if (!el) continue;
      const cardCenter = el.offsetLeft + el.offsetWidth * 0.5;
      const dist = Math.abs(cardCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    setMobileActiveIdx((prev) => (prev !== bestIdx ? bestIdx : prev));
  }, []);

  // Клавиатурное управление (стрелки листают открытый кадр, Esc закрывает)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (focusedIndex === null) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        sceneControllerRef.current.closeFocus();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        sceneControllerRef.current.stepFocus(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        sceneControllerRef.current.stepFocus(-1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusedIndex]);

  const handleOpenFrameFromKeyboard = useCallback((idx) => {
    sceneControllerRef.current.focusFrame(idx);
  }, []);

  return (
    <GallerySection id="gallery" ref={sectionRef} aria-labelledby="gallery-main-title">
      <GalleryCursorFollower ref={cursorFollowerRef} aria-hidden="true">
        <span className="cursor-tag">смотреть</span>
      </GalleryCursorFollower>
      <GalleryCursorDot ref={cursorDotRef} aria-hidden="true" />

      {/* Семантический список всех 9 фото с описаниями для скринридеров и SEO (без дублирования декодирования картинок в памяти) */}
      <VisuallyHiddenSeoList>
        <ul>
          {GALLERY_FRAMES.map((frame, index) => (
            <li key={frame.src}>
              <figure>
                <span role="img" aria-label={frame.alt} />
                <figcaption>
                  {String(index + 1).padStart(2, '0')} — {frame.zone} · {frame.time} ·{' '}
                  {frame.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </VisuallyHiddenSeoList>

      {isMobileMode ? (
        <MobileShowcaseWrap data-testid="gallery-mobile-showcase">
          <div className="mob-header-container">
            <div className="mob-top-telemetry" aria-hidden="true">
              <span className="mob-rec">
                <span className="mob-rec-dot" />
                06 // ВНУТРИ КЛУБА
              </span>
              <span className="mob-counter-badge">
                КАДР {String(mobileActiveIdx + 1).padStart(2, '0')} /{' '}
                {String(GALLERY_FRAMES.length).padStart(2, '0')}
              </span>
            </div>

            <SectionKicker>06 // Фото — Внутри клуба</SectionKicker>
            <GiantTitle id="gallery-main-title" data-testid="gallery-title">
              <span className="line-mask">
                <span className="line-inner">Внутри</span>
              </span>
              <span className="line-mask">
                <span className="line-inner line-offset">клуба</span>
              </span>
            </GiantTitle>
            <IntroSubtitle>
              Без рендеров и стоков — 9 реальных зон арены. Свайпай карточки или выбери зал ниже.
            </IntroSubtitle>
          </div>

          {/* Быстрый фильтр по всем 9 зонам клуба */}
          <MobileZoneFilterRow role="tablist" aria-label="Выбор зоны клуба">
            {GALLERY_FRAMES.map((frame, idx) => {
              const isActive = idx === mobileActiveIdx;
              return (
                <button
                  key={frame.src}
                  ref={(el) => {
                    mobileChipRefs.current[idx] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className="zone-chip"
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => scrollToMobileSlide(idx)}
                >
                  <span className="chip-num">{String(idx + 1).padStart(2, '0')}</span>
                  <span>{frame.zone}</span>
                </button>
              );
            })}
          </MobileZoneFilterRow>

          {/* Горизонтальная тактильная колода всех 9 кадров */}
          <MobileDeckTrack
            ref={mobileDeckRef}
            onScroll={handleMobileDeckScroll}
            role="region"
            aria-label="Фотографии игровых залов"
          >
            {GALLERY_FRAMES.map((frame, idx) => {
              const isActive = idx === mobileActiveIdx;
              const numStr = String(idx + 1).padStart(2, '0');
              const totalStr = String(GALLERY_FRAMES.length).padStart(2, '0');

              return (
                <MobileSlideCard
                  key={frame.src}
                  ref={(el) => {
                    mobileCardRefs.current[idx] = el;
                  }}
                  $active={isActive}
                  data-testid={`gallery-item-${idx + 1}`}
                >
                  <div
                    className="slide-media"
                    onClick={() => setMobileLightboxIdx(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Открыть фото ${frame.zone} на весь экран`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setMobileLightboxIdx(idx);
                      }
                    }}
                  >
                    <div className="slide-top-hud" aria-hidden="true">
                      <span className="slide-badge-zone">
                        <strong>{numStr}</strong>/{totalStr} · {frame.zone}
                      </span>
                      <span className="slide-badge-time">REC ● {frame.time}</span>
                    </div>

                    <img
                      src={frame.mobileSrc || frame.src}
                      alt={frame.alt}
                      loading={idx <= 1 ? 'eager' : 'lazy'}
                      decoding="async"
                    />

                    <button
                      type="button"
                      className="slide-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMobileLightboxIdx(idx);
                      }}
                    >
                      [ + ] Весь экран
                    </button>
                  </div>

                  <div className="slide-body">
                    <div className="slide-zone-row">
                      <span>{frame.zone}</span>
                      <span className="slide-ratio-tag">
                        ФОРМАТ {frame.ratio} // {frame.time}
                      </span>
                    </div>
                    <p className="slide-caption">{frame.caption}</p>
                  </div>
                </MobileSlideCard>
              );
            })}
          </MobileDeckTrack>

          {/* Нижние кнопки переключения одной рукой + 9 сегментов */}
          <MobileDeckControls>
            <button
              type="button"
              className="deck-nav-btn"
              onClick={() => scrollToMobileSlide(mobileActiveIdx - 1)}
              aria-label="Предыдущее фото"
            >
              {'←\uFE0E'} Пред
            </button>

            <div className="deck-segments" role="tablist" aria-label="Индикатор кадра">
              {GALLERY_FRAMES.map((frame, idx) => (
                <button
                  key={frame.src}
                  type="button"
                  className="deck-seg"
                  data-active={idx === mobileActiveIdx ? 'true' : 'false'}
                  onClick={() => scrollToMobileSlide(idx)}
                  aria-label={`Кадр ${idx + 1}: ${frame.zone}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="deck-nav-btn"
              onClick={() => scrollToMobileSlide(mobileActiveIdx + 1)}
              aria-label="Следующее фото"
            >
              След {'→\uFE0E'}
            </button>
          </MobileDeckControls>

          {/* Финальная плашка записи */}
          <MobileFinaleBanner>
            <span className="mob-finale-kicker">
              MAIN ARENA // 9 ЗОН · 50 ПК RTX 4080/4090 · 24/7
            </span>
            <div className="mob-finale-row">
              <a href="#pricing" className="mob-finale-cta" data-testid="gallery-finale-cta">
                Забронировать место {'→\uFE0E'}
              </a>
            </div>
          </MobileFinaleBanner>

          {/* Полноэкранный мобильный просмотрщик по тапу на карточку */}
          {mobileLightboxIdx !== null && GALLERY_FRAMES[mobileLightboxIdx] && (
            <MobileLightboxModal
              role="dialog"
              aria-modal="true"
              aria-label="Полноэкранный просмотр фото"
            >
              <div className="lb-top">
                <span>
                  {String(mobileLightboxIdx + 1).padStart(2, '0')} /{' '}
                  {String(GALLERY_FRAMES.length).padStart(2, '0')} ·{' '}
                  {GALLERY_FRAMES[mobileLightboxIdx].zone}
                </span>
                <button
                  type="button"
                  className="lb-close"
                  onClick={() => setMobileLightboxIdx(null)}
                >
                  ✕ Закрыть
                </button>
              </div>

              <div className="lb-media" onClick={() => setMobileLightboxIdx(null)}>
                <img
                  src={GALLERY_FRAMES[mobileLightboxIdx].src}
                  alt={GALLERY_FRAMES[mobileLightboxIdx].alt}
                />
              </div>

              <div className="lb-bottom">
                <div className="lb-caption">
                  {GALLERY_FRAMES[mobileLightboxIdx].caption}
                </div>
                <div className="lb-controls">
                  <button
                    type="button"
                    className="lb-btn"
                    onClick={() =>
                      setMobileLightboxIdx(
                        (mobileLightboxIdx - 1 + GALLERY_FRAMES.length) %
                          GALLERY_FRAMES.length
                      )
                    }
                  >
                    {'←\uFE0E'} Предыдущее
                  </button>
                  <button
                    type="button"
                    className="lb-btn"
                    onClick={() =>
                      setMobileLightboxIdx(
                        (mobileLightboxIdx + 1) % GALLERY_FRAMES.length
                      )
                    }
                  >
                    Следующее {'→\uFE0E'}
                  </button>
                </div>
              </div>
            </MobileLightboxModal>
          )}
        </MobileShowcaseWrap>
      ) : useFallback ? (
        <FallbackSectionWrap>
          <SectionKicker>06 // Фото — Внутри клуба</SectionKicker>
          <GiantTitle id="gallery-main-title" data-testid="gallery-title">
            <span className="line-mask">
              <span className="line-inner">Внутри</span>
            </span>
            <span className="line-mask">
              <span className="line-inner line-offset">клуба</span>
            </span>
          </GiantTitle>
          <IntroSubtitle>
            Без рендеров и стоков — только то, как выглядит зал прямо сейчас.
          </IntroSubtitle>

          <FallbackStrip role="region" aria-label="Лента фотографий клуба">
            {GALLERY_FRAMES.map((frame, idx) => (
              <figure
                key={frame.src}
                className="fallback-frame"
                data-testid={`gallery-item-${idx + 1}`}
              >
                <div className="fallback-img-wrap">
                  <img src={frame.src} alt={frame.alt} loading="lazy" />
                </div>
                <figcaption className="fallback-caption">
                  <span className="fallback-zone">
                    {String(idx + 1).padStart(2, '0')} · {frame.zone} · {frame.time}
                  </span>
                  <span>{frame.caption}</span>
                </figcaption>
              </figure>
            ))}
          </FallbackStrip>
        </FallbackSectionWrap>
      ) : (
        <TunnelViewport ref={viewportRef} $isMobileSwipe={isMobileMode}>
          <WebGLCanvasWrap ref={canvasMountRef} />
          <FilmGrainOverlay aria-hidden="true" />

          {/* Верхняя телеметрия туннеля */}
          <TopTelemetryBar aria-hidden="true">
            <span className="rec-cluster">
              <span className="rec-dot" />
              06 // ВНУТРИ КЛУБА · WEBGL TUNNEL
            </span>
            <span className="depth-readout" ref={depthReadoutRef}>
              Z-DEPTH // -000.0M
            </span>
          </TopTelemetryBar>

          {/* Клавиатурная навигация */}
          <KeyboardFrameNav aria-label="Быстрый переход по кадрам зала">
            {activeFrames.map((frame, idx) => (
              <button
                key={frame.src}
                type="button"
                data-testid={`gallery-item-${idx + 1}`}
                onClick={() => handleOpenFrameFromKeyboard(idx)}
              >
                {String(idx + 1).padStart(2, '0')} · {frame.zone} ({frame.time}) — {frame.caption}
              </button>
            ))}
          </KeyboardFrameNav>

          {/* Вводный заголовок построчно маской */}
          <IntroOverlay ref={introOverlayRef}>
            <SectionKicker>06 // Фото — Внутри клуба</SectionKicker>
            <GiantTitle id="gallery-main-title" data-testid="gallery-title">
              <span className="line-mask">
                <span className="line-inner">Внутри</span>
              </span>
              <span className="line-mask">
                <span className="line-inner line-offset">клуба</span>
              </span>
            </GiantTitle>
            <IntroSubtitle>
              Без рендеров и стоков — только то, как выглядит зал прямо сейчас.
            </IntroSubtitle>
          </IntroOverlay>

          {/* Нижняя HTML-подпись при клике на кадр: зал · время · описание и счётчик "03 / 09" */}
          <InspectCaptionBar
            $visible={inspectedFrame !== null}
            data-testid="gallery-inspect-bar"
            role="region"
            aria-live="polite"
            aria-label="Описание выбранного кадра"
          >
            {inspectedFrame && (
              <>
                <div className="caption-main">
                  <div className="caption-meta">
                    <span>{inspectedFrame.zone}</span>
                    <span>·</span>
                    <span>{inspectedFrame.time}</span>
                  </div>
                  <div className="caption-text">{inspectedFrame.caption}</div>
                </div>

                <div className="caption-controls">
                  <span className="caption-counter" data-testid="gallery-inspect-counter">
                    <strong>{String(focusedIndex + 1).padStart(2, '0')}</strong> /{' '}
                    {String(activeFrames.length).padStart(2, '0')}
                  </span>

                  <button
                    type="button"
                    className="nav-btn"
                    data-testid="gallery-prev-btn"
                    onClick={() => sceneControllerRef.current.stepFocus(-1)}
                    aria-label="Предыдущий кадр"
                  >
                    ← Пред
                  </button>
                  <button
                    type="button"
                    className="nav-btn"
                    data-testid="gallery-next-btn"
                    onClick={() => sceneControllerRef.current.stepFocus(1)}
                    aria-label="Следующий кадр"
                  >
                    След →
                  </button>
                  <button
                    type="button"
                    className="nav-btn"
                    data-testid="gallery-close-btn"
                    onClick={() => sceneControllerRef.current.closeFocus()}
                    aria-label="Вернуться в туннель"
                  >
                    Esc · Выход
                  </button>
                </div>
              </>
            )}
          </InspectCaptionBar>

          {/* Финал пролёта на 9-м панорамном кадре зала: надпись «Заходи» и кнопка брони */}
          <FinaleOverlay $visible={isAtFinale} data-testid="gallery-finale">
            <div className="finale-inner">
              <span className="finale-kicker">MAIN ARENA // 24/7 БЕЗ ВЫХОДНЫХ</span>
              <h3 className="finale-title">Заходи</h3>
              <div className="finale-row">
                <a href="#pricing" className="finale-cta" data-testid="gallery-finale-cta">
                  Забронировать место →
                </a>
                <span className="finale-note">
                  PRO ZONE · VIP DUO · BOOTCAMP 5×5 · PS5 CINEMA
                </span>
              </div>
            </div>
          </FinaleOverlay>

          {/* Нижняя панель текущего кадра в фокусе и прогресса полёта */}
          <FlightHudBottom $hidden={inspectedFrame !== null || isAtFinale} aria-hidden="true">
            <div className="hud-active-frame">
              <span className="hud-active-zone" ref={hudActiveZoneRef}>
                01 // {GALLERY_FRAMES[0].zone} · {GALLERY_FRAMES[0].time}
              </span>
              <span className="hud-active-caption" ref={hudActiveCaptionRef}>
                {GALLERY_FRAMES[0].caption}
              </span>
            </div>

            <div className="hud-right-col">
              <span className="hud-hint">
                {isMobileMode ? (
                  <>
                    <strong>Свайп</strong> — полёт · <strong>Тап по кадру</strong> — приблизить
                  </>
                ) : (
                  <>
                    <strong>Скролл</strong> — полёт по залу · <strong>Клик по кадру</strong> —
                    подлёт камеры
                  </>
                )}
              </span>

              <div className="hud-progress-wrap">
                <span className="hud-counter" ref={hudCounterRef}>
                  01 / {String(activeFrames.length).padStart(2, '0')}
                </span>
                <div className="hud-bar-track">
                  <div className="hud-bar-fill" ref={hudFillRef} />
                </div>
              </div>
            </div>
          </FlightHudBottom>
        </TunnelViewport>
      )}
    </GallerySection>
  );
};

export default Gallery;
