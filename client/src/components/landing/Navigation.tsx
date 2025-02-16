import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

const Navigation: React.FC = () => (
  <nav className="container mx-auto px-6 py-6 sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg">
    <div className="flex items-center justify-between">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-blue-400" />
        <span className="text-xl font-bold">AI Chat</span>
      </motion.div>
      {/* <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-medium">
        Get Started
      </Button> */}
    </div>
  </nav>
);

export default Navigation;