import React from 'react';
import Navigation from '../../components/landing/Navigation';
import HeroSection from '../../components/landing/HeroSection';
import FeatureCards from '../../components/landing/FeatureCards';
import VideoDemo from '../../components/landing/VideoDemo';
import Testimonials from '../../components/landing/Testimonials';
import Pricing from '../../components/landing/Pricing';
import ChatPreview from '../../components/landing/ChatPreview';
import Contact from '../../components/landing/Contact';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navigation />
      <main className="container mx-auto px-6 pt-20">
        <HeroSection />
        <FeatureCards />
        <VideoDemo />
        <Testimonials />
        <Pricing />
        <ChatPreview />
        <Contact />
      </main>
    </div>
  );
}

export default LandingPage;
