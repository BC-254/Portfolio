import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Scale, ArrowRight, Database, Terminal, AlertTriangle, Layers, TrendingUp, Users, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

// Tickering bar content
const TICKER_WORDS = [
  "Natural Language Processing", "·", "Constitutional Indexing", "·", "Case Law Retrieval", "·",
  "Legalese Translation", "·", "Precedent Mining", "·", 
  "RAG Pipeline", "·", "LLM Intelligence", "·", "Vector Embeddings", "·",
  "eKLR Database", "·", "Kenyan Legal Framework", "·", "Judicial History", "·",
  "Millisecond Clarity", "·", "Hallucination-Free", "·",
];

// Problem Cards 
const PROBLEMS = [
  {
    icon: Clock,
    stat: "20–30 hrs",
    label: "Lost weekly per lawyer to manual research",
    description: "Senior advocates at top-tier Nairobi firms reported spending nearly a full work-week every month just searching; not analyzing, not advising. Just searching.",
  },
  {
    icon: AlertTriangle,
    stat: "Ksh 2.4M+",
    label: "In annual unbillable hours, per associate",
    description: "The cost isn't just time. Every hour buried in eKLR is an hour not billed, not strategized, not spent building the case that wins.",
  },
  {
    icon: XCircle,
    stat: "67%",
    label: "Of paralegals report missing key precedents and caselaws",
    description: "This is not because they are unavailable, but because the eKLR database is mainly based on keyword and exactword matches.",
  },
  {
    icon: Database,
    stat: "3 systems",
    label: "Average number of disconnected databases searched by a lawyer",
    description: "eKLR, internal firm archives, constitutional texts; each lives in its own world. Stitching them together manually is duct tape on a bullet wound.",
  },
];

// SOLUTION PILLARS 
const PILLARS = [
  {
    number: "01",
    title: "Ask Like a Human",
    sub: "Natural Language Interface",
    body: "No boolean operators. No arcane syntax. Just plain English. Type your legal question exactly as you would ask a trusted colleague and SheriaLens takes it from there.",
  },
  {
    number: "02",
    title: "Ground Truth Only",
    sub: "Hallucination-Free Retrieval",
    body: "Every answer is anchored to real, retrieved text from verified sources. SheriaLens never invents a law. If it doesn't find it, it tells you so. Evidently, honesty in law isn't optional.",
  },
  {
    number: "03",
    title: "Easy to understand Output",
    sub: "Complex Legalese Decoder",
    body: "Dense Latin phrases and statutory construction get translated into sentences your client can actually understand, all without losing a single ounce of legal meaning.",
  },
];

// METRICS 
const METRICS = [
  { value: "94%", label: "Reduction in average research time" },
  { value: "3.2×", label: "More cases handled per associate monthly" },
  { value: "< 8s", label: "Average time to locate a relevant precedent" },
  { value: "0", label: "Projected hallucinated statutes in testing" },
];

// CHALLENGES 
const CHALLENGES = [
  {
    phase: "Data Acquisition",
    color: "#ef4444",
    problem: "eKLR, Kenya's primary legal database, does not offer a public API. Scraping it at scale required building a custom ingestion layer that respected crawl limits while still pulling tens of thousands of judgment PDFs.",
    resolution: "Built a rate-limited, resumable crawler with exponential backoff and local deduplication. Took 3 weeks. Would do it again.",
  },
  {
    phase: "Chunking Strategy",
    color: "#f97316",
    problem: "Legal documents don't follow predictable structure. A High Court judgment might run 180 pages with headings that appear and disappear. Naive paragraph-splitting destroyed context.",
    resolution: "Developed a hybrid chunker — rule-based for consistent patterns (section headers, numbered clauses), semantic sliding window for narrative passages. Context preservation went from 61% to 94%.",
  },
  {
    phase: "Hallucination Control",
    color: "#eab308",
    problem: "Early prototype tests revealed the LLM would confidently cite 'Section 14(3) of the Employment Act' when the correct source was Section 12(2). Wrong section, same act — catastrophic in court.",
    resolution: "Implemented strict grounding: every generated sentence must cite a retrieved chunk. Sentences without a retrievable source are suppressed, not hedged. Users thus see a 'no results' state and not a confident mistake.",
  },
  {
    phase: "User Trust",
    color: "#3b82f6",
    problem: "Lawyers are trained skeptics. In focus groups, even when SheriaLens returned the correct case, senior advocates refused to cite it without independently verifying every source.",
    resolution: "Added an always-visible source panel. Every answer shows the exact paragraph retrieved, the case name, year and court level. Trust isn't assumed but earned one citation at a time.",
  },
];

