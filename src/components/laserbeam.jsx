import { motion } from 'framer-motion';

// ---------------------------------------------------------------------------

// Actuarial symbols that burst outward from the spike point.
// Each symbol is assigned a direction (left or right) and a random
// trajectory so no two bursts look identical.
const ALL_SYMBOLS = ['μ', 'σ²', '∑', 'λ', 'β', 'ρ', 'E[X]', 'VaR', 'N(0,1)', 'p(x)', '∫', 'dF/dx'];

// Generates a deterministic-feeling but varied burst pattern.
// index drives the direction (even = left, odd = right).
// spreadX and spreadY are randomised once at module level so they
// don't change on re-renders — stable values, no flicker.
const BURST_CONFIG = ALL_SYMBOLS.map((symbol, i) => ({
  symbol,
  x: (i % 2 === 0 ? -1 : 1) * (55 + (i * 13) % 60),
  y: -80 + (i * 23) % 160,
  delay: 1.05 + (i * 0.035),
}));

// The EKG SVG path.
const EKG_PATH = "M40 0 L40 360 L40 380 L15 410 L65 450 L40 480 L40 900";

export default function LaserSeam() {
  // Detect mobile to halve the symbol count — keeps burst readable on small screens.
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
  const symbols = isMobile ? BURST_CONFIG.filter((_, i) => i % 2 === 0) : BURST_CONFIG;

  return (
    <motion.div
      key="laser-seam"
      className="absolute left-1/2 top-0 z-210 -translate-x-1/2"
      style={{ width: '80px', height: '100%', overflow: 'visible' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      {/* ----------------------------------------------------------------
          SVG LAYER — EKG path + glow filter
      ---------------------------------------------------------------- */}
      <svg
        width="80"
        height="100%"
        viewBox="0 0 80 900"
        preserveAspectRatio="none"
        overflow="visible"
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <defs>
          {/* Glow filter — gives the EKG line the cyan neon look. */}
          <filter id="ekg-glow" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Brighter glow specifically for the spike segment */}
          <filter id="spike-glow" x="-100%" y="-50%" width="300%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main EKG trace */}
        <motion.path
          d={EKG_PATH}
          stroke="#22d3ee"
          strokeWidth="1.5"
          fill="none"
          filter="url(#ekg-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity:    [0, 1, 1, 1, 0],
          }}
          transition={{
            pathLength: { duration: 1.2, delay: 0.8, ease: 'easeInOut' },
            opacity:    { duration: 1.8, delay: 0.8, times: [0, 0.1, 0.5, 0.8, 1] },
          }}
        />

        {/* Spike highlight */}
        <motion.path
          d="M40 380 L15 410 L65 450 L40 480"
          stroke="#ffffff"
          strokeWidth="1"
          fill="none"
          filter="url(#spike-glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity:    [0, 1, 0],
          }}
          transition={{
            pathLength: { duration: 0.3, delay: 1.3, ease: 'easeOut' },
            opacity:    { duration: 0.5, delay: 1.3, times: [0, 0.4, 1] },
          }}
        />

        {/* Baseline pulse dot */}
        <motion.circle
          cx="40"
          r="2.5"
          fill="#22d3ee"
          filter="url(#ekg-glow)"
          initial={{ cy: 0, opacity: 0 }}
          animate={{
            cy:      [0, 360, 480, 900],
            opacity: [0, 1,   1,   0  ],
          }}
          transition={{
            cy:      { duration: 1.2, delay: 0.8, ease: 'easeInOut', times: [0, 0.4, 0.55, 1] },
            opacity: { duration: 1.2, delay: 0.8, times: [0, 0.05, 0.9, 1] },
          }}
        />
      </svg>

      {/* SYMBOL BURST LAYER*/}
      {symbols.map(({ symbol, x, y, delay }, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{
            position:   'absolute',
            left:       '50%',
            top:        '45%',
            fontFamily: 'monospace',
            fontSize:   '11px',
            color:      i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#7c3aed' : '#a5f3fc',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            x:       [0, x * 0.4, x],
            y:       [0, y * 0.4, y],
            opacity: [0, 1,       0],
            scale:   [0.5, 1.2,   0.8],
          }}
          transition={{
            duration: 0.7,
            delay,
            ease: 'easeOut',
            times: [0, 0.3, 1],
          }}
        >
          {symbol}
        </motion.span>
      ))}

      {/* FLASH OVERLAY */}
      <motion.div
        aria-hidden="true"
        style={{
          position:        'absolute',
          top:             0,
          left:            '50%',
          transform:       'translateX(-50%)',
          width:           '2px',
          height:          '100%',
          background:      '#ffffff',
          pointerEvents:   'none',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0] }}
        transition={{ duration: 0.2, delay: 1.3, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
