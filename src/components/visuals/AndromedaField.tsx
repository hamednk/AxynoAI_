"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createBinaryAttributes,
  createParticleAttributes,
} from "@/components/visuals/andromeda-particles";

type AndromedaFieldProps = {
  className?: string;
  reducedMotion?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

const LOGO_URL = "/logo.jpg";

const vertexShader = `
  attribute vec3 aBurst;
  attribute float aSize;
  attribute float aSeed;
  attribute float aTone;

  uniform float uBurst;
  uniform float uLogo;
  uniform float uLogoGlow;
  uniform float uPixelRatio;
  uniform float uTime;

  varying float vEnergy;
  varying float vLogoAmount;
  varying float vLogoGlow;
  varying float vTone;

  void main() {
    vec3 particlePosition = mix(position, aBurst, uBurst);
    float drift = sin(uTime * (0.32 + aSeed * 0.42) + aSeed * 28.0);
    particlePosition.z += drift * 0.018 * (1.0 - uLogo) * (1.0 - uBurst);

    vec4 modelPosition = modelViewMatrix * vec4(particlePosition, 1.0);
    float perspective = 6.4 / max(1.0, -modelPosition.z);
    float energy = uBurst * (0.65 + aSeed * 0.8);

    gl_Position = projectionMatrix * modelPosition;
    gl_PointSize = min(
      20.0,
      aSize * uPixelRatio * perspective * (1.0 + energy + uLogoGlow * 0.18)
    );
    vEnergy = energy;
    vLogoAmount = uLogo;
    vLogoGlow = uLogoGlow;
    vTone = aTone;
  }
`;

const fragmentShader = `
  uniform vec3 uColorBright;
  uniform vec3 uColorDeep;
  uniform vec3 uColorMid;
  uniform float uOpacity;

  varying float vEnergy;
  varying float vLogoAmount;
  varying float vLogoGlow;
  varying float vTone;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, distanceToCenter);
    float core = smoothstep(0.28, 0.0, distanceToCenter);
    vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.08, 0.72, vTone));
    color = mix(color, uColorBright, smoothstep(0.7, 1.0, vTone) + core * 0.22);
    color += uColorBright * vEnergy * 0.24;
    alpha *= 1.0 - smoothstep(0.15, 0.92, vLogoAmount) * 0.92;
    alpha = min(1.0, alpha * (1.0 + vLogoGlow * 0.2));

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;

const haloVertexShader = `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-modelViewPosition.xyz);
    gl_Position = projectionMatrix * modelViewPosition;
  }
`;

const haloFragmentShader = `
  uniform vec3 uHaloColor;
  uniform float uHaloOpacity;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
    float pulse = 0.82 + 0.18 * sin(uTime * 0.7);
    float alpha = (0.08 + fresnel * 0.72) * uHaloOpacity * pulse;

    gl_FragColor = vec4(uHaloColor, alpha);
  }
`;

const binaryVertexShader = `
  attribute float aDigit;
  attribute float aSize;
  attribute float aSeed;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aTilt;

  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uZoom;

  varying float vDigit;
  varying float vPulse;

  void main() {
    vDigit = aDigit;
    vPulse = 0.62 + 0.38 * sin(uTime * (1.6 + aSeed * 2.4) + aSeed * 18.0);
    float angle = aAngle + uTime * aSpeed;
    float orbitX = cos(angle) * aRadius;
    float orbitZ = sin(angle) * aRadius;
    float orbitY = sin(angle * 1.7 + aSeed * 6.28) * 0.14;
    float cosTilt = cos(aTilt);
    float sinTilt = sin(aTilt);
    vec3 orbit = vec3(
      orbitX,
      orbitY * cosTilt - orbitZ * sinTilt,
      orbitY * sinTilt + orbitZ * cosTilt
    );
    orbit *= mix(1.0, uZoom, 0.22);
    vec4 modelPosition = modelViewMatrix * vec4(orbit, 1.0);
    float perspective = 6.4 / max(1.0, -modelPosition.z);
    gl_Position = projectionMatrix * modelPosition;
    gl_PointSize = min(42.0, aSize * uPixelRatio * perspective);
  }
