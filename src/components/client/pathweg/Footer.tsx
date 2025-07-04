"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Newsletter from "./Newsletter";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaTiktok, FaInstagram, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const t = useTranslations("Pathweg.ui.footer");

  // Social links with enhanced metadata for accessibility
  const socialLinks = [
    {
      href: "https://www.tiktok.com/@pathweiapp",
      icon: FaTiktok,
      label: "TikTok",
    },
    {
      href: "https://www.instagram.com/pathwei.app",
      icon: FaInstagram,
      label: "Instagram",
    },
    {
      href: "https://www.linkedin.com/company/pathway-ai-haven-labs",
      icon: FaLinkedin,
      label: "LinkedIn",
    },
    { href: "mailto:info@mypathwayapp.com", icon: FaEnvelope, label: "Email" },
  ];

  // Dynamic flame effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        // Add illumination class when footer comes into view
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
      className="bg-black text-white relative overflow-hidden"
    >
      {/* Newsletter section */}
      <div className="relative z-30">
        <Newsletter />
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 py-12 relative z-30">
        {/* COF Banner prominently displayed */}
        <div className="flex justify-center mb-12">
          <Image
            src="/images/pathweg/COF.png"
            alt="COF Sponsors"
            width={600}
            height={120}
            className="max-w-full"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Footer navigation and social links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Company Info */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              {t("about_pathweg")}
            </h3>
            <p className="text-gray-300 text-center lg:text-left">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              {t("quick_links")}
            </h3>
            <nav className="flex flex-col items-center gap-3">
              <Link href="/" className="hover:text-gray-300 transition-colors">
                {t("links.home")}
              </Link>
              <Link
                href="/equipo"
                className="hover:text-gray-300 transition-colors"
              >
                {t("links.team")}
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center lg:items-end">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              Conecta con Nosotros
            </h3>
            <div className="flex gap-6 mt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="transition-transform hover:scale-110 hover:text-gray-300"
                  >
                    <Icon size={28} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar with copyright and policies */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-3 md:mb-0">{t("rights")}</p>
          <div className="flex gap-6">
            <Link
              href="/cookies"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t("cookie_policy")}
            </Link>
            <Link
              href="/privacidad"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t("privacy_policy")}
            </Link>
            <Link
              href="/terminos"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t("terms_conditions")}
            </Link>
            <Link
              href="/aviso-legal"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {t("legal_notice")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
