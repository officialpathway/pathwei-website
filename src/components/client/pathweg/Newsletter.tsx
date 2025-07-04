"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const t = useTranslations("Pathweg");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage("Por favor, introduce una dirección de email válida");
      return;
    }

    if (!termsAgreed) {
      setMessage("Debes aceptar los términos y condiciones");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, termsAgreed }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "¡Perfecto! Revisa tu email para recibir el enlace de descarga de la beta de Pathweg. ¡Bienvenido al equipo beta!"
        );
        setEmail(""); // Clear the input
        setTermsAgreed(false); // Reset checkbox
      } else {
        setMessage(
          data.error || "Error en la suscripción. Inténtalo de nuevo."
        );
      }
    } catch (error) {
      setMessage("Ha ocurrido un error. Por favor, inténtalo de nuevo.");
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-20 bg-secondary text-white relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Beta Badge */}
        <div className="inline-flex items-center mb-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
            🚀 Acceso Beta Exclusivo
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
          Recibe el APK de Pathweg Beta
        </h2>

        {/* Subtext */}
        <div className="space-y-4 mb-8">
          <p className="text-lg sm:text-xl mb-4">
            Suscríbete y obtén acceso inmediato a la versión beta
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md mx-auto gap-4"
        >
          <div className="flex flex-col sm:flex-row justify-center items-stretch w-full gap-2 sm:gap-0">
            <input
              type="email"
              placeholder="tu-email@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 sm:px-6 py-3 sm:py-4 border-2 border-green-500 bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg sm:rounded-l-none border-2 border-green-500 cursor-pointer
              hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap 
              focus:outline-none focus:ring-2 focus:ring-green-400 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                "Unirse a la Beta"
              )}
            </button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center justify-center w-full">
            <label className="flex items-start gap-3 cursor-pointer max-w-md">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 accent-white cursor-pointer mt-0.5 flex-shrink-0"
                required
              />
              <span className="text-sm leading-relaxed">
                {t("ui.newsletter.terms.agreement")}{" "}
                <Link
                  href="/privacidad"
                  className="underline font-bold hover:text-gray-300 transition-colors duration-300"
                >
                  {t("ui.newsletter.terms.link")}
                </Link>{" "}
                {t("ui.newsletter.terms.agreement_2")}
              </span>
            </label>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`mt-2 p-3 rounded-lg max-w-md w-full ${
                message.includes("Perfecto") || message.includes("Bienvenido")
                  ? "text-green-400 bg-green-500/20 border border-green-500/30"
                  : "text-red-400 bg-red-500/20 border border-red-500/30"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </form>

        {/* Additional Info */}
        <div className="mt-8 space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
            <h3 className="font-semibold text-lg mb-3 text-green-400">
              ¿Qué incluye la Beta?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤖</span>
                <span>IA personalizada para productividad</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <span>Análisis detallado de progreso</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎮</span>
                <span>Sistema de gamificación completo</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👥</span>
                <span>Funciones sociales para estudiantes</span>
              </div>
            </div>
          </div>

          <p className="text-white/60 text-sm">
            * La beta es completamente gratuita. Recibirás el enlace de descarga
            en tu email en los próximos minutos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
