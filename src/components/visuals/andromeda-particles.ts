export type ParticleAttributes = {
  galaxy: Float32Array;
  logo: Float32Array;
  logoColors: Float32Array;
  burst: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  tones: Float32Array;
};

type Point2D = {
  x: number;
  y: number;
};

type LogoPixel = Point2D & {
  red: number;
  green: number;
  blue: number;
};

export type SampledLogoTargets = {
  colors: Float32Array;
  positions: Float32Array;
};

const TAU = Math.PI * 2;

function mulberry32(seed: number) {
  return () => {
    let value = (seed += 0x6d2b79f5);
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function signedNoise(random: () => number) {
  return random() + random() + random() - 1.5;
}

function pointOnSegment(
  start: Point2D,
  end: Point2D,
  progress: number,
  thickness: number,
  random: () => number,
) {
  const x = start.x + (end.x - start.x) * progress;
  const y = start.y + (end.y - start.y) * progress;
  const length = Math.hypot(end.x - start.x, end.y - start.y) || 1;
  const normalX = -(end.y - start.y) / length;
  const normalY = (end.x - start.x) / length;
  const offset = signedNoise(random) * thickness;

  return {
    x: x + normalX * offset,
    y: y + normalY * offset,
  };
}

export function createFallbackLogoTargets(count: number) {
  const random = mulberry32(0xa71a1);
  const result = new Float32Array(count * 3);
  const segments: [Point2D, Point2D, number][] = [
    [{ x: -1.42, y: -1.42 }, { x: -1.05, y: 1.24 }, 1.2],
    [{ x: -1.05, y: 1.24 }, { x: 1.24, y: 1.38 }, 1.05],
    [{ x: 1.24, y: 1.38 }, { x: -0.18, y: -0.14 }, 1.2],
    [{ x: -0.18, y: -0.14 }, { x: 0.64, y: -1.26 }, 0.82],
    [{ x: 0.28, y: -0.2 }, { x: 1.5, y: 1.25 }, 0.75],
  ];
  const totalWeight = segments.reduce((sum, segment) => sum + segment[2], 0);

  for (let index = 0; index < count; index += 1) {
    let selector = random() * totalWeight;
    let selected = segments[0];

    for (const segment of segments) {
      selector -= segment[2];
      if (selector <= 0) {
        selected = segment;
        break;
      }
    }

    const point = pointOnSegment(
      selected[0],
      selected[1],
      random(),
      0.16,
      random,
    );
    const offset = index * 3;
    result[offset] = point.x;
    result[offset + 1] = point.y;
    result[offset + 2] = signedNoise(random) * 0.12;
  }

  return result;
}

export function createParticleAttributes(count: number): ParticleAttributes {
  const random = mulberry32(0x41d20da);
  const colorRandom = mulberry32(0xc010ab);
  const galaxy = new Float32Array(count * 3);
  const burst = new Float32Array(count * 3);
  const logoColors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const tones = new Float32Array(count);
  const logo = createFallbackLogoTargets(count);
  const maxRadius = 2.75;

  for (let index = 0; index < count; index += 1) {
    const selector = random();
    let radius: number;
    let angle: number;
    let thickness: number;

    if (selector < 0.16) {
      radius = Math.pow(random(), 2.7) * 0.82;
      angle = random() * TAU;
      thickness = 0.2 * (1 - radius / maxRadius);
      tones[index] = 0.72 + random() * 0.28;
      sizes[index] = 4.2 + random() * 5.4;
    } else if (selector < 0.91) {
      radius = 0.24 + Math.pow(random(), 0.72) * (maxRadius - 0.24);
      const arm = index % 2;
      const armNoise = signedNoise(random) * (0.2 + radius * 0.11);
      angle = arm * Math.PI + radius * 1.92 + armNoise;
      thickness = 0.16 * (1 - radius / (maxRadius * 1.12));
      tones[index] = 0.22 + (1 - radius / maxRadius) * 0.58 + random() * 0.16;
      sizes[index] = 2.2 + random() * 4.1;
    } else {
      radius = 1.4 + Math.pow(random(), 0.5) * 1.75;
      angle = random() * TAU;
      thickness = 0.26;
      tones[index] = 0.12 + random() * 0.38;
      sizes[index] = 1.5 + random() * 3.2;
    }

    const offset = index * 3;
    const x = Math.cos(angle) * radius * 1.18;
    const y = Math.sin(angle) * radius * 0.48;
    const z = signedNoise(random) * thickness;

    galaxy[offset] = x;
    galaxy[offset + 1] = y;
    galaxy[offset + 2] = z;

    const galaxyLength = Math.hypot(x, y, z) || 1;
    const scatterX = signedNoise(random) * 0.64;
    const scatterY = signedNoise(random) * 0.64;
    const scatterZ = signedNoise(random) * 0.72;
    const scatterLength = Math.hypot(scatterX, scatterY, scatterZ) || 1;
    const distance = 3.2 + random() * 4.8;

    burst[offset] =
      x + (x / galaxyLength) * distance + (scatterX / scatterLength) * 2.1;
    burst[offset + 1] =
      y + (y / galaxyLength) * distance + (scatterY / scatterLength) * 2.1;
    burst[offset + 2] =
      z + (z / galaxyLength) * distance + (scatterZ / scatterLength) * 2.1;
    seeds[index] = random();

    const colorSelector = colorRandom();
    if (colorSelector > 0.76) {
      logoColors[offset] = 0.02;
      logoColors[offset + 1] = 0.72 + colorRandom() * 0.18;
      logoColors[offset + 2] = 0.95 + colorRandom() * 0.05;
    } else if (colorSelector > 0.38) {
      logoColors[offset] = 0.01;
      logoColors[offset + 1] = 0.22 + colorRandom() * 0.18;
      logoColors[offset + 2] = 0.58 + colorRandom() * 0.25;
    } else {
      logoColors[offset] = 0.01;
      logoColors[offset + 1] = 0.035 + colorRandom() * 0.06;
      logoColors[offset + 2] = 0.14 + colorRandom() * 0.12;
    }
  }

  return { galaxy, logo, logoColors, burst, sizes, seeds, tones };
}

function waitForImage(image: HTMLImageElement) {
  return new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load the logo mask."));
  });
}

