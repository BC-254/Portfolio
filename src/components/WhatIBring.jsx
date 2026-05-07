import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

// The Skills and descriptions
const SKILLS = [
  {
    id:          'actuarial',
    label:       'Actuarial Science',
    title:       'Risk Analysis & Financial Reporting',
    color:       '#4a8fe8',
    rgb:         '74, 143, 232',
    ambientBg:   '#04081a',
    description: 'I proactively identify and evaluate potential vulnerabilities by combining data-driven insights with cross-functional feedback. This ensures my mitigation strategies are equitable, accessible and protect the well-being of the client',
    tools:       ['Hypothesis testing', 'R', 'Product Development & Pricing', 'Lifetimes', 'GLMs', 
                    'Cox PH', 'Regulatory Compliance and Reporting', 'Cashflow Modelling'],
  },
  {
    id:          'datascience',
    label:       'Data Science',
    title:       'Predictive Modeling and Machine Learning',
    color:       '#00d4c0',
    rgb:         '0, 212, 192',
    ambientBg:   '#021614',
    description: "I engineer robust machine learning pipelines by meticulously cleaning complex datasets, engineering their features and architecting advanced models. This ensures the algorithms I train are not only structurally sound and highly accurate but also optimized for scalable automation.",
    tools:       ['Python', 'XGBoost', 'Pandas', 'SQL', 'Scikit-learn', 'TensorFlow', 'Natural Language Processing (NLP)', 'Model Deployment', 'RAG Models'],
  },
  {
    id:          'analytics',
    label:       'Analytics',
    title:       'Data Storytelling',
    color:       '#f0922b',
    rgb:         '240, 146, 43',
    ambientBg:   '#160900',
    description: 'Numbers only matter when people understand them. I craft data narratives through interactive dashboards, layered visualisations, web deployments and executive-ready reports that bridge technical depth and strategic clarity. Whether presenting model outputs to non-technical stakeholders or building live analytics tools, insight always reaches the people who need it.',
    tools:       ['Power BI', 'Tableau', 'Plotly', 'SQL', 'Matplotlib', 'Seaborn', 'Web Deployment'],
  },
];

// CREATING THE 3D PRISM AND INTERACTION LOGIC
//Determining which face is currently front-facing based on rotation angle
const getFaceIndex = (rotation) => {
  const n = ((rotation % 360) + 360) % 360;
  if (n < 60 || n >= 300) return 0;
  if (n >= 60 && n < 180) return 2;
  return 1;
};

