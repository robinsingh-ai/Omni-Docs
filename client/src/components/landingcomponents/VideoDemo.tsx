import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const VideoDemo: React.FC = () => {
    const videoRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"]
  });

  const videoOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
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
  );
};

export default VideoDemo;
