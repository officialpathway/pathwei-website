"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import { feedbackData } from "../utils/constants";

const FeedbackSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const cardsContainer = scrollRef.current;
    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.children) as HTMLElement[];

    // Clonar tarjetas para loop infinito
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      cardsContainer.appendChild(clone);
    });

    cardsContainer.style.animation = `scrollCards ${cards.length * 5}s linear infinite`;
  }, [isMobile]);

  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCard = (feedback: any, index: number) => (
    <div
      key={index}
      className="bg-white text-black p-6 pt-10 rounded-lg shadow-lg flex-shrink-0 w-80 md:w-96 relative flex flex-col justify-around mx-auto"
    >
      {/* Estrellas */}
      <div className="absolute top-4 left-4 flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className="text-yellow-500" />
        ))}
      </div>

      {/* Cita */}
      <div className="absolute top-4 right-4">
        <FaQuoteRight className="text-gray-300 text-2xl" />
      </div>

      <h3 className="text-xl font-bold mb-4">{feedback.title}</h3>
      <p className="text-secondary">&quot;{feedback.content}&quot;</p>
      <p className="text-sm mt-4 text-gray-500">- {feedback.user}</p>
    </div>
  );

  return (
    <section id="feedback" className="py-20 bg-background text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Escuchamos a las personas</h2>
        <p className="text-lg text-center mb-12">
          Entendemos que las opiniones sobre gamificación, aplicaciones de productividad y el uso compartido en redes sociales son clave. Hemos tomado en cuenta lo que dijeron para diseñar una experiencia que combina lo mejor de todo.
        </p>

        {/* Móvil: Slider manual con flechas */}
        {isMobile ? (
          <Slider
            dots={true}
            arrows={true}
            infinite={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            className="max-w-100 mx-auto"
          >
            {feedbackData.map(renderCard)}
          </Slider>
        ) : (
          // Desktop/Tablet: Movimiento automático infinito
          <div className="overflow-hidden relative w-full" style={{ height: "280px" }}>
            <div ref={scrollRef} className="flex gap-4 w-max">
              {feedbackData.map(renderCard)}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scrollCards {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
};

export default FeedbackSection;
