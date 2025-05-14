// components/TeamSection.jsx
"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import TeamMemberCard from './TeamMemberCard';
import CurvedBorder from './CurvedBorder';

const TeamSection = () => {
  const t = useTranslations('Pathway.team');
  
  // Team members data
  const teamMembers = [
    {
      id: 1,
      imgSrc: "/images/team_members/ceo.png",
      name: t('members.0.name'),
      role: t('members.0.role'),
      description: t('members.0.description'),
      linkedinUrl: "https://www.linkedin.com/in/%C3%A1lvaro-r%C3%ADos-rodr%C3%ADguez-0a3ab6260/",
    },
    {
      id: 2,
      imgSrc: "/images/team_members/cto.jpeg",
      name: t('members.1.name'),
      role: t('members.1.role'),
      description: t('members.1.description'),
      linkedinUrl: "https://www.linkedin.com/in/rayan-chairi-ben-yamna-boulaich-026605293/",
    },
    {
      id: 3,
      imgSrc: "/images/team_members/cmo.jpeg",
      name: t('members.2.name'),
      role: t('members.2.role'),
      description: t('members.2.description'),
      linkedinUrl: "https://www.linkedin.com/in/mar%C3%ADa-victoria-s%C3%A1nchez-738b71339/",
    }
  ];
  
  return (
    <section className='bg-gradient-to-br from-indigo-50 to-purple-50 pt-10'>
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
            <div className="mt-6 w-20 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard
                key={member.id}
                imgSrc={member.imgSrc}
                name={member.name}
                role={member.role}
                description={member.description}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </div>
        </div>
      </div>

      <CurvedBorder fillColor='fill-black' />
    </section>
  );
};

export default TeamSection;