// Interactions
export default function WhatIBring() {
  const [rotation,      setRotation]      = useState(0);
  const [activeSkill,   setActiveSkill]   = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentFace = useMemo(() => getFaceIndex(rotation), [rotation]);

  const rafRef      = useRef(null);
  const dragState   = useRef({ active: false, lastX: 0, prevX: 0, lastT: 0, prevT: 0, velocity: 0 });

  const cancelRAF = () => { 
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } 
  };

  // Snapping logic to nearest face when inertia ends 
  const snapToNearest = useCallback((fromRot) => {
    cancelRAF();
    const target = Math.round(fromRot / 120) * 120;
    let current  = fromRot;
    const ease   = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.05) { setRotation(target); return; }
      current += diff * 0.14;
      setRotation(current);
      rafRef.current = requestAnimationFrame(ease);
    };
    ease();
  }, []);

  const snapToFace = useCallback((i) => {
    setHasInteracted(true);
    cancelRAF();
    const offsets = [0, -120, -240];
    const base    = offsets[i];

    const n = Math.round((rotation - base) / 360);
    const target = base + n * 360;
    let current  = rotation;

    // Animation loop outside any state updater
    const ease   = () => {
        const diff = target - current;
        if (Math.abs(diff) < 0.05) { 
            setRotation(target);
            return;
        }
        current += diff * 0.12;
        setRotation(current);
        rafRef.current = requestAnimationFrame(ease);
      };

      ease();
    }, [rotation]);
      
  // The arrows at the side of the cards  
  const handleArrowClick = (direction) => {
    //direction is 1 for next and -1 for previous
    let nextIndex = currentFace + direction;
    
    // Looping around if it goes past the faces
    if (nextIndex > 2) nextIndex = 0;
    if (nextIndex < 0) nextIndex = 2;
   
    snapToFace(nextIndex);
  };

  // Inertia Simulation after velocity ends
  const startInertia = useCallback((fromRot) => {
    const DECAY = 0.92;
    let vel     = dragState.current.velocity;
    let rot     = fromRot;
    const tick  = () => {
      if (Math.abs(vel) < 0.25) { snapToNearest(rot); return; }
      rot += vel;
      vel *= DECAY;
      setRotation(rot);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [snapToNearest]);
 
  // Pointer event handlers for drag rotation
  const onPointerDown = (e) => {
    e.target.setPointerCapture(e.pointerId);
    cancelRAF();
    setHasInteracted(true);
    dragState.current = { active: true, lastX: e.clientX, prevX: e.clientX, lastT: performance.now(), prevT: performance.now(), velocity: 0 };
  };

  const onPointerMove = (e) => {
    const ds = dragState.current;
    if (!ds.active) return;
    const now  = performance.now();
    const dx   = e.clientX - ds.lastX;
    ds.velocity = (e.clientX - ds.prevX) / Math.max(now - ds.prevT, 1) * 0.45;
    ds.prevX    = ds.lastX; ds.prevT = ds.lastT;
    ds.lastX    = e.clientX; ds.lastT = now;
    setRotation(r => r + dx * 0.45);
  };

  const onPointerUp = (e) => {
    if (!dragState.current.active) return;
    e.target.releasePointerCapture(e.pointerId);
    dragState.current.active = false;
    startInertia(rotation);
  };

  // Keyboard Navigation using Enter or Space buttons for accessibility
  const handleKeyDown = (e, skill, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (window.innerWidth < 1024) {
        setActiveSkill(skill);  // On mobile phones
      } else {
        snapToFace(index); /* On desktop, rotate to the selected face */
      }
    }
  };
  /* Cleanup RAF on unmount and when dependencies change */
  useEffect(() => () => cancelRAF(), []);

  /* Reset mobile sheet when resizing to desktop */
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            setActiveSkill(null);
        }
    };
    /* Event listener */
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* Tracking the skill currently facing forward */
  const skill = SKILLS[currentFace];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
      
      {/* The WIB Section */}
      <section 
        className="relative min-h-screen w-full flex flex-col items-center pt-24 px-6 pb-12 overflow-hidden transition-colors duration-900 ease-in-out select-auto box-border before:absolute before:inset-0 before:bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] before:bg-size:[16px_16px] before:bg-position:[0_0] before:pointer-events-none before:z-0" 
        style={{ backgroundColor: skill.ambientBg }}
      >
       {/* Section titles and eyebrow text */}
        <div className="text-center mb-16 relative z-10">
          <span className="text-[0.65rem] tracking-[0.22em] text-white/35 block mb-3 uppercase">MY SKILLSET</span>
          <h2 className="text-[clamp(2rem,8vw,3.2rem)] font-extrabold leading-[1.1] text-white/90 m-0">What I bring to the table</h2>
        </div>

        {/* Desktop Layout */}
        <div className="w-full max-w-300 flex flex-col lg:flex-row items-center lg:justify-between relative z-10">
          
          {/* Left Prism Side */}
          <div className="flex flex-col items-center w-full lg:w-1/2 lg:min-h-160 justify-center">
            <div className="perspective-[900px] perspective-origin:50%_40% flex justify-center items-center h-72.5 lg:h-122.5 w-full relative max-lg:[--prism-tz:70px] lg:[--prism-tz:110px]">
              
              {/* Left Arrow */}
              <button
                  className="absolute left-4 lg:left-8 w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center justify-center cursor-pointer z-10 backdrop-blur-xs transition-all duration-300 ease-in-out hover:bg-white/15 hover:text-white/90 hover:border-white/30 hover:scale-105 active:scale-95"
                  onClick={() => handleArrowClick(-1)}
                  aria-label="Previous skill"
                  >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              
              {/* The Prism Wrapper*/}
              <div
                className={`relative perspective-[1000px] [transform-3d] cursor-grab transition-transform duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform touch-none active:cursor-grabbing ${activeSkill ? 'scale-[0.72] transform:[translateZ(-80px)]' : ''}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {/*Rotations*/}
                <div className="transform-3d w-60 lg:w-105 h-72.5 lg:h-122.5 relative will-change-transform" style={{ transform: `rotateY(${rotation}deg)` }}>
                  
                  {/* Looping through the skills */}
                  {SKILLS.map((s, i) => (
                    <div
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${s.title}`}                      
                      className={`absolute inset-0 w-60 lg:w-105 h-72.5 lg:h-122.5 [backface-hidden] [-webkit-backface-visibility:hidden] rounded overflow-hidden cursor-pointer border backdrop-blur-[2px] transition-all duration-400 ease-out focus-visible:outline focus-visible:outline-white focus-visible:outline-offset-4 before:content-[''] before:absolute before:top-0 before:left-[10%] before:right-[10%] before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(var(--face-rgb),0.8)_50%,transparent)] before:transition-opacity before:duration-400 before:ease-out after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(ellipse_at_50%_-10%,rgba(255,255,255,0.4)_0%,rgba(var(--face-rgb),0.2)_40%,transparent_85%)] after:pointer-events-none ${currentFace === i ? 'border-[rgba(var(--face-rgb),0.5)] before:opacity-100' : 'border-[rgba(var(--face-rgb),0.18)] before:opacity-0'}`}
                      style={{
                        transform: `rotateY(${i * 120}deg) translateZ(var(--prism-tz))`,
                        '--face-color': s.color,
                        '--face-rgb':   s.rgb,
                        background: `linear-gradient(145deg, rgba(${s.rgb}, 0.12) 0%, rgba(${s.rgb}, 0.04) 40%, rgba(${s.rgb}, 0.08) 100%)`
                      }}
                      onClick={() => {if (window.innerWidth < 1024) setActiveSkill(s);}}
                      onKeyDown={(e) => handleKeyDown(e, s, i)}
                    >
                      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center py-8 px-6 gap-[0.35rem]">
                        <span className="text-[0.65rem] text-[rgba(var(--face-rgb),0.6)] tracking-widest mb-2">{String(i + 1).padStart(2, '0')}</span>
                        <p className="text-[0.6rem] tracking-[0.18em] text-[rgba(var(--face-rgb),0.7)] uppercase m-0">{s.label}</p>
                        <h3 className="text-[1.25rem] font-bold text-white/90 m-0 leading-[1.2]">{s.title}</h3>
                        {/* Hidden on Desktop */}
                        <span className={`text-[0.6rem] tracking-widest text-(--face-color) mt-0 transition-opacity duration-300 ease-out absolute bottom-10 left-0 right-0 lg:hidden ${currentFace === i ? 'opacity-100' : 'opacity-0'}`}>tap to explore ↗</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>    
              
              {/* Right Arrow */}
              <button
                  className="absolute right-4 lg:right-8 w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center justify-center cursor-pointer z-10 backdrop-blur-xs transition-all duration-300 ease-in-out hover:bg-white/15 hover:text-white/90 hover:border-white/30 hover:scale-105 active:scale-95"
                  onClick={() => handleArrowClick(1)}
                  aria-label="Next skill"
                  >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* The bottom dots */}
            <div className="flex gap-[0.6rem] mt-8 relative z-10" role="tablist">
              {SKILLS.map((s, i) => (
                <button
                  key={s.id}
                  className={`w-8 h-1.5 rounded-full border-none bg-(--dot-c) cursor-pointer p-0 transition-all duration-300 ease-out ${currentFace === i ? 'opacity-100 shadow-[0_0_12px_var(--dot-c)]' : 'opacity-25'}`}
                  style={{ '--dot-c': s.color }}
                  onClick={() => snapToFace(i)}
                  aria-label={`Rotate to ${s.title}`}
                  role="tab"
                />
              ))}
            </div>

            {/* Hint Label at the bottom */}
            <p className={`text-[0.58rem] tracking-[0.16em] text-white/85 flex items-center gap-3 mt-5 relative z-10 transition-opacity duration-600 ease-out ${hasInteracted ? 'opacity-0 pointer-events-none' : ''}`}>
              <span className="block w-7 h-px bg-white/35" />
              swipe to rotate
              <span className="block w-7 h-px bg-white/35" />
            </p>
          </div>

          {/* RIGHT COLUMN: Desktop Info Panel (Hidden on mobile) */}
          <div className="hidden lg:block w-full lg:w-1/2 pl-16">
            <div key={skill.id} className="animate-[fadeIn_0.4s_ease]" style={{ '--skill-c': skill.color, '--skill-rgb': skill.rgb }}>
              <div className="mb-6">
                <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.2em] text-(--skill-c) block mb-[0.4rem] uppercase">{skill.label}</span>
                <h3 className="font-['Syne',sans-serif] text-[1.6rem] font-extrabold text-white/95 m-0 leading-[1.1]">{skill.title}</h3>
              </div>
              <p className="font-['DM_Mono',monospace] text-[0.88rem] leading-[1.8] text-white/60 m-0 mb-8 font-light">{skill.description}</p>
              <div className="border-t border-white/5 pt-5">
                <p className="font-['DM_Mono',monospace] text-[0.58rem] tracking-[0.2em] text-white/25 m-0 mb-3">TOOLS &amp; METHODS</p>
                <div className="flex flex-wrap gap-2">
                  {skill.tools.map(tool => (
                    <span key={tool} className="font-['DM_Mono',monospace] text-[0.7rem] py-[0.3rem] px-3 rounded-xs border border-[rgba(var(--skill-rgb),0.25)] text-(--skill-c) bg-[rgba(var(--skill-rgb),0.06)] tracking-[0.04em] transition-all duration-200 ease-out hover:bg-[rgba(var(--skill-rgb),0.14)] hover:border-[rgba(var(--skill-rgb),0.5)]">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* MOBILE VIEW */}
        {activeSkill && (
          <div className="fixed inset-0 z-100 bg-black/55 flex items-end backdrop-blur-[3px] animate-[fadeIn_0.25s_ease_forwards] lg:hidden" onClick={(e) => e.target === e.currentTarget && setActiveSkill(null)}>
            <div className="w-full max-h-[82vh] overflow-y-auto bg-[#0e0e12] border-t border-[rgba(var(--skill-rgb),0.3)] rounded-t-[20px] pt-4 px-6 pb-10 relative overscroll-contain shadow-[0_-1px_0_rgba(var(--skill-rgb),0.3),0_-20px_60px_rgba(var(--skill-rgb),0.08),inset_0_1px_0_rgba(var(--skill-rgb),0.12)] animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards] [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-xs" style={{ '--skill-c': activeSkill.color, '--skill-rgb': activeSkill.rgb }}>
              <div className="w-9 h-0.75 bg-white/15 rounded-xs mx-auto mb-6" />
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="font-['DM_Mono',monospace] text-[0.6rem] tracking-[0.2em] text-(--skill-c) block mb-[0.4rem] uppercase">{activeSkill.label}</span>
                  <h3 className="font-['Syne',sans-serif] text-[1.6rem] font-extrabold text-white/95 m-0 leading-[1.1]">{activeSkill.title}</h3>
                </div>
                <button
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/50 text-[0.75rem] cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-out hover:bg-white/10 hover:text-white/90"
                  onClick={() => setActiveSkill(null)}
                  aria-label="Close details"
                >✕</button>
              </div>
              <p className="font-['DM_Mono',monospace] text-[0.88rem] leading-[1.8] text-white/60 m-0 mb-8 font-light">{activeSkill.description}</p>
              <div className="border-t border-white/5 pt-5">
                <p className="font-['DM_Mono',monospace] text-[0.58rem] tracking-[0.2em] text-white/25 m-0 mb-3">TOOLS &amp; METHODS</p>
                <div className="flex flex-wrap gap-2">
                  {activeSkill.tools.map(tool => (
                    <span key={tool} className="font-['DM_Mono',monospace] text-[0.7rem] py-[0.3rem] px-3 rounded-xs border border-[rgba(var(--skill-rgb),0.25)] text-(--skill-c) bg-[rgba(var(--skill-rgb),0.06)] tracking-[0.04em] transition-all duration-200 ease-out hover:bg-[rgba(var(--skill-rgb),0.14)] hover:border-[rgba(var(--skill-rgb),0.5)]">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}