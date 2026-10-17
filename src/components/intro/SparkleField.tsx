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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const count = reduced ? 10 : window.matchMedia("(max-width: 700px)").matches ? 18 : 36;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: count }, (_, index) => makeParticle(rect.width, rect.height, index));
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      const converge = scene === "angels" || scene === "frames" || scene === "focus" || scene === "names";
      const center = scene === "memory";

      for (const particle of particles) {
        particle.tw += 0.01;
        const alpha = particle.a * (0.55 + Math.sin(particle.tw) * 0.45);
        if (converge) {
          const targetX = particle.side === 0 ? width * 0.28 : width * 0.72;
          const targetY = height * 0.48;
          particle.vx += (targetX - particle.x) * 0.0008;
          particle.vy += (targetY - particle.y) * 0.0008;
        } else if (center) {
          particle.vx += (width * 0.5 - particle.x) * 0.00035;
          particle.vy += (height * 0.46 - particle.y) * 0.00035;
        }
        if (burst) {
          particle.vy -= 0.01;
          particle.a = Math.min(0.8, particle.a + 0.002);
        }
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.992;
        particle.vy *= 0.992;
        if (particle.x < -10 || particle.x > width + 10 || particle.y < -10 || particle.y > height + 10) {
          particle.x = Math.random() * width;
          particle.y = height + 8;
          particle.vx = (Math.random() - 0.5) * 0.18;
          particle.vy = -0.08 - Math.random() * 0.16;
        }
        context.beginPath();
        context.fillStyle = `rgba(255, 248, 250, ${alpha})`;
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      }
    };

    if (reduced) {
      draw();
      return () => {
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    const loop = () => {
      if (visible && !paused) draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [burst, paused, reduced, scene]);

  return <canvas ref={canvasRef} className="sparkle-field" aria-hidden="true" />;
}
