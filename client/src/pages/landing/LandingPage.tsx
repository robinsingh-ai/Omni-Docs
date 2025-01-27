import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Bot, MessageSquare, Zap, Shield, ArrowRight, Star, Check, Users, Mail } from 'lucide-react';

function App() {
  const videoRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: videoProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: testimonialsProgress } = useScroll({
    target: testimonialsRef,
    offset: ["start end", "center center"]
  });

  const { scrollYProgress: pricingProgress } = useScroll({
    target: pricingRef,
    offset: ["start end", "center center"]
  });

  const videoOpacity = useTransform(videoProgress, [0, 0.5, 1], [0, 1, 0]);
  const videoScale = useTransform(videoProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const testimonialsY = useTransform(testimonialsProgress, [0, 1], [100, 0]);
  const pricingY = useTransform(pricingProgress, [0, 1], [100, 0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <nav className="container mx-auto px-6 py-6 sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <Bot className="w-8 h-8 text-blue-400" />
            <span className="text-xl font-bold">AIChat</span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-full font-medium"
          >
            Get Started
          </motion.button>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20">
        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Experience the Future of
            <span className="text-blue-400"> AI Conversations</span>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium flex items-center space-x-2"
            >
              <span>Try for Free</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button className="text-gray-300 hover:text-white px-8 py-3">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {[
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
          ].map((feature, index) => (
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

        {/* Video Demo Section */}
        <motion.div
          ref={videoRef}
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="my-32 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">See AIChat in Action</h2>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://cdn.coverr.co/videos/coverr-typing-on-a-computer-keyboard-1559/1080p.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          ref={testimonialsRef}
          style={{ y: testimonialsY }}
          className="my-32"
        >
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
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
            ].map((testimonial, index) => (
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
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div
          ref={pricingRef}
          style={{ y: pricingY }}
          className="my-32"
        >
          <h2 className="text-3xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
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
            ].map((plan, index) => (
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    mt-8 w-full py-2 rounded-full font-medium ${plan.highlighted
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500 text-white'
                    }
                  `}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Preview Section */}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Contact Section */}
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
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-full font-medium"
              >
                Contact Sales
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-full font-medium"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;