import { useEffect, useRef } from "react";
import type { SceneId } from "../../types/story";

type SparkleFieldProps = {
  scene: SceneId;
  paused: boolean;
  reduced: boolean;
  burst: boolean;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  tw: number;
  side: number;
};

function makeParticle(width: number, height: number, index: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.6 + 0.4,
    a: Math.random() * 0.45 + 0.15,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -0.05 - Math.random() * 0.16,
    tw: Math.random() * Math.PI * 2,
    side: index % 2 === 0 ? 0 : 1,
  };
}

export function SparkleField({ scene, paused, reduced, burst }: SparkleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(scene);
  const pausedRef = useRef(paused);
  const burstRef = useRef(burst);
  sceneRef.current = scene;
  pausedRef.current = paused;
  burstRef.current = burst;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const count = window.matchMedia("(max-width: 700px)").matches ? 8 : 14;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width));
      canvas.height = Math.max(1, Math.floor(rect.height));
      context.setTransform(1, 0, 0, 1, 0, 0);
      particles = Array.from({ length: count }, (_, index) => makeParticle(rect.width, rect.height, index));
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = (step: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const sceneNow = sceneRef.current;
      const burstNow = burstRef.current;
      context.clearRect(0, 0, width, height);
      const converge = sceneNow === "angels" || sceneNow === "frames" || sceneNow === "focus" || sceneNow === "names";
      const center = sceneNow === "memory";

      for (const particle of particles) {
        particle.tw += 0.01 * step;
        const alpha = particle.a * (0.55 + Math.sin(particle.tw) * 0.45);
        if (converge) {
          const targetX = particle.side === 0 ? width * 0.28 : width * 0.72;
          const targetY = height * 0.48;
          particle.vx += (targetX - particle.x) * 0.0008 * step;
          particle.vy += (targetY - particle.y) * 0.0008 * step;
        } else if (center) {
          particle.vx += (width * 0.5 - particle.x) * 0.00035 * step;
          particle.vy += (height * 0.46 - particle.y) * 0.00035 * step;
        }
        if (burstNow) {
          particle.vy -= 0.01 * step;
          particle.a = Math.min(0.8, particle.a + 0.002 * step);
        }
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        if (particle.x < -10 || particle.x > width + 10 || particle.y < -10 || particle.y > height + 10) {
          particle.x = Math.random() * width;
          particle.y = height + 8;
          particle.vx = (Math.random() - 0.5) * 0.18;
          particle.vy = -0.08 - Math.random() * 0.16;
        }
        context.fillStyle = `rgba(255, 248, 250, ${alpha})`;
        context.fillRect(particle.x, particle.y, particle.r * 2, particle.r * 2);
      }
    };

    if (reduced) {
      draw(1);
      return () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    let last = 0;
    const loop = (now: number) => {
      if (visible && !pausedRef.current && now - last >= 50) {
        const step = Math.min(3, (now - last) / 16.7);
        last = now;
        draw(step);
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="sparkle-field" aria-hidden="true" />;
}
