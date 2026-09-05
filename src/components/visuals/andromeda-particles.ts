export type ParticleAttributes = {
  galaxy: Float32Array;
  logo: Float32Array;
  emblem: Float32Array;
  emblemMask: Float32Array;
  logoColors: Float32Array;
  burst: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  tones: Float32Array;
};

export type BinaryAttributes = {
  angles: Float32Array;
  digits: Float32Array;
  radii: Float32Array;
  seeds: Float32Array;
  sizes: Float32Array;
  speeds: Float32Array;
  tilts: Float32Array;
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
  emblem: Float32Array;
  emblemMask: Float32Array;
  positions: Float32Array;
};

const SPHERE_RADIUS = 1.68;
const EMBLEM_RADIUS = 1.12;
const EMBLEM_ANGULAR_SIZE = 0.7;

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

function sphericalPoint(random: () => number, radius: number) {
  const phi = Math.acos(2 * random() - 1);
  const lambda = random() * TAU;
  const sinPhi = Math.sin(phi);

  return {
    x: sinPhi * Math.cos(lambda) * radius,
    y: Math.cos(phi) * radius,
    z: sinPhi * Math.sin(lambda) * radius,
  };
}

function isElectricBlueFill(red: number, green: number, blue: number) {
  return blue > 92 && blue > red + 32 && blue >= green - 6 && green > 38;
}

function restyleLogoColor(red: number, green: number, blue: number) {
  if (isElectricBlueFill(red, green, blue)) {
    const luminance = (red * 0.22 + green * 0.42 + blue * 0.36) / 255;
    if (luminance > 0.52) {
      return { b: 0.9, g: 0.86, r: 0.8 };
    }
    return { b: 0.11, g: 0.06, r: 0.035 };
  }

  return {
    b: Math.min(blue, red * 0.92 + 28) / 255,
    g: green / 255,
    r: red / 255,
  };
}

function projectLogoToEmblem(x: number, y: number, extent: number) {
  const nx = x / extent;
  const ny = y / extent;
  const disk = Math.min(1, Math.hypot(nx, ny));
  const theta = disk * EMBLEM_ANGULAR_SIZE;
  const phi = Math.atan2(ny, nx);
  const sinTheta = Math.sin(theta);

  return {
    x: EMBLEM_RADIUS * sinTheta * Math.cos(phi),
    y: EMBLEM_RADIUS * sinTheta * Math.sin(phi),
    z: EMBLEM_RADIUS * Math.cos(theta),
  };
}

function logoExtent(positions: Float32Array) {
  let max = 0.001;
  for (let index = 0; index < positions.length; index += 3) {
    max = Math.max(
      max,
      Math.abs(positions[index]),
      Math.abs(positions[index + 1]),
    );
  }
  return max;
}

function createEmblemFromLogo(logo: Float32Array, count: number, random: () => number) {
  const emblem = new Float32Array(count * 3);
  const emblemMask = new Float32Array(count);
  const extent = logoExtent(logo);
  const emblemShare = 0.42;

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const mapped = projectLogoToEmblem(logo[offset], logo[offset + 1], extent);
    emblem[offset] = mapped.x + signedNoise(random) * 0.012;
    emblem[offset + 1] = mapped.y + signedNoise(random) * 0.012;
    emblem[offset + 2] = mapped.z + signedNoise(random) * 0.01;
    emblemMask[index] = index / count < emblemShare ? 1 : 0;
  }

  return { emblem, emblemMask };
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

  for (let index = 0; index < count; index += 1) {
    const selector = random();
    let radius: number;

    if (selector < 0.12) {
      radius = Math.pow(random(), 0.55) * 0.62;
      tones[index] = 0.86 + random() * 0.14;
      sizes[index] = 4.8 + random() * 5.6;
    } else if (selector < 0.78) {
      radius = SPHERE_RADIUS + signedNoise(random) * 0.042;
      tones[index] = 0.4 + random() * 0.5;
      sizes[index] = 2.4 + random() * 3.6;
    } else if (selector < 0.92) {
      radius = Math.pow(random(), 0.3) * SPHERE_RADIUS;
      tones[index] = 0.24 + random() * 0.46;
      sizes[index] = 1.7 + random() * 3.0;
    } else {
      radius = SPHERE_RADIUS + 0.18 + random() * 0.38;
      tones[index] = 0.16 + random() * 0.32;
      sizes[index] = 1.25 + random() * 2.4;
    }

    const point = sphericalPoint(random, radius);
    const offset = index * 3;
    const x = point.x;
    const y = point.y;
    const z = point.z;

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
    if (colorSelector > 0.72) {
      logoColors[offset] = 0.78 + colorRandom() * 0.16;
      logoColors[offset + 1] = 0.84 + colorRandom() * 0.12;
      logoColors[offset + 2] = 0.9 + colorRandom() * 0.08;
    } else if (colorSelector > 0.34) {
      logoColors[offset] = 0.04 + colorRandom() * 0.05;
      logoColors[offset + 1] = 0.08 + colorRandom() * 0.08;
      logoColors[offset + 2] = 0.14 + colorRandom() * 0.1;
    } else {
      logoColors[offset] = 0.02 + colorRandom() * 0.03;
      logoColors[offset + 1] = 0.03 + colorRandom() * 0.04;
      logoColors[offset + 2] = 0.06 + colorRandom() * 0.06;
    }
  }

  const { emblem, emblemMask } = createEmblemFromLogo(logo, count, random);

  return {
    burst,
    emblem,
    emblemMask,
    galaxy,
    logo,
    logoColors,
    seeds,
    sizes,
    tones,
  };
}

export function createBinaryAttributes(count: number): BinaryAttributes {
  const random = mulberry32(0xb1a41);
  const angles = new Float32Array(count);
  const digits = new Float32Array(count);
  const radii = new Float32Array(count);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);
  const tilts = new Float32Array(count);
  const rings = 6;

  for (let index = 0; index < count; index += 1) {
    const ring = index % rings;
    const direction = ring % 2 === 0 ? 1 : -1;
    angles[index] = (index / Math.max(1, count)) * TAU * 13 + ring * 0.62;
    radii[index] = 2.05 + ring * 0.18 + random() * 0.07;
    tilts[index] = (ring / (rings - 1) - 0.5) * 1.05;
    speeds[index] = direction * (0.42 + random() * 0.28);
    digits[index] = random() > 0.5 ? 1 : 0;
    seeds[index] = random();
    sizes[index] = 16 + random() * 14;
  }

  return { angles, digits, radii, seeds, sizes, speeds, tilts };
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
        brightness < 208 &&
        !isElectricBlueFill(red, green, blue) &&
        (brightness < 188 || colorRange > 18);

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
    const restyled = restyleLogoColor(point.red, point.green, point.blue);
    positions[offset] =
      (point.x - centerX) * scale + signedNoise(random) * 0.018;
    positions[offset + 1] =
      -(point.y - centerY) * scale + signedNoise(random) * 0.018;
    positions[offset + 2] = signedNoise(random) * 0.11;
    colors[offset] = restyled.r;
    colors[offset + 1] = restyled.g;
    colors[offset + 2] = restyled.b;
  }

  const { emblem, emblemMask } = createEmblemFromLogo(positions, count, random);

  return { colors, emblem, emblemMask, positions };
}
