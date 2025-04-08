"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx"; // Para nombres de clases condicionales

const BentoGrid = () => {
  const [visibleSections, setVisibleSections] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0", 10);
            setVisibleSections((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".bento-section");
    sections.forEach((section, index) => {
      section.setAttribute("data-index", index.toString());
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 min-h-screen p-6 w-full max-w-full overflow-hidden">
      {/* Sección de Salud */}
      <div
        className={clsx(
          "bento-section col-span-1 md:col-span-2 md:row-span-2 relative bg-green-500 text-white transition-all duration-700 transform aspect-[4/3] md:aspect-auto",
          visibleSections.includes(0)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Image
          src="/images/health.jpg"
          alt="Meta de Salud"
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 tracking-wide drop-shadow-lg">
            Salud
          </h2>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light drop-shadow-md">
            Mejora tu bienestar. Construye una vida sana, come saludable y alcanza tus metas personales.
          </p>
        </div>
      </div>

      {/* Sección de Aprender un Idioma */}
      <div
        className={clsx(
          "bento-section col-span-1 md:col-span-2 relative bg-blue-500 text-white transition-all duration-700 transform aspect-[4/3] md:aspect-auto",
          visibleSections.includes(1)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Image
          src="/images/language.jpg"
          alt="Meta de Aprender un Idioma"
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase mb-4 tracking-wide drop-shadow-lg">
            Aprende un Idioma
          </h2>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light drop-shadow-md">
            Sumérgete en nuevas culturas y amplía tu mundo dominando un idioma.
          </p>
        </div>
      </div>

      {/* Sección de Trabajo */}
      <div
        className={clsx(
          "bento-section col-span-1 relative bg-yellow-500 text-gray-800 transition-all duration-700 transform aspect-[4/3] md:aspect-auto",
          visibleSections.includes(2)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Image
          src="/images/work.jpg"
          alt="Meta de Trabajo"
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase mb-2 tracking-wide drop-shadow-lg">
            Trabajo
          </h2>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light drop-shadow-md">
            Mejora tu productividad y alcanza el éxito profesional.
          </p>
        </div>
      </div>

      {/* Sección de Tecnología */}
      <div
        className={clsx(
          "bento-section col-span-1 relative bg-gray-800 text-white transition-all duration-700 transform aspect-[4/3] md:aspect-auto",
          visibleSections.includes(3)
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        )}
      >
        <Image
          src="/images/tech.jpg"
          alt="Meta de Tecnología"
          fill
          className="object-cover rounded-md"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent">
          <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase mb-2 tracking-wide drop-shadow-lg">
            Tecnología
          </h2>
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-light drop-shadow-md">
            Acepta la innovación y domina las nuevas tecnologías para el futuro.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
