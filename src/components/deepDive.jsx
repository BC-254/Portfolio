import { useEffect, useRef, useState } from "react";

// Scroll-Reveal hook
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// Animated wrapper for staggered reveal of header elements
function AnimatedEl({ children, delay = 0, className = "", as: Tag = "div" }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
/* THE CARDS DESIGN */
// Arrow icon
function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 12L12 2M12 2H5M12 2V9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Cards data
const CARDS = [
  {
    index: "01",
    label: "Project re-imagined",
    href: "/sherialens",
    title: "SheriaLens: A Case Study",
    description:
      "How do you build an NLP model when your legal corpus is fragmented, vast and structurally inconsistent? A full-depth walkthrough and what it means for access to justice in Kenya.",
    tags: ["NLP", "Kenyan law", "Transformer", "Legal AI"],
    stats: [
      { val: "Kenya",  lbl: "Country in scope" },
      { val: "2",   lbl: "Courts currently modelled (KELRC and KEELC)" },
      { val: "5",  lbl: "The range of years currently covered" },
    ],
    cta: "Enter case study",
    ariaLabel: "Open SheriaLens case study",
    roundedClass: "rounded-2xl md:rounded-r-none md:rounded-l-2xl",
  },
  {
    index: "02",
    label: "Professional life",
    href: "/actuarial",
    title: "Actuarial Science",
    description:
      "Risk is not a number but a narrative. Explore the actuarial thinking behind the data: mortality surfaces, ruin probability, credibility theory, and what it means to price uncertainty in an East African market.",
    tags: ["Mortality tables", "VaR modelling", "Solvency II", "GLM pricing"],
    stats: [
      { val: "∞",    lbl: "Possible futures" },
      { val: "p(ψ)", lbl: "Ruin probability" },
      { val: "KE",   lbl: "Market context" },
    ],
    cta: "Explore the risk world",
    ariaLabel: "Open actuarial professional life section",
    roundedClass: "rounded-2xl md:rounded-l-none md:rounded-r-2xl",
  },
];

// The individual cards
function DestCard({ card, delay }) {
  const [ref, visible] = useReveal(0.1);

  return (
    <a    
      ref={ref} //When user scrolls and the card enters the viewport
      href={card.href}
      aria-label={card.ariaLabel}
      className={[  //Put them in a single list array and join with spaces for easier maintenance
        "group relative flex-1 block no-underline",
        "p-7 sm:p-9",
        card.roundedClass,
        "border-2 border-blue-400/50", 
        "bg-[#111111]",
        "overflow-hidden cursor-pointer",
        "transition-all duration-500",
        "hover:-translate-y-2",
        "hover:shadow-[0_20px_40px_-15px_rgba(200,185,140,0.10)]",
        "active:scale-[0.98]",
        "focus:outline-none focus:border-blue-400 md:focus:border-[rgba(200,185,140,0.40)]", //Light Blue on Mobile
        "touch-manipulation",
      ].join(" ")}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {/* Bar at the top of the cards*/}
      <div
        className="absolute top-0 left-0 h-0.5 w-0 bg-linear-to-r from-[#c8b98c] to-[#e8d9b0] transition-all duration-500 group-hover:w-full"
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      />

      {/* Hover box over the entire card*/}
      <div className="absolute inset-0 bg-linear-to-br from-[rgba(200,185,140,0.10)] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* The Cards Content */}
      {/* Label */}
      <div className="relative z-10">
        <p className="text-[0.62rem] tracking-[0.18em] text-[#c8b98c] uppercase mb-3">
          {card.label}
        </p>
        {/* The Title */}
        <h3 className="text-[clamp(1.6rem,3vw,2.2rem)] font-normal text-[#f0ebe0] leading-[1.15] tracking-[-0.02em] mb-4 whitespace-pre-line">
          {card.title}
        </h3>
        {/* Description */}
        <p className="text-[0.90rem] text-[#6b6860] leading-[1.75] mb-6">
          {card.description}
        </p>
        {/* The tags*/}
        <div className="flex flex-wrap gap-2 opacity-100 translate-y-0 md:opacity-60 md:translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="text-[0.6rem] tracking-widest py-0.75 px-2 border border-[#83ef0833] rounded-xs text-[#80989a]"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Statistics */}
        <div className="flex gap-6 flex-wrap border-t border-[rgba(200,185,140,0.08)] pt-4 mt-6">
          {card.stats.map((s) => (
            <div key={s.lbl}>
              <span className="block text-xl font-light text-[#c8b98c]">
                {s.val}
              </span>
              <span className="text-[0.58rem] tracking-[0.12em] text-[#6b6860] uppercase">
                {s.lbl}
              </span>
            </div>
          ))}
        </div>        
        {/* Call to Action */}
        <div
          className="inline-flex items-center gap-2 text-[0.68rem] text-[#c8b98c] tracking-[0.08em] mt-8 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          {card.cta}
          <ArrowIcon />
        </div>
      </div>
    </a>
  );
}

export default function DeepDive() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      aria-label="Portfolio deep-dive destinations"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          animation: "gridDrift 10s linear infinite",
        }}
        aria-hidden="true"
      />

      {/* gridDrift keyframe */}
      <style>{`
        @keyframes gridDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50%       { opacity: 1;   transform: scaleY(1.3); }
        }
      `}</style>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-14 sm:mb-20 flex flex-col items-center text-center mx-auto max-w-2xl"> 
        {/* The Eyebrow */}
          <AnimatedEl delay={100}>
            <p className="font-['DM_Mono',monospace] text-[0.65rem] tracking-[0.2em] text-[#f2f0eb9a] uppercase mb-4">
              Deep dive
            </p>
          </AnimatedEl>
            {/* The main title */}
          <AnimatedEl delay={250}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight text-[#f0ebe0] tracking-[-0.02em]">
              A tale of two worlds.
            </h2>
          </AnimatedEl>
              {/* The Description */}
          <AnimatedEl delay={400}>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed">
              The work behind the work. The full case study of SheriaLens and an actuarial sneakpeak into the numbers that govern real risk.
            </p>
          </AnimatedEl>
        </div>

        {/* Card Side-Side Design */}
        <div className="flex flex-col md:flex-row items-stretch gap-8 md:gap-0">
          <DestCard card={CARDS[0]} delay={120} />

          {/* Book-Design Connector */}
          <div
            className="flex flex-row md:flex-col items-center justify-center gap-2 md:gap-1.5 shrink-0 px-1 py-1 md:py-0"
            aria-hidden="true"
            /* Dots and lines connecting the cards */
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(200,185,140,0.25)]" /> {/* The circle */}
            <div className="h-px md:h-auto md:w-px flex-1 min-w-10px md:min-h-10px bg-[rgba(200,185,140,0.10)]" /> {/* The line */}
            <span className="text-[0.58rem] tracking-[0.14em] text-[#3d3c38] uppercase md:[writing-mode:vertical-rl]">
              and
            </span>
            <div className="h-px md:h-auto md:w-px flex-1 min-w-10px md:min-h-10px bg-[rgba(200,185,140,0.10)]" /> {/* The bottom line */}
            <div className="w-1.5 h-1.5 rounded-full bg-[rgba(200,185,140,0.25)]" />    {/* The bottom circle */}
          </div>

          <DestCard card={CARDS[1]} delay={240} />
        </div>

        
        </div>
        
    </section>
  );
}