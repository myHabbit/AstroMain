import React, { useState, useEffect, useRef } from "react";

const MIN_BRANCH = 30;
const r180 = Math.PI;
const r90 = Math.PI / 2;
const r15 = Math.PI / 12;
const color = "#88888825";

const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
  const dx = r * Math.cos(theta);
  const dy = r * Math.sin(theta);
  return [x + dx, y + dy];
};

const RandomBranches = () => {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [stopped, setStopped] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [steps, setSteps] = useState([]);
  const [prevSteps, setPrevSteps] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const bsr =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;

    const dpi = dpr / bsr;

    canvas.style.width = `${size.width}px`;
    canvas.style.height = `${size.height}px`;
    canvas.width = dpi * size.width;
    canvas.height = dpi * size.height;

    setCtx(context);

    const random = Math.random;
    const { width, height } = canvas;

    const step = (x, y, rad, counter = 0) => {
      const length = random() * 6;
      counter++;

      const [nx, ny] = polar2cart(x, y, length, rad);

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(nx, ny);
      context.stroke();

      const rad1 = rad + random() * r15;
      const rad2 = rad - random() * r15;

      if (
        nx < -100 ||
        nx > size.width + 100 ||
        ny < -100 ||
        ny > size.height + 100
      )
        return;

      const rate = counter <= MIN_BRANCH ? 0.8 : 0.5;

      if (random() < rate) steps.push(() => step(nx, ny, rad1, counter));

      if (random() < rate) steps.push(() => step(nx, ny, rad2, counter));
    };

    const randomMiddle = () => random() * 0.6 + 0.2;

    const animate = () => {
      if (stopped) return;

      setPrevSteps([...steps]);
      setSteps([]);

      if (prevSteps.length === 0) {
        setStopped(true);
        return;
      }

      prevSteps.forEach((i) => {
        if (random() < 0.5) steps.push(i);
        else i();
      });

      requestAnimationFrame(animate);
    };

    setSteps([
      () => step(randomMiddle() * size.width, -5, r90),
      () => step(randomMiddle() * size.width, size.height + 5, -r90),
      () => step(-5, randomMiddle() * size.height, 0),
      () => step(size.width + 5, randomMiddle() * size.height, r180),
    ]);

    animate();

    return () => setStopped(true);
  }, [size, steps, prevSteps, stopped]);

  useEffect(() => {
    if (!ctx) return;
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
  }, [ctx, size]);

  const handleResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStart = () => setStopped(false);

  const mask = "radial-gradient(circle, transparent, black)";

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
      style={{
        zIndex: -99,
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        onClick={handleStart}
      />
    </div>
  );
};

export default RandomBranches;