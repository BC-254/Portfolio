import { useState, useEffect, useRef } from "react";
import {motion} from "framer-motion";
import NavBar from "./NavBar";
import profilePic from '../assets/Profile_Photo.png';


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
            {/* Availability badge*/}
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0f0b1e]" title="Available for work" />
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
                the gap between traditional risk assessment and modern predictive analytics.
                Expert at transforming complex datasets into actionable,
                data-driven risk management solutions.
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
        
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Credentials & Education
          </h2>
        </div>

        {/* The Education Container */}
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
                    transform: visible ? "translateY(0)" : "translateY(30px)",
                    transitionDelay: `${i * 200}ms` 
                  }}
                >
                  {/* The Glowing Dot */}
                  <div className="absolute left-5 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#0f0b1e] z-10 -translate-x-1.75 md:-translate-x-1/2 mt-1.5 md:mt-8 transition-transform duration-300 hover:scale-150"
                       style={{ background: item.color}} 
                  />

                  {/* Forcing the card to one side on desktop */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* The Content Card */}
                    <div 
                      className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
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
                        {/* A custom tech/circuit pattern SVG */}
                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M0,20 Q25,30 50,20 T100,20" stroke="white" strokeWidth="0.5" fill="none" />
                          <path d="M0,80 Q25,70 50,80 T100,80" stroke="white" strokeWidth="0.5" fill="none" />
                          <circle cx="50" cy="20" r="1.5" fill="white" />
                          <circle cx="25" cy="75" r="1" fill="white" />
                          <circle cx="75" cy="75" r="1.5" fill="white" />
                          <path d="M50,20 L25,75 M50,20 L75,75" stroke="white" strokeWidth="0.2" fill="none" strokeDasharray="2,2" />
                          {/* Topographic grid overlay */}
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.1"/>
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>

                      {/* The "Power LED" Hover Effect */}
                      <div 
                        className="absolute -inset-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" 
                        style={{ 
                          // When hovered, the edges light up like a powered-on device
                          background: `linear-gradient(135deg, ${item.color}40 0%, transparent 40%, transparent 60%, ${item.color}20 100%)`,
                          maskImage: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: "1px"
                        }} 
                      />
                      
                      {/* Your existing content stays exactly the same! */}
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

// Section title component 
function SectionTitle({ title }) {
  return (
    <div className="text-center">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
      <div className="h-1 w-14 rounded-full mx-auto" style={{ background: "linear-gradient(90deg,#7c3aed,#f472b6)" }} />
    </div>
  );
}