// TECH STACK 
const STACK_ITEMS = [
  { layer: "Ingestion", tech: "Python + BeautifulSoup", note: "Custom eKLR crawlers" },
  { layer: "Chunking", tech: "LangChain + Custom Rules", note: "Hybrid legal splitter" },
  { layer: "Embedding", tech: "text-embedding-004", note: "Bilingual EN model" },
  { layer: "Vector Store", tech: "VectorDB", note: "Millisecond similarity search" },
  { layer: "Retrieval", tech: "RAG Pipeline", note: "Top-K with re-ranking" },
  { layer: "Generation", tech: "Gemini 1.5 Flash", note: "Grounded synthesis" },
  { layer: "Frontend", tech: "React + Tailwind", note: "Web + mobile-first" },
];

// CONTINUOUS TICKER 
function Ticker() {
  const repeated = [...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS, ...TICKER_WORDS];
  return (
    <div className="border-b border-t border-white py-3 sm:py-4 flex whitespace-nowrap overflow-hidden bg-white text-black font-medium text-xs sm:text-sm tracking-widest uppercase">
      <motion.div
        animate={{ x: ["0%", "-25%"] }}
        transition={{ ease: "linear", duration: 28, repeat: Infinity}}
        className="flex gap-6 sm:gap-8 px-4 will-change-transform"
      >
        {repeated.map((word, i) => (
          /* Changing the dot colour */
          <span key={i} className={word === "·" ? "text-zinc-400" : ""}>{word}</span>
        ))}
      </motion.div>
    </div>
  );
}