export async function sampleLogoTargets(
  count: number,
  source: string,
  signal?: AbortSignal,
): Promise<SampledLogoTargets> {
  const image = new Image();
  image.decoding = "async";
  image.src = source;

  if (!image.complete) {
    await waitForImage(image);
  }
  if (signal?.aborted) {
    throw new DOMException("Logo sampling aborted.", "AbortError");
  }

  const size = 192;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Canvas 2D is unavailable for logo sampling.");
  }

  context.drawImage(image, 0, 0, size, size);
  const pixels = context.getImageData(0, 0, size, size).data;
  const candidates: LogoPixel[] = [];
  let minX = size;
  let minY = size;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const pixel = (y * size + x) * 4;
      const red = pixels[pixel];
      const green = pixels[pixel + 1];
      const blue = pixels[pixel + 2];
      const alpha = pixels[pixel + 3];
      const brightness = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      const colorRange = Math.max(red, green, blue) - Math.min(red, green, blue);
      const belongsToLogo =
        alpha > 48 &&
        (brightness < 205 || (brightness < 235 && colorRange > 24 && blue > red));

      if (belongsToLogo) {
        candidates.push({ blue, green, red, x, y });
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (candidates.length < 100) {
    throw new Error("The logo mask did not contain enough sampled pixels.");
  }

  const random = mulberry32(0x10c0fa);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scale = 3.2 / Math.max(maxX - minX, maxY - minY, 1);

  for (let index = 0; index < count; index += 1) {
    const point = candidates[Math.floor(random() * candidates.length)];
    const offset = index * 3;
    positions[offset] =
      (point.x - centerX) * scale + signedNoise(random) * 0.018;
    positions[offset + 1] =
      -(point.y - centerY) * scale + signedNoise(random) * 0.018;
    positions[offset + 2] = signedNoise(random) * 0.11;
    colors[offset] = point.red / 255;
    colors[offset + 1] = point.green / 255;
    colors[offset + 2] = point.blue / 255;
  }

  return { colors, positions };
}
