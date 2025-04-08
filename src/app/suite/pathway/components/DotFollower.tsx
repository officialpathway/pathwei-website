"use client";

import React, { useEffect, useRef } from "react";

const DotFollower = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dotRef.current) {
        // Position the dot slightly offset to the top-left of the cursor
        const offsetX = -8; // Adjust this value for precise alignment (negative for left)
        const offsetY = -8; // Adjust this value for precise alignment (negative for top)

        // Apply the new position with a smooth transition
        dotRef.current.style.transform = `translate3d(${event.clientX + offsetX}px, ${event.clientY + offsetY}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none mix-blend-difference z-50 transition-transform duration-300 ease-out"
    ></div>
  );
};

export default DotFollower;