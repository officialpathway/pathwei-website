"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Features = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check the initial screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed (e.g., 768px for small screens)
    };

    handleResize(); // Run on mount

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const featuresData = [
    {
      title: "IA Avanzada",
      description: "Utiliza IA para optimizar tus tareas y alcanzar tus metas más rápido.",
      image: "/images/pathway/ia.png",
      alt: "IA Avanzada",
      animationFrom: "left",
      imageFirst: true, // Always image first
    },
    {
      title: "Gamificación",
      description: "Compite con amigos y alcanza nuevos niveles de productividad.",
      image: "/images/pathway/game.png",
      alt: "Gamificación",
      animationFrom: "right",
      imageFirst: isMobile, // Dynamically decide based on screen size
    },
    {
      title: "Red Social",
      description: "Comparte tus logros y sigue el progreso de otros usuarios.",
      image: "/images/pathway/web.png",
      alt: "Red Social",
      animationFrom: "left",
      imageFirst: true, // Always image first
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6 space-y-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">Características Principales</h2>

        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              x: feature.animationFrom === "left" ? -100 : 100,
            }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8"
          >
            {/* Conditionally Render Image First or Second */}
            {feature.imageFirst && (
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={300} // Specify the width
                  height={300} // Specify the height
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="md:w-1/2 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white text-lg">{feature.description}</p>
            </div>
            {!feature.imageFirst && (
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  width={300} // Specify the width
                  height={300} // Specify the height
                  className="rounded-lg shadow-lg"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
