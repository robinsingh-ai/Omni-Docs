import React from 'react';
import Navigation from '../../components/landingcomponents/Navigation';
import HeroSection from '../../components/landingcomponents/HeroSection';
import FeatureCards from '../../components/landingcomponents/FeatureCards';
import VideoDemo from '../../components/landingcomponents/VideoDemo';
import Testimonials from '../../components/landingcomponents/Testimonials';
import Pricing from '../../components/landingcomponents/Pricing';
import ChatPreview from '../../components/landingcomponents/ChatPreview';
import Contact from '../../components/landingcomponents/Contact';

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
