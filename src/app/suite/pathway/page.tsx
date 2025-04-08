import Hero from './components/Hero';
import SloganSection from './components/SloganSection';
import BentoGrid from './components/BentoGrid';
import Features from './components/Features';
import FeedbackSection from './components/FeedbackSection';
import Footer from './components/Footer';
import DotFollower from './components/DotFollower';
import { CyberpunkHeader } from '../../components/Header/CyberpunkHeader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden w-full">
      <CyberpunkHeader />
      <DotFollower />
      <main className="flex-grow w-full overflow-x-hidden">
        <Hero />
        <SloganSection />
        <BentoGrid />
        <Features />
        <FeedbackSection />
      </main>
      <Footer />
    </div>
  );
}