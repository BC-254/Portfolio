import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LaserSeam from '../components/laserbeam'; 


// CONSTANTS — defined outside the component to prevent re-instantiation on every render. 
const PARTICLE_DENSITY_DIVISOR = 1500; // px² per particle
const PARTICLE_CAP = 120;              // hard ceiling — prevents 4K overload

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// PARTICLE BACKGROUND
// Runs on a single <canvas> element. 
const ParticleBackground = React.memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect the user's OS reduced-motion preference (WCAG 2.1 SC 2.3.3)
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize handler that updates canvas dimensions to match the viewport.
    // Defined inside useEffect so it closes over canvas/ctx without becoming a stale reference on re-renders.
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Particle pool which is capped at PARTICLE_CAP regardless of screen size.
    const count = Math.min(
      Math.floor((canvas.width * canvas.height) / PARTICLE_DENSITY_DIVISOR),
      PARTICLE_CAP
    );

    const particles = Array.from({ length: count }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      // 5% of particles are large bright dots; rest are tiny.
      size:    Math.random() > 0.95
                 ? Math.random() * 2.5 + 1.5
                 : Math.random() * 1.2 + 0.2,
      speedY:  Math.random() * 0.3 + 0.05,
      opacity: Math.random() * 0.7 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y -= p.speedY;

        // Wrap vertically; particle reappears at the bottom when it exits top.
        if (p.y < 0) p.y = canvas.height;

        // Wrap horizontally; guards against stale x values after a resize.
        if (p.x > canvas.width) p.x = Math.random() * canvas.width;

        ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cancelling the animation loop and removes the resize listener when the component unmounts, preventing memory leaks.
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array — canvas setup runs once on mount only.

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
    />
  );
});

ParticleBackground.displayName = 'ParticleBackground';

// SPLASH SCREEN
export default function SplashScreen({ onInitialize }) {
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Stable handler — useCallback prevents unnecessary re-renders of children that receive this as a prop if this component ever gains child components.
  const handleSequenceStart = useCallback(() => {
    if (isUnlocking) return; // Guard: ignore calls after the first click.
    setIsUnlocking(true);
  }, [isUnlocking]);

  
  useEffect(() => {
    if (!isUnlocking) return;

    const timer = setTimeout(() => {
      onInitialize();
    }, 2600);

    return () => clearTimeout(timer);
  }, [isUnlocking, onInitialize]);

  return (
    <div
      className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#0a0f1c] overflow-hidden"
      // Announces the transition to screen readers when unlocking starts.
      role="status"
      aria-live="polite"
      aria-label={isUnlocking ? 'Loading portfolio...' : 'Portfolio splash screen'}
    >

      {/* AIRLOCK SHUTTERS */}
      <AnimatePresence>
        {isUnlocking && (
          <>
            {/* Left shutter — slides in from the left, stays closed on exit */}
            <motion.div
              key="shutter-left"
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute left-0 top-0 w-1/2 h-full bg-slate-950 z-200 border-r border-cyan-500/30"
            />

            {/* Right shutter — slides in from the right, stays closed on exit */}
            <motion.div
              key="shutter-right"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '0%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="absolute right-0 top-0 w-1/2 h-full bg-slate-950 z-200 border-l border-cyan-500/30"
            />
            <LaserSeam />
          </>
        )}
      </AnimatePresence>

      {/* BACKGROUND LAYER
          Fades out when unlocking begins so the shutters close over*/}
      <motion.div
        animate={{ opacity: isUnlocking ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 w-full h-full"
      >
        <ParticleBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none" />
      </motion.div>

      {/* Animates back to "hidden" when isUnlocking is true, so the headline fades out as the shutters close. */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isUnlocking ? 'hidden' : 'visible'}
        className="relative z-10 text-center space-y-10 max-w-4xl px-6"
      >
        {/* Making h1 always present in the DOM (not gated behind a state condition) so search engines and screen readers see it immediately,
            not after a JavaScript delay. SEO and accessibility requirement. */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]"
        >
          Actuarial Logic.{' '}
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-600">
          Algorithmic Scale.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-slate-300 text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mx-auto"
        >
          I don&#39;t just model risk; I engineer comprehensive systems and solutions. <br></br>
          
        </motion.p>

        <motion.div variants={itemVariants} className="pt-4">
          {/* FIX: disabled={isUnlocking} prevents double-click from calling
              handleSequenceStart twice, setting two competing timeouts, and
              calling onInitialize() twice. The guard inside handleSequenceStart
              is a second layer of defence — both are needed. */}
          <button
            onClick={handleSequenceStart}
            disabled={isUnlocking}
            aria-label="Initialize portfolio and enter the site"
            className="group relative px-10 py-4 bg-transparent text-cyan-400 font-mono text-sm font-bold tracking-[0.2em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <div className="absolute inset-0 border border-cyan-500/50 group-hover:border-cyan-400 transition-colors duration-300" />
            <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative flex items-center justify-center gap-3">
              {isUnlocking ? 'Initializing...' : 'Initialize Portfolio'}
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
