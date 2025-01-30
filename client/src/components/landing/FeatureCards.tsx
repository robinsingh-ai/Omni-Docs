import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    title: "Natural Conversations",
    description: "Experience human-like interactions with advanced language processing"
  },
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    title: "Lightning Fast",
    description: "Get instant responses powered by state-of-the-art AI technology"
  },
  {
    icon: <Shield className="w-6 h-6 text-blue-400" />,
    title: "Secure & Private",
    description: "Your conversations are encrypted and completely private"
  }
];

const FeatureCards: React.FC = () => (
  <div className="grid md:grid-cols-3 gap-8 mt-20">
    {features.map((feature, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 + index * 0.2 }}
        className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-lg border border-gray-700"
      >
        <div className="bg-gray-700/50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          {feature.icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
        <p className="text-gray-400">{feature.description}</p>
      </motion.div>
    ))}
  </div>
);

export default FeatureCards;
