"use client";

import React, { useEffect, useRef, useState } from "react";

const SloganSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.getBoundingClientRect().top;
        const sectionHeight = sectionRef.current.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate progress: 0 when the section starts entering, 1 when fully in view
        const progress = Math.min(
          Math.max((windowHeight - sectionTop) / sectionHeight, 0),
          1
        );
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex h-[75vh]"
      style={{
        overflow: "hidden",
      }}
    >
      {/* Left Transparent Space */}
      <div className="flex-1"></div>

      {/* Right Transparent Space with Animated Slogan */}
      <div className="flex-1 flex flex-col justify-center items-start p-6 sm:p-10 space-y-4">
        <h3
          style={{
            transform: `translateY(${100 - scrollProgress * 100}px)`,
            opacity: scrollProgress,
            transition: "transform 0.2s, opacity 0.2s",
          }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-white leading-none"
        >
          ¡La{" "}
          <span
            style={{
              transform: `translateX(-${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-white/70 animate-pulse-glow"
          >
            revolución
          </span>{" "}
          <span
            style={{
              transform: `translateX(${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl text-white/90"
          >
            comienza
          </span>{" "}
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold animate-crazy-colors">
            contigo
          </span>
          !
        </h3>
        <p
          style={{
            transform: `translateY(${100 - scrollProgress * 100}px)`,
            opacity: scrollProgress,
            transition: "transform 0.2s, opacity 0.2s",
          }}
          className="text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] text-white/90 leading-snug"
        >
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70">Toma el </span>
          <span
            style={{
              transform: `translateX(-${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-3xl text-white"
          >
            control
          </span>
          <span className="text-sm sm:text-base md:text-lg lg:text-xl text-white/60"> de tus </span>
          <span
            style={{
              transform: `translateX(${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-xl sm:text-2xl md:text-4xl lg:text-4xl font-semibold text-white"
          >
            metas
          </span>{" "}
          y potencia tu <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl text-white/80">productividad</span>.
        </p>
        <p
          style={{
            transform: `translateY(${100 - scrollProgress * 100}px)`,
            opacity: scrollProgress,
            transition: "transform 0.2s, opacity 0.2s",
          }}
          className="text-sm sm:text-base md:text-lg lg:text-lg text-white/60"
        >
          Conecta,{" "}
          <span
            style={{
              transform: `translateX(-${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-base sm:text-lg md:text-xl lg:text-[1.4rem] text-white italic"
          >
            aprende
          </span>{" "}
          y{" "}
          <span
            style={{
              transform: `translateX(${50 - scrollProgress * 50}px)`,
              opacity: scrollProgress,
              transition: "transform 0.2s, opacity 0.2s",
            }}
            className="text-base sm:text-lg md:text-xl lg:text-[1.2rem] text-white/70"
          >
            mejora.
          </span>
        </p>
      </div>
    </section>
  );
};

export default SloganSection;
