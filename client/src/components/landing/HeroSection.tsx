import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => (
  <div className="max-w-4xl mx-auto text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-5xl md:text-6xl font-bold mb-6"
    >
      Experience the Future of <span className="text-blue-400">AI Conversations</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-xl text-gray-300 mb-12"
    >
      Engage with our advanced AI chatbot powered by cutting-edge technology.
      Get instant responses, smart suggestions, and human-like interactions.
    </motion.p>
    <div className="flex justify-center space-x-4"> {/* Flex container for buttons */}
      <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium flex items-center space-x-2">
        Login <ArrowRight className="w-4 h-4" />
      </Button>
      <Button className="text-gray-300 hover:text-white px-8 py-3">
        Sign Up
      </Button>
    </div>
  </div>
);

export default HeroSection;