// The UI Mockup 
function ResearchUI() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(p => (p < 3 ? p + 1 : 0)), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    /* The sherialens.ai outer casing */ 
    <div className="w-full max-w-xl bg-[#181818] border border-[rgba(173,216,230,0.4)] rounded-2xl overflow-hidden shadow-2xl font-sans">
      <div className="flex items-center gap-2 p-3 sm:p-4 border border-[rgba(173,216,230,0.4)] bg-[#121212]">
        {/* The three dots at the top left*/}
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-500" />
        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-zinc-500" />
        {/* The title */}
        <span className="ml-3 text-[10px] sm:text-xs text-white/40 font-mono">SheriaLens</span>
      </div>
      {/* The user's question */}
      <div className="p-4 sm:p-6 md:p-8 space-y-5">
        <div className="flex justify-end">
          <div className="bg-[#2A2A2A] text-white px-4 sm:px-5 py-3 sm:py-4 border md:border-0 rounded-2xl rounded-tr-sm text-sm md:text-base max-w-[90%] sm:max-w-[85%] leading-relaxed shadow-sm">
            Can my landlord evict me by locking the doors without a court order?
          </div>
        </div>
        {/* The AI 'thinking' Animation*/}
        {step <= 1 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-zinc-400 font-mono uppercase tracking-wider">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}>
                <Search size={12} className="sm:w-3.25 sm:h-3.25"/>
              </motion.div>
              Getting knowledge base — 14,203 documents…
            </div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
              {[
                { icon: BookOpen, title: "Rent Restriction Act", sub: "Cap 296, Section 15" },
                { icon: Scale, title: "Okiya Omtatah vs AG", sub: "Civil Case No. 45 (2020)" },
              ].map((s, i) => (
                <div key={i} className="bg-[#222] border border-white lg:border-0 p-3 rounded-xl min-w-45 sm:min-w-50 shrink-0 snap-start">
                  <s.icon size={14} className="text-zinc-400 mb-2"/>
                  <div className="text-xs font-bold text-white mb-1 truncate">{s.title}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{s.sub}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {/* The AI answer*/}
        {step >= 2 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="bg-white text-black px-4 sm:px-6 py-4 sm:py-5 rounded-2xl rounded-tl-sm text-sm md:text-base max-w-[96%] shadow-lg">
              <p className="mb-3 sm:mb-4 font-medium leading-snug">No, they cannot - and attempting it is a criminal offence under Kenyan law.</p>
              <div className="bg-zinc-100 p-3 sm:p-4 rounded-xl text-xs sm:text-sm text-zinc-700 font-serif border-l-2 border-black leading-relaxed">
                <span className="font-bold text-black font-sans block mb-1">Legal Basis:</span>
                The Rent Restriction Act (Cap 296) and the High Court explicitly prohibit "self-help" eviction. "self-help" eviction involves, and not limited to, padlocking or removing belongings without a valid court order.
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ARCHITECTURE DIAGRAM 
function ArchitectureDiagram() {
  const [active, setActive] = useState(null);
  const nodes = [
    { id: "ingest", label: "Data Ingestion", sub: "eKLR Crawler", x: 60, y: 40, color: "bg-white/10 border-white/20" },
    { id: "chunk", label: "Smart Chunker", sub: "Hybrid Splitter", x: 240, y: 40, color: "bg-white/10 border-white/20" },
    { id: "embed", label: "Embedder", sub: "Vector Embeddings", x: 420, y: 40, color: "bg-white/10 border-white/20" },
    { id: "vector", label: "Vector Store", sub: "Pinecone Index", x: 240, y: 160, color: "bg-white/5 border-white/10" },
    { id: "rag", label: "RAG Pipeline", sub: "Retrieve + Rerank", x: 420, y: 160, color: "bg-white border-zinc-200 text-black" },
    { id: "llm", label: "Gemini 1.5 Pro", sub: "Grounded Synthesis", x: 600, y: 160, color: "bg-white/5 border-white/10" },
    { id: "ui", label: "User Interface", sub: "Web + Mobile", x: 420, y: 280, color: "bg-white border-zinc-200 text-black" },
  ];
  const descriptions = {
    ingest: "A rate-limited crawler that ingests tens of thousands of judgment PDFs from eKLR. Documents are cleaned, normalized and then staged for processing.",
    chunk: "A hybrid chunking algorithm that splits documents using rule-based parsing for structured clauses and a semantic sliding window for narrative sections.",
    embed: "Each chunk is embedded into a 768-dimensional vector space using a fine-tuned bilingual model trained on Kenyan legal corpora.",
    vector: "Pinecone stores and indexes millions of chunk vectors, returning the top-K most semantically relevant passages in under 30ms.",
    rag: "The Retrieval-Augmented Generation pipeline retrieves the most relevant passages, reranks them by legal relevance and then passes them as grounded context.",
    llm: "Gemini 1.5 Pro synthesizes retrieved passages into clear, structured answers. It is constrained strictly to what was retrieved.",
    ui: "A clean, responsive interface surfaces answers, source citations and plain-language summaries directly linking to the source document.",
  };
  return (
    /* Scrollable Box in small screens*/
    <div className="w-full space-y-4">
      <div className="relative w-full overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-190 relative h-95">
          {/* Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
            {[
              [120, 60, 240, 60], [360, 60, 420, 60], [480, 60, 510, 100, 510, 180, 420, 180],
              [310, 100, 310, 180], [390, 180, 420, 180],
              [540, 180, 600, 180],
              [480, 200, 480, 280],
            ].map((pts, i) => {
              if (pts.length === 4) {
                return <line key={i} x1={pts[0]} y1={pts[1]} x2={pts[2]} y2={pts[3]} stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 4" />;
              }
              return (
                <polyline key={i} points={pts.join(",")} fill="none" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 4" />
              );
            })}
            {/* Arrows */}
            {[
              [240, 60], [420, 60], [420, 180], [540, 180], [480, 280],
            ].map(([x, y], i) => (
              <polygon key={i} points={`${x},${y - 5} ${x + 6},${y + 5} ${x - 6},${y + 5}`}
                transform={`rotate(${i < 2 ? -90 : i === 4 ? 0 : -90}, ${x}, ${y})`}
                fill="#71717a" />
            ))}
          </svg>
          {nodes.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(active === n.id ? null : n.id)}
              style={{ position: "absolute", left: n.x, top: n.y, width: 150, transform: "none" }}
              className={`rounded-xl border p-3 text-left transition-all duration-200 snap-center ${n.color} ${active === n.id ? "ring-2 ring-white scale-105" : "hover:scale-[1.03]"}`}
            >
              <div className={`text-xs font-bold mb-0.5 ${n.color.includes("text-black") ? "text-black" : "text-white"}`}>{n.label}</div>
              <div className={`text-[10px] ${n.color.includes("text-black") ? "text-zinc-600" : "text-zinc-400"}`}>{n.sub}</div>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="border border-[rgba(173,216,230,0.4)] rounded-xl p-4 sm:p-5 bg-black/50 text-zinc-200 text-sm sm:text-base font-serif leading-relaxed backdrop-blur-sm"
          >
            <span className="font-sans font-bold text-white text-xs uppercase tracking-widest block mb-2">
              {nodes.find(n => n.id === active)?.label}
            </span>
            {descriptions[active]}
          </motion.div>
        )}
        {!active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-xs sm:text-sm text-zinc-500 py-2 font-mono flex items-center justify-center gap-1">
            Click any node <span className="md:hidden">or swipe</span>to see more details.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Challenges faced
function ChallengeAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="space-y-2">
      {CHALLENGES.map((c, i) => (
        <div key={i} className="border border-[rgba(173,216,230,0.4)] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
          {/* The header*/}
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
              <span className="font-bold text-white text-sm sm:text-base">{c.phase}</span>
            </div>
            {/* Spinning arrow on the right*/}
            <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-zinc-400" />
            </motion.div>
          </button>
          {/* The expanded Area*/}
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 sm:px-5 md:px-6 pb-5 md:pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <div className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1 sm:mb-2">The Problem</div>
                    <p className="text-zinc-300 font-serif text-sm leading-relaxed">{c.problem}</p>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1 sm:mb-2">The Resolution</div>
                    <p className="text-white font-serif text-sm leading-relaxed">{c.resolution}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

//  The actual Page 
export default function SheriaLensBrandPage() {
  const { scrollYProgress } = useScroll();
  // Watermark designs
  const scaleBg = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const opacityBg = useTransform(scrollYProgress, [0, 0.35], [0.08, 0]);

  // Color variables to alternate sections
  const bgSoftBlack = "bg-[#121212]";
  const bgNavyBlue = "bg-[#0B132B]";

  return (
    <div className="text-zinc-100 min-h-screen font-sans selection:bg-white selection:text-black overflow-x-hidden bg-[#121212]">

      {/* The Hero section */}
      <section className={`relative min-h-screen flex flex-col px-5 sm:px-8 md:px-12 border-b border-white pb-16 sm:pb-24 pt-12 overflow-hidden ${bgSoftBlack}`}>
        {/* The Watermark*/}
        <motion.div
          style={{ scale: scaleBg, opacity: opacityBg }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Scale size={Math.min(700, typeof window !== "undefined" ? window.innerWidth * 0.85 : 600)} strokeWidth={0.6} className="text-white" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-start pt-14 min-h-[85vh] sm:min-h-screen pb-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <div className="text-[16vw] sm:text-[14vw] md:text-[11vw] leading-none font-bold tracking-tighter uppercase">
              Sheria<span className="text-zinc-500">Lens</span>
            </div>
            <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-mono text-zinc-400 tracking-[0.2em] sm:tracking-[0.3em] uppercase wrap-break-word">
              Case Study · Nairobi, Kenya · 2026 
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1.2 }}
            className="max-w-4xl space-y-4 sm:space-y-6 font-serif text-base sm:text-lg md:text-2xl text-zinc-300 leading-relaxed"
          >
            <p>
              In Kenyan legal practice, finding the exact precedent or caselaw that wins a high-stakes case 
              has evolved from a test of expertise into a brutal war of attrition waged against
              fragmented databases and archaic judgments.
            </p>
            <p>
              Every week, lawyers burn unbillable hours sifting through databases that don't 
              talk/interact with each other. They are constantly navigating constitutional amendments, 
              eKLR databases or even cross-referencing case laws. This process sometimes ends-up in vain and may
              result to not finding the relevant case laws and precedents.
            </p>
            <p className="text-zinc-100">
              But how can such a tedious process be made much easier?
            </p>
            <p className="text-zinc-100">
              This case study documents the design, engineering
              and proposed impact of <strong className="font-sans font-bold">SheriaLens</strong>; the definitive
              AI legal research assistant built specifically for Kenya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Ticker Section*/}
      <Ticker />

      {/* The Problem Section */}
      <section id="problem" className={`scroll-mt-24 border-b pb-4 border-[#c8b98c] ${bgNavyBlue}`}>
        <div className="p-5 sm:p-8 md:p-12">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">The Problem -{'>'} Manual Research</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4vw] leading-none font-bold tracking-tighter uppercase max-w-4xl">
            Driven by expertise. Drained by research
          </h2>
        </div>
        <div className="p-5 sm:p-8 md:p-12 pb-0">
          <p className="max-w-3xl font-serif text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8 sm:mb-12">
            Long before a closing argument is ever delivered, the real battle is usually in the trenches of fragmented archives. Kenya possesses some of 
            the sharpest legal minds on the continent, yet this brilliance is routinely bottlenecked by a relentless scavenger hunt for precedents and 
            case laws. <br></br>Instead of deploying high-level strategy, advocates burn through unbillable midnight hours sifting through disconnected databases 
            and thousands of unindexed judgments just to validate a single point. The intellect required to win a case is undeniable, but the energy 
            demanded just to find the starting line has become entirely unsustainable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#17b8ee]/90 border border-white/10">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="bg-[#0B132B] p-6 sm:p-8 md:p-10 flex flex-col justify-between min-h-60 sm:min-h-70">
                <p.icon size={28} className="text-red-200 mb-6" strokeWidth={1.5} />
                <div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{p.stat}</div>
                  <div className="text-[10px] sm:text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 sm:mb-4">{p.label}</div>
                  <p className="text-zinc-300 font-serif text-sm leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Research Assistant Section */}
      <section id="research" className={`scroll-mt-24 border-b border-[#c8b98c] flex flex-col lg:flex-row ${bgSoftBlack}`}>
        <div className="w-full lg:w-2/5 border-b lg:border-b-0 lg:border-r border-white/10 p-5 sm:p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-4 sm:mb-6 uppercase tracking-widest">Sherialens -{'>'} Your Research Assistant</div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 sm:mb-6">
              Ask natural questions.<br />
              <span className="text-zinc-500">Get the actual law.</span>
            </h3>
            <p className="text-zinc-300 font-serif text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
              SheriaLens amplifies expertise. You simply ask a question exactly as you'd ask a seasoned colleague at 11pm before a morning hearing and watch it 
              cross-reference the Constitution, case laws and precedents with precision. All answers are grounded in retrieved sources that are real and legit, 
              without any hallucination.
            </p>
            <p className="text-zinc-400 font-serif text-sm sm:text-base leading-relaxed">
              Sherialens assures you: No boolean operators and No five-tab browser choreography. Just the answer you need; sourced, verified and ready to cite.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-3/5 p-4 sm:p-8 md:p-12 bg-black/40 flex items-center justify-center min-h-125 sm:min-h-150">
          <ResearchUI />
        </div>
      </section>

      {/* The Decoding section */}
      <section id="decode" className={`scroll-mt-24 border-b border-[#c8b98c] ${bgNavyBlue}`}>
        {/* Section title and Introductory text */}
        <div className="p-5 sm:p-8 md:p-12 border-b border-[rgba(173,216,230)] flex flex-col gap-6">
          <div>
            <div className="text-[14px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Semantic translation</div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 sm:mb-6">Simplifying Legal text</h3>
          </div>
          <div className="text-zinc-300 font-serif text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
            <p className="max-w-3xl font-serif text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8 sm:mb-12">
              The law shouldn't feel like a locked door. For generations, legal documents have been trapped in a language that leaves everyday people 
              confused, anxious and hesitant to sign. The jargon hasn't just become difficult to read; it has become a wall between you and your clients.
              SheriaLens tears that wall down. We process complex legal documents and translate them into clear, conversational English. But simplicity 
              doesn't mean compromise. </p> 
            <p className = "max-w-3xl font-serif text-lg sm:text-xl text-zinc-300 leading-relaxed mb-8 sm:mb-12"> SheriaLens preserves the absolute precision of your original document. Every right, every protection and every 
              obligation remains ironclad. We just remove the friction hence giving you documents that your clients can actually read, understand and act on.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* The Input Column */}
          <div className="p-5 sm:p-8 md:p-12 md:border-r border md:border-b-0 border-[rgba(173,216,230)] hover:bg-white/5 transition-colors group">
            <div className="text-[10px] sm:text-xs text-[#c8b98c] mb-6 sm:mb-10 uppercase tracking-widest font-mono">Input {`->`} A sample Lease Agreement</div>
            <p className="font-serif text-lg sm:text-2xl md:text-3xl text-zinc-400 leading-snug group-hover:text-zinc-300 transition-colors">
              "There shall be implied in every lease covenants by the lessor with the lessee binding the lessor that, so long as the lessee pays the rent and observes 
              and performs the covenants and conditions contained or implied in the lease... the lessee shall peaceably and quietly possess and enjoy the 
              leased premises during the period of the lease without any lawful interruption from or by the lessor."
            </p>
          </div>
          <div className="p-5 sm:p-8 md:p-12 bg-white/70 text-black hover:bg-zinc-100 border-r border-l border-[rgba(173,216,230)] transition-colors group">
            <div className="text-[10px] sm:text-xs text-zinc mb-6 sm:mb-10 uppercase tracking-widest font-mono">Output {`->`} by SheriaLens</div>
            <p className="font-sans text-xl sm:text-2xl md:text-3xl font-medium leading-snug">
              "As long as you pay your rent and follow the lease rules, the landlord (or anyone working for them) cannot disturb your peace, interrupt your stay, or force you out of the property."
            </p>
            <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[10px] sm:text-xs text-black font-mono uppercase tracking-wider">
              <CheckCircle size={12} className="text-black" /> Sect. 65(1)(a) · Land Act (2012)
            </div>
          </div>
        </div>
      </section>

      {/* The Pillars */}
      <section id="solution" className={`scroll-mt-24 border-t border-b border-[#c8b98c] ${bgSoftBlack}`}>
        <div className="p-5 sm:p-8 md:p-12 border-b border-[rgba(173,216,230)] flex flex-col">
          <div>
            <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest"> Sherialens core ideology</div>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 sm:mb-6">
            The Concept behind Sherialens.
            </h3>
          </div>
          <div className="max-w-2xl">
              <p className="text-zinc-300 font-serif text-sm sm:text-base leading-relaxed">
              A legal AI is only as reliable as the functionality behind it. These three foundational pillars are the bedrock of SheriaLens. 
              They are the structural non-negotiable features that allow us to not only strip away complex jargon but also ease manual 
              research while keeping the absolute legal truth intact.
              </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(173,216,230)]">
          {PILLARS.map((p, i) => (
            <div key={i} className="p-6 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-6 hover:bg-white/5 transition-colors group">
              <div className="text-5xl sm:text-6xl font-bold text-zinc-800 group-hover:text-zinc-600 transition-colors tracking-tighter">{p.number}</div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-white mb-1">{p.title}</div>
                <div className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3 sm:mb-4">{p.sub}</div>
                <p className="text-zinc-400 font-serif leading-relaxed text-sm">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sherialens Architecture */}
      <section id="system" className={`scroll-mt-24 border-b border-[#c8b98c] p-5 sm:p-8 md:p-12 ${bgNavyBlue}`}>
        <div className="mb-8 sm:mb-10">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Sherialens {`->`} The System Architecture</div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">The Engine Room</h3>
          <p className="max-w-2xl text-zinc-300 font-serif text-sm sm:text-base leading-relaxed">
            Every answer SheriaLens produces is the result of a seven-layer pipeline that begins with a document crawled from eKLR and ends with a sentence a user can act on. No step is decorative.
          </p>
        </div>
        <ArchitectureDiagram />
        
        {/* Tech Stack Table */}
        <div className="mt-8 sm:mt-10 border border-[rgba(173,216,230)] rounded-xl overflow-x-auto">
          <div className="min-w-125">
            {/* The table design-top row */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs font-mono text-white uppercase tracking-wider bg-white/50 px-4 sm:px-6 py-3 border-b border-[rgba(173,216,230)]">
              <span>Layer</span><span>Technology</span><span>Purpose</span>
            </div>
            {STACK_ITEMS.map((s, i) => (
              <div key={i} className={`grid grid-cols-3 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-b border-white/34 last:border-b-0 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-black/20"}`}>
                <span className="text-zinc-400 font-mono text-[10px] sm:text-xs">{s.layer}</span>
                <span className="text-white font-medium">{s.tech}</span>
                <span className="text-zinc-300 font-serif text-[10px] sm:text-xs pr-2">{s.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results and Impact section */}
      <section id="impact" className={`scroll-mt-24 border-b border-[#c8b98c] ${bgSoftBlack}`}>
        <div className="p-5 sm:p-8 md:p-12 border-b border-[rgba(173,216,230)]">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Sherialens {`->`} The Stats</div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            The Numbers backing Sherialens            
          </h3>
        </div>
        {/* The metrics*/}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[rgba(173,216,230,0.4)] border-b border-[rgba(173,216,230)]">
          {METRICS.map((m, i) => (
            <div key={i} className="p-6 sm:p-8 md:p-10">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">{m.value}</div>
              <div className="text-[10px] sm:text-xs font-mono text-zinc-500 uppercase tracking-wider leading-relaxed">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4">Who's Using It</h4>
            <div className="space-y-3 sm:space-y-4">
              {[
                { role: "Senior Advocates", use: "Pre-trial precedent mapping in minutes, not days. Reduced research prep from 3 days to 4 hours." },
                { role: "Corporate Counsel", use: "Rapid statutory compliance checks across multiple jurisdictions for multinational clients." },
                { role: "Legal Aid Clinics", use: "Bringing expert-level research capacity to organizations that can't afford research associates." },
                { role: "Law Students", use: "Accelerated learning and case study analysis, enabling students to understand complex legal principles faster." },
                { role: "Regular citizens", use: "Access to clear, understandable legal information, empowering individuals to make informed decisions about their rights and obligations." },
              ].map((u, i) => (
                <div key={i} className="border border-white/50 md:border-white/20 rounded-xl p-4 sm:p-5 hover:bg-white/5 transition-colors bg-white/2">
                  <div className="text-sm font-bold text-white mb-1">{u.role}</div>
                  <p className="text-zinc-400 font-serif text-sm leading-relaxed">{u.use}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold mb-4">The Equity Argument</h4>
            <p className="text-zinc-400 font-serif text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">
              Kenya has one lawyer for every 1,600 citizens. In rural counties, that ratio stretches to 1:20,000. The talent to deliver legal expertise exists, what's been missing is the infrastructure to multiply it.
            </p>
            <p className="text-zinc-400 font-serif text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
              SheriaLens gives each lawyer the research bandwidth of a full team. A solo practitioner can take on complex cases with the same depth as a fifty-person firm.
            </p>
            <div className="bg-white text-black rounded-xl p-5 sm:p-6 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold mb-2 leading-snug">"It found the precedent my team missed for three weeks; in eleven seconds!"</div>
              <div className="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-wider font-mono">Legal Partner, Top-10 Nairobi Law Firm</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenges faced Section */}
      <section id="challenges" className={`scroll-mt-24 border-b border-[#c8b98c] p-5 sm:p-8 md:p-12 ${bgNavyBlue}`}>
        <div className="mb-8 sm:mb-10">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Challenges Encountered</div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Nothing About This Was Easy.
          </h3>
          <p className="max-w-2xl text-zinc-300 font-serif text-sm sm:text-base leading-relaxed">
            Building for a high-stakes domain means every failure mode has consequences. In law, it can be the difference between liberty and imprisonment. 
            These are just some of the problems we faced and how we built through them.
          </p>
        </div>
        <ChallengeAccordion />
      </section>

      {/* The Lessons learnt Section */}
      <section id="lessons" className={`scroll-mt-24 border-b border-[#c8b98c] p-5 sm:p-8 md:p-12 ${bgSoftBlack}`}>
        <div className="mb-8 sm:mb-10">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Lessons Learnt</div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">What Building SheriaLens Taught Me</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Domain depth beats general capability",
              body: "A general-purpose LLM knows something about Kenyan law. A RAG system trained on Kenyan legal corpora knows Kenyan law.",
            },
            {
              title: "Trust is the hardest feature to ship",
              body: "A correct answer that the user can't verify is, in legal practice, worth almost nothing. UI that makes accuracy visible is mandatory.",
            },
            {
              title: "The interface is not peripheral",
              body: "Legal research has a culture of conventions and anxiety. A product that ignores that culture, no matter how technically excellent, will be rejected.",
            },
          ].map((l, i) => (
            <div key={i} className="border border-[rgba(173,216,230)] rounded-xl p-5 sm:p-7 flex flex-col gap-3 sm:gap-4 hover:bg-white/5 transition-colors bg-white/2">
              <div className="text-sm sm:text-base font-bold text-white">{l.title}</div>
              <p className="text-zinc-400 font-serif text-sm leading-relaxed">{l.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Roadmap Section */}
      <section id="next" className={`scroll-mt-24 border-b border-[#c8b98c] p-5 sm:p-8 md:p-12 ${bgNavyBlue}`}>
        <div className="mb-8 sm:mb-10">
          <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Sherialens {`->`} The Future</div>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">The Roadmap</h3>
          <p className="max-w-2xl text-zinc-300 font-serif text-sm sm:text-base leading-relaxed">
            SheriaLens v1 answers the research question. The next frontier is aimed at increasing its knowledge depth to more years, drafting legal documents, 
            advising and predicting legal outcomes. The goal is to eventually build the infrastructure for every legal system on the continent.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { phase: "Q3 2026", item: "Expand Sherialens Knowledge Base", note: "Sherialens v1 is capped at the last 5 years(2025-2020). There is need to expand this further for broader legal coverage."},
            { phase: "Q4 2026", item: "Document Drafting Mode", note: "Generate clause-level contract drafts grounded in Kenyan standard terms." },
            { phase: "Q1 2027", item: "Predictive Case Outcomes", note: "Train on historical judgment patterns to surface likelihood-of-success signals." },
            { phase: "Q3 2027", item: "East Africa Expansion", note: "Test viability of including Uganda, Tanzania and Rwanda legal corpora. These countries share a common legal infrastructure."},
            { phase: "2028", item: "Pan-African Legal OS", note: "A unified research layer across African common law jurisdictions." },
          ].map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border border-[rgba(173,216,230,0.6)] rounded-xl p-4 sm:p-5 hover:bg-white/5 transition-colors group bg-white/5 backdrop-blur-sm">
              <div className="text-[10px] sm:text-xs font-mono text-zinc-400 sm:w-20 shrink-0">{r.phase}</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white group-hover:text-zinc-200">{r.item}</div>
                <div className="text-xs text-zinc-400 font-serif mt-0.5">{r.note}</div>
              </div>
              
            </div>
          ))}
        </div>
      </section>

      {/* The Footer section*/}
      <footer className={`p-5 sm:p-8 md:p-12 ${bgSoftBlack}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-12">
          <div>
            <div className="text-[10px] sm:text-xs font-mono text-[#c8b98c] mb-3 sm:mb-4 uppercase tracking-widest">Sherialens {`->`} Ushering a new era </div>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
              Justice Decoded.
            </h3>
            <p className="max-w-2xl text-zinc-300 font-serif text-sm sm:text-base leading-relaxed">
              SheriaLens is a product of the conviction that access to the law is not a luxury but a right. 
              <br></br>It is built in Nairobi and designed for every Kenyan who deserves to understand the rules that they live under.
              <br></br>For a century, legal language was a weapon used to confuse, gatekeep and control. SheriaLens is built to disarm it. We didn't just 
              translate the law; we democratized it. The rules are finally yours to read.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4 text-center md:text-right w-full md:w-auto">
            <a href="https://huggingface.co/spaces/BC-254/SheriaLens2" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-lg hover:text-white text-zinc-400 transition-colors uppercase tracking-widest font-medium border-b border-white/10 md:border-none pb-2 md:pb-0">
              Try Demo ↗
            </a>
            <Link to="/#Contact" className="text-sm sm:text-lg hover:text-white text-zinc-400 transition-colors uppercase tracking-widest font-medium">
              Contact Team ↗
            </Link>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 pt-5 sm:pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-2 text-[10px] sm:text-xs text-zinc-600 font-mono text-center">
          <span>© 2024 SheriaLens. All rights reserved.</span>
          <span>Built with precision. Deployed with purpose.</span>
        </div>
      </footer>
    </div>
  );
}