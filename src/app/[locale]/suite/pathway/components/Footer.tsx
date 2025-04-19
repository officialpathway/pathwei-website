"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Newsletter from "./Newsletter";

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (footerTop <= windowHeight) {
          document.body.classList.add("illuminated");
        } else {
          document.body.classList.remove("illuminated");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      id="footer"
      className="bg-secondary text-white py-10 relative overflow-hidden"
    >
      <Newsletter />
  
      {/* Content container with higher z-index */}
      <div className="relative z-30 flex flex-col w-full min-h-[120px] px-6">
        {/* Image container with black background */}
        <Image
          className="block bg-black/10 my-4"
          src="/images/pathway/COF.png"
          alt="Footer image"
          width={500}
          height={120}
        />

        {/* Footer text */}
        <div className="flex flex-col md:flex-row justify-between px-8">
          <p className="text-xs mb-2">&copy; 2025 Pathway. Todos los derechos reservados.</p>
          <p className="text-xs">Gracias por acompañarnos en el viaje.</p>
        </div>
      </div>
  
      {/* Glowing Flame - behind content */}
      <div className="z-20 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-red-500 rounded-full filter blur-3xl opacity-75 animate-pulse"></div>
      <div className="z-20 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-yellow-300 rounded-full filter blur-xl opacity-90 animate-flicker"></div>
    </footer>
  );
};

export default Footer;