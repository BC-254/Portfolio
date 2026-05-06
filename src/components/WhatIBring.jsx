import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import './WhatIBring.css';

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
// Determining which face is currently front-facing based on rotation angle
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

  //Animated snapping to the nearest face when inertia ends
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

    /* Animation loop outside any state updater */
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
    // direction is 1 for Next, -1 for Previous
    let nextIndex = currentFace + direction;
    
    // Looping around if we go past the ends
    if (nextIndex > 2) nextIndex = 0;
    if (nextIndex < 0) nextIndex = 2;
    
    snapToFace(nextIndex);
  };

  // Inertia simulation after velocity ends
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

  // Keyboard Navigation using Enter or Space Buttons for accessibility
  const handleKeyDown = (e, skill) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();

      if (window.innerWidth < 1024) {
        setActiveSkill(skill);   // On mobile phones
      } else {
        snapToFace(index); // On desktop, rotate to the selected face
      }
    }
  };
  // Cleanup RAF on unmount to prevent memory leaks
  useEffect(() => () => cancelRAF(), []);

  //Reset mobile sheet when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
            setActiveSkill(null);
        }
    };
    //Event Listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Tracking the skill currently facing forward
  const skill = SKILLS[currentFace];

  return (
    <section className="wib" style={{ backgroundColor: skill.ambientBg }}>
      
      <div className="wib__header">
        <span className="wib__eyebrow">MY SKILLSET</span>
        <h2 className="wib__title">What I bring to the table</h2>
      </div>

    {/* DESKTOP LAYOUT*/}
      {/* Main Layout Container */}
      <div className="wib__content">
        
        {/* LEFT COLUMN: The Prism */}
        <div className="wib__left">
          <div className="wib__scene">
            {/* Left Arrow */}
            <button
                className="wib__arrow wib__arrow--left"
                onClick={() => handleArrowClick(-1)}
                aria-label="Previous skill"
                >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            
            {/* The Prism Wrapper */}
            <div
              className={`wib__prism-wrapper${activeSkill ? ' is-back' : ''}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
                {/* Rotations */}
              <div className="wib__prism" style={{ transform: `rotateY(${rotation}deg)` }}>
                
                {/* Looping through the skills */}
                {SKILLS.map((s, i) => (
                  <div
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${s.title}`}
                    className={`wib__face wib__face--${s.id}${currentFace === i ? ' is-front' : ''}`}
                    style={{
                      transform: `rotateY(${i * 120}deg) translateZ(var(--prism-tz))`,
                      '--face-color': s.color,
                      '--face-rgb':   s.rgb,
                    }}
                    onClick={() => {if (window.innerWidth<1024) setActiveSkill(s);}}
                    onKeyDown={(e) => handleKeyDown(e, s, i)}
                  >
                    <div className="wib__face-inner">
                      <span className="wib__face-num">{String(i + 1).padStart(2, '0')}</span>
                      <p className="wib__face-label">{s.label}</p>
                      <h3 className="wib__face-title">{s.title}</h3>
                      {/* Hidden on desktop via CSS */}
                      <span className="wib__face-cta">tap to explore ↗</span>
                      
                    </div>
                 </div>
                ))}
            </div>
            </div>    
            
            {/* Right Arrow */}
            <button
                className="wib__arrow wib__arrow--right"
                onClick={() => handleArrowClick(1)}
                aria-label="Next skill"
                >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="wib__dots" role="tablist">
            {SKILLS.map((s, i) => (
              <button
                key={s.id}
                className={`wib__dot${currentFace === i ? ' is-active' : ''}`}
                style={{ '--dot-c': s.color }}
                onClick={() => snapToFace(i)}
                aria-label={`Rotate to ${s.title}`}
                role="tab"
              />
            ))}
          </div>

          <p className={`wib__hint${hasInteracted ? ' is-gone' : ''}`}>
            <span className="wib__hint-line" />
            swipe to rotate
            <span className="wib__hint-line" />
          </p>
        </div>

        {/* RIGHT COLUMN: Desktop Info Panel (Hidden on Mobile) */}
        <div className="wib__right">
          <div key={skill.id} className="wib__desktop-info" style={{ '--skill-c': skill.color, '--skill-rgb': skill.rgb }}>
            <div className="wib__desktop-head">
              <span className="wib__sheet-eyebrow">{skill.label}</span>
              <h3 className="wib__sheet-title">{skill.title}</h3>
            </div>
            <p className="wib__sheet-desc">{skill.description}</p>
            <div className="wib__sheet-footer">
              <p className="wib__tools-heading">TOOLS &amp; METHODS</p>
              <div className="wib__tools-list">
                {skill.tools.map(tool => (
                  <span key={tool} className="wib__tool">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MOBILE VIEW */}
      {activeSkill && (
        <div className="wib__overlay" onClick={(e) => e.target === e.currentTarget && setActiveSkill(null)}>
          <div className="wib__sheet" style={{ '--skill-c': activeSkill.color, '--skill-rgb': activeSkill.rgb }}>
            <div className="wib__sheet-handle" />
            <div className="wib__sheet-head">
              <div>
                <span className="wib__sheet-eyebrow">{activeSkill.label}</span>
                <h3 className="wib__sheet-title">{activeSkill.title}</h3>
              </div>
              <button
                className="wib__sheet-close"
                onClick={() => setActiveSkill(null)}
                aria-label="Close details"
              >✕</button>
            </div>
            <p className="wib__sheet-desc">{activeSkill.description}</p>
            <div className="wib__sheet-footer">
              <p className="wib__tools-heading">TOOLS &amp; METHODS</p>
              <div className="wib__tools-list">
                {activeSkill.tools.map(tool => (
                  <span key={tool} className="wib__tool">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}