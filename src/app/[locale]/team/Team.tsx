'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { teamMembers } from "@/lib/constants";
import { useTranslations } from 'next-intl';

// Define a type for team member
type TeamMember = {
  name: string;
  role: string;
  color: string;
  imgSrc: string;
  status?: string;
  specialty?: string;
  bio: string;
  connections?: string[];
};

export function TeamSection() {
  // Get the translator for the aihavenlabs namespace
  const t = useTranslations('aihavenlabs');
  
  // Call the teamMembers function with the translator to get the array
  const teamMembersArray = teamMembers(t);

  // Define social links with proper typing
  const socialLinks: Record<string, string> = {
    'Alvaro Rios': 'https://www.linkedin.com/in/%C3%A1lvaro-r%C3%ADos-rodr%C3%ADguez-0a3ab6260/',
    'Rayan Chairi': 'https://www.linkedin.com/in/rayan-chairi-ben-yamna-boulaich-026605293/',
    'Maria Victoria Sanchez': 'https://www.linkedin.com/in/mar%C3%ADa-victoria-s%C3%A1nchez-738b71339/'
  };

  return (
    <section className="relative w-full py-16">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header with animated gradient text */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
              {t('team.title')}
            </span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            {t('team.description')}
          </p>
        </div>

        {/* Team Cards Grid - Improved readability */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembersArray.map((member: TeamMember, index: number) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                boxShadow: `0 0 20px ${getGlowColor(member.color, 0.5)}`,
              }}
              className="bg-purple-950/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20"
              style={{
                boxShadow: `0 0 10px ${getGlowColor(member.color, 0.2)}`,
              }}
            >
              {/* Member Image */}
              <div className="h-56 bg-gray-900 relative overflow-hidden">
                <Image
                  src={member.imgSrc}
                  alt={member.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-950 to-transparent" />
                
                {/* Status badge */}
                <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-orange-500/80 text-white font-medium shadow-md">
                  {member.status || 'Founder'}
                </span>
              </div>
              
              {/* Content - Improved for readability */}
              <div className="p-6 bg-purple-950/40">
                <h3 className="text-white text-xl font-bold mb-1">
                  {member.name}
                </h3>
                <p className="text-orange-300 text-sm font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                  {member.bio}
                </p>
                
                {/* Contributions list - Improved contrast */}
                {member.connections && (
                  <div className="mt-4 bg-purple-900/30 p-3 rounded-lg">
                    <h4 className="text-orange-300 text-sm font-medium mb-2">
                      {t("team.card.contributions")}:
                    </h4>
                    <ul className="space-y-2">
                      {(Array.isArray(member.connections) ? member.connections : []).map((connection, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2 text-orange-400 font-bold">→</span>
                          <span className="text-white/90 text-sm">
                            {connection}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer - Improved contrast */}
              <div className="px-6 py-3 border-t border-white/10 bg-orange-500/10 text-center">
                <a 
                  href={socialLinks[member.name] || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block w-full py-2 text-sm font-medium text-orange-300 hover:text-orange-200 transition-colors"
                >
                  {t('team.card.connect')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Helper function for glow colors using orange tones
// Reduced purple glow and enhanced orange/amber
function getGlowColor(color: string, opacity: number = 1) {
  const colors: Record<string, string> = {
    cyan: `rgba(255, 156, 0, ${opacity})`,     // Orange
    pink: `rgba(255, 128, 0, ${opacity})`,     // Darker orange
    purple: `rgba(245, 158, 11, ${opacity})`,  // Amber
    green: `rgba(255, 175, 25, ${opacity})`,   // Light orange
    blue: `rgba(249, 115, 22, ${opacity})`,    // Deep orange
    yellow: `rgba(255, 190, 0, ${opacity})`    // Golden yellow
  };
  return colors[color] || colors.cyan;
}