`;

const binaryFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vDigit;
  varying float vPulse;

  float digitZero(vec2 uv) {
    vec2 point = (uv - 0.5) * vec2(1.35, 1.0);
    float radius = length(point);
    float ring = smoothstep(0.1, 0.045, abs(radius - 0.28));
    return ring * smoothstep(0.5, 0.18, radius);
  }

  float digitOne(vec2 uv) {
    vec2 point = uv - vec2(0.52, 0.5);
    float stem = (1.0 - smoothstep(0.045, 0.09, abs(point.x)))
      * (1.0 - smoothstep(0.34, 0.4, abs(point.y)));
    float cap = (1.0 - smoothstep(0.08, 0.14, length(point - vec2(-0.07, 0.22))))
      * smoothstep(0.18, 0.08, point.y);
    return max(stem, cap * 0.85);
  }

  void main() {
    float glyph = mix(digitZero(gl_PointCoord), digitOne(gl_PointCoord), step(0.5, vDigit));
    float glow = smoothstep(0.55, 0.12, distance(gl_PointCoord, vec2(0.5))) * 0.18;
    float alpha = (glyph * 0.95 + glow) * uOpacity * vPulse;

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const logoVertexShader = `
  uniform float uCurve;
  uniform float uZoom;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float radial = length(pos.xy);
    pos.z -= radial * radial * uCurve;
    pos *= uZoom;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const logoFragmentShader = `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uGlow;

  varying vec2 vUv;

  void main() {
    vec4 texel = texture2D(uMap, vUv);
    float luma = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    float white = smoothstep(0.86, 0.97, luma);
    float alpha = texel.a * (1.0 - white) * uOpacity;

    if (alpha < 0.02) discard;

    vec3 color = texel.rgb;
    color += color * uGlow * 0.22;
    gl_FragColor = vec4(color, alpha);
  }
`;

function smoothStep(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function zoomPulse(time: number) {
  return 0.82 + (Math.sin(time * 1.05) * 0.5 + 0.5) * 0.38;
}

function getCycleState(time: number) {
  const phase = time % 18;

  if (phase < 5.4) {
    return {
      binary: 0,
      burst: 0,
      emblem: 1,
      glow: 0.32 + Math.sin(time * 1.4) * 0.1,
      logo: 0,
      spin: 1,
      zoom: 1,
    };
  }
  if (phase < 6.7) {
    const burst = smoothStep((phase - 5.4) / 1.3);
    return {
      binary: 0,
      burst,
      emblem: 1 - burst,
      glow: burst * 0.22,
      logo: 0,
      spin: 1 - burst * 0.35,
      zoom: 1,
    };
  }
  if (phase < 8.5) {
    const progress = smoothStep((phase - 6.7) / 1.8);
    return {
      binary: progress,
      burst: 1 - progress,
      emblem: 0,
      glow: progress * (0.42 + Math.sin(progress * Math.PI) * 0.88),
      logo: progress,
      spin: 0,
      zoom: 0.78 + progress * 0.14,
    };
  }
  if (phase < 15.2) {
    const local = phase - 8.5;
    return {
      binary: 1,
      burst: 0,
      emblem: 0,
      glow: 0.42 + Math.sin(local * 1.15) ** 2 * 0.28,
      logo: 1,
      spin: 0,
      zoom: zoomPulse(local),
    };
  }

  const progress = smoothStep((phase - 15.2) / 2.8);
  return {
    binary: 1 - progress,
    burst: 0,
    emblem: progress,
    glow: (1 - progress) * 0.48 + Math.sin(progress * Math.PI) * 0.7,
    logo: 1 - progress,
    spin: progress,
    zoom: 1,
  };
}

function createCurvedLogoGeometry(width: number, height: number) {
  return new THREE.PlaneGeometry(width, height, 48, 48);
}

function loadLogoTexture(url: string, signal: AbortSignal) {
  return new Promise<THREE.Texture>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Logo load aborted.", "AbortError"));
      return;
    }

    const loader = new THREE.TextureLoader();
    const onAbort = () => {
      reject(new DOMException("Logo load aborted.", "AbortError"));
    };
    signal.addEventListener("abort", onAbort, { once: true });

    loader.load(
      url,
      (texture) => {
        signal.removeEventListener("abort", onAbort);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        resolve(texture);
      },
      undefined,
      () => {
        signal.removeEventListener("abort", onAbort);
        reject(new Error("Unable to load logo texture."));
      },
    );
  });
}

