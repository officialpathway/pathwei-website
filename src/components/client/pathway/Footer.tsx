"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Newsletter from "./Newsletter";
import { useTranslations } from 'next-intl';
import Link from "next/link";

const Footer = () => {
  const t = useTranslations("Pathway");

  // Social media links
  const socialLinks = [
    { platform: "TikTok", handle: "@pathwayapp", href: "https://www.tiktok.com/@pathwayapp" },
    { platform: "Instagram", handle: "@pathway.app", href: "https://www.instagram.com/pathway.app" },
    { platform: "LinkedIn", handle: "Pathway", href: "https://www.linkedin.com/company/pathway-ai-haven-labs" },
    { platform: "Email", handle: "officialpathwayapp@gmail.com", href: "mailto:officialpathwayapp@gmail.com" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (footerTop <= windowHeight) {
          document.body.classList.add("illuminated");
        } else {
          document.body.classList.remove("illuminated");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      id="footer"
      className="bg-secondary text-white py-10 relative overflow-hidden"
    >
      <Newsletter />
  
      {/* Content container with higher z-index */}
      <div className="relative z-30 flex flex-col w-full min-h-[120px] px-6">
        {/* Image container with black background */}
        <Image
          className="block bg-black/10 my-4"
          src="/images/pathway/COF.png"
          alt="Footer image"
          width={500}
          height={120}
        />

        {/* Social Media Links */}
        <div className="flex flex-col md:flex-row justify-between px-8 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-3 md:mb-0">
            <a 
              href={socialLinks[0].href}
              className="flex items-center text-sm hover:text-gray-300 transition-colors duration-300"
            >
              <span className="font-medium mr-1">{socialLinks[0].platform}:</span>
              <span>{socialLinks[0].handle}</span>
            </a>
            <a 
              href={socialLinks[1].href}
              className="flex items-center text-sm hover:text-gray-300 transition-colors duration-300"
            >
              <span className="font-medium mr-1">{socialLinks[1].platform}:</span>
              <span>{socialLinks[1].handle}</span>
            </a>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <a 
              href={socialLinks[2].href}
              className="flex items-center text-sm hover:text-gray-300 transition-colors duration-300"
            >
              <span className="font-medium mr-1">{socialLinks[2].platform}:</span>
              <span>{socialLinks[2].handle}</span>
            </a>
            <a 
              href={socialLinks[3].href}
              className="flex items-center text-sm hover:text-gray-300 transition-colors duration-300"
            >
              <span className="font-medium mr-1">{socialLinks[3].platform}:</span>
              <span>{socialLinks[3].handle}</span>
            </a>
          </div>
        </div>

        {/* Footer text */}
        <div className="flex flex-col md:flex-row justify-between px-8">
          <p className="text-xs mb-2">{t("footer-rights")}</p>
          <Link href="/suite/pathway/policy" className="underline text-xs font-medium hover:text-gray-300 transition-colors duration-300">
            {t("footer-privacy-policy")}
          </Link>
        </div>
      </div>
  
      {/* Glowing Flame - behind content */}
      <div className="z-20 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-red-500 rounded-full filter blur-3xl opacity-75 animate-pulse"></div>
      <div className="z-20 absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-yellow-300 rounded-full filter blur-xl opacity-90 animate-flicker"></div>
    </footer>
  );
};

export default Footer;