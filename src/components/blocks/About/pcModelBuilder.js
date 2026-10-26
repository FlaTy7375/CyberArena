import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/**
 * Цветовая палитра сборки CyberArena:
 * Глубокий матовый чёрный (#0a0a0a – #141414), графитовые металлы
 * и аккуратный салатовый неон (#B6FF00 / #9DFF3C) без пересвета.
 */
export const PC_COLORS = {
  caseBlack: 0x090a0d,
  matteBlack: 0x101217,
  graphiteDark: 0x171920,
  graphiteMid: 0x232630,
  gunmetal: 0x353946,
  brushedSilver: 0x78808f,
  chrome: 0xc4ccd8,
  copper: 0xb87348,
  gold: 0xd4af37,
  pcbBlack: 0x0a0c10,
  pcbSubstrate: 0x0d261c,
  thermalPad: 0x2c3e50,
  glassTint: 0x0c1110,
  neonPrimary: 0xb6ff00,
  neonSecondary: 0x9dff3c,
};

/**
 * Создаёт пул переиспользуемых материалов и базовых геометрий.
 * Исключает дублирование шейдеров/буферов и гарантирует стабильные 60 FPS.
 * Материалы настроены так, чтобы избежать пересвета от HDRI и Bloom.
 */
export function createSharedResources() {
  const geometries = new Map();
  const materials = new Map();
  const dynamicCustomGeometries = new Set();
  const pulsingMaterials = [];

  const registerMat = (key, mat) => {
    materials.set(key, mat);
    return mat;
  };

  // --- БЫСТРЫЕ PBR МАТЕРИАЛЫ (MeshStandardMaterial + MeshPhysicalMaterial для стекла) ---

  // 1. Чёрный матовый металл корпуса (порошковая окраска)
  registerMat(
    'caseMatteMetal',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.caseBlack,
      metalness: 0.72,
      roughness: 0.42,
      envMapIntensity: 0.58,
    })
  );

  // 2. Тёмный анодированный алюминий (радиаторы, кожух GPU, БП)
  registerMat(
    'anodizedBlack',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.matteBlack,
      metalness: 0.82,
      roughness: 0.3,
      envMapIntensity: 0.68,
    })
  );

  // 3. Графитовый металлик (акценты кожухов, бэкплейты, рёбра)
  registerMat(
    'graphiteMetal',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.graphiteMid,
      metalness: 0.85,
      roughness: 0.26,
      envMapIntensity: 0.75,
    })
  );

  // 4. Оружейная сталь / Gunmetal (крепежи, рамки PCIe, дроссели)
  registerMat(
    'gunmetal',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.gunmetal,
      metalness: 0.88,
      roughness: 0.22,
      envMapIntensity: 0.8,
    })
  );

  // 5. Фрезерованный серебристый алюминий (контрастные фаски и рёбра)
  registerMat(
    'brushedSilver',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.brushedSilver,
      metalness: 0.9,
      roughness: 0.2,
      envMapIntensity: 0.85,
    })
  );

  // 6. Светлый полированный металл (никелированные трубки, крышка CPU, винты)
  registerMat(
    'chromeMetal',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.chrome,
      metalness: 0.94,
      roughness: 0.14,
      envMapIntensity: 0.92,
    })
  );

  // 7. Медь (тепловые трубки и основание водоблока)
  registerMat(
    'copperMetal',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.copper,
      metalness: 0.92,
      roughness: 0.18,
      envMapIntensity: 0.85,
    })
  );

  // 8. Позолоченные контакты (PCIe, RAM, M.2, SMA)
  registerMat(
    'goldContacts',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.gold,
      metalness: 0.92,
      roughness: 0.2,
      envMapIntensity: 0.8,
    })
  );

  // 9. Текстолит материнской платы (глубокий матово-сатиновый чёрный)
  registerMat(
    'pcbSurface',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.pcbBlack,
      metalness: 0.3,
      roughness: 0.34,
      envMapIntensity: 0.52,
    })
  );

  // 10. Подложка процессора (тёмно-изумрудный текстолит CPU)
  registerMat(
    'cpuSubstrate',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.pcbSubstrate,
      metalness: 0.3,
      roughness: 0.35,
      envMapIntensity: 0.5,
    })
  );

  // 11. Термопрокладка (Thermal Pad под радиаторами SSD/VRM)
  registerMat(
    'thermalPad',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.thermalPad,
      metalness: 0.1,
      roughness: 0.65,
    })
  );

  // 12. Матовый полимер (разъёмы, оплётка кабелей, чипы памяти)
  registerMat(
    'darkPolymer',
    new THREE.MeshStandardMaterial({
      color: 0x111318,
      metalness: 0.18,
      roughness: 0.58,
      envMapIntensity: 0.4,
    })
  );

  // 13. Полупрозрачный дымчатый поликарбонат крыльчатки вентиляторов
  registerMat(
    'fanBladeMat',
    new THREE.MeshStandardMaterial({
      color: 0x16191b,
      metalness: 0.28,
      roughness: 0.24,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 0.6,
    })
  );

  // 14. Тонированное закалённое стекло боковой панели (MeshPhysicalMaterial)
  registerMat(
    'temperedGlass',
    new THREE.MeshPhysicalMaterial({
      color: 0x0f1713,
      metalness: 0.05,
      roughness: 0.08,
      reflectivity: 0.75,
      clearcoat: 0.85,
      clearcoatRoughness: 0.06,
      transparent: true,
      opacity: 0.32,
      envMapIntensity: 0.95,
      depthWrite: false,
    })
  );

  // 15. Зеркальное стекло крышки водоблока СЖО (Infinity Mirror)
  registerMat(
    'aioMirrorGlass',
    new THREE.MeshStandardMaterial({
      color: 0x040705,
      metalness: 0.85,
      roughness: 0.06,
      envMapIntensity: 1.1,
    })
  );

  // --- СБАЛАНСИРОВАННЫЕ EMISSIVE МАТЕРИАЛЫ (БЕЗ ПЕРЕСВЕТА В БЕЛЫЙ) ---

  // 1. Основной салатовый неон (#B6FF00) — чёткий лаймовый свет
  const neonPrimaryMat = registerMat(
    'neonPrimary',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.neonPrimary,
      emissive: PC_COLORS.neonPrimary,
      emissiveIntensity: 0.95,
      roughness: 0.22,
      metalness: 0.08,
    })
  );
  neonPrimaryMat.userData.baseIntensity = 0.95;
  pulsingMaterials.push(neonPrimaryMat);

  // 2. Мягкий салатовый неон (#9DFF3C) — диффузоры ОЗУ, акценты СЖО
  const neonSecondaryMat = registerMat(
    'neonSecondary',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.neonSecondary,
      emissive: PC_COLORS.neonSecondary,
      emissiveIntensity: 0.78,
      roughness: 0.25,
      metalness: 0.08,
    })
  );
  neonSecondaryMat.userData.baseIntensity = 0.78;
  pulsingMaterials.push(neonSecondaryMat);

  // 3. Тонкие декоративные дорожки материнской платы и индикаторы
  const neonTraceMat = registerMat(
    'neonTrace',
    new THREE.MeshStandardMaterial({
      color: PC_COLORS.neonPrimary,
      emissive: PC_COLORS.neonPrimary,
      emissiveIntensity: 0.58,
      roughness: 0.3,
      metalness: 0.15,
    })
  );
  neonTraceMat.userData.baseIntensity = 0.58;
  pulsingMaterials.push(neonTraceMat);

  // --- КЭШИРОВАННЫЕ ГЕОМЕТРИИ И INSTANCED MESH ХЕЛПЕР ---
  const getBox = (w, h, d) => {
    const key = `box_${w.toFixed(4)}_${h.toFixed(4)}_${d.toFixed(4)}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.BoxGeometry(w, h, d));
    }
    return geometries.get(key);
  };

  const getRoundedBox = (w, h, d, segments = 1, radius = 0.02) => {
    const key = `rbox_${w.toFixed(4)}_${h.toFixed(4)}_${d.toFixed(4)}_${segments}_${radius.toFixed(4)}`;
    if (!geometries.has(key)) {
      geometries.set(key, new RoundedBoxGeometry(w, h, d, segments, radius));
    }
    return geometries.get(key);
  };

  const getCylinder = (rt, rb, h, seg = 12) => {
    const key = `cyl_${rt.toFixed(4)}_${rb.toFixed(4)}_${h.toFixed(4)}_${seg}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.CylinderGeometry(rt, rb, h, seg));
    }
    return geometries.get(key);
  };

  const getTorus = (r, tube, rSeg = 10, tSeg = 28) => {
    const key = `torus_${r.toFixed(4)}_${tube.toFixed(4)}_${rSeg}_${tSeg}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.TorusGeometry(r, tube, rSeg, tSeg));
    }
    return geometries.get(key);
  };

  const dummyMatrix = new THREE.Matrix4();
  const addInstancedPositions = (parent, geom, mat, positions) => {
    const inst = new THREE.InstancedMesh(geom, mat, positions.length);
    for (let i = 0; i < positions.length; i++) {
      const [px, py, pz] = positions[i];
      dummyMatrix.makeTranslation(px, py, pz);
      inst.setMatrixAt(i, dummyMatrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    parent.add(inst);
    return inst;
  };

  const trackGeometry = (geom) => {
    dynamicCustomGeometries.add(geom);
    return geom;
  };

  const disposeAll = () => {
    geometries.forEach((g) => g.dispose());
    dynamicCustomGeometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    geometries.clear();
    dynamicCustomGeometries.clear();
    materials.clear();
  };

  return {
    materials,
    mat: (name) => materials.get(name),
    getBox,
    getRoundedBox,
    getCylinder,
    getTorus,
    addInstancedPositions,
    trackGeometry,
    pulsingMaterials,
    disposeAll,
  };
}

/**
 * 1. КОРПУС ПК (чёрный матовый металл + отдельная боковая панель из тонированного стекла)
 * Возвращает { caseGroup, glassPanelGroup }
 */
export function createCase(res, { isMobile = false } = {}) {
  const caseGroup = new THREE.Group();
  caseGroup.name = 'caseChassis';

  const W = 4.15; // по оси X (от задней стенки -X до фронтальной панели +X)
  const H = 4.4;  // по оси Y
  const D = 2.25; // по оси Z

  const matCase = res.mat('caseMatteMetal');
  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matPolymer = res.mat('darkPolymer');
  const matNeon = res.mat('neonPrimary');
  const matNeonTrace = res.mat('neonTrace');

  // Нижнее основание корпуса с усиленной рамой
  const bottomPlate = new THREE.Mesh(
    res.getRoundedBox(W, 0.12, D, 2, 0.02),
    matCase
  );
  bottomPlate.position.set(0, -H / 2 + 0.06, 0);
  bottomPlate.castShadow = true;
  bottomPlate.receiveShadow = true;
  caseGroup.add(bottomPlate);

  // Верхняя крышка корпуса + магнитный пылевой фильтр
  const topPlate = new THREE.Mesh(
    res.getRoundedBox(W, 0.14, D, 2, 0.025),
    matCase
  );
  topPlate.position.set(0, H / 2 - 0.07, 0);
  topPlate.castShadow = true;
  topPlate.receiveShadow = true;
  caseGroup.add(topPlate);

  // Углубление верхнего пылевого фильтра с металлической окантовкой
  const topMeshRecess = new THREE.Mesh(
    res.getRoundedBox(2.92, 0.04, 1.38, 1, 0.01),
    matAnodized
  );
  topMeshRecess.position.set(-0.22, H / 2 + 0.005, 0);
  caseGroup.add(topMeshRecess);

  const ribCountTop = isMobile ? 12 : 20;
  const topRibPositions = [];
  for (let i = 0; i < ribCountTop; i++) {
    topRibPositions.push([-1.54 + (i / (ribCountTop - 1)) * 2.64, H / 2 + 0.024, 0]);
  }
  res.addInstancedPositions(caseGroup, res.getBox(0.028, 0.018, 1.28), matGraphite, topRibPositions);

  // Продольные направляющие верхней решётки
  for (let s = -1; s <= 1; s += 2) {
    const stringer = new THREE.Mesh(
      res.getBox(2.76, 0.02, 0.03),
      matGunmetal
    );
    stringer.position.set(-0.22, H / 2 + 0.025, s * 0.42);
    caseGroup.add(stringer);
  }

  // Детализированная панель I/O сверху спереди (кнопка Power, Reset, Audio, 2x USB-A, USB-C)
  const ioPanel = new THREE.Mesh(
    res.getRoundedBox(0.44, 0.032, 1.52, 1, 0.01),
    matGraphite
  );
  ioPanel.position.set(W / 2 - 0.35, H / 2 + 0.01, 0.22);
  caseGroup.add(ioPanel);

  const powerBtn = new THREE.Mesh(
    res.getCylinder(0.072, 0.072, 0.04, 20),
    matGunmetal
  );
  powerBtn.position.set(W / 2 - 0.35, H / 2 + 0.026, 0.74);
  caseGroup.add(powerBtn);

  const powerLedRing = new THREE.Mesh(
    res.getTorus(0.078, 0.009, 10, 24),
    matNeon
  );
  powerLedRing.rotation.x = Math.PI / 2;
  powerLedRing.position.set(W / 2 - 0.35, H / 2 + 0.034, 0.74);
  caseGroup.add(powerLedRing);

  // Кнопка Reset и аудиоразъёмы 3.5мм
  const resetBtn = new THREE.Mesh(
    res.getCylinder(0.032, 0.032, 0.038, 14),
    matSilver
  );
  resetBtn.position.set(W / 2 - 0.35, H / 2 + 0.025, 0.54);
  caseGroup.add(resetBtn);

  for (let j = 0; j < 2; j++) {
    const audioJack = new THREE.Mesh(
      res.getCylinder(0.024, 0.024, 0.036, 12),
      matChrome
    );
    audioJack.position.set(W / 2 - 0.35, H / 2 + 0.025, 0.38 - j * 0.11);
    caseGroup.add(audioJack);
  }

  // 2x USB 3.2 + 1x Type-C порты с металлическими гильзами
  for (let u = 0; u < 3; u++) {
    const usbShell = new THREE.Mesh(
      res.getBox(0.075, 0.022, u === 2 ? 0.1 : 0.15),
      matChrome
    );
    usbShell.position.set(W / 2 - 0.35, H / 2 + 0.025, 0.12 - u * 0.22);
    caseGroup.add(usbShell);

    const usbTongue = new THREE.Mesh(
      res.getBox(0.045, 0.024, u === 2 ? 0.07 : 0.12),
      matNeonTrace
    );
    usbTongue.position.set(W / 2 - 0.35, H / 2 + 0.027, 0.12 - u * 0.22);
    caseGroup.add(usbTongue);
  }

  // Задняя глухая стенка (за материнской платой, при Z = -D/2)
  const rightSideWall = new THREE.Mesh(
    res.getRoundedBox(W, H - 0.2, 0.09, 2, 0.015),
    matCase
  );
  rightSideWall.position.set(0, 0, -D / 2 + 0.045);
  rightSideWall.castShadow = true;
  rightSideWall.receiveShadow = true;
  caseGroup.add(rightSideWall);

  // Внутренний поддон материнской платы (Motherboard Tray) с выштамповками жёсткости
  const moboTray = new THREE.Mesh(
    res.getBox(W - 0.35, H - 0.32, 0.06),
    matAnodized
  );
  moboTray.position.set(-0.08, 0.02, -0.42);
  moboTray.receiveShadow = true;
  caseGroup.add(moboTray);

  // Вырез сервисного окна за сокетом CPU в поддоне
  const cpuCutoutLip = new THREE.Mesh(
    res.getBox(1.12, 1.05, 0.07),
    matGraphite
  );
  cpuCutoutLip.position.set(-0.62, 0.92, -0.415);
  caseGroup.add(cpuCutoutLip);

  // Резиновые кабель-каналы (Grommets) с лепестковыми шторками
  const grommetPositions = [
    [0.72, 0.88],
    [0.72, -0.04],
    [-0.45, 1.52],
  ];
  grommetPositions.forEach(([gx, gy]) => {
    const grommetOuter = new THREE.Mesh(
      res.getRoundedBox(0.24, 0.56, 0.09, 1, 0.02),
      matPolymer
    );
    grommetOuter.position.set(gx, gy, -0.41);
    if (gy > 1.2) grommetOuter.rotation.z = Math.PI / 2;
    caseGroup.add(grommetOuter);

    // Разделительные прорези в резинке кабель-канала
    const grommetRim = new THREE.Mesh(
      res.getBox(0.16, 0.46, 0.1),
      matGraphite
    );
    grommetRim.position.set(gx, gy, -0.41);
    if (gy > 1.2) grommetRim.rotation.z = Math.PI / 2;
    caseGroup.add(grommetRim);
  });

  // Вертикальная декоративная кабель-планка (Cable Management Bar) справа от платы
  const cableCoverBar = new THREE.Mesh(
    res.getRoundedBox(0.26, 2.72, 0.24, 2, 0.02),
    matAnodized
  );
  cableCoverBar.position.set(0.95, 0.44, -0.24);
  cableCoverBar.castShadow = true;
  caseGroup.add(cableCoverBar);

  const cableBarAccent = new THREE.Mesh(
    res.getBox(0.018, 2.35, 0.02),
    matNeonTrace
  );
  cableBarAccent.position.set(0.83, 0.44, -0.115);
  caseGroup.add(cableBarAccent);

  // Задняя стенка корпуса (Rear Exhaust + PCIe brackets, при X = -W/2)
  const rearWallTop = new THREE.Mesh(
    res.getBox(0.11, H - 0.24, D - 0.12),
    matCase
  );
  rearWallTop.position.set(-W / 2 + 0.055, 0, 0);
  rearWallTop.castShadow = true;
  rearWallTop.receiveShadow = true;
  caseGroup.add(rearWallTop);

  // Перфорация заднего выдува (вентиляционная решётка + круглая окантовка 120мм)
  const rearFanRing = new THREE.Mesh(
    res.getTorus(0.44, 0.018, 10, 28),
    matGunmetal
  );
  rearFanRing.rotation.y = Math.PI / 2;
  rearFanRing.position.set(-W / 2 + 0.115, 0.98, 0.15);
  caseGroup.add(rearFanRing);

  const rearGrillCount = isMobile ? 7 : 10;
  for (let r = 0; r < rearGrillCount; r++) {
    const grillBar = new THREE.Mesh(
      res.getBox(0.13, 0.024, 0.95),
      matGraphite
    );
    grillBar.position.set(-W / 2 + 0.06, 0.52 + r * 0.1, 0.15);
    caseGroup.add(grillBar);
  }

  // Заглушки слотов расширения PCIe сзади (7 перфорированных слотов с барашковыми винтами)
  for (let p = 0; p < 7; p++) {
    const pcieCover = new THREE.Mesh(
      res.getBox(0.14, 0.088, 0.92),
      p === 1 || p === 2 || p === 3 ? matGunmetal : matGraphite
    );
    pcieCover.position.set(-W / 2 + 0.07, -0.05 - p * 0.14, 0.15);
    caseGroup.add(pcieCover);

    const screw = new THREE.Mesh(
      res.getCylinder(0.028, 0.028, 0.08, 10),
      matChrome
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(-W / 2 + 0.12, -0.05 - p * 0.14, 0.65);
    caseGroup.add(screw);
  }

  // Кожух блока питания (PSU Shroud) в нижней части корпуса
  const shroudW = W - 0.85;
  const shroudH = 0.96;
  const shroudD = D - 0.55;
  const psuShroud = new THREE.Mesh(
    res.getRoundedBox(shroudW, shroudH, shroudD, 2, 0.03),
    matAnodized
  );
  psuShroud.position.set(-0.32, -H / 2 + 0.12 + shroudH / 2, 0.18);
  psuShroud.castShadow = true;
  psuShroud.receiveShadow = true;
  caseGroup.add(psuShroud);

  // Фаска-окантовка смотрового окна в кожухе БП
  const shroudWindowBezel = new THREE.Mesh(
    res.getRoundedBox(1.58, 0.54, 0.04, 1, 0.015),
    matGraphite
  );
  shroudWindowBezel.position.set(-0.88, -H / 2 + 0.58, 0.18 + shroudD / 2 + 0.004);
  caseGroup.add(shroudWindowBezel);

  const shroudWindowRecess = new THREE.Mesh(
    res.getBox(1.48, 0.44, 0.042),
    res.mat('pcbSurface')
  );
  shroudWindowRecess.position.set(-0.88, -H / 2 + 0.58, 0.18 + shroudD / 2 + 0.006);
  caseGroup.add(shroudWindowRecess);

  // Узкая аккуратная салатовая линия вдоль верхней кромки кожуха БП (без пересвета)
  const shroudNeonStrip = new THREE.Mesh(
    res.getBox(shroudW - 0.22, 0.016, 0.02),
    matNeon
  );
  shroudNeonStrip.position.set(-0.32, -H / 2 + 0.12 + shroudH - 0.05, 0.18 + shroudD / 2 + 0.01);
  caseGroup.add(shroudNeonStrip);

  // Перфорация сверху кожуха БП (1 draw call через InstancedMesh)
  const shroudVents = isMobile ? 10 : 16;
  const shroudVentPositions = [];
  for (let v = 0; v < shroudVents; v++) {
    shroudVentPositions.push([-1.52 + v * 0.14, -H / 2 + 0.12 + shroudH + 0.006, 0.22]);
  }
  res.addInstancedPositions(caseGroup, res.getBox(0.032, 0.018, 0.58), matGraphite, shroudVentPositions);

  // Передняя панель (Front Bezel): скошенные грани, сетка Airflow и тонкая неоновая нить
  const frontFrameLeft = new THREE.Mesh(
    res.getRoundedBox(0.24, H - 0.12, 0.22, 1, 0.02),
    matCase
  );
  frontFrameLeft.position.set(W / 2 - 0.1, 0, D / 2 - 0.11);
  caseGroup.add(frontFrameLeft);

  const frontFrameRight = new THREE.Mesh(
    res.getRoundedBox(0.24, H - 0.12, 0.22, 1, 0.02),
    matCase
  );
  frontFrameRight.position.set(W / 2 - 0.1, 0, -D / 2 + 0.11);
  caseGroup.add(frontFrameRight);

  // Горизонтальные ламели фронтальной решётки забора воздуха (1 draw call через InstancedMesh)
  const frontLouverCount = isMobile ? 12 : 20;
  const frontLouverPositions = [];
  for (let fl = 0; fl < frontLouverCount; fl++) {
    frontLouverPositions.push([
      W / 2 - 0.06,
      -H / 2 + 0.34 + fl * ((H - 0.68) / (frontLouverCount - 1)),
      0,
    ]);
  }
  res.addInstancedPositions(caseGroup, res.getBox(0.035, 0.022, D - 0.44), matGraphite, frontLouverPositions);

  // Тонированная фронтальная вставка
  const frontGlassInsert = new THREE.Mesh(
    res.getBox(0.04, H - 0.34, D - 0.38),
    res.mat('temperedGlass')
  );
  frontGlassInsert.position.set(W / 2 - 0.015, 0, 0);
  caseGroup.add(frontGlassInsert);

  // Металлическая стойка на фасаде с тонкой неоновой линией (0.016 вместо 0.04)
  const frontAccentBar = new THREE.Mesh(
    res.getBox(0.08, H - 0.28, 0.18),
    matGraphite
  );
  frontAccentBar.position.set(W / 2 - 0.01, 0, 0.55);
  caseGroup.add(frontAccentBar);

  const frontNeonBar = new THREE.Mesh(
    res.getBox(0.02, H - 0.52, 0.016),
    matNeon
  );
  frontNeonBar.position.set(W / 2 + 0.026, 0, 0.55);
  caseGroup.add(frontNeonBar);

  // Внутренние стойки каркаса со стороны стекла с заклёпками
  const topRail = new THREE.Mesh(
    res.getBox(W - 0.2, 0.11, 0.12),
    matGraphite
  );
  topRail.position.set(0, H / 2 - 0.16, D / 2 - 0.08);
  caseGroup.add(topRail);

  const bottomRail = new THREE.Mesh(
    res.getBox(W - 0.2, 0.11, 0.12),
    matGraphite
  );
  bottomRail.position.set(0, -H / 2 + 0.16, D / 2 - 0.08);
  caseGroup.add(bottomRail);

  // 4 массивные фрезерованные ножки корпуса снизу с хромированными кольцами
  const footCoords = [
    [-W / 2 + 0.42, -H / 2 - 0.11, -D / 2 + 0.32],
    [W / 2 - 0.42, -H / 2 - 0.11, -D / 2 + 0.32],
    [-W / 2 + 0.42, -H / 2 - 0.11, D / 2 - 0.32],
    [W / 2 - 0.42, -H / 2 - 0.11, D / 2 - 0.32],
  ];
  footCoords.forEach(([fx, fy, fz]) => {
    const footBase = new THREE.Mesh(
      res.getRoundedBox(0.56, 0.18, 0.36, 2, 0.03),
      matGraphite
    );
    footBase.position.set(fx, fy, fz);
    footBase.castShadow = true;
    caseGroup.add(footBase);

    const footTrim = new THREE.Mesh(
      res.getCylinder(0.16, 0.18, 0.04, 16),
      matChrome
    );
    footTrim.position.set(fx, fy - 0.08, fz);
    caseGroup.add(footTrim);
  });

  // --- БОКОВАЯ СТЕНКА ИЗ ТОНИРОВАННОГО ЗАКАЛЁННОГО СТЕКЛА (ОТДЕЛЬНАЯ ГРУППА) ---
  const glassPanelGroup = new THREE.Group();
  glassPanelGroup.name = 'glassSidePanel';

  const glassW = W - 0.18;
  const glassH = H - 0.24;
  const glassZ = D / 2 + 0.03;

  const glassPane = new THREE.Mesh(
    res.getBox(glassW, glassH, 0.045),
    res.mat('temperedGlass')
  );
  glassPane.position.set(0, 0, glassZ);
  glassPanelGroup.add(glassPane);

  // Чёрная шелкография-рамка по периметру стекла + металлические петли слева
  const borderThickness = 0.13;
  const topBorder = new THREE.Mesh(
    res.getBox(glassW, borderThickness, 0.05),
    matAnodized
  );
  topBorder.position.set(0, glassH / 2 - borderThickness / 2, glassZ);
  glassPanelGroup.add(topBorder);

  const bottomBorder = new THREE.Mesh(
    res.getBox(glassW, borderThickness, 0.05),
    matAnodized
  );
  bottomBorder.position.set(0, -glassH / 2 + borderThickness / 2, glassZ);
  glassPanelGroup.add(bottomBorder);

  const leftBorder = new THREE.Mesh(
    res.getBox(borderThickness, glassH - borderThickness * 2, 0.05),
    matAnodized
  );
  leftBorder.position.set(-glassW / 2 + borderThickness / 2, 0, glassZ);
  glassPanelGroup.add(leftBorder);

  const rightBorder = new THREE.Mesh(
    res.getBox(borderThickness, glassH - borderThickness * 2, 0.05),
    matAnodized
  );
  rightBorder.position.set(glassW / 2 - borderThickness / 2, 0, glassZ);
  glassPanelGroup.add(rightBorder);

  // Тонкая лазерная гравировка-шильдик в углу стекла
  const glassCornerPlate = new THREE.Mesh(
    res.getBox(0.62, 0.08, 0.052),
    matGunmetal
  );
  glassCornerPlate.position.set(glassW / 2 - 0.54, -glassH / 2 + 0.22, glassZ + 0.002);
  glassPanelGroup.add(glassCornerPlate);

  const glassCornerBadge = new THREE.Mesh(
    res.getBox(0.48, 0.014, 0.055),
    matNeonTrace
  );
  glassCornerBadge.position.set(glassW / 2 - 0.54, -glassH / 2 + 0.22, glassZ + 0.005);
  glassPanelGroup.add(glassCornerBadge);

  // 4 накатных винта (Thumbscrews) с демпферными шайбами по углам стеклянной панели
  const screwOffsets = [
    [-glassW / 2 + 0.22, glassH / 2 - 0.22],
    [glassW / 2 - 0.22, glassH / 2 - 0.22],
    [-glassW / 2 + 0.22, -glassH / 2 + 0.22],
    [glassW / 2 - 0.22, -glassH / 2 + 0.22],
  ];
  screwOffsets.forEach(([sx, sy]) => {
    const washer = new THREE.Mesh(
      res.getCylinder(0.068, 0.068, 0.058, 16),
      matGunmetal
    );
    washer.rotation.x = Math.PI / 2;
    washer.position.set(sx, sy, glassZ + 0.018);
    glassPanelGroup.add(washer);

    const screwCap = new THREE.Mesh(
      res.getCylinder(0.046, 0.046, 0.072, 16),
      matChrome
    );
    screwCap.rotation.x = Math.PI / 2;
    screwCap.position.set(sx, sy, glassZ + 0.042);
    glassPanelGroup.add(screwCap);
  });

  caseGroup.userData = {
    id: 'case',
    label: 'CHASSIS // FULL-TOWER',
    sublabel: 'Матовый алюминий · CNC сталь',
    anchorLocal: new THREE.Vector3(-1.35, 1.45, -0.45),
    explodePos: new THREE.Vector3(-0.85, 0.18, -1.05),
    explodeRot: new THREE.Euler(0.03, -0.1, 0.02),
  };

  glassPanelGroup.userData = {
    id: 'glass',
    label: 'TEMPERED GLASS // 4MM',
    sublabel: 'Тонированное бронестекло',
    anchorLocal: new THREE.Vector3(-0.78, -0.56, glassZ),
    explodePos: new THREE.Vector3(0.48, -0.06, 1.78),
    explodeRot: new THREE.Euler(-0.04, 0.22, -0.02),
  };

  return { caseGroup, glassPanelGroup };
}

/**
 * 2. МАТЕРИНСКАЯ ПЛАТА (чёрная ATX Z790: 20+2 фаз VRM, теплотрубка VRM, задняя панель I/O,
 *    POST-индикатор, слоты DDR5 и PCIe 5.0, SATA-блок, конденсаторы, тонкие дорожки)
 */
export function createMotherboard(res, { isMobile = false } = {}) {
  const moboGroup = new THREE.Group();
  moboGroup.name = 'motherboard';

  const basePos = new THREE.Vector3(-0.48, 0.46, -0.32);
  moboGroup.position.copy(basePos);

  const pcbW = 2.35; // по X
  const pcbH = 2.85; // по Y
  const pcbD = 0.07; // по Z

  const matPcb = res.mat('pcbSurface');
  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matCopper = res.mat('copperMetal');
  const matGold = res.mat('goldContacts');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');
  const matTrace = res.mat('neonTrace');
  const matPolymer = res.mat('darkPolymer');

  // Многослойный текстолит ATX платы
  const pcbMesh = new THREE.Mesh(
    res.getRoundedBox(pcbW, pcbH, pcbD, 1, 0.015),
    matPcb
  );
  pcbMesh.castShadow = true;
  pcbMesh.receiveShadow = true;
  moboGroup.add(pcbMesh);

  // Тонкие прецизионные дорожки шины данных на текстолите (PCB traces)
  const traces = [
    [0.01, 1.35, -0.98, -0.62],
    [0.01, 0.95, -0.93, -0.75],
    [0.65, 0.01, -0.58, -1.25],
    [0.85, 0.01, 0.45, 0.05],
    [0.01, 0.72, 0.98, -0.35],
    [0.52, 0.01, 0.58, -0.98],
    [0.42, 0.01, -0.15, 1.24],
    [0.01, 0.65, 0.14, -0.55],
    [0.01, 0.48, 0.22, 0.48],
    [0.01, 0.48, 0.25, 0.48],
  ];
  traces.forEach(([tw, th, tx, ty]) => {
    const trace = new THREE.Mesh(
      res.getBox(tw, th, 0.008),
      matTrace
    );
    trace.position.set(tx, ty, pcbD / 2 + 0.004);
    moboGroup.add(trace);
  });

  // --- СТЕК ЗАДНИХ РАЗЪЁМОВ I/O (USB, RJ45, Wi-Fi 7 SMA, Audio) ---
  const ioStackPositions = [
    [-1.08, 1.02, 0.14, 0.18, 0.16, matChrome],
    [-1.08, 0.8, 0.16, 0.2, 0.18, matGunmetal],
    [-1.08, 0.56, 0.16, 0.22, 0.18, matChrome],
    [-1.08, 0.32, 0.14, 0.18, 0.15, matGunmetal],
    [-1.08, 0.08, 0.15, 0.22, 0.16, matPolymer],
  ];
  ioStackPositions.forEach(([ix, iy, iw, ih, id, mat]) => {
    const tower = new THREE.Mesh(res.getBox(iw, ih, id), mat);
    tower.position.set(ix, iy, pcbD / 2 + id / 2);
    moboGroup.add(tower);
  });

  // 2 позолоченных антенных коннектора Wi-Fi 7 SMA на панели I/O
  for (let w = 0; w < 2; w++) {
    const smaPin = new THREE.Mesh(
      res.getCylinder(0.024, 0.024, 0.12, 12),
      matGold
    );
    smaPin.rotation.z = Math.PI / 2;
    smaPin.position.set(-1.16, 0.36 - w * 0.08, 0.12);
    moboGroup.add(smaPin);
  }

  // --- ЛЕВЫЙ И ВЕРХНИЙ РАДИАТОРЫ VRM С ТЕПЛОВОЙ ТРУБКОЙ ---
  const vrmLeft = new THREE.Mesh(
    res.getRoundedBox(0.46, 1.28, 0.34, 2, 0.02),
    matAnodized
  );
  vrmLeft.position.set(-0.84, 0.56, 0.18);
  vrmLeft.castShadow = true;
  moboGroup.add(vrmLeft);

  // Металлическая декоративная накладка кожуха VRM
  const vrmArmorPlate = new THREE.Mesh(
    res.getRoundedBox(0.32, 1.16, 0.04, 1, 0.01),
    matGraphite
  );
  vrmArmorPlate.position.set(-0.82, 0.56, 0.345);
  moboGroup.add(vrmArmorPlate);

  // Рёбра охлаждения левого радиатора VRM
  const vrmFinCount = isMobile ? 9 : 16;
  for (let i = 0; i < vrmFinCount; i++) {
    const fin = new THREE.Mesh(
      res.getBox(0.48, 0.02, 0.36),
      i % 3 === 0 ? matSilver : matGraphite
    );
    fin.position.set(-0.84, 0.0 + i * 0.072, 0.18);
    moboGroup.add(fin);
  }

  // Узкая прецизионная салатовая линия на кожухе VRM (без пересвета)
  const vrmNeonSlash = new THREE.Mesh(
    res.getBox(0.018, 0.88, 0.016),
    matNeon
  );
  vrmNeonSlash.position.set(-0.76, 0.56, 0.368);
  moboGroup.add(vrmNeonSlash);

  const vrmNeonSecondary = new THREE.Mesh(
    res.getBox(0.2, 0.016, 0.016),
    matNeonSec
  );
  vrmNeonSecondary.position.set(-0.84, 1.04, 0.368);
  moboGroup.add(vrmNeonSecondary);

  // Верхний радиатор VRM (над сокетом CPU)
  const vrmTop = new THREE.Mesh(
    res.getRoundedBox(0.96, 0.32, 0.28, 2, 0.02),
    matAnodized
  );
  vrmTop.position.set(-0.08, 1.12, 0.15);
  vrmTop.castShadow = true;
  moboGroup.add(vrmTop);

  for (let i = 0; i < (isMobile ? 10 : 18); i++) {
    const fin = new THREE.Mesh(
      res.getBox(0.02, 0.34, 0.3),
      i % 3 === 0 ? matSilver : matGraphite
    );
    fin.position.set(-0.52 + i * 0.052, 1.12, 0.15);
    moboGroup.add(fin);
  }

  const vrmTopNeon = new THREE.Mesh(
    res.getBox(0.72, 0.016, 0.016),
    matTrace
  );
  vrmTopNeon.position.set(-0.08, 1.12, 0.302);
  moboGroup.add(vrmTopNeon);

  // Никелированная тепловая трубка, соединяющая левый и верхний радиаторы VRM
  const vrmPipeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.82, 0.96, 0.22),
    new THREE.Vector3(-0.76, 1.12, 0.24),
    new THREE.Vector3(-0.42, 1.12, 0.22),
  ]);
  const vrmPipeGeo = res.trackGeometry(new THREE.TubeGeometry(vrmPipeCurve, 12, 0.028, 10, false));
  const vrmPipeMesh = new THREE.Mesh(vrmPipeGeo, matChrome);
  moboGroup.add(vrmPipeMesh);

  // --- ДРОССЕЛИ ПИТАНИЯ (20+2 ФАЗЫ) И ТВЕРДОТЕЛЬНЫЕ КОНДЕНСАТОРЫ ВОКРУГ СОКЕТА ---
  for (let c = 0; c < 9; c++) {
    const cy = 0.14 + c * 0.095;
    const choke = new THREE.Mesh(
      res.getRoundedBox(0.082, 0.082, 0.085, 1, 0.01),
      matGunmetal
    );
    choke.position.set(-0.52, cy, 0.07);
    moboGroup.add(choke);

    const cap = new THREE.Mesh(
      res.getCylinder(0.028, 0.028, 0.075, 12),
      matChrome
    );
    cap.rotation.x = Math.PI / 2;
    cap.position.set(-0.41, cy, 0.068);
    moboGroup.add(cap);
  }

  for (let c = 0; c < 7; c++) {
    const cx = -0.38 + c * 0.105;
    const chokeTop = new THREE.Mesh(
      res.getRoundedBox(0.082, 0.082, 0.085, 1, 0.01),
      matGunmetal
    );
    chokeTop.position.set(cx, 0.9, 0.07);
    moboGroup.add(chokeTop);

    const capTop = new THREE.Mesh(
      res.getCylinder(0.028, 0.028, 0.075, 12),
      matChrome
    );
    capTop.rotation.x = Math.PI / 2;
    capTop.position.set(cx, 0.8, 0.068);
    moboGroup.add(capTop);
  }

  // --- 4 СЛОТА ОПЕРАТИВНОЙ ПАМЯТИ DDR5 DIMM С МЕТАЛЛИЧЕСКИМ АРМИРОВАНИЕМ ---
  for (let s = 0; s < 4; s++) {
    const slotX = 0.42 + s * 0.11;
    const dimmSlot = new THREE.Mesh(
      res.getBox(0.052, 1.14, 0.09),
      s % 2 === 1 ? matSilver : matPolymer
    );
    dimmSlot.position.set(slotX, 0.52, 0.065);
    moboGroup.add(dimmSlot);

    const slotChannel = new THREE.Mesh(
      res.getBox(0.02, 1.08, 0.098),
      matPolymer
    );
    slotChannel.position.set(slotX, 0.52, 0.068);
    moboGroup.add(slotChannel);

    const latchTop = new THREE.Mesh(
      res.getBox(0.064, 0.07, 0.125),
      matGraphite
    );
    latchTop.position.set(slotX, 1.11, 0.08);
    moboGroup.add(latchTop);

    const latchBottom = new THREE.Mesh(
      res.getBox(0.064, 0.07, 0.125),
      matGraphite
    );
    latchBottom.position.set(slotX, -0.07, 0.08);
    moboGroup.add(latchBottom);
  }

  // --- POST-CODE ИНДИКАТОР И КНОПКИ ЗАПУСКА НА ПЛАТЕ (СВЕРХУ СПРАВА) ---
  const postDisplayHousing = new THREE.Mesh(
    res.getBox(0.18, 0.12, 0.06),
    matPolymer
  );
  postDisplayHousing.position.set(0.94, 1.24, 0.06);
  moboGroup.add(postDisplayHousing);

  for (let d = 0; d < 2; d++) {
    const digitSeg = new THREE.Mesh(
      res.getBox(0.05, 0.07, 0.015),
      matTrace
    );
    digitSeg.position.set(0.905 + d * 0.07, 1.24, 0.092);
    moboGroup.add(digitSeg);
  }

  // --- 3 АРМИРОВАННЫХ СТАЛЬЮ СЛОТА PCIe 5.0 x16 + ВТОРИЧНЫЙ M.2 РАДИАТОР ---
  const pcieYPositions = [-0.42, -0.88, -1.22];
  pcieYPositions.forEach((py, idx) => {
    const steelArmor = new THREE.Mesh(
      res.getBox(1.18, 0.105, 0.11),
      idx === 0 ? matChrome : matGunmetal
    );
    steelArmor.position.set(-0.22, py, 0.07);
    moboGroup.add(steelArmor);

    const slotGroove = new THREE.Mesh(
      res.getBox(1.12, 0.04, 0.12),
      matPolymer
    );
    slotGroove.position.set(-0.22, py, 0.075);
    moboGroup.add(slotGroove);

    const pcieLatch = new THREE.Mesh(
      res.getBox(0.11, 0.085, 0.14),
      idx === 0 ? matNeonSec : matGraphite
    );
    pcieLatch.position.set(0.42, py, 0.085);
    moboGroup.add(pcieLatch);
  });

  // Нижний радиатор M.2 Shield Frozr между слотами PCIe
  const lowerM2Shield = new THREE.Mesh(
    res.getRoundedBox(1.08, 0.26, 0.09, 1, 0.015),
    matAnodized
  );
  lowerM2Shield.position.set(-0.26, -0.65, 0.07);
  moboGroup.add(lowerM2Shield);

  const lowerM2Line = new THREE.Mesh(
    res.getBox(0.84, 0.012, 0.015),
    matTrace
  );
  lowerM2Line.position.set(-0.26, -0.65, 0.118);
  moboGroup.add(lowerM2Line);

  // --- РАДИАТОР ЧИПСЕТА Z790 (ВНИЗУ СПРАВА) С ФРЕЗЕРОВКОЙ ---
  const chipsetHeatsink = new THREE.Mesh(
    res.getRoundedBox(0.76, 0.68, 0.18, 2, 0.02),
    matAnodized
  );
  chipsetHeatsink.position.set(0.58, -0.82, 0.11);
  chipsetHeatsink.castShadow = true;
  moboGroup.add(chipsetHeatsink);

  const chipsetPlate = new THREE.Mesh(
    res.getRoundedBox(0.66, 0.56, 0.04, 1, 0.01),
    matGraphite
  );
  chipsetPlate.position.set(0.58, -0.82, 0.195);
  moboGroup.add(chipsetPlate);

  for (let cf = -2; cf <= 2; cf++) {
    const groove = new THREE.Mesh(
      res.getBox(0.58, 0.02, 0.015),
      matGunmetal
    );
    groove.position.set(0.58, -0.82 + cf * 0.1, 0.216);
    moboGroup.add(groove);
  }

  // Тонкая диагональная салатовая линия на чипсете
  const chipsetNeon = new THREE.Mesh(
    res.getBox(0.54, 0.018, 0.02),
    matNeon
  );
  chipsetNeon.rotation.z = 0.52;
  chipsetNeon.position.set(0.58, -0.82, 0.22);
  moboGroup.add(chipsetNeon);

  // --- РАЗЪЁМЫ ПИТАНИЯ 24-PIN ATX, USB-C FRONT, 6x SATA 6GB/S, 8+8 PIN EPS ---
  const atx24Pin = new THREE.Mesh(
    res.getBox(0.16, 0.58, 0.18),
    matPolymer
  );
  atx24Pin.position.set(1.04, 0.42, 0.11);
  moboGroup.add(atx24Pin);

  const atxNeonAccent = new THREE.Mesh(
    res.getBox(0.016, 0.5, 0.02),
    matTrace
  );
  atxNeonAccent.position.set(1.12, 0.42, 0.17);
  moboGroup.add(atxNeonAccent);

  // Блок из 6 угловых разъёмов SATA на правом краю платы
  for (let s = 0; s < 3; s++) {
    const sataPair = new THREE.Mesh(
      res.getBox(0.16, 0.16, 0.14),
      matGunmetal
    );
    sataPair.position.set(1.06, -0.42 - s * 0.2, 0.09);
    moboGroup.add(sataPair);
  }

  // 8+8 pin EPS разъёмы питания процессора в металлической оплётке (сверху слева)
  for (let e = 0; e < 2; e++) {
    const epsHeader = new THREE.Mesh(
      res.getBox(0.22, 0.14, 0.16),
      matGunmetal
    );
    epsHeader.position.set(-0.86 + e * 0.26, 1.32, 0.1);
    moboGroup.add(epsHeader);
  }

  // Батарейка BIOS (CR2032) в держателе, аудиокодек SupremeFX и золотые конденсаторы
  const cmosHolder = new THREE.Mesh(
    res.getCylinder(0.13, 0.13, 0.035, 20),
    matPolymer
  );
  cmosHolder.rotation.x = Math.PI / 2;
  cmosHolder.position.set(-0.15, -0.42, 0.05);
  moboGroup.add(cmosHolder);

  const cmosBattery = new THREE.Mesh(
    res.getCylinder(0.105, 0.105, 0.045, 20),
    matChrome
  );
  cmosBattery.rotation.x = Math.PI / 2;
  cmosBattery.position.set(-0.15, -0.42, 0.058);
  moboGroup.add(cmosBattery);

  // Экранированный аудиочип в левом нижнем углу
  const audioChip = new THREE.Mesh(
    res.getRoundedBox(0.22, 0.26, 0.06, 1, 0.01),
    matGunmetal
  );
  audioChip.position.set(-1.02, -0.48, 0.06);
  moboGroup.add(audioChip);

  for (let a = 0; a < 6; a++) {
    const cap = new THREE.Mesh(
      res.getCylinder(0.035, 0.035, 0.09, 12),
      matGold
    );
    cap.rotation.x = Math.PI / 2;
    cap.position.set(-1.04, -0.68 - a * 0.11, 0.075);
    moboGroup.add(cap);
  }

  // 9 винтов крепления материнской платы с металлическими площадками заземления
  const standoffCoords = [
    [-1.08, 1.32],
    [0.0, 1.32],
    [1.08, 1.32],
    [-1.08, 0.0],
    [1.08, 0.0],
    [-1.08, -1.32],
    [0.0, -1.32],
    [1.08, -1.32],
  ];
  standoffCoords.forEach(([sx, sy]) => {
    const pad = new THREE.Mesh(
      res.getCylinder(0.055, 0.055, 0.015, 14),
      matGold
    );
    pad.rotation.x = Math.PI / 2;
    pad.position.set(sx, sy, pcbD / 2 + 0.008);
    moboGroup.add(pad);

    const screw = new THREE.Mesh(
      res.getCylinder(0.032, 0.032, 0.032, 10),
      matChrome
    );
    screw.rotation.x = Math.PI / 2;
    screw.position.set(sx, sy, pcbD / 2 + 0.018);
    moboGroup.add(screw);
  });

  moboGroup.userData = {
    id: 'motherboard',
    label: 'Z790 CARBON // ATX PCB',
    sublabel: '20+2 фаз VRM · PCIe 5.0',
    basePos: basePos.clone(),
    anchorLocal: new THREE.Vector3(-0.84, 0.65, 0.28),
    explodePos: new THREE.Vector3(-1.05, 0.26, -0.48),
    explodeRot: new THREE.Euler(0.03, 0.12, -0.02),
  };

  return moboGroup;
}

/**
 * 3. ПРОЦЕССОР + КУЛЕР / СЖО (текстолит и крышка CPU, рифлёный водоблок с глубоким Infinity-зеркалом,
 *    поворотные фитинги, шланги в оплётке и 360мм радиатор с коллекторами)
 */
export function createCPUAndCooler(res, { isMobile = false } = {}) {
  const cpuGroup = new THREE.Group();
  cpuGroup.name = 'cpuCooler';

  const basePos = new THREE.Vector3(-0.56, 0.94, -0.22);
  cpuGroup.position.copy(basePos);

  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matCopper = res.mat('copperMetal');
  const matGold = res.mat('goldContacts');
  const matSubstrate = res.mat('cpuSubstrate');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');
  const matTrace = res.mat('neonTrace');
  const matMirror = res.mat('aioMirrorGlass');
  const matPolymer = res.mat('darkPolymer');

  // Прижимная рамка сокета LGA1700/1851 с рычагом фиксации (ILM Lever)
  const socketFrame = new THREE.Mesh(
    res.getRoundedBox(0.64, 0.64, 0.06, 1, 0.02),
    matGunmetal
  );
  socketFrame.position.set(0, 0, -0.02);
  cpuGroup.add(socketFrame);

  const socketLever = new THREE.Mesh(
    res.getCylinder(0.016, 0.016, 0.68, 10),
    matChrome
  );
  socketLever.position.set(0.36, 0.02, 0.0);
  cpuGroup.add(socketLever);

  // Зелёно-изумрудная подложка процессора (CPU PCB Substrate) с золотыми контактными площадками
  const cpuSubstrateMesh = new THREE.Mesh(
    res.getBox(0.52, 0.52, 0.03),
    matSubstrate
  );
  cpuSubstrateMesh.position.set(0, 0, 0.015);
  cpuGroup.add(cpuSubstrateMesh);

  const cpuGoldRim = new THREE.Mesh(
    res.getBox(0.53, 0.53, 0.012),
    matGold
  );
  cpuGoldRim.position.set(0, 0, 0.01);
  cpuGroup.add(cpuGoldRim);

  // Двухступенчатая никелированная крышка теплораспределителя (Stepped IHS Core i9)
  const cpuIhsBase = new THREE.Mesh(
    res.getRoundedBox(0.46, 0.46, 0.045, 2, 0.015),
    matChrome
  );
  cpuIhsBase.position.set(0, 0, 0.04);
  cpuGroup.add(cpuIhsBase);

  const cpuIhsTop = new THREE.Mesh(
    res.getRoundedBox(0.36, 0.4, 0.035, 1, 0.01),
    matSilver
  );
  cpuIhsTop.position.set(0, 0, 0.065);
  cpuGroup.add(cpuIhsTop);

  // Медная подошва водоблока (Coldplate) с микровинтами
  const coldPlate = new THREE.Mesh(
    res.getCylinder(0.35, 0.35, 0.05, 28),
    matCopper
  );
  coldPlate.rotation.x = Math.PI / 2;
  coldPlate.position.set(0, 0, 0.1);
  cpuGroup.add(coldPlate);

  // Крепёжная крестовина водоблока с 4 накатанными подпружиненными гайками
  const bracketAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  bracketAngles.forEach((angle) => {
    const arm = new THREE.Mesh(
      res.getBox(0.26, 0.085, 0.04),
      matGunmetal
    );
    arm.rotation.z = angle;
    arm.position.set(Math.cos(angle) * 0.32, Math.sin(angle) * 0.32, 0.12);
    cpuGroup.add(arm);

    const spring = new THREE.Mesh(
      res.getCylinder(0.032, 0.032, 0.08, 10),
      matSilver
    );
    spring.rotation.x = Math.PI / 2;
    spring.position.set(Math.cos(angle) * 0.41, Math.sin(angle) * 0.41, 0.11);
    cpuGroup.add(spring);

    const thumbNut = new THREE.Mesh(
      res.getCylinder(0.048, 0.048, 0.09, 14),
      matChrome
    );
    thumbNut.rotation.x = Math.PI / 2;
    thumbNut.position.set(Math.cos(angle) * 0.41, Math.sin(angle) * 0.41, 0.155);
    cpuGroup.add(thumbNut);
  });

  // Фрезерованный цилиндрический корпус помпы СЖО с вертикальным рифлением
  const pumpBody = new THREE.Mesh(
    res.getCylinder(0.38, 0.41, 0.34, 32),
    matAnodized
  );
  pumpBody.rotation.x = Math.PI / 2;
  pumpBody.position.set(0, 0, 0.28);
  pumpBody.castShadow = true;
  cpuGroup.add(pumpBody);

  // Продольные металлические рёбра на корпусе водоблока (CNC knurling)
  const pumpRibCount = isMobile ? 12 : 20;
  for (let pr = 0; pr < pumpRibCount; pr++) {
    const angle = (pr / pumpRibCount) * Math.PI * 2;
    const rib = new THREE.Mesh(
      res.getBox(0.022, 0.022, 0.28),
      matGraphite
    );
    rib.position.set(Math.cos(angle) * 0.395, Math.sin(angle) * 0.395, 0.28);
    rib.rotation.z = angle;
    cpuGroup.add(rib);
  }

  // Алюминиевый безель вокруг экрана помпы
  const pumpBezel = new THREE.Mesh(
    res.getTorus(0.375, 0.032, 14, 36),
    matGunmetal
  );
  pumpBezel.position.set(0, 0, 0.45);
  cpuGroup.add(pumpBezel);

  // Глубокое зеркало Infinity Mirror на вершине помпы
  const mirrorCap = new THREE.Mesh(
    res.getCylinder(0.35, 0.35, 0.03, 32),
    matMirror
  );
  mirrorCap.rotation.x = Math.PI / 2;
  mirrorCap.position.set(0, 0, 0.445);
  cpuGroup.add(mirrorCap);

  // Тонкие прецизионные кольца Infinity Mirror (без размытия и пересвета)
  const outerNeonRing = new THREE.Mesh(
    res.getTorus(0.3, 0.011, 12, 42),
    matNeon
  );
  outerNeonRing.position.set(0, 0, 0.464);
  cpuGroup.add(outerNeonRing);

  const midNeonRing = new THREE.Mesh(
    res.getTorus(0.21, 0.008, 10, 36),
    matNeonSec
  );
  midNeonRing.position.set(0, 0, 0.463);
  cpuGroup.add(midNeonRing);

  const innerNeonRing = new THREE.Mesh(
    res.getTorus(0.12, 0.007, 10, 28),
    matTrace
  );
  innerNeonRing.position.set(0, 0, 0.462);
  cpuGroup.add(innerNeonRing);

  // Центральный геометрический символ телеметрии внутри зеркала помпы
  const coreBar1 = new THREE.Mesh(
    res.getBox(0.11, 0.014, 0.012),
    matNeon
  );
  coreBar1.position.set(0, 0.022, 0.466);
  cpuGroup.add(coreBar1);

  const coreBar2 = new THREE.Mesh(
    res.getBox(0.075, 0.012, 0.012),
    matNeonSec
  );
  coreBar2.position.set(0, -0.022, 0.466);
  cpuGroup.add(coreBar2);

  // --- ВЕРХНИЙ РАДИАТОР СЖО 360MM С КОЛЛЕКТОРНЫМИ БАЧКАМИ И ФИТИНГАМИ ---
  const radW = 2.65;
  const radH = 0.24;
  const radD = 1.08;
  const radPos = new THREE.Vector3(0.32, 1.02, 0.34);

  const radiatorFrame = new THREE.Mesh(
    res.getRoundedBox(radW, radH, radD, 2, 0.02),
    matAnodized
  );
  radiatorFrame.position.copy(radPos);
  radiatorFrame.castShadow = true;
  cpuGroup.add(radiatorFrame);

  // Боковые коллекторные бачки радиатора (End Tanks)
  const leftTank = new THREE.Mesh(
    res.getRoundedBox(0.22, radH + 0.02, radD + 0.02, 2, 0.02),
    matGraphite
  );
  leftTank.position.set(radPos.x - radW / 2 + 0.11, radPos.y, radPos.z);
  cpuGroup.add(leftTank);

  const rightTank = new THREE.Mesh(
    res.getRoundedBox(0.26, radH + 0.02, radD + 0.02, 2, 0.02),
    matGraphite
  );
  rightTank.position.set(radPos.x + radW / 2 - 0.13, radPos.y, radPos.z);
  cpuGroup.add(rightTank);

  // Боковая металлическая шина радиатора с тонкой салатовой линией
  const radSidePlate = new THREE.Mesh(
    res.getBox(radW - 0.44, radH * 0.72, 0.025),
    matGunmetal
  );
  radSidePlate.position.set(radPos.x, radPos.y, radPos.z + radD / 2 + 0.008);
  cpuGroup.add(radSidePlate);

  const radNeonStrip = new THREE.Mesh(
    res.getBox(radW - 0.56, 0.014, 0.018),
    matNeonSec
  );
  radNeonStrip.position.set(radPos.x, radPos.y, radPos.z + radD / 2 + 0.016);
  cpuGroup.add(radNeonStrip);

  // Пакет тонких алюминиевых ламелей радиатора СЖО (1 draw call через InstancedMesh)
  const finCount = isMobile ? 20 : 34;
  const radFinPositions = [];
  for (let f = 0; f < finCount; f++) {
    radFinPositions.push([
      radPos.x - radW / 2 + 0.28 + f * ((radW - 0.56) / finCount),
      radPos.y,
      radPos.z,
    ]);
  }
  res.addInstancedPositions(cpuGroup, res.getBox(0.018, radH - 0.03, radD - 0.08), matGraphite, radFinPositions);

  // 3 низкопрофильных кожуха вентиляторов под радиатором СЖО
  for (let rf = -1; rf <= 1; rf++) {
    const subFanRing = new THREE.Mesh(
      res.getTorus(0.36, 0.018, 10, 28),
      matGunmetal
    );
    subFanRing.rotation.x = Math.PI / 2;
    subFanRing.position.set(radPos.x + rf * 0.76, radPos.y - radH / 2 - 0.02, radPos.z);
    cpuGroup.add(subFanRing);
  }

  // 2 гибких шланга СЖО в оплётке с поворотными 90° фитингами и компрессионными кольцами
  const tubeConfigs = [
    [
      new THREE.Vector3(0.38, 0.085, 0.28),
      new THREE.Vector3(0.88, 0.16, 0.68),
      new THREE.Vector3(1.24, 0.56, 0.62),
      new THREE.Vector3(1.38, radPos.y - 0.1, radPos.z + 0.18),
    ],
    [
      new THREE.Vector3(0.38, -0.085, 0.28),
      new THREE.Vector3(0.96, -0.02, 0.54),
      new THREE.Vector3(1.32, 0.46, 0.44),
      new THREE.Vector3(1.38, radPos.y - 0.1, radPos.z - 0.12),
    ],
  ];

  tubeConfigs.forEach((pts) => {
    // Поворотный фитинг на помпе + накатная гайка
    const fitting = new THREE.Mesh(
      res.getCylinder(0.052, 0.052, 0.13, 14),
      matChrome
    );
    fitting.rotation.z = Math.PI / 2;
    fitting.position.copy(pts[0]);
    cpuGroup.add(fitting);

    // Фитинг на бачке радиатора
    const radFitting = new THREE.Mesh(
      res.getCylinder(0.055, 0.055, 0.11, 14),
      matChrome
    );
    radFitting.position.copy(pts[3]);
    cpuGroup.add(radFitting);

    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = res.trackGeometry(
      new THREE.TubeGeometry(curve, isMobile ? 18 : 28, 0.044, 12, false)
    );
    const tubeMesh = new THREE.Mesh(tubeGeo, matPolymer);
    tubeMesh.castShadow = true;
    cpuGroup.add(tubeMesh);
  });

  // Металлическая клипса-держатель шлангов СЖО с тонкой салатовой вставкой
  const tubeClip = new THREE.Mesh(
    res.getRoundedBox(0.11, 0.28, 0.28, 1, 0.02),
    matGraphite
  );
  tubeClip.position.set(1.06, 0.22, 0.58);
  tubeClip.rotation.z = 0.45;
  cpuGroup.add(tubeClip);

  const tubeClipNeon = new THREE.Mesh(
    res.getBox(0.115, 0.016, 0.285),
    matNeon
  );
  tubeClipNeon.position.copy(tubeClip.position);
  tubeClipNeon.rotation.copy(tubeClip.rotation);
  cpuGroup.add(tubeClipNeon);

  cpuGroup.userData = {
    id: 'cpu',
    label: 'CORE i9-14900K // 360 AIO',
    sublabel: '6.0 ГГц · СЖО с Infinity-зеркалом',
    basePos: basePos.clone(),
    anchorLocal: new THREE.Vector3(0.0, 0.04, 0.47),
    explodePos: new THREE.Vector3(-0.18, 0.82, 1.05),
    explodeRot: new THREE.Euler(0.14, -0.16, 0.04),
  };

  return cpuGroup;
}

/**
 * 4. ВИДЕОКАРТА (флагманская RTX 4080/4090: литой кожух с фасками, 3 вентилятора с внешними кольцами,
 *    бэкплейт с окном продува Flow-Through, 6 медных/никелированных теплотрубок, кабель 12VHPWR)
 */
export function createGPU(res, { isMobile = false } = {}) {
  const gpuGroup = new THREE.Group();
  gpuGroup.name = 'gpu';

  const basePos = new THREE.Vector3(-0.34, -0.14, 0.34);
  gpuGroup.position.copy(basePos);

  const gpuW = 2.48; // Длина видеокарты по X
  const gpuH = 0.48; // Толщина (3.5 слота) по Y
  const gpuD = 1.06; // Ширина по Z

  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matCopper = res.mat('copperMetal');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');
  const matTrace = res.mat('neonTrace');
  const matPcb = res.mat('pcbSurface');
  const matGold = res.mat('goldContacts');
  const matPolymer = res.mat('darkPolymer');
  const matBlade = res.mat('fanBladeMat');

  // --- МЕТАЛЛИЧЕСКИЙ БЭКПЛЕЙТ С ОКНОМ ПРОДУВА FLOW-THROUGH И КРЕСТОВИНОЙ GPU ---
  const backplateLeft = new THREE.Mesh(
    res.getRoundedBox(gpuW * 0.62, 0.042, gpuD, 2, 0.015),
    matAnodized
  );
  backplateLeft.position.set(-gpuW * 0.19, gpuH / 2 - 0.02, 0);
  backplateLeft.castShadow = true;
  backplateLeft.receiveShadow = true;
  gpuGroup.add(backplateLeft);

  // Правая рамка бэкплейта вокруг сквозного окна Flow-Through
  const bpRightTop = new THREE.Mesh(
    res.getBox(gpuW * 0.38, 0.04, 0.18),
    matAnodized
  );
  bpRightTop.position.set(gpuW * 0.31, gpuH / 2 - 0.02, gpuD / 2 - 0.09);
  gpuGroup.add(bpRightTop);

  const bpRightBottom = new THREE.Mesh(
    res.getBox(gpuW * 0.38, 0.04, 0.18),
    matAnodized
  );
  bpRightBottom.position.set(gpuW * 0.31, gpuH / 2 - 0.02, -gpuD / 2 + 0.09);
  gpuGroup.add(bpRightBottom);

  const bpRightEnd = new THREE.Mesh(
    res.getBox(0.16, 0.04, gpuD),
    matAnodized
  );
  bpRightEnd.position.set(gpuW / 2 - 0.08, gpuH / 2 - 0.02, 0);
  gpuGroup.add(bpRightEnd);

  // Поперечные рёбра жёсткости в окне Flow-Through
  for (let b = -1; b <= 1; b++) {
    const strut = new THREE.Mesh(
      res.getBox(0.045, 0.038, gpuD - 0.32),
      matGraphite
    );
    strut.position.set(0.68 + b * 0.22, gpuH / 2 - 0.018, 0.06);
    gpuGroup.add(strut);
  }

  // Крестовина-брекет GPU ядра на бэкплейте с 4 винтами и матрицей конденсаторов MLCC
  const coreCavity = new THREE.Mesh(
    res.getBox(0.28, 0.025, 0.28),
    matPcb
  );
  coreCavity.position.set(-0.55, gpuH / 2 + 0.004, -0.05);
  gpuGroup.add(coreCavity);

  const coreMlcc = new THREE.Mesh(
    res.getBox(0.14, 0.03, 0.14),
    matGold
  );
  coreMlcc.position.set(-0.55, gpuH / 2 + 0.008, -0.05);
  gpuGroup.add(coreMlcc);

  for (let rot of [Math.PI / 4, -Math.PI / 4]) {
    const xBracket = new THREE.Mesh(
      res.getBox(0.38, 0.022, 0.055),
      matChrome
    );
    xBracket.rotation.y = rot;
    xBracket.position.set(-0.55, gpuH / 2 + 0.01, -0.05);
    gpuGroup.add(xBracket);
  }

  // Узкая прецизионная салатовая линия на бэкплейте
  const backplateNeon = new THREE.Mesh(
    res.getBox(1.12, 0.014, 0.016),
    matTrace
  );
  backplateNeon.position.set(-0.18, gpuH / 2 + 0.006, 0.32);
  gpuGroup.add(backplateNeon);

  // --- ПЕЧАТНАЯ ПЛАТА ВИДЕОКАРТЫ + ЗОЛОТОЙ РАЗЪЁМ PCIe 5.0 x16 ---
  const gpuPcb = new THREE.Mesh(
    res.getBox(gpuW * 0.68, 0.032, gpuD - 0.08),
    matPcb
  );
  gpuPcb.position.set(-0.34, gpuH / 2 - 0.08, -0.02);
  gpuGroup.add(gpuPcb);

  const pcieFingers = new THREE.Mesh(
    res.getBox(0.92, 0.036, 0.14),
    matGold
  );
  pcieFingers.position.set(-0.42, gpuH / 2 - 0.08, -gpuD / 2 - 0.04);
  gpuGroup.add(pcieFingers);

  // --- ДВУХСЕКЦИОННЫЙ РАДИАТОР ОХЛАЖДЕНИЯ (1 draw call через InstancedMesh) + 6 ТЕПЛОТРУБОК ---
  const finCount = isMobile ? 24 : 42;
  const gpuFinPositions = [];
  for (let i = 0; i < finCount; i++) {
    gpuFinPositions.push([-gpuW / 2 + 0.12 + i * ((gpuW - 0.24) / finCount), 0.01, 0]);
  }
  res.addInstancedPositions(gpuGroup, res.getBox(0.018, gpuH - 0.12, gpuD - 0.12), matGraphite, gpuFinPositions);

  // 6 тепловых трубок (чередование меди и никелированной стали), проходящих сквозь радиатор
  for (let hp = 0; hp < 6; hp++) {
    const pipe = new THREE.Mesh(
      res.getCylinder(0.022, 0.022, gpuW - 0.06, 12),
      hp % 2 === 0 ? matChrome : matCopper
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, -0.08 + hp * 0.038, gpuD / 2 - 0.055);
    gpuGroup.add(pipe);

    // Торцевые колпачки теплотрубок справа (видны спереди)
    const pipeEnd = new THREE.Mesh(
      res.getCylinder(0.024, 0.018, 0.06, 10),
      hp % 2 === 0 ? matChrome : matCopper
    );
    pipeEnd.rotation.z = Math.PI / 2;
    pipeEnd.position.set(gpuW / 2 - 0.01, -0.08 + hp * 0.038, -0.22 + hp * 0.08);
    gpuGroup.add(pipeEnd);
  }

  // --- ЛИТОЙ КОЖУХ ВИДЕОКАРТЫ С ГЕОМЕТРИЧЕСКОЙ БРОНЁЙ И ШИЛЬДИКОМ RTX ---
  const shroudBody = new THREE.Mesh(
    res.getRoundedBox(gpuW, 0.17, gpuD, 2, 0.025),
    matAnodized
  );
  shroudBody.position.set(0, -gpuH / 2 + 0.085, 0);
  shroudBody.castShadow = true;
  gpuGroup.add(shroudBody);

  // Передний боковой торец кожуха (обращённый к стеклу, Z = +gpuD/2)
  const sideArmor = new THREE.Mesh(
    res.getRoundedBox(gpuW, gpuH * 0.56, 0.075, 2, 0.018),
    matGraphite
  );
  sideArmor.position.set(0, 0.02, gpuD / 2 - 0.02);
  gpuGroup.add(sideArmor);

  // Металлическая плашка GEFORCE RTX на торце
  const rtxBadgePlate = new THREE.Mesh(
    res.getRoundedBox(0.76, 0.11, 0.03, 1, 0.01),
    matGunmetal
  );
  rtxBadgePlate.position.set(-0.56, 0.02, gpuD / 2 + 0.012);
  gpuGroup.add(rtxBadgePlate);

  // Узкая утопленная салатовая линия световода на торце видеокарты (без пересвета!)
  const mainNeonStrip = new THREE.Mesh(
    res.getBox(gpuW - 0.22, 0.02, 0.018),
    matNeon
  );
  mainNeonStrip.position.set(0, 0.095, gpuD / 2 + 0.018);
  gpuGroup.add(mainNeonStrip);

  const subNeonStrip = new THREE.Mesh(
    res.getBox(0.68, 0.014, 0.018),
    matNeonSec
  );
  subNeonStrip.position.set(-0.56, -0.038, gpuD / 2 + 0.018);
  gpuGroup.add(subNeonStrip);

  // Разъём питания 16-pin 12VHPWR + изогнутый кабель в оплётке с гребёнкой
  const powerHeader = new THREE.Mesh(
    res.getBox(0.24, 0.12, 0.14),
    matPolymer
  );
  powerHeader.position.set(0.48, gpuH / 2 - 0.05, gpuD / 2 - 0.05);
  gpuGroup.add(powerHeader);

  const vhpwrCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.48, gpuH / 2 - 0.04, gpuD / 2 + 0.02),
    new THREE.Vector3(0.48, -0.18, gpuD / 2 + 0.22),
    new THREE.Vector3(0.48, -0.52, gpuD / 2 + 0.04),
  ]);
  const vhpwrGeo = res.trackGeometry(new THREE.TubeGeometry(vhpwrCurve, 14, 0.042, 10, false));
  const vhpwrCable = new THREE.Mesh(vhpwrGeo, matPolymer);
  gpuGroup.add(vhpwrCable);

  const cableComb = new THREE.Mesh(
    res.getBox(0.14, 0.035, 0.11),
    matGunmetal
  );
  cableComb.position.set(0.48, -0.22, gpuD / 2 + 0.21);
  gpuGroup.add(cableComb);

  // --- 3 ОСЕВЫХ ВЕНТИЛЯТОРА AXIAL-TECH С ВНЕШНИМИ БАРЬЕРНЫМИ КОЛЬЦАМИ ---
  const fanRotors = [];
  const fanXOffsets = [-0.78, 0.0, 0.78];

  fanXOffsets.forEach((fx, idx) => {
    // Фрезерованное металлическое кольцо колодца вентилятора + 4 микровинта
    const fanBezel = new THREE.Mesh(
      res.getTorus(0.35, 0.018, 12, 32),
      idx === 1 ? matSilver : matGunmetal
    );
    fanBezel.rotation.x = Math.PI / 2;
    fanBezel.position.set(fx, -gpuH / 2 - 0.004, 0);
    gpuGroup.add(fanBezel);

    if (idx === 1) {
      const centerAccentRing = new THREE.Mesh(
        res.getTorus(0.365, 0.007, 10, 32),
        matTrace
      );
      centerAccentRing.rotation.x = Math.PI / 2;
      centerAccentRing.position.set(fx, -gpuH / 2 - 0.008, 0);
      gpuGroup.add(centerAccentRing);
    }

    // Вращающийся ротор с 9 изогнутыми лопастями и барьерным кольцом
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(fx, -gpuH / 2 - 0.008, 0);
    rotorGroup.userData.spinSpeed = idx === 1 ? -7.5 : 7.5;

    const hub = new THREE.Mesh(
      res.getCylinder(0.11, 0.11, 0.05, 20),
      matGraphite
    );
    rotorGroup.add(hub);

    const hubCap = new THREE.Mesh(
      res.getCylinder(0.068, 0.068, 0.056, 16),
      matChrome
    );
    rotorGroup.add(hubCap);

    // Внешнее барьерное кольцо крыльчатки (Axial-Tech Barrier Ring)
    const barrierRing = new THREE.Mesh(
      res.getTorus(0.31, 0.012, 10, 28),
      matBlade
    );
    barrierRing.rotation.x = Math.PI / 2;
    rotorGroup.add(barrierRing);

    const bladeCount = 9;
    for (let b = 0; b < bladeCount; b++) {
      const angle = (b / bladeCount) * Math.PI * 2;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.y = angle;

      const blade = new THREE.Mesh(
        res.getBox(0.21, 0.015, 0.072),
        matBlade
      );
      blade.position.set(0.19, 0, 0);
      blade.rotation.x = 0.42;
      bladePivot.add(blade);
      rotorGroup.add(bladePivot);
    }

    gpuGroup.add(rotorGroup);
    fanRotors.push(rotorGroup);
  });

  // Задняя крепёжная планка I/O видеокарты с видеовыходами (3x DP, 1x HDMI)
  const ioBracket = new THREE.Mesh(
    res.getBox(0.045, gpuH + 0.14, gpuD - 0.14),
    matChrome
  );
  ioBracket.position.set(-gpuW / 2 - 0.022, -0.02, 0);
  gpuGroup.add(ioBracket);

  for (let p = 0; p < 4; p++) {
    const portBox = new THREE.Mesh(
      res.getBox(0.09, 0.045, 0.12),
      matGold
    );
    portBox.position.set(-gpuW / 2 + 0.02, 0.05, -0.28 + p * 0.18);
    gpuGroup.add(portBox);
  }

  gpuGroup.userData = {
    id: 'gpu',
    label: 'RTX 4090 // 24 GB GDDR6X',
    sublabel: 'Triple-Fan · 16384 CUDA ядер',
    basePos: basePos.clone(),
    fanRotors,
    anchorLocal: new THREE.Vector3(0.35, 0.05, gpuD / 2 + 0.04),
    explodePos: new THREE.Vector3(0.42, -0.28, 1.55),
    explodeRot: new THREE.Euler(-0.22, -0.18, 0.05),
  };

  return gpuGroup;
}

/**
 * 5. ОПЕРАТИВНАЯ ПАМЯТЬ (2 планки DDR5: текстолит с чипами, двухцветный алюминиевый радиатор
 *    и сегментированный металлическими ламелями RGB-гребень без пересвета)
 */
export function createRAM(res) {
  const ramGroup = new THREE.Group();
  ramGroup.name = 'ramKit';

  const basePos = new THREE.Vector3(0.06, 0.98, -0.18);
  ramGroup.position.copy(basePos);

  const matPcb = res.mat('pcbSurface');
  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matGold = res.mat('goldContacts');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');

  const sticks = [];
  const slotXOffsets = [-0.11, 0.11];

  slotXOffsets.forEach((sx, idx) => {
    const stickGroup = new THREE.Group();
    stickGroup.position.set(sx, 0, 0);
    stickGroup.userData.baseX = sx;
    stickGroup.userData.stickIndex = idx;

    // Чёрный 10-слойный текстолит модуля памяти
    const ramPcb = new THREE.Mesh(
      res.getBox(0.022, 1.1, 0.22),
      matPcb
    );
    ramPcb.position.set(0, 0, 0.02);
    stickGroup.add(ramPcb);

    // Золотые контакты DDR5 снизу планки (разделённые ключом)
    const goldEdgeTop = new THREE.Mesh(
      res.getBox(0.024, 0.52, 0.045),
      matGold
    );
    goldEdgeTop.position.set(0, 0.26, -0.065);
    stickGroup.add(goldEdgeTop);

    const goldEdgeBot = new THREE.Mesh(
      res.getBox(0.024, 0.44, 0.045),
      matGold
    );
    goldEdgeBot.position.set(0, -0.28, -0.065);
    stickGroup.add(goldEdgeBot);

    // Алюминиевый радиатор охлаждения DDR5 с рельефными боковинами
    const heatsink = new THREE.Mesh(
      res.getRoundedBox(0.05, 1.12, 0.23, 2, 0.01),
      matAnodized
    );
    heatsink.position.set(0, 0, 0.06);
    heatsink.castShadow = true;
    stickGroup.add(heatsink);

    // Контрастная фрезерованная накладка по центру радиатора
    const finOverlay = new THREE.Mesh(
      res.getBox(0.058, 0.64, 0.14),
      matGraphite
    );
    finOverlay.position.set(0, 0, 0.07);
    stickGroup.add(finOverlay);

    const centerBadge = new THREE.Mesh(
      res.getBox(0.062, 0.24, 0.07),
      matSilver
    );
    centerBadge.position.set(0, 0, 0.075);
    stickGroup.add(centerBadge);

    // Изящный узкий гребень RGB-диффузора (вдвое тоньше прежнего, чтобы не слепил)
    const rgbLightbar = new THREE.Mesh(
      res.getRoundedBox(0.036, 1.14, 0.052, 1, 0.01),
      idx === 0 ? matNeon : matNeonSec
    );
    rgbLightbar.position.set(0, 0, 0.205);
    stickGroup.add(rgbLightbar);

    // 7 металлических колец-ламелей поверх RGB-полосы (эффект Dominator/Trident)
    for (let seg = -3; seg <= 3; seg++) {
      const divider = new THREE.Mesh(
        res.getBox(0.054, 0.034, 0.068),
        seg === 0 ? matGunmetal : matAnodized
      );
      divider.position.set(0, seg * 0.155, 0.206);
      stickGroup.add(divider);
    }

    ramGroup.add(stickGroup);
    sticks.push(stickGroup);
  });

  ramGroup.userData = {
    id: 'ram',
    label: '64 GB DDR5 // 6400 MHz',
    sublabel: '2×32 ГБ Dual-Channel RGB',
    basePos: basePos.clone(),
    sticks,
    anchorLocal: new THREE.Vector3(0.11, 0.22, 0.22),
    explodePos: new THREE.Vector3(0.84, 0.72, 0.85),
    explodeRot: new THREE.Euler(0.1, -0.24, -0.12),
  };

  return ramGroup;
}

/**
 * 6. БЛОК ПИТАНИЯ (1000W ATX 3.0: крыльчатка 135мм под защитной решёткой, рельефная боковая панель,
 *    колодки модульных разъёмов, кабели с гребёнками и вход C14 с латунными пинами)
 */
export function createPSU(res, { isMobile = false } = {}) {
  const psuGroup = new THREE.Group();
  psuGroup.name = 'psu';

  const basePos = new THREE.Vector3(-1.18, -1.62, 0.16);
  psuGroup.position.copy(basePos);

  const psuW = 1.48;
  const psuH = 0.78;
  const psuD = 1.32;

  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matGold = res.mat('goldContacts');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');
  const matTrace = res.mat('neonTrace');
  const matPolymer = res.mat('darkPolymer');
  const matBlade = res.mat('fanBladeMat');

  // Корпус блока питания
  const psuBody = new THREE.Mesh(
    res.getRoundedBox(psuW, psuH, psuD, 2, 0.025),
    matAnodized
  );
  psuBody.castShadow = true;
  psuBody.receiveShadow = true;
  psuGroup.add(psuBody);

  // Рельефная боковая панель с металлическими рёбрами и тонкой неоновой нитью
  const sidePlate = new THREE.Mesh(
    res.getRoundedBox(psuW - 0.16, psuH - 0.16, 0.03, 1, 0.01),
    matGraphite
  );
  sidePlate.position.set(0, 0, psuD / 2 + 0.008);
  psuGroup.add(sidePlate);

  for (let r = -1; r <= 1; r += 2) {
    const trimRib = new THREE.Mesh(
      res.getBox(psuW - 0.26, 0.024, 0.036),
      matGunmetal
    );
    trimRib.position.set(0, r * 0.22, psuD / 2 + 0.012);
    psuGroup.add(trimRib);
  }

  // Тонкая салатовая линия статуса 1000W (вместо широкой пересвеченной полосы)
  const psuNeonBar = new THREE.Mesh(
    res.getBox(psuW - 0.34, 0.016, 0.022),
    matNeon
  );
  psuNeonBar.position.set(0, 0.08, psuD / 2 + 0.018);
  psuGroup.add(psuNeonBar);

  // Шильдик мощности 1000W и 3 компактных светодиода нагрузки
  const specBadge = new THREE.Mesh(
    res.getBox(0.46, 0.11, 0.028),
    matSilver
  );
  specBadge.position.set(0.28, -0.09, psuD / 2 + 0.014);
  psuGroup.add(specBadge);

  const psuWattBadges = [-0.42, -0.28, -0.14];
  psuWattBadges.forEach((bx, i) => {
    const badgeBar = new THREE.Mesh(
      res.getBox(0.08, 0.032, 0.024),
      i === 0 ? matNeonSec : matTrace
    );
    badgeBar.position.set(bx, -0.09, psuD / 2 + 0.016);
    psuGroup.add(badgeBar);
  });

  // --- ВЕРХНИЙ 135-ММ ВЕНТИЛЯТОР БП И КОНЦЕНТРИЧЕСКАЯ ЗАЩИТНАЯ РЕШЁТКА ---
  for (let r = 1; r <= 3; r++) {
    const grillRing = new THREE.Mesh(
      res.getTorus(r * 0.15, 0.012, 8, 28),
      r === 3 ? matGunmetal : matGraphite
    );
    grillRing.rotation.x = Math.PI / 2;
    grillRing.position.set(0, psuH / 2 + 0.012, 0);
    psuGroup.add(grillRing);
  }

  const fanHub = new THREE.Mesh(
    res.getCylinder(0.14, 0.14, 0.032, 18),
    matChrome
  );
  fanHub.position.set(0, psuH / 2 + 0.01, 0);
  psuGroup.add(fanHub);

  // Лопасти внутреннего вентилятора БП
  for (let b = 0; b < 7; b++) {
    const angle = (b / 7) * Math.PI * 2;
    const blade = new THREE.Mesh(
      res.getBox(0.32, 0.014, 0.09),
      matBlade
    );
    blade.rotation.y = angle;
    blade.rotation.x = 0.35;
    blade.position.set(Math.cos(angle) * 0.24, psuH / 2 + 0.002, Math.sin(angle) * 0.24);
    psuGroup.add(blade);
  }

  const grillCount = isMobile ? 7 : 11;
  for (let g = 0; g < grillCount; g++) {
    const bar = new THREE.Mesh(
      res.getBox(0.96, 0.016, 0.02),
      matGraphite
    );
    bar.position.set(0, psuH / 2 + 0.016, -0.42 + g * (0.84 / (grillCount - 1)));
    psuGroup.add(bar);
  }

  // --- ПАНЕЛЬ МОДУЛЬНЫХ РАЗЪЁМОВ ATX 3.0 СПРАВА + ПУЧОК ПЛЕТЁНЫХ КАБЕЛЕЙ ---
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const socket = new THREE.Mesh(
        res.getBox(0.06, 0.14, 0.18),
        row === 1 && col === 0 ? matGunmetal : matPolymer
      );
      socket.position.set(psuW / 2 + 0.02, -0.14 + row * 0.26, -0.38 + col * 0.25);
      psuGroup.add(socket);
    }
  }

  // Салатовая маркировка разъёма 12VHPWR PCIe 5.0 на БП
  const pcie5Collar = new THREE.Mesh(
    res.getBox(0.068, 0.02, 0.185),
    matTrace
  );
  pcie5Collar.position.set(psuW / 2 + 0.024, 0.19, -0.38);
  psuGroup.add(pcie5Collar);

  // Выходящие дуги модульных кабелей питания с кабельными гребёнками
  for (let c = 0; c < 4; c++) {
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(psuW / 2 + 0.04, 0.12 - c * 0.09, -0.22 + c * 0.15),
      new THREE.Vector3(psuW / 2 + 0.36, 0.16 - c * 0.06, -0.24 + c * 0.13),
      new THREE.Vector3(psuW / 2 + 0.5, 0.46, -0.34),
    ]);
    const cableGeo = res.trackGeometry(new THREE.TubeGeometry(cableCurve, 12, 0.028, 8, false));
    const cableMesh = new THREE.Mesh(cableGeo, matPolymer);
    psuGroup.add(cableMesh);
  }

  // Сетевой разъём C14 с 3 латунными контактами и тумблер питания сзади
  const acInlet = new THREE.Mesh(
    res.getBox(0.05, 0.18, 0.24),
    matPolymer
  );
  acInlet.position.set(-psuW / 2 - 0.015, -0.06, 0.28);
  psuGroup.add(acInlet);

  for (let p = -1; p <= 1; p++) {
    const brassPin = new THREE.Mesh(
      res.getBox(0.06, 0.02, 0.03),
      matGold
    );
    brassPin.position.set(-psuW / 2 - 0.02, -0.06 + (p === 0 ? 0.03 : -0.02), 0.28 + p * 0.06);
    psuGroup.add(brassPin);
  }

  const powerSwitch = new THREE.Mesh(
    res.getBox(0.05, 0.12, 0.16),
    matGunmetal
  );
  powerSwitch.position.set(-psuW / 2 - 0.015, 0.16, 0.28);
  psuGroup.add(powerSwitch);

  const switchLed = new THREE.Mesh(
    res.getBox(0.055, 0.02, 0.1),
    matTrace
  );
  switchLed.position.set(-psuW / 2 - 0.018, 0.19, 0.28);
  psuGroup.add(switchLed);

  psuGroup.userData = {
    id: 'psu',
    label: 'PSU 1000W // 80+ TITANIUM',
    sublabel: 'ATX 3.0 · Модульные линии',
    basePos: basePos.clone(),
    anchorLocal: new THREE.Vector3(0.0, 0.08, psuD / 2 + 0.04),
    explodePos: new THREE.Vector3(-0.62, -0.68, 1.38),
    explodeRot: new THREE.Euler(0.12, 0.22, -0.04),
  };

  return psuGroup;
}

/**
 * 7. НАКОПИТЕЛЬ SSD M.2 NVMe (текстолит 2280, чипы NAND и контроллер, голубая термопрокладка,
 *    фрезерованный радиатор с продольными и поперечными прорезями и тонким индикатором)
 */
export function createSSD(res) {
  const ssdGroup = new THREE.Group();
  ssdGroup.name = 'ssdNvme';

  const basePos = new THREE.Vector3(-0.46, 0.28, -0.19);
  ssdGroup.position.copy(basePos);

  const ssdW = 0.88;
  const ssdH = 0.24;

  const matPcb = res.mat('pcbSurface');
  const matThermal = res.mat('thermalPad');
  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matGold = res.mat('goldContacts');
  const matPolymer = res.mat('darkPolymer');
  const matNeon = res.mat('neonPrimary');

  // Текстолит M.2 2280
  const pcb = new THREE.Mesh(
    res.getBox(ssdW, ssdH, 0.024),
    matPcb
  );
  ssdGroup.add(pcb);

  // Золотой разъём M-Key справа (с вырезом ключа)
  const goldConnectorMain = new THREE.Mesh(
    res.getBox(0.075, ssdH * 0.56, 0.028),
    matGold
  );
  goldConnectorMain.position.set(ssdW / 2 + 0.02, -0.025, 0);
  ssdGroup.add(goldConnectorMain);

  const goldConnectorKey = new THREE.Mesh(
    res.getBox(0.075, ssdH * 0.18, 0.028),
    matGold
  );
  goldConnectorKey.position.set(ssdW / 2 + 0.02, 0.072, 0);
  ssdGroup.add(goldConnectorKey);

  // Микросхемы контроллера PCIe Gen5 и чипов памяти NAND + прослойка термопрокладки
  for (let ic = 0; ic < 3; ic++) {
    const chip = new THREE.Mesh(
      res.getBox(0.18, 0.18, 0.022),
      ic === 2 ? matSilver : matPolymer
    );
    chip.position.set(-0.24 + ic * 0.22, 0, 0.02);
    ssdGroup.add(chip);
  }

  const thermalLayer = new THREE.Mesh(
    res.getBox(ssdW - 0.12, ssdH - 0.02, 0.016),
    matThermal
  );
  thermalLayer.position.set(-0.02, 0, 0.032);
  ssdGroup.add(thermalLayer);

  // Ступенчатый фрезерованный алюминиевый радиатор M.2 сверху
  const heatsink = new THREE.Mesh(
    res.getRoundedBox(ssdW - 0.08, ssdH + 0.02, 0.085, 2, 0.012),
    matAnodized
  );
  heatsink.position.set(-0.02, 0, 0.075);
  heatsink.castShadow = true;
  ssdGroup.add(heatsink);

  // Боковая прижимная скоба радиатора с микровинтами
  const clampPlate = new THREE.Mesh(
    res.getBox(0.42, ssdH + 0.03, 0.04),
    matGunmetal
  );
  clampPlate.position.set(-0.02, 0, 0.105);
  ssdGroup.add(clampPlate);

  // Продольные рёбра охлаждения на радиаторе SSD
  for (let r = -2; r <= 2; r++) {
    const rib = new THREE.Mesh(
      res.getBox(ssdW - 0.12, 0.018, 0.028),
      r % 2 === 0 ? matGraphite : matSilver
    );
    rib.position.set(-0.02, r * 0.044, 0.122);
    ssdGroup.add(rib);
  }

  // Узкая прецизионная салатовая линия активности NVMe Gen5 (0.014 вместо 0.034)
  const ssdNeon = new THREE.Mesh(
    res.getBox(ssdW - 0.22, 0.014, 0.018),
    matNeon
  );
  ssdNeon.position.set(-0.02, 0, 0.134);
  ssdGroup.add(ssdNeon);

  // Позолоченное полукольцо заземления и крепёжный винт M.2 слева
  const groundPad = new THREE.Mesh(
    res.getCylinder(0.046, 0.046, 0.03, 14),
    matGold
  );
  groundPad.rotation.x = Math.PI / 2;
  groundPad.position.set(-ssdW / 2 + 0.015, 0, 0.01);
  ssdGroup.add(groundPad);

  const m2Screw = new THREE.Mesh(
    res.getCylinder(0.03, 0.03, 0.06, 12),
    matChrome
  );
  m2Screw.rotation.x = Math.PI / 2;
  m2Screw.position.set(-ssdW / 2 + 0.015, 0, 0.065);
  ssdGroup.add(m2Screw);

  ssdGroup.userData = {
    id: 'ssd',
    label: 'NVMe M.2 // 4 TB GEN5',
    sublabel: '12 400 МБ/с · Thermal Armor',
    basePos: basePos.clone(),
    anchorLocal: new THREE.Vector3(0.0, 0.0, 0.13),
    explodePos: new THREE.Vector3(-0.68, 0.18, 1.32),
    explodeRot: new THREE.Euler(-0.16, 0.22, 0.06),
  };

  return ssdGroup;
}

/**
 * 8. 3 КОРПУСНЫХ ВЕНТИЛЯТОРА (120mm ARGB: 9 лопастей с барьерным кольцом, 4 статорные стойки,
 *    виброгасящие уголки и тонкие двойные неоновые кольца без бокового пересвета)
 */
export function createCaseFans(res) {
  const fansGroup = new THREE.Group();
  fansGroup.name = 'caseFans';

  const basePos = new THREE.Vector3(1.52, 0.14, 0.02);
  fansGroup.position.copy(basePos);

  const matAnodized = res.mat('anodizedBlack');
  const matGraphite = res.mat('graphiteMetal');
  const matGunmetal = res.mat('gunmetal');
  const matSilver = res.mat('brushedSilver');
  const matChrome = res.mat('chromeMetal');
  const matPolymer = res.mat('darkPolymer');
  const matNeon = res.mat('neonPrimary');
  const matNeonSec = res.mat('neonSecondary');
  const matTrace = res.mat('neonTrace');
  const matBlade = res.mat('fanBladeMat');

  const fanUnits = [];
  const fanRotors = [];
  const fanYPositions = [1.08, 0.0, -1.08];

  fanYPositions.forEach((fy, idx) => {
    const unitGroup = new THREE.Group();
    unitGroup.position.set(0, fy, 0);
    unitGroup.userData.baseY = fy;
    unitGroup.userData.fanIndex = idx;

    const frameSize = 0.98;
    const frameDepth = 0.24;

    // Внешний корпус рамки 120мм вентилятора
    const frame = new THREE.Mesh(
      res.getRoundedBox(frameDepth, frameSize, frameSize, 2, 0.03),
      matAnodized
    );
    frame.castShadow = true;
    unitGroup.add(frame);

    // Резиновые антивибрационные уголки и 4 крепёжных винта
    const cornerOffsets = [
      [frameSize / 2 - 0.1, frameSize / 2 - 0.1],
      [frameSize / 2 - 0.1, -frameSize / 2 + 0.1],
      [-frameSize / 2 + 0.1, frameSize / 2 - 0.1],
      [-frameSize / 2 + 0.1, -frameSize / 2 + 0.1],
    ];
    cornerOffsets.forEach(([cy, cz]) => {
      const damperPad = new THREE.Mesh(
        res.getBox(frameDepth + 0.01, 0.16, 0.16),
        matPolymer
      );
      damperPad.position.set(0, cy, cz);
      unitGroup.add(damperPad);

      const screw = new THREE.Mesh(
        res.getCylinder(0.025, 0.025, frameDepth + 0.032, 10),
        matChrome
      );
      screw.rotation.z = Math.PI / 2;
      screw.position.set(0, cy, cz);
      unitGroup.add(screw);
    });

    // 4 задние статорные стойки-направляющие потока воздуха
    for (let s = 0; s < 4; s++) {
      const sAngle = (s / 4) * Math.PI * 2 + Math.PI / 4;
      const strut = new THREE.Mesh(
        res.getBox(0.025, 0.84, 0.035),
        matGunmetal
      );
      strut.rotation.x = sAngle;
      strut.position.set(-frameDepth / 2 + 0.02, 0, 0);
      unitGroup.add(strut);
    }

    // Тонкие прецизионные салатовые кольца подсветки (Dual ARGB Halo, радиус трубки 0.013 вместо 0.028)
    const haloInner = new THREE.Mesh(
      res.getTorus(0.415, 0.013, 12, 36),
      matNeon
    );
    haloInner.rotation.y = Math.PI / 2;
    haloInner.position.set(-frameDepth / 2 - 0.006, 0, 0);
    unitGroup.add(haloInner);

    const haloOuter = new THREE.Mesh(
      res.getTorus(0.415, 0.011, 12, 36),
      matNeonSec
    );
    haloOuter.rotation.y = Math.PI / 2;
    haloOuter.position.set(frameDepth / 2 + 0.006, 0, 0);
    unitGroup.add(haloOuter);

    // Боковая металлическая накладка на торце рамки (обращённая к стеклу) с узкой 1.5мм линией вместо сплошного пересвета!
    const sideArmorPlate = new THREE.Mesh(
      res.getRoundedBox(frameDepth * 0.78, frameSize * 0.72, 0.024, 1, 0.008),
      matGraphite
    );
    sideArmorPlate.position.set(0, 0, frameSize / 2 + 0.006);
    unitGroup.add(sideArmorPlate);

    const sideAccentLine = new THREE.Mesh(
      res.getBox(0.018, frameSize * 0.62, 0.016),
      matTrace
    );
    sideAccentLine.position.set(0, 0, frameSize / 2 + 0.016);
    unitGroup.add(sideAccentLine);

    // Вращающийся ротор вентилятора с 9 лопастями, металлическим хабом и барьерным кольцом
    const rotorGroup = new THREE.Group();
    rotorGroup.userData.spinSpeed = 6.8 + idx * 0.4;

    const hub = new THREE.Mesh(
      res.getCylinder(0.13, 0.13, frameDepth * 0.76, 20),
      matGraphite
    );
    hub.rotation.z = Math.PI / 2;
    rotorGroup.add(hub);

    const hubCap = new THREE.Mesh(
      res.getCylinder(0.075, 0.075, frameDepth * 0.8, 16),
      matSilver
    );
    hubCap.rotation.z = Math.PI / 2;
    rotorGroup.add(hubCap);

    const hubRing = new THREE.Mesh(
      res.getTorus(0.09, 0.008, 10, 24),
      matTrace
    );
    hubRing.rotation.y = Math.PI / 2;
    hubRing.position.set(-frameDepth * 0.39, 0, 0);
    rotorGroup.add(hubRing);

    const bladeCount = 9;
    for (let b = 0; b < bladeCount; b++) {
      const angle = (b / bladeCount) * Math.PI * 2;
      const bladePivot = new THREE.Group();
      bladePivot.rotation.x = angle;

      const blade = new THREE.Mesh(
        res.getBox(0.022, 0.25, 0.105),
        matBlade
      );
      blade.position.set(0, 0.23, 0);
      blade.rotation.y = 0.48;
      bladePivot.add(blade);
      rotorGroup.add(bladePivot);
    }

    unitGroup.add(rotorGroup);
    fanRotors.push(rotorGroup);

    fansGroup.add(unitGroup);
    fanUnits.push(unitGroup);
  });

  fansGroup.userData = {
    id: 'fans',
    label: '3× 120MM // ARGB HALO',
    sublabel: '2200 RPM · Гидродинамический подшипник',
    basePos: basePos.clone(),
    fanUnits,
    fanRotors,
    anchorLocal: new THREE.Vector3(0.0, 0.0, 0.48),
    explodePos: new THREE.Vector3(1.52, 0.06, 0.55),
    explodeRot: new THREE.Euler(0.05, -0.28, 0.04),
  };

  return fansGroup;
}

/**
 * Собирает полный игровой ПК из всех 8 групп и возвращает структуру для сцены и анимации.
 */
export function createGamingPCAssembly({ isMobile = false } = {}) {
  const resources = createSharedResources();
  const rootGroup = new THREE.Group();
  rootGroup.name = 'gamingPCRoot';

  // Начальный разворот сборки (эффектный ракурс 3/4, открывающий взгляд внутрь через стекло)
  const initialRotation = new THREE.Euler(0.08, -0.58, 0.0);
  rootGroup.rotation.copy(initialRotation);

  const { caseGroup, glassPanelGroup } = createCase(resources, { isMobile });
  const motherboardGroup = createMotherboard(resources, { isMobile });
  const cpuCoolerGroup = createCPUAndCooler(resources, { isMobile });
  const gpuGroup = createGPU(resources, { isMobile });
  const ramGroup = createRAM(resources, { isMobile });
  const psuGroup = createPSU(resources, { isMobile });
  const ssdGroup = createSSD(resources, { isMobile });
  const fansGroup = createCaseFans(resources, { isMobile });

  const components = {
    case: caseGroup,
    glass: glassPanelGroup,
    motherboard: motherboardGroup,
    cpu: cpuCoolerGroup,
    gpu: gpuGroup,
    ram: ramGroup,
    psu: psuGroup,
    ssd: ssdGroup,
    fans: fansGroup,
  };

  Object.values(components).forEach((group) => {
    if (!group.userData.basePos) {
      group.userData.basePos = group.position.clone();
    }
    group.userData.baseRot = group.rotation.clone();
    rootGroup.add(group);
  });

  const allFanRotors = [
    ...(gpuGroup.userData.fanRotors || []),
    ...(fansGroup.userData.fanRotors || []),
  ];

  return {
    rootGroup,
    initialRotation,
    components,
    componentList: Object.values(components),
    allFanRotors,
    resources,
  };
}
