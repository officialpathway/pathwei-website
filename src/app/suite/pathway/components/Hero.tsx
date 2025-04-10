"use client";

import React, { useEffect, useState } from "react";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 1 + scrollY * 0.001; // Adjust the factor (0.001) for more or less scaling

  return (
    <section
      className="relative bg-secondary text-white overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Parallax Video */}
      <div
        className="absolute inset-0"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 0.1s linear",
        }}
      >
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src="/videos/pathway/hero-bg.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Overlay */}
      <div className="relative flex flex-col justify-center items-center h-full text-center z-10">
        <h2 className="text-5xl font-bold mb-6">Transforma tu productividad con IA</h2>
        <p className="text-xl mb-8">
          Únete a la revolución de la productividad con nuestra aplicación que combina IA,
          gamificación y redes sociales.
        </p>
        <div className="flex justify-center space-x-4 sm:space-x-4 px-4 sm:px-0">
          <button className="backdrop-blur-md bg-white/30 border-2 border-blue-500 text-blue-500 px-6 sm:px-7 py-3 sm:py-3 text-base sm:text-base rounded-full hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out shadow-md flex flex-col sm:flex-row sm:items-center leading-tight">
            <span className="font-medium sm:inline">Próximamente</span>
            <span className="text-sm opacity-90 sm:ml-1">en iOS</span>
          </button>
          <button className="backdrop-blur-md bg-white/30 border-2 border-blue-500 text-blue-500 px-6 sm:px-7 py-3 sm:py-3 text-base sm:text-base rounded-full hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out shadow-md flex flex-col sm:flex-row sm:items-center leading-tight">
            <span className="font-medium sm:inline">Próximamente</span>
            <span className="text-sm opacity-90 sm:ml-1">en Android</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
