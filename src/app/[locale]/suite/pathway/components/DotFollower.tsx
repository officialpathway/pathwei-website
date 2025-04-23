"use client";

import React, { useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/client/useWindowSize"; // Adjust import path as needed

const DotFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const isDesktop = width >= 768; // Tailwind's 'md' breakpoint

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (dotRef.current) {
        const offsetX = -8;
        const offsetY = -8;
        dotRef.current.style.transform = `translate3d(${event.clientX + offsetX}px, ${event.clientY + offsetY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none mix-blend-difference z-50 transition-transform duration-300 ease-out"
    ></div>
  );
};

export default DotFollower;