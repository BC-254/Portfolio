import { useEffect, useRef, useState } from "react";

// Cards Data and Descriptions
const PROJECTS = [
  {
    id: "sheria",
    title: "SheriaLens",
    tagline: "Kenyan Legal Research Assistant Chatbot",
    description:
      "The law isn't blind. It’s hidden behind a wall of impenetrable jargon. Sherialens is a tireless legal research assistant engineered to crack the code of the courtroom. It dives deep into complex legal archives, hunts down relevant precedents and deciphers arcane legalese into clear, actionable power for the ordinary mwananchi. I am actively building the bridge between the code of law and true access to justice. The system is evolving and the first iteration is already live. Click 'Live Preview' to explore my first prototype.",
    skills: ["Python", "NLP", "Transformers", "FastAPI", "RAG", "ChromaDb"],
    github: "https://github.com/BC-254/SheriaLens",
    live: "https://huggingface.co/spaces/BC-254/SheriaLens2",
    glow: "59,130,246",        // blue
    glowClass: "from-blue-500/20 via-blue-400/10",
    borderGlow: "border-white/90 sm:border-white/10 sm:hover:border-blue-500/50",
    badgeColor: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    texture: "flag",   
  },
  {
    id: "stops",
    title: "Stops-to-Arrest Prediction",
    tagline: "Predictive Policing Bias Classifier",
    description:
      "This project develops a predictive model that accurately forecasts whether a traffic stop will result in an arrest. It assists law enforcement agencies in making informed decisions during traffic stops hence ensuring that adequate resources have been allocated effectively and that officers are better prepared for potential outcomes. Nonetheless, the model also seeks to enhance transparency and accountability within law enforcement by providing insights into the factors that influence arrest decisions.",
    skills: ["Machine Learning", "Pandas", "Feature Engineering", "Scikit-learn", "Logistic Regression", "AUC-ROC"],
    github: "https://github.com/BC-254/analyzing-reasonable-suspicion",
    //{live: "Undefined",}
    comingSoon: true,
    glow: "239,68,68",        // red
    glowClass: "from-red-500/20 via-red-400/10",
    borderGlow: "border-white/90 sm:border-white/10 sm:hover:border-red-500/50",
    badgeColor: "bg-red-500/10 text-red-300 border-red-500/20",
    texture: "scatter",
    
  },
  {
    id: "movielens",
    title: "MovieLens Recommender System",
    tagline: "Collaborative Filtering at Scale",
    description:
      "A matrix-factorisation recommender trained on 25M ratings, with hybrid content-based fallback for cold-start users and real-time inference via a REST endpoint.",
    skills: ["Python", "SVD", "Surprise", "Pandas", "Flask"],
    github: "https://github.com/BC-254/movielens-recommender-system",
    //{live: "Undefined",}
    comingSoon: true,
    glow: "34,197,94",       // green
    glowClass: "from-green-500/20 via-green-400/10",
    borderGlow: "border-white/90 sm:border-white/10 sm:hover:border-green-500/50",
    badgeColor: "bg-green-500/10 text-green-300 border-green-500/20",
    texture: "dots",   
  },
];

