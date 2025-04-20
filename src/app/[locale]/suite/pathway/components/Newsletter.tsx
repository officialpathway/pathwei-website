"use client";

import React, { useState } from "react";
import { useTranslations } from 'next-intl';

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations("Pathway");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage(`${t("provide-valid-email")}`);
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${t("subscription-success")}`);
        setEmail(""); // Clear the input
      } else {
        setMessage(data.error || `${t("subscription-failed")}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="pb-20 bg-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {t("newsletter-heading")}
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-xl mb-6 sm:mb-8">
          {t("newsletter-subheading")}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-stretch w-full max-w-md mx-auto gap-2 sm:gap-0"
        >
          <input
            type="email"
            placeholder={t("email-placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-grow px-4 sm:px-6 py-3 sm:py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 sm:py-4 bg-white text-black font-medium rounded-lg sm:rounded-l-none border-2 border-white cursor-pointer
            hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("sending")}
              </span>
            ) : (
              `${t("subscribe")}`
            )}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <p className={`mt-4 text-sm ${message.includes(`${t("success-checker")}`) ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;