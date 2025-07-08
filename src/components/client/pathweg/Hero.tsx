// components/client/pathweg/Hero.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Download, Lock, Eye, EyeOff } from "lucide-react";

const Hero = () => {
  const t = useTranslations("Pathweg");
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDownloadClick = () => {
    setShowCredentialModal(true);
  };

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check credentials against environment variables
      const correctUsername =
        process.env.NEXT_PUBLIC_BETA_USERNAME || "beta_tester";
      const correctPassword =
        process.env.NEXT_PUBLIC_BETA_PASSWORD || "PathwegBeta2025!";
      const driveUrl =
        process.env.NEXT_PUBLIC_APK_STORAGE_URL ||
        "https://drive.google.com/file/d/1xArTNVQEg_Ic3pznxakBPeeiIHuoEMKo/view?usp=drivesdk";

      if (
        credentials.username === correctUsername &&
        credentials.password === correctPassword
      ) {
        // Redirect to Google Drive download
        window.open(driveUrl, "_blank");
        setShowCredentialModal(false);
        setCredentials({ username: "", password: "" });
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.log(error);
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const BetaFeature = ({
    icon,
    title,
    description,
  }: {
    icon: string;
    title: string;
    description: string;
  }) => (
    <div className="relative group">
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-amber-500/20 rounded-2xl blur-xl group-hover:bg-amber-500/30 transition-all duration-300" />

      {/* Main container */}
      <div
        className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 
                      hover:bg-white/15 hover:border-amber-500/30 transition-all duration-300
                      shadow-2xl hover:shadow-amber-500/20"
      >
        {/* Icon */}
        <div className="text-4xl mb-3 text-center">{icon}</div>

        {/* Title */}
        <div className="text-white font-semibold text-center mb-2">{title}</div>

        {/* Description */}
        <div className="text-white/80 text-sm text-center">{description}</div>

        {/* Animated border */}
        <div className="absolute inset-0 rounded-2xl border border-amber-500/0 group-hover:border-amber-500/50 transition-all duration-300" />
      </div>
    </div>
  );

  return (
    <>
      <section className="relative bg-transparent overflow-hidden min-h-screen flex items-center justify-center">
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto pt-20 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Beta Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center mb-6"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                🚀 Beta Disponible Ahora
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="block mb-2">{t("ui.hero.heading.part1")}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-500">
                {t("ui.hero.heading.part2")}
              </span>
            </motion.h1>

            {/* Beta announcement */}
            <motion.div
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl text-white mb-4 font-medium">
                ¡Únete a la Beta de Pathweg!
              </p>
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
                Sé uno de los primeros en probar nuestra revolucionaria app de
                productividad con IA. La beta está disponible ahora.
              </p>
            </motion.div>

            {/* Beta Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 sm:mb-12 max-w-4xl mx-auto"
            >
              <BetaFeature
                icon="🎯"
                title="Funciones Completas"
                description="Acceso a todas las características principales de Pathweg"
              />
              <BetaFeature
                icon="🤖"
                title="IA Integrada"
                description="Experimenta nuestro asistente de productividad con inteligencia artificial"
              />
              <BetaFeature
                icon="📱"
                title="APK Exclusivo"
                description="Descarga directa del archivo APK para Android"
              />
            </motion.div>

            {/* Download and Newsletter CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Download APK Button */}
              <div className="space-y-4">
                <motion.button
                  type="button"
                  onClick={handleDownloadClick}
                  className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 
                            rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                            hover:scale-105 transform hover:shadow-blue-500/25 mr-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Download size={20} />
                    Descargar APK Beta
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              </div>

              {/* Newsletter CTA */}
              <div className="space-y-4">
                <p className="text-white/90 text-lg font-medium">
                  🔐 Acceso Beta Exclusivo
                </p>
                <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                  Suscríbete a nuestro newsletter y recibe las credenciales de
                  descarga del APK directamente en tu email. ¡Solo para usuarios
                  beta!
                </p>
              </div>

              {/* Newsletter signup button */}
              <motion.button
                type="button"
                className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-4 
                          rounded-full font-medium text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
                          hover:scale-105 transform hover:shadow-green-500/25"
                onClick={() => {
                  const newsletterSection =
                    document.getElementById("newsletter");
                  if (newsletterSection) {
                    newsletterSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Obtener Credenciales Beta
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              {/* Secondary info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Beta gratuita</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Credenciales por email</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Acceso inmediato</span>
                </div>
              </div>
            </motion.div>

            {/* Scroll Down Indicator */}
            <motion.div
              className="flex flex-col items-center mt-8 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <p className="text-gray-300 mb-2 text-sm font-medium">
                Descubre más sobre Pathweg
              </p>
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
              >
                <motion.div
                  animate={{
                    y: [0, 6, 0],
                    opacity: [1, 0.3, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  className="w-1 h-2 bg-gray-300 rounded-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credential Modal */}
      {showCredentialModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Credenciales Beta Requeridas
              </h3>
              <p className="text-gray-600 text-sm">
                Ingresa las credenciales que recibiste por email para descargar
                el APK
              </p>
            </div>

            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ingresa tu usuario beta"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({
                        ...credentials,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingresa tu contraseña beta"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCredentialModal(false);
                    setCredentials({ username: "", password: "" });
                    setError("");
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download size={16} className="mr-2" />
                      Descargar
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm text-center">
                <strong>¿No tienes credenciales?</strong>
                <br />
                Suscríbete al newsletter para recibirlas por email
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Hero;