// Sherialens card Kenyan Flag background
function KenyanFlagOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <div className="absolute inset-0 flex flex-col transform -skew-y-12 scale-125 origin-center">
        <div className="flex-3 bg-[#1a1a1a]/30" />   {/* Black stripe */}
        <div className="h-3 bg-white/30" />   {/* White stripe */}
        <div className="flex-3 bg-[#BB0000]/20" />
        <div className="h-3 bg-white/30" />
        <div className="flex-3 bg-[#006600]/20" />
      </div>
      {/* Abstract Maasai shield in the center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-20 border-2 border-white/40 rounded-[50%] bg-[#BB0000]/20 backdrop-blur-sm" />
      </div>
    </div>
  );
}

// Stops-to-Arrest SVG pattern
function ScatterPattern() {
    // visually scattered points 
  const dots = Array.from({ length: 40 }, (_, i) => ({
    cx: Math.sin(i * 137.5) * 50 + 50,
    cy: Math.cos(i * 97.3) * 50 + 50,
    r: 0.6 + (i % 3) * 0.4,
  }));
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-60"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="rgb(239,68,68)" opacity="0.35" />
      ))}
      {dots.slice(0, 12).map((d, i) => {
        const next = dots[(i + 7) % dots.length];
        return (
          <line
            key={`l${i}`}
            x1={d.cx} y1={d.cy}
            x2={next.cx} y2={next.cy}
            stroke="rgb(239,68,68)"
            strokeWidth="0.15"
            opacity="0.2"
          />
        );
      })}
    </svg>
  );
}

// Movielens recommender card background
function DotGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgb(34,197,94)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}


// Individual Project Card Components
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // Scroll reveal animation
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
        // When card enters viewport, set it to visible and disconnect observer to prevent re-triggering
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The Flashlight mouse glow effect
  useEffect(() => {
    const el = cardRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;

    // On mouse move
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(${project.glow},0.18) 0%, transparent 65%)`;
    };
    // On mouse leave, fade out the glow
    const handleLeave = () => {
      glow.style.background = "transparent";
    };

    // Attach event listeners
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [project.glow]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      style={{
        // Giving each card a delay-Waterfall entrance effect
        transitionDelay: `${index * 120}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
        {/* The inner card with Glassmorphism and hover effects */}
      <div
        className={`
          relative overflow-hidden rounded-2xl
          bg-[#0a0f18]/80 backdrop-blur-sm
          border sm:border  border-white/10 ${project.borderGlow}
          transition-all duration-500
          hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50  
          flex flex-col h-full
          min-h-105 sm:min-h-115
        `}
        style={{ willChange: "transform" }}
      >
        {/* The background visual layers */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none z-10 transition-all duration-100 rounded-2xl hidden sm:block" />
        
        {/* Static ambient glow - Mobile only */}
        <div
            className="absolute inset-0 pointer-events-none z-10 rounded-2xl sm:hidden"
            style={{ background: `radial-gradient(circle at 85% 15%, rgba(${project.glow},0.25) 0%, transparent 65%)`}}
            />
        {project.texture === "flag" && <KenyanFlagOverlay />}
        {project.texture === "scatter" && <ScatterPattern />}
        {project.texture === "dots" && <DotGrid />}

        <div className={`h-1 w-full bg-linear-to-r ${project.glowClass} to-transparent`} />
        {/* Content of the card */}
        <div className="relative z-20 flex flex-col flex-1 p-6 sm:p-7 gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-1" >
              {project.title}
            </h3>
            <p className="text-xs sm:text-sm tracking-widest uppercase font-medium" style={{ color: `rgb(${project.glow})`, opacity: 0.85 }}>
              {project.tagline}
            </p>
          </div>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed flex-1">
            {project.description}
          </p>
          
          {/* The skills badges */}
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span key={skill} className={`text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-full border ${project.badgeColor} transition-all duration-300 group-hover:border-opacity-60`}>
                {skill}
              </span>
            ))}
          </div>
            {/* The links to Github and Live Demo */}
          <div className="flex items-center gap-3 translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out"> 
            <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 hover:text-white transition-colors duration-200 font-mono">
              <GithubIcon />
              <span>View Code</span>
            </a>
            <span className="w-px h-4 bg-white/15" />
            {project.live ? (
              <a href={project.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs sm:text-sm transition-colors duration-200 font-mono" style={{ color: `rgb(${project.glow})` }}>
                <ExternalIcon />
                <span>Live Preview</span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-xs sm:text-sm font-mono text-zinc-500 italic">
                Live link coming soon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// The projects section component
// The GitHub logo
function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// Live preview arrow icon
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// The Projects Component
export default function Projects() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);


  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Main layout and Background
  return (
    <section id="featured-projects" className="relative pt-4 pb-6 mt-2 sm:mt-8 px-4 sm:px-6 lg:px-8 h-fit text-white border-b border-[#c8b98c]">
      {/* Ambient background behind the cards*/}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/20 blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-blue-500/20 blur-[120px]" />
      </div>
        {/* The header and description */}
      <div 
        ref={headerRef}
        className="mb-12 sm:mb-16 flex flex-col items-center text-center"
        style={{opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(24px)", transition:"opacity 0.8s ease, transform 0.8s ease"}}
    > 
        {/* Accent Line and Subtitle */}
        <div className = "flex items-center justify-center gap-3 mb-4 w-full">
            <span className="text-[0.65rem] tracking-[0.22em] text-[#c8b98c] block mb-3 uppercase">
                Selected Works
            </span>
            
        </div>
           {/* The header */}
        <h2 
            className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight"
            >
            Featured Projects
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
            Transforming complex data into scalable, real-world intelligence. A curated look at my deployed analytical models.
          </p>
        </div>
            {/* The projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>    
    </section>
  );
}