'use client';
import { CyberpunkCard } from "@/app/components/common/Card";

export function TeamSection() {
  const teamMembers = [
    {
      name: "Alvaro Rios",
      role: "Chief Executive Officer",
      color: "cyan",
      specialty: "STRATEGIC SYNTHESIS",
      imgSrc: "/images/team/ceo.jpg"
    },
    {
      name: "Rayan Chairi",
      role: "Chief Technology Officer",
      color: "pink",
      specialty: "NEURAL OPTIMIZATION",
      imgSrc: "/images/team/cto.jpg"
    },
    {
      name: "Dudinha Sena Barra",
      role: "Chief Marketing Officer",
      color: "purple",
      specialty: "COGNITIVE ADOPTION",
      imgSrc: "/images/team/duda.jpg"
    }
  ];

  return (
    <section className="relative py-20 bg-black overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white glitch-text" data-text="NEURAL_CORE">
            AI HAVEN LABS
          </h2>
          <p className="text-neon-cyan font-mono text-lg">
            {`> MEET THE ARCHITECTS OF TOMORROW`}
          </p>
        </div>

        {/* Team cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <CyberpunkCard
              key={index}
              name={member.name}
              role={member.role}
              imgSrc={member.imgSrc}
              color={member.color as 'cyan' | 'pink' | 'purple'}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-block px-6 py-2 border border-neon-purple/50">
            <p className="text-gray-400 font-mono text-sm">
              {`> ENGINEERING HUMAN-AI SYMBIOSIS SINCE 2025`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}