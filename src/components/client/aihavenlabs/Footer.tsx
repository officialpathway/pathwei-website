// components/Footer/MainFooter.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const FooterContent = () => {
  const t = useTranslations('aihavenlabs.footer');
  
  // Animation variants for better organization
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Navigation links data with types for TypeScript
  interface NavLink {
    href: string;
    label: string;
  }
  
  const navLinks: NavLink[] = [
    { href: "/", label: `${t("home")}` },
    { href: "/suite", label: `${t("suite")}` },
    { href: "/team", label: `${t("team")}` },
    { href: "/suite/pathway", label: "Pathway" }
  ];

  // Social media links data
  interface SocialLink {
    platform: string;
    handle: string;
    href: string;
  }

  const socialLinks: SocialLink[] = [
    { platform: "TikTok", handle: "@pathwayapp", href: "https://www.tiktok.com/@pathwayapp" },
    { platform: "Instagram", handle: "@pathway.app", href: "https://www.instagram.com/pathway.app" },
    { platform: "LinkedIn", handle: "Pathway", href: "https://www.linkedin.com/company/pathway-ai-haven-labs" },
    { platform: "Email", handle: "officialpathwayapp@gmail.com", href: "mailto:officialpathwayapp@gmail.com" }
  ];

  // Simple link renderer with proper TypeScript types
  const renderNavLink = (link: NavLink) => {    
    return (
      <div key={link.label} className="px-4 md:px-6 py-2">
        <Link 
          href={link.href} 
          className="group block text-white/70 hover:text-white transition-colors py-1"
        >
          <span className="inline-block">{link.label}</span>
          <span className="block h-0.5 w-0 bg-sky-400 transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </div>
    );
  };

  // Social link renderer
  const renderSocialLink = (link: SocialLink) => {
    return (
      <motion.div 
        key={link.platform}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-3"
      >
        <span className="text-sky-400 text-sm mr-2">{link.platform}:</span>
        <a href={link.href} className="text-white/70 hover:text-white transition-colors">
          {link.handle}
        </a>
      </motion.div>
    );
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full bg-slate-900 text-white overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(56,189,248,0.03)_0%,rgba(255,255,255,0)_60%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(99,102,241,0.03)_0%,rgba(255,255,255,0)_60%)]"></div>
      
      {/* Enhanced top accent line with animation */}
      <motion.div 
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/30 to-transparent origin-left"
      ></motion.div>
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-20">
        {/* Main Title with enhanced styling */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-wide text-white">
            SYMBIOSYS
          </h2>
          <div className="h-px w-24 bg-sky-400/80 mt-4"></div>
        </motion.div>

        {/* Navigation - Now centered and expanded */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center w-full">
            {navLinks.map(renderNavLink)}
          </div>
        </div>
        
        {/* Social Media Section - NEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-xl font-light text-white mb-6 flex items-center">
            <span className="mr-3">CONNECT WITH US</span>
            <div className="flex-grow h-px bg-gradient-to-r from-sky-400/30 to-transparent"></div>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {socialLinks.map(renderSocialLink)}
          </div>
        </motion.div>

        {/* Bottom Bar with enhanced styling */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-white/50 text-sm"
            >
              © 2025 AI HAVEN LABS
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-4 md:mt-0 flex items-center gap-6"
            >
              <Link href="/suite/pathway/policy" className="group block text-white/60 hover:text-sky-400 transition-colors duration-300 text-sm">
                Privacy Policy
                <span className="block h-px w-0 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/suite/pathway/terms" className="group block text-white/60 hover:text-sky-400 transition-colors duration-300 text-sm">
                Terms of Service
                <span className="block h-px w-0 bg-gradient-to-r from-sky-400 to-indigo-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute bottom-24 left-10 w-32 h-32 rounded-full bg-sky-500/5 blur-3xl"></div>
      <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl"></div>
    </motion.div>
  );
};

export const MainFooter = () => {
  return (
    <footer className="w-full">
      <FooterContent />
    </footer>
  );
};