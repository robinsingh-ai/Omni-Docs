import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import {Button} from '../ui/button';

const Contact: React.FC = () => (
  <div className="max-w-4xl mx-auto text-center pb-32">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-800/50 p-8 rounded-xl border border-gray-700"
    >
      <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
      <p className="text-gray-300 mb-8">Have questions? Our team is here to help!</p>
      <Button className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium">
        Contact Sales
      </Button>
      <Button className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-full font-medium">
        Schedule Demo
      </Button>
    </motion.div>
  </div>
);

export default Contact;