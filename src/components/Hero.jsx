import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Terminal as TerminalIcon } from 'lucide-react'; 
import profilePic from '../assets/Landing_Photo.png';

// Data within the terminal 
const bootSequence = [
  "> Initializing Portfolio.exe...",
  "> Loading data points... [OK]",
  "> Importing nodes... [OK]",
  "> Portfolio ready."
];

// ACTUARIAL MATRIX BACKGROUND 
const MatrixBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      // Added fallback to window dimensions if parent is not yet computed
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    const matrixSymbols = ['μ', 'σ²', 'VaR', 'E[X]', 'p(x)', 'λ', 'ρ', 'β', '∑', '∫', 'd/dt', '0.0034', '1.09', 'N(0,1)'];
    const particles = [];
    const numParticles = Math.floor((canvas.width * canvas.height) / 1000); 

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        symbol: matrixSymbols[Math.floor(Math.random() * matrixSymbols.length)],
        speedY: Math.random() * 0.2 + 0.05, 
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '10px monospace';

      particles.forEach(p => {
        p.y -= p.speedY;
        
        // BUG FIX: Added boundary checks for both Y and X axes to handle window resizing properly
        if (p.y < 0) p.y = canvas.height;
        if (p.x > canvas.width) p.x = Math.random() * canvas.width; 
        
        ctx.fillStyle = `rgba(148, 163, 184, ${p.opacity})`;
        ctx.fillText(p.symbol, p.x, p.y);
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
      aria-hidden="true" // Added for accessibility
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
    />
  );
};

// FRAMER MOTION VARIANTS
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -50 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  },
};

const catchphraseVariants = {
  hidden: { opacity: 0, y: -120 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
  },
};


// THE MAIN HERO SECTION
export default function Hero() {
  const [bootStep, setBootStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (bootStep < bootSequence.length) {
      const timer = setTimeout(() => setBootStep(prev => prev + 1), 600);
      return () => clearTimeout(timer);
    } else if (bootStep === bootSequence.length && !isExpanded) {
      const expandTimer = setTimeout(() => setIsExpanded(true), 800);
      return () => clearTimeout(expandTimer);
    }
  }, [bootStep, isExpanded]);

  return (
    <div className="min-h-screen w-full bg-[#0a0f1c] flex flex-col pt-20 md:pt-0 overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* THE TERMINAL */}
      <motion.div
        layout 
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className={`flex flex-col relative z-20 ${
          isExpanded
            ? "w-full min-h-screen" 
            : "w-11/12 max-w-2xl h-75 mx-auto mt-32 rounded-lg border border-cyan-500/30 bg-slate-900/50 shadow-[0_0_40px_rgba(6,182,212,0.1)]" 
        }`}
      >
        {/* Terminal Window */}
        {!isExpanded && (
          <>
            <div className="flex items-center px-4 py-3 border-b border-cyan-500/20 bg-slate-950/50">
              <TerminalIcon size={14} className="text-cyan-500 mr-2" />
              <span className="text-xs font-mono text-slate-500">root@brian-chege:~</span>
            </div>

            <div className="p-6 font-mono text-sm md:text-base absolute inset-0 z-30 pt-12">
              {bootSequence.slice(0, bootStep).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-3 ${i === bootSequence.length - 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}`}
                >
                  {line}
                </motion.div>
              ))}
              {!isExpanded && bootStep < bootSequence.length && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-3 h-5 bg-cyan-500 mt-2 inline-block"
                />
              )}
            </div>
          </>
        )}

        {/* THE HERO SECTION */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full h-full flex flex-col md:flex-row pt-20 md:pt-0"
          >
            
            {/* PHOTO PLACEHOLDER */}
            <motion.div
              initial={{ x: "100vw", opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.4, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className="w-full md:w-[30%] min-h-[60vh] md:min-h-screen bg-slate-900/40 relative flex items-center justify-center p-6 sm:p-10 md:p-8 lg:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800 z-30"
              >
                
                <div className="relative group overflow-hidden shadow-2xl rounded-2xl border border-slate-700 bg-slate-800/50 w-full max-w-sm mx-auto aspect-4/5 md:max-w-none md:mx-0 md:aspect-auto md:w-full md:h-[70vh]"> 
                    <img 
                        src={profilePic} 
                        alt="Brian Chege - Actuarial Data Scientist" 
                        className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
                    />

                    <div className="absolute bottom-4 left-4 font-mono text-xs text-slate-400 p-2 bg-slate-950/80 backdrop-blur-sm rounded-md border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        B.CHEGE
                    </div>

                </div>
            </motion.div>

            {/* TEXT SECTION WITH MATRIX */}
            <div className="relative w-full md:w-[70%] min-h-[60vh] md:min-h-screen flex items-center justify-start p-8 md:p-16 lg:px-24 overflow-hidden border-t md:border-t-0 border-slate-800">
                
              {/* Matrix Background nested behind text */}
              <MatrixBackground />

              {/* Staggered Intro Text Layer */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-3xl space-y-12"
              >
                <div className="flex flex-col">
                  <motion.p variants={itemVariants} className="font-mono text-[#e83e8c] tracking-[0.2em] text-sm font-bold uppercase mb-2">
                    HELLO, I'M
                  </motion.p>
                  
                  <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif font-bold text-white tracking-tight leading-none mb-4 whitespace-nowrap">
                    Brian Chege
                  </motion.h1>
                  
                  <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-slate-400 mb-8 font-light">
                    Actuarial Analyst & Data Scientist
                  </motion.h2>
                </div>

                {/* Catchphrase */}
                <motion.p variants={catchphraseVariants} className="text-slate-300 text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mb-12">
                  Not just analyzing the risk, I engineer the prediction
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block ml-3 animate-pulse"></span>
                </motion.p>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 pt-4">
                  
                  <a 
                    href="#work"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-semibold transition-colors"
                  >
                    View My Work
                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </a>
                  
                  <a 
                    href="/Brian_Chege_CV.pdf" 
                    download="Brian_Chege_CV.pdf"
                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-lg font-semibold transition-colors"
                  >
                    Download CV
                    <Download size={20} className="ml-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </a>

                </motion.div>
              </motion.div>
            </div>

          </motion.div>
        )}
      </motion.div>

    </div>
  );
}