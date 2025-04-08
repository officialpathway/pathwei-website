"use client"; // Mark as a Client Component

import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address.");
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
        setMessage("Thank you for subscribing!");
        setEmail(""); // Clear the input
      } else {
        setMessage(data.error || "Failed to subscribe. Please try again.");
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
          ¡No te lo pierdas!
        </h2>

        {/* Subtext */}
        <p className="text-base sm:text-xl mb-6 sm:mb-8">
          Suscríbete para recibir una notificación cuando la aplicación esté disponible.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-0"
        >
          <input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-xs px-4 py-3 rounded-lg sm:rounded-l-lg text-gray-800 mb-4 sm:mb-0"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-lg cursor-pointer sm:rounded-r-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Subscribing..." : "Suscribirse"}
          </button>
        </form>

        {/* Feedback Message */}
        {message && (
          <p className={`mt-4 text-sm ${message.includes("Thank you") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;