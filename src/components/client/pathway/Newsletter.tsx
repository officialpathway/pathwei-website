"use client";

import React, { useState } from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const t = useTranslations("Pathway");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage(`${t("ui.newsletter.provide_valid_email")}`);
      return;
    }

    if (!termsAgreed) {
      setMessage(`${t("ui.newsletter.agree_message")}`);
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
        setMessage(`${t("ui.newsletter.messages.subscription_success")}`);
        setEmail(""); // Clear the input
        setTermsAgreed(false); // Reset checkbox
      } else {
        setMessage(data.error || `${t("ui.newsletter.messages.subscription_failed")}`);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 bg-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          {t("ui.newsletter.heading")}
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-xl mb-6 sm:mb-8">
          {t("ui.newsletter.subheading")}
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full max-w-md mx-auto gap-4"
        >
          <div className="flex flex-col sm:flex-row justify-center items-stretch w-full gap-2 sm:gap-0">
            <input
              type="email"
              placeholder={t("ui.newsletter.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 sm:px-6 py-3 sm:py-4 border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 sm:py-4 bg-white text-black font-medium rounded-lg sm:rounded-l-none border-2 border-white cursor-pointer
              hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap 
              focus:outline-none focus:ring-2 focus:ring-white shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("ui.newsletter.buttons.sending")}
                </span>
              ) : (
                `${t("ui.newsletter.buttons.subscribe")}`
              )}
            </button>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center justify-center w-full">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="w-4 h-4 accent-white cursor-pointer"
                required
              />
              <span className="text-sm">
                {t("ui.newsletter.terms.agreement")}{" "}
                <Link href="/terminos" className="underline font-medium hover:text-gray-300 transition-colors duration-300">
                  {t("ui.newsletter.terms.link")}
                </Link>
              </span>
            </label>
          </div>

          {/* Feedback Message */}
          {message && (
            <p className={`mt-2 text-sm ${message.includes(`${t("ui.newsletter.messages.success_checker")}`) ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default Newsletter;