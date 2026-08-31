"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  createParticleAttributes,
  sampleLogoTargets,
} from "@/components/visuals/andromeda-particles";

type AndromedaFieldProps = {
  className?: string;
  reducedMotion?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

const vertexShader = `
  attribute vec3 aLogo;
  attribute vec3 aBurst;
  attribute float aSize;
  attribute float aSeed;
  attribute float aTone;

  uniform float uBurst;
  uniform float uLogo;
  uniform float uPixelRatio;
  uniform float uTime;

  varying float vEnergy;
  varying float vTone;

  void main() {
    vec3 basePosition = mix(position, aLogo, uLogo);
    vec3 particlePosition = mix(basePosition, aBurst, uBurst);
    float drift = sin(uTime * (0.32 + aSeed * 0.42) + aSeed * 28.0);
    particlePosition.z += drift * 0.018 * (1.0 - uLogo) * (1.0 - uBurst);

    vec4 modelPosition = modelViewMatrix * vec4(particlePosition, 1.0);
    float perspective = 6.4 / max(1.0, -modelPosition.z);
    float energy = uBurst * (0.65 + aSeed * 0.8);

    gl_Position = projectionMatrix * modelPosition;
    gl_PointSize = min(18.0, aSize * uPixelRatio * perspective * (1.0 + energy));
    vEnergy = energy;
    vTone = aTone;
  }
`;

const fragmentShader = `
  uniform vec3 uColorBright;
  uniform vec3 uColorDeep;
  uniform vec3 uColorMid;
  uniform float uOpacity;

  varying float vEnergy;
  varying float vTone;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = smoothstep(0.5, 0.08, distanceToCenter);
    float core = smoothstep(0.28, 0.0, distanceToCenter);
    vec3 color = mix(uColorDeep, uColorMid, smoothstep(0.08, 0.72, vTone));
    color = mix(color, uColorBright, smoothstep(0.7, 1.0, vTone) + core * 0.22);
    color += uColorBright * vEnergy * 0.24;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha * uOpacity);
  }
`;

const haloVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragmentShader = `
  uniform vec3 uHaloColor;
  uniform float uHaloOpacity;
  uniform float uTime;

  varying vec2 vUv;

  void main() {
    vec2 point = (vUv - 0.5) * 2.0;
    float radius = length(point);
    float angle = atan(point.y, point.x);
    float body = smoothstep(1.0, 0.05, radius);
    float core = smoothstep(0.34, 0.0, radius);
    float arms = 0.5 + 0.5 * sin(angle * 2.0 - radius * 16.0 - uTime * 0.08);
    float dust = smoothstep(1.0, 0.18, radius) * (0.42 + arms * 0.58);
    float alpha = (body * dust * 0.22 + core * 0.52) * uHaloOpacity;

    gl_FragColor = vec4(uHaloColor, alpha);
  }
`;

function smoothStep(value: number) {
  const clamped = Math.min(1, Math.max(0, value));
  return clamped * clamped * (3 - 2 * clamped);
}

function getCycleState(time: number) {
  const phase = time % 15;

  if (phase < 5.8) return { burst: 0, flip: 0, logo: 0 };
  if (phase < 7) {
    return { burst: smoothStep((phase - 5.8) / 1.2), flip: 0, logo: 0 };
  }
  if (phase < 8.7) {
    const progress = smoothStep((phase - 7) / 1.7);
    return { burst: 1 - progress, flip: 0, logo: progress };
  }
  if (phase < 9.1) {
    return { burst: 0, flip: 0, logo: 1 };
  }
  if (phase < 10.7) {
    const progress = smoothStep((phase - 9.1) / 1.6);
    return { burst: 0, flip: progress * Math.PI * 2, logo: 1 };
  }
  if (phase < 11.1) {
    return { burst: 0, flip: Math.PI * 2, logo: 1 };
  }
  if (phase < 13.4) {
    return {
      burst: 0,
      flip: Math.PI * 2,
      logo: 1 - smoothStep((phase - 11.1) / 2.3),
    };
  }

  return { burst: 0, flip: 0, logo: 0 };
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
    const attributes = createParticleAttributes(particleCount);
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
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
      "aLogo",
      new THREE.BufferAttribute(attributes.logo, 3),
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
      side: THREE.DoubleSide,
      transparent: true,
      uniforms: haloUniforms,
      vertexShader: haloVertexShader,
    });
    const haloGeometry = new THREE.PlaneGeometry(7.6, 3.8);
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.z = -0.42;
    halo.renderOrder = 0;
    galaxyGroup.add(halo);

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
    const startedAt = performance.now();

    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      pointUniforms.uColorBright.value.set(dark ? "#e8fbff" : "#d9f8ff");
      pointUniforms.uColorMid.value.set(dark ? "#00c8f8" : "#008dcc");
      pointUniforms.uColorDeep.value.set(dark ? "#06458f" : "#073f77");
      pointUniforms.uOpacity.value = dark ? 0.92 : 0.76;
      haloUniforms.uHaloColor.value.set(dark ? "#00a8e8" : "#0077bb");
      haloUniforms.uHaloOpacity.value = dark ? 0.78 : 0.42;
    };

    const applyComposition = () => {
      const width = Math.max(1, container.clientWidth);
      const height = Math.max(1, container.clientHeight);
      const mobile = width < 768;
      const compact = height < 600;
      const direction = document.documentElement.dir;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.75);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      pointUniforms.uPixelRatio.value = pixelRatio;
      camera.aspect = width / height;
      camera.fov = mobile ? 46 : 44;
      camera.updateProjectionMatrix();

      if (mobile) {
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
        ? { burst: 0, flip: 0, logo: 0 }
        : getCycleState(elapsed);
      pointUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      pointUniforms.uBurst.value = cycle.burst;
      pointUniforms.uLogo.value = cycle.logo;
      haloUniforms.uTime.value = reducedMotion ? 0 : elapsed;

      if (!reducedMotion) {
        currentTiltX += (baseTiltX + pointerY * 0.06 - currentTiltX) * 0.035;
        currentTiltY += (baseTiltY + pointerX * 0.08 - currentTiltY) * 0.035;
        galaxyGroup.rotation.x = THREE.MathUtils.lerp(
          currentTiltX,
          0,
          cycle.logo,
        );
        galaxyGroup.rotation.y = THREE.MathUtils.lerp(
          currentTiltY,
          0,
          cycle.logo,
        );
        points.rotation.y = cycle.flip;
        points.rotation.z = THREE.MathUtils.lerp(
          elapsed * 0.035,
          0,
          cycle.logo,
        );
        halo.rotation.z = -elapsed * 0.018;
      } else {
        galaxyGroup.rotation.set(baseTiltX, baseTiltY, 0);
        points.rotation.y = 0;
        points.rotation.z = 0.18;
        halo.rotation.z = -0.12;
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

    void sampleLogoTargets(particleCount, "/logo.png", controller.signal)
      .then((logoTargets) => {
        if (disposed || controller.signal.aborted) return;
        geometry.setAttribute("aLogo", new THREE.BufferAttribute(logoTargets, 3));
        requestRender();
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        // The procedural angular mark remains a valid fallback logo target.
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
      galaxyGroup.remove(points, halo);
      geometry.dispose();
      material.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      renderer.dispose();
    };
  }, [onReady, onUnavailable, reducedMotion]);

  return (
    <div ref={containerRef} className={className} aria-hidden>
      <canvas ref={canvasRef} className="andromeda-canvas" />
    </div>
  );
}
