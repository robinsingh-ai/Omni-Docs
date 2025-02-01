import React from 'react';
import { motion } from 'framer-motion';
import {Button} from '../ui/button';
import { ArrowRight } from 'lucide-react';

const ChatPreview: React.FC = () => (
  <div className="my-32">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="relative rounded-xl overflow-hidden shadow-2xl"
    >
      <img
        src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=2000&q=80"
        alt="AI Chat Interface"
        className="w-full h-[500px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Customer Experience?</h2>
        <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2">
          Get Started Now <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  </div>
);

export default ChatPreview;
