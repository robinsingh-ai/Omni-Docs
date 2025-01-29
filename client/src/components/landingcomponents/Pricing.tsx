import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {Button} from '../ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Starter",
    price: "Free",
    features: ["1,000 messages/month", "Basic AI responses", "Email support"],
    highlighted: false
  },
  {
    name: "Pro",
    price: "$29/month",
    features: ["50,000 messages/month", "Advanced AI capabilities", "Priority support", "Custom training"],
    highlighted: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited messages", "Dedicated support", "Custom integration", "SLA guarantee"],
    highlighted: false
  }
];

const Pricing: React.FC = () => {
  const pricingRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pricingRef,
    offset: ["start end", "end start"]
  });

  const pricingY = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div
      ref={pricingRef}
      style={{ y: pricingY }}
      className="my-32"
    >
      <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`
              p-8 rounded-xl border ${plan.highlighted 
                ? 'bg-blue-600 border-blue-400' 
                : 'bg-gray-800/50 border-gray-700'
              }
            `}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold mb-6">{plan.price}</p>
            <ul className="space-y-4">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className={`mt-8 w-full py-2 rounded-full font-medium ${plan.highlighted ? 'bg-white text-blue-600' : 'bg-blue-500 text-white'}`}>
              Get Started
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Pricing;