// TECHNICAL ECOSYSTEM SECTION 
function TechSection() {
  const [ref, visible] = useReveal(0.1);
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
    <section className="py-20 px-6" style={{ background: "#13102a" }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="Technical Ecosystem" />
        <div
          ref={ref}
          className={`grid md:grid-cols-3 gap-7 mt-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {categories.map((cat, ci) => (
            <div
              key={cat.label}
              className="rounded-2xl p-7 border border-white/5 hover:-translate-y-2 transition-transform duration-300"
              style={{
                background: "#1a162e",
                borderTop: `3px solid ${cat.accent}`,
                transitionDelay: `${ci * 100}ms`,
              }}
            >
              <h3 className="flex items-center gap-3 text-lg font-semibold text-white mb-6">
                <span className="text-2xl" aria-hidden>{cat.icon}</span>
                {cat.label}
              </h3>
              <ul className="space-y-5">
                {cat.skills.map((sk) => (
                  <li key={sk.name}>
                    <p className="text-sm font-semibold mb-1" style={{ color: cat.accent }}>
                      {sk.name}
                    </p>
                    {sk.detail && (
                      <p className="text-xs text-slate-500 leading-relaxed">{sk.detail}</p>
                    )}
                    {sk.tags && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {sk.tags.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2.5 py-0.5 rounded-md border border-sky-400/20 text-sky-300"
                            style={{ background: "rgba(56,189,248,0.08)" }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Flip cards 
function HobbiesSection() {
  const [ref, visible] = useReveal(0.1);
  const [flipped, setFlipped] = useState({});

  const toggle = (i) => setFlipped((f) => ({ ...f, [i]: !f[i] }));

  const cards = [
    {
      icon: "💻",
      front: "The Coder",
      backTitle: "Problem Solver",
      back: "I don't just write code; I architect solutions. Whether automating a spreadsheet or building a predictive model, I love the thrill of making things work efficiently.",
    },
    {
      icon: "⚽",
      front: "The Baller",
      backTitle: "On & Off Pitch",
      back: "Avid footballer who loves the physical challenge of a match, equally competitive on the console. Balancing turf with gaming is how I recharge and stay focused.",
    },
    {
      icon: "✍️",
      front: "The Creator",
      backTitle: "Creative Soul",
      back: "Data tells the truth, but stories sell it. Writing allows me to explore the emotional side of the digital revolution and keeps my imagination vivid.",
    },
    {
      icon: "🔬",
      front: "The Techie",
      backTitle: "Obsessed",
      back: "I live and breathe technology. Whether optimizing code or dissecting AI trends, I view technology as the ultimate creative canvas where logic meets imagination.",
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "#0f0b1e" }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle title="My Core Algorithm" />
        <p className="text-center text-sm text-slate-500 mt-2 mb-12">
          Tap a card to flip it
        </p>
        <div
          ref={ref}
          className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {cards.map((card, i) => (
            <div
              key={card.front}
              className="h-72 cursor-pointer"
              style={{ perspective: "1000px" }}
              onClick={() => toggle(i)}
              onKeyDown={(e) => e.key === "Enter" && toggle(i)}
              tabIndex={0}
              role="button"
              aria-label={`Flip card: ${card.front}`}
              aria-pressed={!!flipped[i]}
            >
              <div
                className="relative w-full h-full transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 border border-white/5"
                  style={{ background: "#1a162e", backfaceVisibility: "hidden" }}
                >
                  <span className="text-5xl" aria-hidden>{card.icon}</span>
                  <p className="text-lg font-semibold text-white">{card.front}</p>
                  <span className="text-xs text-slate-500">tap to flip</span>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 text-center border border-white/10"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <p className="text-lg font-bold text-white border-b border-white/20 pb-2 w-full text-center">
                    {card.backTitle}
                  </p>
                  <p className="text-sm text-violet-100 leading-relaxed">{card.back}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Fun facts ──────────────────────────────────────────────────────────────
function FactsSection() {
  const [ref, visible] = useReveal(0.1);
  const facts = [
    {
      icon: "🧹",
      title: "Certified Clean Freak",
      desc: "I treat my apartment like my datasets: null values (dust) are not tolerated, outliers (stray socks) are investigated, and everything must be normalized before I can function.",
    },
    {
      icon: "🎵",
      title: "French Playlist Obsession",
      desc: "I analyze data in English, but I vibe exclusively to French songs. A deep, unapologetic obsession that powers my late-night coding sessions. C'est la vie.",
    },
    {
      icon: "❤️",
      title: "The Empathetic Engineer",
      desc: "I believe the best code doesn't just function — it cares. I build technology that feels less like a machine and more like a supportive partner.",
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "#13102a" }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle title='The "Unfiltered" Stats' />
        <div
          ref={ref}
          className={`flex flex-wrap justify-center gap-6 mt-12 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {facts.map((f, i) => (
            <div
              key={f.title}
              className="flex items-start gap-4 max-w-sm rounded-2xl p-5 border border-white/5 hover:scale-105 hover:border-violet-500/40 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#f472b6)",
                  boxShadow: "0 0 15px rgba(124,58,237,0.4)",
                }}
                aria-hidden
              >
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">{f.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Socials / Connect ──────────────────────────────────────────────────────
function SocialsSection() {
  const [ref, visible] = useReveal(0.1);
  const links = [
    { href: "https://linkedin.com/in/bchege", label: "LinkedIn", icon: "in", color: "#0077b5" },
    { href: "https://wa.me/+254790002282", label: "WhatsApp", icon: "💬", color: "#25D366" },
    { href: "mailto:bchege55200@gmail.com", label: "Email", icon: "✉️", color: "#EA4335" },
    { href: "https://instagram.com/lu.ch.a_", label: "Instagram", icon: "📸", color: "#E1306C" },
  ];

  return (
    <section className="py-20 px-6 text-center" style={{ background: "#0f0b1e" }}>
      <div className="max-w-3xl mx-auto">
        <SectionTitle title="Let's Connect" />
        <div
          ref={ref}
          className={`inline-flex flex-wrap justify-center gap-4 mt-12 p-5 rounded-2xl border border-white/5 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              aria-label={l.label}
              className="relative group w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-white/10 text-slate-400 transition-all duration-300 hover:-translate-y-2 hover:scale-110 hover:text-white"
              style={{ background: "#1a162e" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = l.color;
                e.currentTarget.style.boxShadow = `0 10px 20px rgba(0,0,0,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#1a162e";
                e.currentTarget.style.boxShadow = "none";
              }}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <span aria-hidden>{l.icon}</span>
              {/* Tooltip */}
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {l.label}
              </span>
            </a>
          ))}
        </div>
        <p className="text-slate-600 text-sm mt-8">
          Open to opportunities, collaborations, and good conversations.
        </p>
      </div>
    </section>
  );
}

// ── Root component ──────────
export default function AboutPage() {
    return(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration:0.5, ease: "easeOut"}}
          className="min-h-screen" style={{ background: "#0f0b1e" }}
          style={{ background: "#0f0b1e" }}
        >     
         <ScrollProgress />
         <NavBar topOffset={36} />
         <main>
           <IntroSection />
           <CredentialsSection />
           <TechSection />
           <HobbiesSection />
           <FactsSection />
           <SocialsSection />
          </main>
        </motion.div>
  );
}