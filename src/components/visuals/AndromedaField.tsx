"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createBinaryAttributes } from "@/components/visuals/andromeda-particles";

type AndromedaFieldProps = {
  className?: string;
  reducedMotion?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

const LOGO_URL = "/logo.jpg";

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

function zoomPulse(time: number) {
  return 0.84 + (Math.sin(time * 1.05) * 0.5 + 0.5) * 0.34;
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
    const binaryCount = mobile ? 140 : 240;
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

    const stage = new THREE.Group();
    scene.add(stage);

    const logoUniforms = {
      uCurve: { value: 0.08 },
      uGlow: { value: 0.35 },
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
    const logoGeometry = new THREE.PlaneGeometry(3.05, 3.05, 48, 48);
    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.frustumCulled = false;
    logoMesh.renderOrder = 2;
    stage.add(logoMesh);

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
    binaryPoints.renderOrder = 1;
    stage.add(binaryPoints);

    let animationFrame = 0;
    let disposed = false;
    let inViewport = true;
    let pageVisible = document.visibilityState === "visible";
    let pointerX = 0;
    let pointerY = 0;
    let currentTiltX = -0.04;
    let currentTiltY = 0;
    let baseTiltX = -0.04;
    let baseTiltY = 0;
    let logoTexture: THREE.Texture | null = null;
    const startedAt = performance.now();

    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
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
      binaryUniforms.uPixelRatio.value = pixelRatio;
      camera.aspect = width / height;
      camera.fov = isMobile ? 46 : 44;
      camera.updateProjectionMatrix();

      if (isMobile) {
        stage.position.set(0, 0.72, 0);
        stage.scale.setScalar(0.49);
        baseTiltX = -0.02;
        baseTiltY = 0;
      } else {
        stage.position.set(direction === "rtl" ? -1.45 : 1.45, compact ? 0.12 : 0, 0);
        stage.scale.setScalar(compact ? 0.78 : 1);
        baseTiltX = -0.04;
        baseTiltY = direction === "rtl" ? -0.08 : 0.08;
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
      const zoom = reducedMotion ? 1 : zoomPulse(elapsed);
      const glow = reducedMotion
        ? 0.28
        : 0.28 + Math.sin(elapsed * 1.15) ** 2 * 0.22;

      binaryUniforms.uTime.value = reducedMotion ? 0 : elapsed;
      binaryUniforms.uZoom.value = zoom;
      binaryUniforms.uOpacity.value = reducedMotion ? 0.35 : 0.88;

      logoUniforms.uOpacity.value = 1;
      logoUniforms.uZoom.value = zoom;
      logoUniforms.uGlow.value = glow;
      logoUniforms.uCurve.value = 0.08;

      if (!reducedMotion) {
        currentTiltX += (baseTiltX + pointerY * 0.05 - currentTiltX) * 0.035;
        currentTiltY += (baseTiltY + pointerX * 0.06 - currentTiltY) * 0.035;
        stage.rotation.x = currentTiltX;
        stage.rotation.y = currentTiltY;
        binaryPoints.rotation.x = Math.sin(elapsed * 0.16) * 0.08;
        binaryPoints.scale.setScalar(0.94 + (zoom - 1) * 0.3);
      } else {
        stage.rotation.set(baseTiltX, baseTiltY, 0);
        binaryPoints.rotation.set(0.08, 0.2, 0.04);
        binaryPoints.scale.setScalar(1);
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
      stage.remove(logoMesh, binaryPoints);
      logoGeometry.dispose();
      logoMaterial.dispose();
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
