import React, { useEffect, useRef, useState, useCallback } from 'react';

const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = "#88888825";
const MIN_BRANCH = 30;

interface IWindowSize {
  width: number;
  height: number;
}

function useWindowSize(): IWindowSize {
  const [size, setSize] = useState<IWindowSize>({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    
    const resizeListener = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return size;
}

function CanvasBackground() {
  const el = useRef<HTMLCanvasElement>(null);
  const size = useWindowSize();
  const [stopped, setStopped] = useState(false);
  const [len,] = useState(6);

  const initCanvas = useCallback((canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ctx: undefined, dpi: 1 };

    const dpr = window.devicePixelRatio || 1;
    const bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio    ||
                ctx.msBackingStorePixelRatio     ||
                ctx.oBackingStorePixelRatio      ||
                ctx.backingStorePixelRatio       ||
                1;

    const dpi = _dpi || dpr / bsr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = dpi * width;
    canvas.height = dpi * height;
    ctx.scale(dpi, dpi);

    return { ctx, dpi };
  }, []);

  const polar2cart = useCallback((x = 0, y = 0, r = 0, theta = 0) => {
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return [x + dx, y + dy];
  }, []);

  useEffect(() => {
    const { current: canvas } = el;
    if (!canvas) return;

    const { ctx } = initCanvas(canvas, size.width, size.height);
    if (!ctx) return;

    let steps: (() => void)[] = [];
    let prevSteps: (() => void)[] = [];

    const step = (x: number, y: number, rad: number, counter = { value: 0 }) => {
      const length = Math.random() * len;
      counter.value += 1;
  
      const [nx, ny] = polar2cart(x, y, length, rad);
  
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
  
      const rad1 = rad + Math.random() * r15;
      const rad2 = rad - Math.random() * r15;
  
      if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100) return;
  
      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;
  
      if (Math.random() < rate) steps.push(() => step(nx, ny, rad1, counter));
      if (Math.random() < rate) steps.push(() => step(nx, ny, rad2, counter));
    };

    const draw = () => {
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      prevSteps = [];
      steps = [
        () => step(Math.random() * 0.6 + 0.2 * size.width, -5, r90),
        () => step(Math.random() * 0.6 + 0.2 * size.width, size.height + 5, -r90),
        () => step(-5, Math.random() * 0.6 + 0.2 * size.height, 0),
        () => step(size.width + 5, Math.random() * 0.6 + 0.2 * size.height, r180),
      ];
      if (size.width < 500) steps = steps.slice(0, 2);

      const frame = () => {
        requestAnimationFrame(() => {
          if (stopped) return;
          prevSteps = steps.slice();
          steps = [];
  
          prevSteps.forEach((i) => {
            if (Math.random() < 0.5) steps.push(i);
            else i();
          });
  
          if (!prevSteps.length) setStopped(true);
          else frame();
        });
      };
      frame();
    };

    draw(); 
  }, [initCanvas, polar2cart, size.width, size.height, len]);

  const mask = "radial-gradient(circle, transparent, black)";

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
      style={{
        zIndex: -99,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <canvas ref={el} width="400" height="400" />
    </div>
  );
}

export default CanvasBackground;