"use client";

import React, { useEffect } from "react";
import Newsletter from "./Newsletter";

const Footer = () => {
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (footerTop <= windowHeight) {
          document.body.classList.add("illuminated"); // Add glow to app
        } else {
          document.body.classList.remove("illuminated"); // Remove glow
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer
      id="footer"
      className="bg-secondary text-white py-20 relative overflow-hidden"
    >
      <Newsletter />
      <div className="container mx-auto px-6 flex justify-between absolute bottom-2 right-0 left-0">
        <p className="text-sm mb-2">&copy; 2025 Pathway. Todos los derechos reservados.</p>
        <p className="text-xs">Gracias por acompañarnos en el viaje.</p>
      </div>

      {/* Glowing Flame */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-red-500 rounded-full filter blur-3xl opacity-75 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-yellow-300 rounded-full filter blur-xl opacity-90 animate-flicker"></div>
    </footer>
  );
};

export default Footer;
