import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    content: "AIChat has revolutionized how we handle customer support. The responses are incredibly natural and accurate.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Michael Chen",
    role: "Tech Lead",
    content: "The integration was seamless, and the AI's understanding of context is impressive. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const Testimonials: React.FC = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "end start"]
  });

  const testimonialsY = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div
      ref={testimonialsRef}
      style={{ y: testimonialsY }}
      className="my-32"
    >
      <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-gray-800/50 p-8 rounded-xl border border-gray-700"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-300">{testimonial.content}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Testimonials;
