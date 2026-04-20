import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// THE DATA SWARM CANVAS ENGINE
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 1500);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() > 0.95 ? Math.random() * 2.5 + 1.5 : Math.random() * 1.2 + 0.2,
        speedY: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speedY;
        if (p.y < 0) p.y = canvas.height;
        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
    />
  );
};

// --- FRAMER MOTION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// --- MAIN COMPONENT ---
export default function SplashScreen({ onInitialize }) {
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSequenceStart = () => {
    setIsUnlocking(true);
    // Tell the main App.jsx to load the website after 1.5 seconds (while the doors are shut)
    setTimeout(() => {
      onInitialize();
    }, 1500); 
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0a0f1c] overflow-hidden">
      
      {/* --- THE AIRLOCK SHUTTERS --- */}
      <AnimatePresence>
        {isUnlocking && (
          <>
            {/* Left Shutter */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute left-0 top-0 w-1/2 h-full bg-slate-950 z-200 border-r border-cyan-500/30"
            />
            {/* Right Shutter */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute right-0 top-0 w-1/2 h-full bg-slate-950 z-200 border-l border-cyan-500/30"
            />
            {/* The Laser Flash */}
            <motion.div 
              initial={{ height: "0%", opacity: 0 }}
              animate={{ height: "100%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, delay: 0.8, ease: "linear" }}
              className="absolute left-1/2 top-0 w-0.5 bg-cyan-400 shadow-[0_0_20px_#22d3ee] z-210 -translate-x-1/2"
            />
          </>
        )}
      </AnimatePresence>

      {/* --- THE BACKGROUND LAYER --- */}
      <motion.div 
        animate={{ opacity: isUnlocking ? 0 : 1 }} 
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full"
      >
        <ParticleBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent60%)] pointer-events-none" />
      </motion.div>

      {/* --- THE CONTENT LAYER --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isUnlocking ? "hidden" : "visible"}
        className="relative z-10 text-center space-y-10 max-w-4xl px-6"
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
          Actuarial Logic. <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
            Algorithmic Scale.
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-slate-300 text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mx-auto">
          Risk is just an equation waiting for a framework. I thus strive to build automated systems that compile tomorrow, today.
        </motion.p>
        
        <motion.div variants={itemVariants} className="pt-4">
          <button 
            onClick={handleSequenceStart} 
            className="group relative px-10 py-4 bg-transparent text-cyan-400 font-mono text-sm font-bold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <div className="absolute inset-0 border border-cyan-500/50 group-hover:border-cyan-400 transition-colors duration-300" />
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-3">
              Initialize Portfolio
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </span>
          </button>
        </motion.div>
      </motion.div>

    </div>
  );
}