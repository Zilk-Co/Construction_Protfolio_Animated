import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = 100;
    particles.current = Array.from({ length: COUNT }, () => {
      const bvx = (Math.random() - 0.5) * 0.45;
      const bvy = (Math.random() - 0.5) * 0.45;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: bvx,
        vy: bvy,
        baseVx: bvx,
        baseVy: bvy,
        size: Math.random() * 1.8 + 0.5,
        opacity: 0,
        baseOpacity: Math.random() * 0.28 + 0.08,
      };
    });

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);

    const REPEL_RADIUS = 200;
    const REPEL_STRENGTH = 2.2;
    const CONNECT_DIST = 130;
    const GLOW_RADIUS = 80;

    const draw = () => {
      ctx.fillStyle = "hsl(220, 18%, 9%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const hasMouse = mx > -1000;

      for (const p of particles.current) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (hasMouse && dist < REPEL_RADIUS && dist > 0) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_STRENGTH;
          const normalizedForce = force * (1 - dist / REPEL_RADIUS);
          p.vx += (dx / dist) * normalizedForce;
          p.vy += (dy / dist) * normalizedForce;
          const brighten = 1 - dist / REPEL_RADIUS;
          p.opacity = Math.min(p.baseOpacity + brighten * 0.65, 0.92);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.06;
          p.vx += (p.baseVx - p.vx) * 0.015;
          p.vy += (p.baseVy - p.vy) * 0.015;
        }

        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const inGlow = hasMouse && dist < GLOW_RADIUS;
        const drawSize = inGlow ? p.size * (1.5 + (1 - dist / GLOW_RADIUS)) : p.size;

        if (inGlow) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, drawSize * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 146, 42, ${p.opacity * 0.15})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 146, 42, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const fade = 1 - dist / CONNECT_DIST;
            const alpha = fade * fade * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(200, 146, 42, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      if (hasMouse) {
        let closestDist = Infinity;
        for (const p of particles.current) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) closestDist = dist;

          if (dist < REPEL_RADIUS * 0.7) {
            const alpha = (1 - dist / (REPEL_RADIUS * 0.7)) * 0.08;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(200, 146, 42, ${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}
