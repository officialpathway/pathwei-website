"use client";

import React, { useEffect, useState } from "react";

const Header = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if user is near the bottom of the page
      if (scrollTop + windowHeight >= scrollHeight - 50) {
        setIsVisible(false); // Hide the header
      } else {
        setIsVisible(true); // Show the header
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full backdrop-blur-md bg-secondary/70 text-white py-6 z-20 transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pathway</h1>
        <nav className="hidden md:flex space-x-6">
          <ul className="flex space-x-6">
            <li>
              <a href="#features" className="hover:text-accent">
                Features
              </a>
            </li>
            <li>
              <a href="#newsletter" className="hover:text-accent">
                Newsletter
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-secondary/70 text-white py-6">
          <ul className="flex flex-col space-y-4 items-center">
            <li>
              <a href="#features" className="hover:text-accent">
                Features
              </a>
            </li>
            <li>
              <a href="#newsletter" className="hover:text-accent">
                Newsletter
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
