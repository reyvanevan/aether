"use client";

import { useEffect, useState } from "react";

export type PerformanceTier = "high" | "medium" | "low";

export interface DevicePerformance {
  tier: PerformanceTier;
  isMobile: boolean;
  dpr: [number, number];
  particleCount: number;
  starCount: number;
  useTransmission: boolean;
  shadowResolution: number;
  geometryDetail: number;
  antialias: boolean;
}

// Tier configs — tuned for real-world devices
const TIER_CONFIGS: Record<PerformanceTier, Omit<DevicePerformance, "tier">> = {
  low: {
    isMobile: true,
    dpr: [1, 1],
    particleCount: 40,
    starCount: 0, // Stars completely off
    useTransmission: false, // MeshPhysicalMaterial fallback
    shadowResolution: 0, // ContactShadows off
    geometryDetail: 2,
    antialias: false,
  },
  medium: {
    isMobile: true,
    dpr: [1, 1.5],
    particleCount: 80,
    starCount: 200,
    useTransmission: false, // Transmission still too expensive for mid-range mobile
    shadowResolution: 256,
    geometryDetail: 3,
    antialias: false,
  },
  high: {
    isMobile: false,
    dpr: [1, 2],
    particleCount: 200,
    starCount: 1000,
    useTransmission: true,
    shadowResolution: 512,
    geometryDetail: 4,
    antialias: true,
  },
};

// SSR-safe defaults (assume high so server renders full markup, client corrects)
const SSR_DEFAULT: DevicePerformance = { tier: "high", ...TIER_CONFIGS.high };

function detectTier(): PerformanceTier {
  if (typeof window === "undefined") return "high";

  const ua = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    "ontouchstart" in window ||
    window.innerWidth < 768;

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as any).deviceMemory || 4; // GB, Chrome-only

  // Probe GPU capabilities via throwaway WebGL context
  let maxTexture = 4096;
  let renderer = "";
  try {
    const c = document.createElement("canvas");
    const gl =
      (c.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (c.getContext("webgl") as WebGLRenderingContext | null);
    if (gl) {
      maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string;
      // Free context
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    /* swallow */
  }

  // Known low-end GPU keywords (Adreno 3xx/4xx/5xx, Mali-4xx/T6xx, PowerVR SGX)
  const isWeakGPU = /Adreno\s*[345]\d{2}|Mali-[4T][0-6]|PowerVR\s*SGX|SwiftShader/i.test(renderer);

  if (isMobile && (cores <= 4 || memory <= 3 || isWeakGPU || maxTexture <= 4096)) {
    return "low";
  }
  if (isMobile || cores <= 4 || memory <= 4) {
    return "medium";
  }
  return "high";
}

export function useDevicePerformance(): DevicePerformance {
  const [perf, setPerf] = useState<DevicePerformance>(SSR_DEFAULT);

  useEffect(() => {
    const tier = detectTier();
    const config = TIER_CONFIGS[tier];
    setPerf({ tier, ...config, isMobile: config.isMobile || tier !== "high" });
  }, []);

  return perf;
}