export function AndromedaField({
  className,
  reducedMotion = false,
  onReady,
  onUnavailable,
}: AndromedaFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const controller = new AbortController();
    const mobile = window.innerWidth < 768;
    const lowPowerDevice =
      typeof navigator.hardwareConcurrency === "number" &&
      navigator.hardwareConcurrency <= 4;
    const particleCount = mobile
      ? lowPowerDevice
        ? 4500
        : 7000
      : lowPowerDevice
        ? 14000
        : 22000;
    const binaryCount = mobile ? 140 : 240;
    const attributes = createParticleAttributes(particleCount);
    const binaryAttributes = createBinaryAttributes(binaryCount);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      });
    } catch {
      onUnavailable?.();
      return;
    }

    if (!renderer.getContext()) {
      renderer.dispose();
      onUnavailable?.();
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 50);
    camera.position.z = 7;

    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(attributes.galaxy, 3),
    );
    geometry.setAttribute(
      "aBurst",
      new THREE.BufferAttribute(attributes.burst, 3),
    );
    geometry.setAttribute("aSize", new THREE.BufferAttribute(attributes.sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(attributes.seeds, 1));
    geometry.setAttribute("aTone", new THREE.BufferAttribute(attributes.tones, 1));

    const pointUniforms = {
      uBurst: { value: 0 },
      uColorBright: { value: new THREE.Color("#e8fbff") },
      uColorDeep: { value: new THREE.Color("#07509b") },
      uColorMid: { value: new THREE.Color("#00b8f0") },
      uLogo: { value: 0 },
      uLogoGlow: { value: 0 },
      uOpacity: { value: 0.86 },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader,
      transparent: true,
      uniforms: pointUniforms,
      vertexShader,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    points.renderOrder = 1;
    galaxyGroup.add(points);

    const haloUniforms = {
      uHaloColor: { value: new THREE.Color("#00a8e8") },
      uHaloOpacity: { value: 0.7 },
      uTime: { value: 0 },
    };
    const haloMaterial = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader: haloFragmentShader,
      side: THREE.BackSide,
      transparent: true,
      uniforms: haloUniforms,
      vertexShader: haloVertexShader,
    });
    const haloGeometry = new THREE.SphereGeometry(2.02, 48, 48);
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.renderOrder = 0;
    galaxyGroup.add(halo);

    const logoGroup = new THREE.Group();
    logoGroup.renderOrder = 3;
    galaxyGroup.add(logoGroup);

    const logoUniforms = {
      uCurve: { value: 0.08 },
      uGlow: { value: 0 },
      uMap: { value: null as THREE.Texture | null },
      uOpacity: { value: 0 },
      uZoom: { value: 1 },
    };
    const logoMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      fragmentShader: logoFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: logoUniforms,
      vertexShader: logoVertexShader,
    });
    const logoGeometry = createCurvedLogoGeometry(3.05, 3.05);
    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.frustumCulled = false;
    logoMesh.visible = false;
    logoGroup.add(logoMesh);

    const emblemUniforms = {
      uCurve: { value: 0.55 },
      uGlow: { value: 0.35 },
      uMap: { value: null as THREE.Texture | null },
      uOpacity: { value: 0 },
      uZoom: { value: 1 },
    };
    const emblemMaterial = new THREE.ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      fragmentShader: logoFragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: emblemUniforms,
      vertexShader: logoVertexShader,
    });
    const emblemGeometry = createCurvedLogoGeometry(1.35, 1.35);
    const emblemMesh = new THREE.Mesh(emblemGeometry, emblemMaterial);
    emblemMesh.position.z = 1.05;
    emblemMesh.frustumCulled = false;
    emblemMesh.visible = false;
    logoGroup.add(emblemMesh);

    const binaryGeometry = new THREE.BufferGeometry();
    binaryGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(binaryCount * 3), 3),
    );
    binaryGeometry.setAttribute(
      "aDigit",
      new THREE.BufferAttribute(binaryAttributes.digits, 1),
    );
    binaryGeometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(binaryAttributes.sizes, 1),
    );
    binaryGeometry.setAttribute(
      "aSeed",
      new THREE.BufferAttribute(binaryAttributes.seeds, 1),
    );
    binaryGeometry.setAttribute(
      "aAngle",
      new THREE.BufferAttribute(binaryAttributes.angles, 1),
    );
    binaryGeometry.setAttribute(
      "aRadius",
      new THREE.BufferAttribute(binaryAttributes.radii, 1),
    );
    binaryGeometry.setAttribute(
      "aSpeed",
      new THREE.BufferAttribute(binaryAttributes.speeds, 1),
    );
    binaryGeometry.setAttribute(
      "aTilt",
      new THREE.BufferAttribute(binaryAttributes.tilts, 1),
    );
    const binaryUniforms = {
      uColor: { value: new THREE.Color("#7ef3ff") },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uZoom: { value: 1 },
    };
    const binaryMaterial = new THREE.ShaderMaterial({
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      fragmentShader: binaryFragmentShader,
      transparent: true,
      uniforms: binaryUniforms,
      vertexShader: binaryVertexShader,
    });
    const binaryPoints = new THREE.Points(binaryGeometry, binaryMaterial);
    binaryPoints.frustumCulled = false;
    binaryPoints.renderOrder = 2;
    galaxyGroup.add(binaryPoints);

    let animationFrame = 0;
    let disposed = false;
    let inViewport = true;
    let pageVisible = document.visibilityState === "visible";
    let pointerX = 0;
    let pointerY = 0;
    let currentTiltX = -0.08;
    let currentTiltY = 0;
    let baseTiltX = -0.08;
    let baseTiltY = 0;
    let baseHaloOpacity = 0.7;
    let logoTexture: THREE.Texture | null = null;
    const startedAt = performance.now();

    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      pointUniforms.uColorBright.value.set(dark ? "#e8fbff" : "#d9f8ff");
      pointUniforms.uColorMid.value.set(dark ? "#00c8f8" : "#008dcc");
      pointUniforms.uColorDeep.value.set(dark ? "#06458f" : "#073f77");
      pointUniforms.uOpacity.value = dark ? 0.92 : 0.76;
      haloUniforms.uHaloColor.value.set(dark ? "#00a8e8" : "#0077bb");
      baseHaloOpacity = dark ? 0.78 : 0.42;
      binaryUniforms.uColor.value.set(dark ? "#9af7ff" : "#0477a8");
    };

    const applyComposition = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const isMobile = width < 768;
      const compact = height < 600;
      const direction = document.documentElement.dir;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.35 : 1.75);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      pointUniforms.uPixelRatio.value = pixelRatio;
      binaryUniforms.uPixelRatio.value = pixelRatio;
      camera.aspect = width / height;
      camera.fov = isMobile ? 46 : 44;
      camera.updateProjectionMatrix();

      if (isMobile) {
        galaxyGroup.position.set(0, 0.72, 0);
        galaxyGroup.scale.setScalar(0.49);
        baseTiltX = -0.04;
        baseTiltY = 0;
      } else {
        galaxyGroup.position.set(direction === "rtl" ? -1.45 : 1.45, compact ? 0.12 : 0, 0);
        galaxyGroup.scale.setScalar(compact ? 0.78 : 1);
        baseTiltX = -0.1;
        baseTiltY = direction === "rtl" ? -0.12 : 0.12;
      }
    };

    const requestRender = () => {
      if (!disposed && inViewport && pageVisible && animationFrame === 0) {
        animationFrame = requestAnimationFrame(renderFrame);
      }
    };

    const renderFrame = (now: number) => {
      animationFrame = 0;
      if (disposed || !inViewport || !pageVisible) return;

      const elapsed = (now - startedAt) / 1000;
      const cycle = reducedMotion
        ? { binary: 0.22, burst: 0, emblem: 0.85, glow: 0.28, logo: 0, spin: 0, zoom: 1 }
        : getCycleState(elapsed);

      pointUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      pointUniforms.uBurst.value = cycle.burst;
      pointUniforms.uLogo.value = cycle.logo;
      pointUniforms.uLogoGlow.value = cycle.glow;

      haloUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      haloUniforms.uHaloOpacity.value =
        baseHaloOpacity *
        (0.55 + cycle.glow * 0.7) *
        (1 - cycle.logo * 0.55) *
        (0.35 + cycle.emblem * 0.65 + cycle.burst * 0.4);

      binaryUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      binaryUniforms.uZoom.value = cycle.zoom;
      binaryUniforms.uOpacity.value = cycle.binary * (reducedMotion ? 0.35 : 0.88);

      logoUniforms.uOpacity.value = cycle.logo;
      logoUniforms.uZoom.value = cycle.zoom;
      logoUniforms.uGlow.value = cycle.glow;
      logoUniforms.uCurve.value = 0.06 + cycle.logo * 0.04;
      logoMesh.visible = cycle.logo > 0.02;

      emblemUniforms.uOpacity.value = cycle.emblem * 0.96;
      emblemUniforms.uGlow.value = 0.25 + cycle.glow * 0.35;
      emblemUniforms.uZoom.value = 1;
      emblemUniforms.uCurve.value = 0.52;
      emblemMesh.visible = cycle.emblem > 0.02;

      if (!reducedMotion) {
        currentTiltX += (baseTiltX + pointerY * 0.06 - currentTiltX) * 0.035;
        currentTiltY += (baseTiltY + pointerX * 0.08 - currentTiltY) * 0.035;
        galaxyGroup.rotation.x = THREE.MathUtils.lerp(
          currentTiltX,
          0.02,
          cycle.logo,
        );
        galaxyGroup.rotation.y = THREE.MathUtils.lerp(
          currentTiltY,
          0,
          cycle.logo,
        );
        points.rotation.x = elapsed * 0.1 * cycle.spin;
        points.rotation.y = elapsed * 0.42 * cycle.spin;
        halo.rotation.y = elapsed * 0.22 * Math.max(cycle.spin, 0.18);
        logoGroup.rotation.y = elapsed * 0.42 * cycle.spin;
        emblemMesh.rotation.z = Math.sin(elapsed * 0.35) * 0.04;
        binaryPoints.rotation.x = Math.sin(elapsed * 0.16) * 0.08;
        binaryPoints.scale.setScalar(0.94 + (cycle.zoom - 1) * 0.3);
      } else {
        galaxyGroup.rotation.set(baseTiltX, baseTiltY, 0);
        points.rotation.y = 0.35;
        points.rotation.x = 0.12;
        halo.rotation.y = 0.2;
        logoGroup.rotation.set(0, 0.35, 0);
        binaryPoints.rotation.set(0.12, 0.4, 0.08);
      }

      renderer.render(scene, camera);
      if (!reducedMotion) requestRender();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const handleVisibility = () => {
      pageVisible = document.visibilityState === "visible";
      requestRender();
    };

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      inViewport = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      onUnavailable?.();
    };

    const resizeObserver = new ResizeObserver(() => {
      applyComposition();
      requestRender();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        requestRender();
      },
      { rootMargin: "120px" },
    );
    intersectionObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      applyTheme();
      applyComposition();
      requestRender();
    });
    themeObserver.observe(document.documentElement, {
      attributeFilter: ["class", "dir"],
      attributes: true,
    });

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);

    applyTheme();
    applyComposition();
    renderer.render(scene, camera);
    onReady?.();
    requestRender();

    void loadLogoTexture(LOGO_URL, controller.signal)
      .then((texture) => {
        if (disposed || controller.signal.aborted) {
          texture.dispose();
          return;
        }
        logoTexture = texture;
        logoUniforms.uMap.value = texture;
        emblemUniforms.uMap.value = texture;
        requestRender();
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      });

    return () => {
      disposed = true;
      controller.abort();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      galaxyGroup.remove(points, halo, binaryPoints, logoGroup);
      geometry.dispose();
      material.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      logoGeometry.dispose();
      logoMaterial.dispose();
      emblemGeometry.dispose();
      emblemMaterial.dispose();
      binaryGeometry.dispose();
      binaryMaterial.dispose();
      logoTexture?.dispose();
      renderer.dispose();
    };
  }, [onReady, onUnavailable, reducedMotion]);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="andromeda-canvas" />
    </div>
  );
}
