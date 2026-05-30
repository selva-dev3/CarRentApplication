'use client';

import { useEffect, useState } from 'react';

export default function AmbientLights() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <div
        className="fixed pointer-events-none z-0 -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(232,52,28,0.08)_0%,transparent_70%)] transition-transform duration-300"
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
      />
      <div
        className="fixed pointer-events-none z-0 -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,52,28,0.05)_0%,transparent_70%)] transition-transform duration-300"
        style={{ transform: `translate(${-pos.x}px, ${-pos.y}px)` }}
      />
    </>
  );
}
