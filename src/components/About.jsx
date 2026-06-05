import React,{ useState, useEffect, useRef } from "react";
import {motion} from "framer-motion";
import NavBar from "./NavBar";
import profilePic from '../assets/Profile_Photo.png';
import { Code2, Gamepad2, PenTool, Compass} from "lucide-react";


// Scroll-reveal animation
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Profession type-writer effect
function useTyping(text, speed = 60, startDelay = 800, pauseDelay=2000) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    // Typing effect
    let i = 0;
    let timeout;
    
    const typeLetter = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0,i+1));
        i++;
        timeout = setTimeout(typeLetter, speed);        
      }
      // After text is finished, pause and reset
      else {
        timeout = setTimeout(() => {
          i=0;
          setDisplayed("");
          typeLetter();
        }, pauseDelay);
      }
    };

    timeout = setTimeout(typeLetter, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay, pauseDelay]);
  return displayed;
}


// Scroll progress bar at the top
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  // Throttled scroll listener
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = document.documentElement;
          const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
          setProgress(Math.round(scrolled * 100));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const qx =     [0.28, 0.18, 0.14, 0.16, 0.20, 0.28, 0.38, 0.54, 0.70, 0.88];
  const hues =   [240,  232,  224,  216,  204,  192,  175,  155,  130,  100 ];
  const active = Math.floor(progress / 100 * qx.length);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-end gap-0.75 px-0 overflow-hidden"
      style={{ height: "36px", background: "rgba(10,13,20,0.97)",  }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Page scroll progress: ${progress}%`}
    >
      {qx.map((h, i) => {
        const isActive = i <= active;
        const barH = isActive ? Math.max(6, Math.round(h * 32)) : 4;
        return (
          <div
          /* Each bar has its own invisible column */
            key={i}
            className="flex flex-col items-center justify-end flex-1"
            style={{ height: "36px", paddingBottom: "2px" }}
          > 
          {/* Giving the bars color */}
            <div
              style={{
                height: `${barH}px`,
                width: "100%",
                borderRadius: "2px 2px 0 0",
                background: isActive
                  ? `hsl(${hues[i]}, 65%, 62%)`
                  : "rgba(255,255,255,0.06)",
                transition: "height 0.25s ease, background 0.3s ease",
                willChange: isActive ? "height" : "auto",
              }}
            />            
          </div>
        );
      })}
    </div>
  );
}

//----------------------------------------------------------------------------------------------------------------------
// THE INTRODUCTION SECTION
function IntroSection() {
  const typedText = useTyping("Actuarial Analyst & Data Scientist",60,800);
  const [ref, visible] = useReveal(0.1);

  return (
    <section className="relative pt-32 pb-12 text-center overflow-hidden" style={{ background: "#020617" }}>
      <div
        ref={ref}
        className={`relative z-10 max-w-4xl mx-auto px-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Photo avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <img
              src={profilePic}
              alt="Brian Chege Profile Photo"
              className="w-28 h-28 md:w-36 md:h-36 rounded-full border-2 border-cyan-500/30 object-cover"
            />
          </div>
        </div>

        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-sky-300 mb-6 border border-sky-400/20"
          style={{ background: "rgba(56,189,248,0.08)" }}>
          <span aria-hidden="true" className="text-sm">🌍</span> Nairobi, Kenya
        </div>
        {/* My introduction heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
          val developer={" "}
          <span
            /* Keeping the gradient in the letters only */
            style={{
              background: "#06B6D4",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            "Brian Chege"
          </span>
        </h1>

        {/* Typing text */}
        <div className="h-9 mb-2 pt-6 flex justify-center">
          <p className="font-mono text-lg md:text-xl text-slate-400 flex items-center">
            {typedText}

            {/* Blinking cursor */}
            <span className= "inline-block w-0.5 h-5 bg-emerald-400 ml-0.5 animate-pulse" />
          </p>
        </div>

        {/* Tag line */}
        <p className="text-sm text-slate-500 pt-6 mb-10 italic">
          Integrating advanced analytics and machine learning into seamless digital experiences.
        </p>

        {/* The terminal window*/}
        <div
          className="rounded-xl text-left overflow-hidden border border-#0a8df1 mx-auto max-w-3xl"
          style={{ background: "#1e1e1e", boxShadow: "0 25px 50px -12px rgba(135, 206, 250, 0.2)" }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#0a8df1]" style={{ background: "#252526" }}>
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="flex-1 text-center text-xs text-[#4ca6ba] font-mono">
              Brian_Chege.py — An overview
            </span>
          </div>

          {/* Terminal content */}
          <div className="p-5 space-y-4 font-mono text-sm md:text-base leading-relaxed">
            <p className="text-[#d4d4d4] flex gap-4">
              <span className="text-[#555] select-none w-4 text-right shrink-0">1</span>
              <span>
                I am a detail-oriented{" "}
                <span className="text-[#f472b6]">Actuarial Analyst</span> and{" "}
                <span className="text-[#f472b6]">Certified Data Scientist</span> who bridges
                the gap between traditional risk assessment and advanced artificial intelligence.
                I specialize in decoding large-scale datasets, architecting predictive models and 
                translating rigorous statistical analysis into clear, actionable business intelligence. 
                 
              </span>
            </p>
            <p className="text-[#d4d4d4] flex gap-4">
              <span className="text-[#555] select-none w-4 text-right shrink-0">2</span>
              <span>
                My technical toolkit includes{" "}
                <span className="text-[#f472b6]">Python</span> and{" "}
                <span className="text-[#f472b6]">R</span> for modelling,{" "}
                <span className="text-[#f472b6]">SQL</span> for data extraction, {" "}
                <span className="text-[#f472b6]">Power BI</span> and {" "}
                <span className="text-[#f472b6]">Tableau</span> for storytelling and{" "}
                <span className="text-[#f472b6]">HTML</span>,{" "}
                <span className="text-[#f472b6]">CSS</span> &{" "}
                <span className="text-[#f472b6]">JavaScript</span> for web interfaces.
                I am currently specializing in building intelligent Android applications using{" "}
                <span className="text-[#f472b6]">Kotlin</span>.
              </span>
            </p>
          </div>
        </div>        
      </div>
    </section>
  );
}

//---------------------------------------------------------------------------------------------------------------
//  THE CREDENTIALS AND EDUCATION SECTION
function CredentialsSection() {
  const [ref, visible] = useReveal(0.1);
  const items = [
    {
      year: "2026",
      title: "Data Science and Machine Learning",
      org: "Moringa School",
      color: "#7c3aed", 
    },
    {
      year: "2025",
      title: "Data Analytics & Visualization with Advanced Excel, SQL & Power BI",
      org: "Moringa School",
      color: "#38bdf8", 
    },
    {
      year: "2025",
      title: "BSc. Actuarial Science",
      org: "Catholic University of Eastern Africa",
      color: "#f472b6",
     
    },
  ];

  return (
    <section className="py-14 px-6 relative overflow-hidden" style={{ background: "#0d046d3c" }}>
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Educational Background
          </h2>
        </div>

        {/* The Educations Area */}
        <div ref={ref} className="relative">
          
          {/* The Vertical Line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-#c8b98c md:-translate-x-1/2">
            {/* The glowing laser*/}
            <div 
              className={`absolute top-0 w-full bg-linear-to-b from-transparent via-[#2bb8f0] to-[#ffffff] transition-all duration-2000 ease-out ${visible ? "h-full opacity-100" : "h-0 opacity-0"}`}
              style={{ boxShadow: "0 0 20px 2px rgba(56,189,248,0.4)" }}
            />
          </div>

          {/* The Education Items */}
          <div className="space-y-12">
            {items.map((item, i) => {
              // Alternating left and right for desktop
              const isEven = i % 2 === 0;
              return (
                <div 
                  key={i} 
                  className={`relative flex flex-col md:flex-row items-start ${isEven ? "md:flex-row-reverse" : ""} transition-all duration-700`}
                  style={{ 
                    opacity: visible ? 1 : 0, 
                    transform: visible ? "translateY(0)" : "translateY(40px)",
                    transitionDelay: `${i * 200}ms` 
                  }}
                >
                  {/* The Glowing Dot */}
                  <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#0f0b1e] z-10 -translate-x-1.75 md:-translate-x-1/2 mt-1.5 md:mt-8 transition-transform duration-300 hover:scale-150"
                       style={{ background: item.color}} 
                  />

                  {/* Placeholder for the desktop content area */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* The Content Cards */}
                    <div 
                      className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                      style={{ 
                        backgroundColor: "#13101e",
                        borderTop: "1px solid rgba(255, 255, 255, 0.8)",
                        borderLeft: "1px solid rgba(255, 255, 255, 0.4)",
                        borderBottom: "1px solid rgba(0, 0, 0, 0.6)",
                        borderRight: "1px solid rgba(0, 0, 0, 0.4)",
                        boxShadow: "8px 12px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
                      }}
                    >
                      {/* The cards SVG Design*/}
                      <div className="absolute inset-0 opacity-[0.2] pointer-events-none mix-blend-screen">
                        {/* A woody tech pattern SVG */}
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M0,20 Q25,30 50,20 T100,20" stroke="white" strokeWidth="0.5" fill="none" />
                          <path d="M0,80 Q25,70 50,80 T100,80" stroke="white" strokeWidth="0.5" fill="none" />
                          <circle cx="50" cy="20" r="1.5" fill="white" />
                          <circle cx="25" cy="75" r="1" fill="white" />
                          <circle cx="75" cy="75" r="1.5" fill="white" />
                          <path d="M50,20 L25,75 M50,20 L75,75" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="2,2" />
                          {/* Grid overlay */}
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>

                      {/* The Hover Effect */}
                      <div 
                        className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                        style={{ 
                          background: `linear-gradient(135deg, ${item.color}40 0%, transparent 40%, transparent 60%, ${item.color}20 100%)`,
                          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: "1px"
                        }} 
                      />
                      
                      {/*  */}
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-3 border" style={{ color: item.color, borderColor: `${item.color}40`, background: `${item.color}10` }}>
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-white mb-1 relative z-10">{item.title}</h3>
                      <p className="text-slate-400 text-sm relative z-10">{item.org}</p>
                    </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

//-------------------------------------------------------------------------------------------------------------------------
// THE TECHNICAL ECOSYSTEM
      // Cards onMouse 3D tilt on Desktop
function TiltCard({ children, accent, delay }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  // Mouse Hover
  const handleMouseMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Determining the mouse co-ordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // The cards tilt
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 30;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };
  // Mouse leaves then resets the card
  const handleMouseLeave = () => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="snap-center shrink-0 w-[85vw] md:w-87.5 my-8 rounded-2xl p-7 active:scale-[0.98] cursor-grab active:cursor-grabbing"
      style={{
        transform,
        willChange: "transform",
        contain:"layout",
        transition: "transform 0.2s ease-out, scale 0.2s ease-out", 
        background: "linear-gradient(180deg, #1a162e 0%, #0d0a1a 100%)", 
        borderTop: `3px solid ${accent}`,
        borderLeft: `2px solid ${accent}40`, 
        borderRight: `2px solid ${accent}10`,
        borderBottom: `2px solid transparent`,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.09)", // Drop shadow to float inside the ditch
      }}
    >
      {children}
    </div>
  );
}

// THE MAIN TECHNICAL ECOSYSTEM SECTION
function TechSection() {
  const [ref, visible] = useReveal(0.1);
  const scrollbarRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  
  // Arrows on devices where content overflows
  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer:fine)").matches;
    if (!pointerFine) return;

    const checkOverflow = () => {
      const el = scrollbarRef.current;
      if (!el) return;
      setShowArrows(el.scrollWidth > el.clientWidth);
    };
    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    if (scrollbarRef.current) ro.observe(scrollbarRef.current);
    return () => ro.disconnect();
  }, []);

  // Hiding the floating hint
  const handleScroll = (e) => {
    if (!hasScrolled && e.target.scrollLeft > 20) setHasScrolled(true);
  };

  // Scroll-arrows on desktop
  const slideLeft = () => scrollbarRef.current?.scrollBy({left:-350, behavior:"smooth"});
  const slideRight = () => scrollbarRef.current?.scrollBy({left:350, behavior:"smooth"});
  
  // The categories and skills data
  const categories = [
    {
      label: "Data Science & AI",
      accent: "#f472b6", 
      skills: [
        { name: "Python Ecosystem", detail: "Pandas, NumPy, Scikit-learn for advanced data manipulation." },
        { name: "Machine Learning", detail: "Regression, Classification, Clustering and Predictive Modeling." },
        { name: "NLP", detail: "Sentiment Analysis & Text Classification using SpaCy/NLTK." },
        { name: "Deep Learning", detail: "Neural Networks with TensorFlow/PyTorch." },
      ],
    },
    {
      label: "Engineering",
      accent: "#38bdf8", 
      skills: [
        { name: "Kotlin", detail: "Building intelligent, native Android applications." },
        { name: "SQL & Databases", detail: "Complex querying, data warehousing, and ETL processes." },
        { name: "Version Control", detail: "Git, GitHub, and CI/CD pipelines." },
        { name: "Web Technologies", detail: "HTML5, CSS3, JavaScript for web interfaces." },
      ],
    },
    {
      label: "Actuarial & Viz",
      accent: "#4ade80", 
      skills: [
        { name: "R Language", detail: "Statistical computing and graphical techniques." },
        { name: "Financial Modeling", detail: "Risk analysis, probability theory, and reserving methods." },
        {
          name: "Visualization",
          tags: ["Power BI", "Tableau", "Matplotlib", "Seaborn"],
        },
        { name: "Excel / VBA", detail: "Advanced macros and automation for reporting." },
      ],
    },
  ];

  return (
    <section 
      className="relative py-14 px-4 md:px-8 overflow-hidden" 
      style={{ background: "radial-gradient(circle at top center)" }}
    >
      {/*Top-left and Bottom-right glows*/}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#f472b6] opacity-15 blur-[100px] md:blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#4ade80] opacity-10 blur-[100px] md:blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Title */}
        <div className="mb-16 text-center">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Ecosystem</h2>
           <p className="text-slate-400 text-sm md:hidden">Swipe to explore my toolkit</p>
        </div>

        {/* The ditch wrapper */}
        <div ref={ref} className="relative rounded-3xl overflow-hidden bg-black/40 border border-white/50 shadow-[inset_0_20px_50px_rgba(0,0,0,0.8)] py-10 px-4 md:px-10">
          
          {/* The Swipe Hint in Mobile only */}
          <div 
            className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 pointer-events-none md:hidden transition-opacity duration-700 ${
              hasScrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex items-center gap-2 bg-[#1a162e]/90 backdrop-blur-md px-4 py-2 rounded-full border border-sky-400/30 text-sky-300 text-xs font-semibold shadow-lg animate-pulse">
              Swipe
              {/* Arrow SVG */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
          </div>

          {/* Rendering the arrows when showArrows is true */}
          {showArrows && (
            <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20 pointer-events-none">

              {/* Left Button */}
              <button 
                onClick={slideLeft} 
                className="pointer-events-auto w-10 h-10 rounded-full bg-[#1a162e]/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:scale-110 transition-all shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              {/* Right Button */}
              <button 
                onClick={slideRight} 
                className="pointer-events-auto w-10 h-10 rounded-full bg-[#1a162e]/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:scale-110 transition-all shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          )}

          {/* Mobile Scrollbar */}
          <div
            ref={scrollbarRef}
            onScroll={handleScroll}
            className={`flex overflow-x-auto snap-x snap-mandatory w-full lg:justify-center gap-6 px-4 md:px-0 pb-8 transition-all duration-1000 
              /* Scrollbar Styling */
              [&::-webkit-scrollbar]:h-2
              [&::-webkit-scrollbar-track]:bg-black/30 
              [&::-webkit-scrollbar-track]:rounded-full 
              [&::-webkit-scrollbar-track]:mt-6
              [&::-webkit-scrollbar-track]:border
              [&::-webkit-scrollbar-track]:border-sky-400/30
              [&::-webkit-scrollbar-thumb]:bg-blue-500/30 
              hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/30 
              [&::-webkit-scrollbar-thumb]:rounded-full
              ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
            `}
          >
            {categories.map((cat, ci) => (
              <TiltCard key={cat.label} accent={cat.accent} delay={`${ci * 100}ms`}>
                {/* The categories Title */}
                <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-6">
                  {cat.label}
                </h3>
                
                <ul className="space-y-5">
                  {cat.skills.map((sk) => (
                    <li key={sk.name}>
                      <p className="text-sm font-semibold mb-1" style={{ color: cat.accent }}>
                        {sk.name}
                      </p>
                      
                      {sk.detail && (
                        <p className="text-xs text-slate-400 leading-relaxed">{sk.detail}</p>
                      )}
                      
                      {sk.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {sk.tags.map((t) => (
                            <span
                              key={t}
                              className="text-xs px-2.5 py-0.5 rounded-md border text-sky-300 backdrop-blur-sm"
                              style={{ 
                                  background: "rgba(56,189,248,0.05)",
                                  borderColor: "rgba(56,189,248,0.15)"
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

              </TiltCard>
            ))}
            
            {/* Mobile extra space on the right to allow scroll */}
            <div className="snap-center shrink-0 w-4 md:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}

//---------------------------------------------------------------------------------------------------------------------------------------
// THE HOBBIES SECTION
function HobbiesSection() {
  const [activeCard, setActiveCard] = useState(null);

  const cards = [
    {
      icon: <Code2 strokeWidth={1.5} size={42} className="text-violet-400" />,
      front: "Coder",
      backTitle: "Digital Architect",
      back: "For me, coding is not just about pushing commits and writing scripts. My goal is to always architect seamless, end-to-end digital solutions. I am usually very meticulous about how an application comes together, from the underlying database architecture to the final user interface.",
      gradient: "linear-gradient(135deg, #6d28d9, #4c1d95)", 
      glow: "rgba(139, 92, 246, 0.4)",
      themeText: "text-violet-400",
    },
    {
      icon: <Gamepad2 strokeWidth={1.5} size={42} className="text-emerald-400" />,
      front: "Baller",
      backTitle: "Pitch & Pixels",
      back: "All work and no play makes Jack a dull boy. I am an avid footballer who loves the physical challenge and camaraderie of a match. I combine this with an undeniable passion and focus in console gaming hence keeping me recharged and dialed in, in-between my work schedules.",
      gradient: "linear-gradient(135deg, #059669, #064e3b)", 
      glow: "rgba(16, 185, 129, 0.4)",
      themeText: "text-emerald-400",
    },
    {
      icon: <PenTool strokeWidth={1.5} size={42} className="text-blue-400" />,
      front: "Script-Writer",
      backTitle: "Analytical Scribe",
      back: "Data tells the truth, but it takes a story to actually sell that truth to the world. Even though my profession requires strict logic, writing allows me to keep my imagination vivid and that I never lose sight of the individuals behind the screens.", 
      gradient: "linear-gradient(135deg, #60a5fa, #2563eb)", 
      glow: "rgba(96, 165,250, 0.4)",
      themeText: "text-blue-400",
    },
    {
      icon: <Compass strokeWidth={1.5} size={42} className="text-[#ea580c]" />,
      front: "Explorer",
      backTitle: "Offline Horizons",
      back: "Honestly, the most profound inspiration rarely comes from sitting behind a monitor. Whenever I am unplugged, my default state is exploring the outdoors. Stepping out of the digital ecosystem is never an escape but a means where my most innovative ideas often come from.",
      gradient: "linear-gradient(135deg, #ea580c, #9a3412)", 
      glow: "rgba(245, 158, 11, 0.4)",
      themeText: "text-[#ea580c]",
    }    
  ];

  return (
    <section className="relative py-14 px-6 bg-[#0d046d3c] overflow-hidden">
      {/* Rain Background */}
      <style>
        {`
          @keyframes rain-fall {
            0% { background-position: 0px 0px; }
            100% { background-position: 100px 200px; }
          }
        `}
      </style>
      
      {/*Violet drops*/}
      <div 
        className="absolute inset-0 pointer-events-none opacity-90 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 l -3 15 M80 50 l -3 15 M140 10 l -3 15 M180 80 l -3 15 M50 120 l -3 15 M110 150 l -3 15 M160 130 l -3 15 M10 180 l -3 15' stroke='%238b5cf6' stroke-width='1.5' stroke-linecap='round' stroke-opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          animation: "rain-fall 1.5s linear infinite",
          willChange: "background-position"
        }}
      />
      
      {/*Cyan drops*/}
      <div 
        className="absolute inset-0 pointer-events-none opacity-90 mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='150' height='150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 40 l -4 20 M100 20 l -4 20 M130 90 l -4 20 M60 110 l -4 20' stroke='%2322d3ee' stroke-width='1' stroke-linecap='round' stroke-opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          animation: "rain-fall 1s linear infinite",
          willChange: "background-position"
        }}
      />      
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* The Section header */}
        <div className="mb-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            My Core Modules            
          </h2>
          <p className="font-mono text-sm text-slate-400 max-w-lg mt-2 leading-relaxed">
             The facets that make me who I am. 
          </p>
        </div>

        {/* THE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => {
            const isFlipped = activeCard === i;

            return (
              <div
                key={card.front}
                className="group h-90 cursor-pointer"
                style={{ perspective: "1200px" }}
                
                // Mobile Click / Keyboard Toggle
                onClick={() => setActiveCard(isFlipped ? null : i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveCard(isFlipped ? null : i);
                  }
                }}
                // Desktop Hover
                onMouseEnter={() => setActiveCard(i)}
                onMouseLeave={() => setActiveCard(null)}
                tabIndex={0}
                role="button"
                aria-label={`Flip card: ${card.front}`}
                aria-expanded={isFlipped}
              >
                {/* Flipping Design*/}
                <div
                  className="relative w-full h-full transition-all duration-700 ease-out rounded-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    boxShadow: isFlipped ? `0 0 30px ${card.glow}` : "none",
                  }}
                >
                  {/* Front of the card */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 border border-white/70 md:border-white/30 bg-[#111] backdrop-blur-md transition-all duration-300 group-hover:bg-[#1a1a1a] group-hover:border-white/70 group-hover:-translate-y-2 group-hover:shadow-2xl"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {/*The icon circle*/}
                    <div className="mb-6 p-4 rounded-full bg-white/5 border border-white/30 shadow-inner transition-transform duration-300 group-hover:scale-110">
                      {card.icon}
                    </div>
                    <p className="text-2xl font-bold text-white tracking-wide mb-2">
                      {card.front}
                    </p>
                    <p className={`font-mono text-xs tracking-[0.2em] uppercase sm:hidden mt-14 ${card.themeText}`}>
                      Tap to view
                    </p>
                  </div>

                  {/* Back of the cards */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center p-8 border border-white/50 overflow-hidden"
                    style={{
                      background: card.gradient,
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/60 w-full">
                      {card.backTitle}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed font-light">
                      {card.back}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------
// THE CONTACTS SECTION
function SocialsSection() {
  const [ref, visible] = useReveal(0.1);
  const links = [
    {
      href: "https://linkedin.com/in/bchege",
      label: "LinkedIn",
      color: "#0077b5",
      isCustom: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),      
    },

    {
      href: "https://wa.me/+254780940277",
      label: "WhatsApp",
      color: "#25D366",
      slug: "whatsapp",
    },

    {
      href: "mailto:bchege55200@gmail.com",
      label: "Gmail",
      color: "#EA4335",
      slug: "gmail",  
    },

    {
      href: "https://instagram.com/lu.ch.a_",
      label: "Instagram",
      color: "#E1306C",
      slug: "instagram",
    },
  ];

  return (
    <section className="relative py-14 px-6 text-center overflow-hidden" style={{ background: "#0f0b1e" }}>

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Let's Connect
          </h2>
        </div>

        {/*The Dock Design*/}
        <div
          ref={ref}
          className={`inline-flex justify-center items-center gap-2 sm:gap-4 p-2 rounded-4xl border border-[rgba(173,216,230,0.4)] transition-all duration-1000 ease-out shadow-2xl ${
            visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
          }`}
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* The individual buttons*/}
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              aria-label={l.label}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                "--brand-color": l.color,
                "--brand-glow": `0 10px 30px -10px ${l.color}`,
              }}
              className="group relative w-16 h-16 rounded-2xl flex items-center justify-center bg-[#151124] border border-[rgba(173,216,230,0.4)] transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-110 hover:border-transparent hover:z-20 hover:bg-(--brand-color) hover:shadow-(--brand-glow)"
            >
               <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                {l.isCustom ? (
                  /* Putting LinkedIn SVG */
                  <div className="w-7 h-7 flex items-center justify-center text-(--brand-color) group-hover:text-white transition-colors duration-300">
                    {l.icon}
                  </div>
                ) : (
                  /* The other icons */
                  <div className="relative w-7 h-7">
                    <img
                      src={`https://cdn.simpleicons.org/${l.slug}/${l.color.replace("#", "")}`}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                    />
                    {/* White icons on hover */}
                    <img
                      src={`https://cdn.simpleicons.org/${l.slug}/ffffff`}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                )}
              </span>

              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-[#1a162e] border border-white/10 text-white text-xs font-bold font-mono tracking-wider opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out whitespace-nowrap shadow-xl">
                {l.label}
                {/* The litle triangle*/}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a162e] border-b border-r border-white/10 rotate-45" />
              </span>
            </a>
          ))}
        </div>

        <p
          className="font-mono text-slate-500 text-sm mt-12 transition-all duration-700 delay-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          I am open to opportunities, collaborations and good conversations.
        </p>
      </div>
    </section>
  );
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// THE MAIN ABOUT PAGE
export default function AboutPage() {
    return(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration:0.5, ease: "easeOut"}}
          className="min-h-screen" 
        >     
         <ScrollProgress />
         <NavBar topOffset={36} />
         <main>
           <IntroSection />
           <CredentialsSection />
           <TechSection />
           <HobbiesSection />           
           <SocialsSection />
          </main>
        </motion.div>
  );
}