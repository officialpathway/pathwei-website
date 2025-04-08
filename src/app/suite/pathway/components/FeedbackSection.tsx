"use client";

import React, { useEffect, useRef } from "react";
import { FaStar, FaQuoteRight } from "react-icons/fa";

const FeedbackSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardsContainer = scrollRef.current;

    if (!cardsContainer) return;

    const cards = Array.from(cardsContainer.children) as HTMLElement[];

    // Duplicate the cards for seamless looping
    cards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      cardsContainer.appendChild(clone);
    });

    // Apply the scrolling animation
    cardsContainer.style.animation = `scrollCards ${cards.length * 5}s linear infinite`;
  }, []);

  const feedbackData = [
    {
      title: "Opinión sobre Gamificación",
      content:
        "Los sistemas de gamificación han cambiado la forma en la que alcanzo mis metas. Pero a veces la competencia puede ser abrumadora.",
      user: "GameMaster92",
    },
    {
      title: "Opinión sobre Aplicaciones de Productividad",
      content:
        "Las aplicaciones me han ayudado a mantenerme organizado, pero encuentro que algunas son difíciles de usar.",
      user: "TaskWizard88",
    },
    {
      title: "Opinión sobre Redes Sociales",
      content:
        "Compartir mis logros en redes sociales me motiva, aunque no quiero que mi privacidad se vea comprometida.",
      user: "SocialStar07",
    },
    {
      title: "Opinión General",
      content:
        "Una combinación de gamificación, productividad y redes sociales es ideal, pero debe ser equilibrada y fácil de usar.",
      user: "BalancedGuru",
    },
  ];  

  return (
    <section id="feedback" className="py-20 bg-background text-white">
      <div className="container mx-auto px-6">
        {/* Introductory Text */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Escuchamos a las personas
        </h2>
        <p className="text-lg text-center mb-12">
          Entendemos que las opiniones sobre gamificación, aplicaciones de
          productividad y el uso compartido en redes sociales son clave.
          Hemos tomado en cuenta lo que dijeron para diseñar una experiencia
          que combina lo mejor de todo.
        </p>

        {/* Moving Cards */}
        <div className="overflow-hidden relative w-full" style={{ height: "280px" }}>
          <div
            ref={scrollRef}
            className="flex gap-4 w-max"
          >
            {feedbackData.map((feedback, index) => (
              <div
                key={index}
                className="bg-white text-black p-6 pt-10 rounded-lg shadow-lg flex-shrink-0 w-80 md:w-96 relative flex flex-col justify-around"
              >
                {/* Five Stars */}
                <div className="absolute top-4 left-4 flex space-x-1">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar key={starIndex} className="text-yellow-500" />
                  ))}
                </div>

                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <FaQuoteRight className="text-gray-300 text-2xl" />
                </div>

                {/* Card Content */}
                <h3 className="text-xl font-bold mb-4">{feedback.title}</h3>
                <p className="text-secondary">&quot;{feedback.content}&quot;</p>
                <p className="text-sm mt-4 text-gray-500">- {feedback.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for scrolling animation */}
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