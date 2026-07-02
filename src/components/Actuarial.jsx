import React, { useState, useEffect, useRef } from "react";
import {Bot, Gauge, Code2, Globe2, HeartHandshake, GraduationCap, Sparkles, ShieldCheck, HeartPulse, CloudLightning, Lock, LineChart, Quote, ArrowDown,} from "lucide-react";


const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
.font-body { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif; }
.font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

@keyframes riseIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes drawLine {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}
@keyframes pulseDot {
  0%, 100% { opacity: 0.55; r: 3.4; }
  50% { opacity: 1; r: 4.6; }
}
.rise-in { animation: riseIn 0.9s cubic-bezier(0.16,1,0.3,1) both; }
.curve-path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  pathLength: 1;
  animation: drawLine 2.1s cubic-bezier(0.16,1,0.3,1) forwards;
}
.net-dot { animation: pulseDot 2.6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .rise-in, .curve-path, .net-dot { animation: none !important; }
}
`;

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Reveal({ children, className = "", delay = 0 }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* THE HERO SECTION */
function CurveToNetwork() {
  return (
    <svg
      viewBox="0 0 900 340"
      className="w-full h-auto"
      role="img"
      aria-label="An actuarial decay curve transforming into a connected neural network"
    >
        {/* Gradient for the curve*/}
      <defs>
        <linearGradient id="curveFade" x1="0" x2="1">
          <stop offset="0%" stopColor="#C9A227" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#C9A227" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3FD0C9" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      
      {/* The curve */}
      <path
        className="curve-path"
        d="M 40 60
           C 160 60, 220 200, 320 230
           C 400 250, 430 190, 500 190
           C 560 190, 560 130, 620 140
           C 670 148, 690 210, 750 170
           C 800 140, 820 120, 860 150"
        fill="none"
        stroke="url(#curveFade)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* The network edges */}
      <g stroke="#3FD0C9" strokeOpacity="0.45" strokeWidth="1.5">
        <line x1="620" y1="140" x2="690" y2="90" />
        <line x1="620" y1="140" x2="700" y2="230" />
        <line x1="690" y1="90" x2="770" y2="120" />
        <line x1="700" y1="230" x2="770" y2="255" />
        <line x1="770" y1="120" x2="860" y2="150" />
        <line x1="770" y1="255" x2="860" y2="150" />
        <line x1="750" y1="170" x2="860" y2="150" />
      </g>

      {/* The network nodes */}
      {[
        [620, 140], [690, 90], [700, 230], [750, 170], [770, 120],
        [770, 255], [860, 150],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          className="net-dot"
          cx={cx}
          cy={cy}
          r="4"
          fill="#3FD0C9"
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}

      {/* The timeline ticks */}
      {[40, 320, 500].map((x, i) => (
        <line key={i} x1={x} y1="270" x2={x} y2="278" stroke="#C9A227" strokeOpacity="0.5" strokeWidth="1.5" />
      ))}
      <text x="40" y="296" fill="#C9A227" opacity="0.55" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        1762
      </text>
      <text x="770" y="296" fill="#3FD0C9" opacity="0.6" fontSize="11" fontFamily="IBM Plex Mono, monospace">
        2026
      </text>
    </svg>
  );
}

{/* Eyebrow text */}
function Eyebrow({ children, tone = "gold" }) {
  const color = tone === "gold" ? "#B59410" : "#1E3A8A";
  return (
    <div className="flex items-center gap-3 font-mono text-xs tracking-[0.22em] uppercase mb-4">
      <span style={{ color }}>{children}</span>
    </div>
  );
}

{/* The section Divider*/}
function EntryDivider({ n }) {
  return (
    <div className="flex items-center gap-4 my-2 select-none" aria-hidden="true">
      <span className="flex-1 h-0.5" style={{ backgroundColor: "#000000"}} />
      {Array.from({ length: 4 }).map((_, i) => (
        <span key={i} className="w-px h-1" style={{ backgroundColor: "#000000"}} />
      ))}
    </div>
  );
}

{/* The toolkit pills */}
function Chip({ children }) {
  return (
    <span
      className="font-mono text-xs px-3 py-1.5 rounded-full border"
      style={{ borderColor: "#93C5FD", color: "#1E3A8A", backgroundColor: "#EFF6FF" }}
    >
      {children}
    </span>
  );
}

{/* The icon badge */}
function IconBadge({ Icon, tone = "navy" }) {
  const bg = tone === "navy" ? "#EFF6FF" : "#E9FBF9";
  const fg = tone === "navy" ? "#1E3A8A" : "#0E7C74";
  const ring = tone === "navy" ? "#93C5FD" : "#9FE6DF";
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center border"
      style={{ backgroundColor: bg, borderColor: ring }}
    >
      <Icon size={22} color={fg} strokeWidth={1.75} />
    </div>
  );
}

{/* The risk gauge */}
function RiskGauge() {
  const bandStart = 20;
  const bandEnd = 50;
  return (
    <div className="w-full">
      <div className="flex justify-between font-mono text-[11px] tracking-wide mb-2" style={{ color: "#5B6360" }}>
        <span>0%</span>
        <span>LOW</span>
        <span>MEDIUM</span>
        <span>HIGH</span>
        <span>100%</span>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E6DF", border: "1px solid #000000" }}>
        <div
          className="absolute inset-y-0"
          style={{
            left: `${bandStart}%`,
            width: `${bandEnd - bandStart}%`,
            backgroundColor: "#C9A227",
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-y-0" style={{ left: "18%", width: "1.5px", backgroundColor: "#0E7C74" }} />
        <div className="absolute inset-y-0" style={{ left: "50%", width: "1.5px", backgroundColor: "#0E7C74" }} />
      </div>
      <div className="relative h-6 mt-2 font-mono text-[11px] whitespace-nowrap">
        {/* 18% Marker Text */}
        <span 
          className="absolute top-0" 
          style={{ 
            left: "18%", 
            transform: "translateX(-4px)", 
            color: "#0E7C74" 
          }}
        >
          ▲ 2013 est.<br/> 20%
        </span>

        {/* 50% Marker Text */}
        <span 
          className="absolute top-0" 
          style={{ 
            left: "50%", 
            transform: "translateX(-4px)", 
            color: "#0E7C74" 
          }}
        >
          ▲ Follow-up est.<br/> 50%
        </span>

      </div>
      <p className="font-mono text-[11px] mt-3" style={{ color: "#000000" }}>
        Actuaries are in the low-to-moderate band in terms of automation risk.
      </p>
    </div>
  );
}

{/* The alternating design of the sections */}
function Section({ n, eyebrow, title, children, visual, reverse, tone }) {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <EntryDivider n={n} />
      <Reveal>
        <div className={`grid md:grid-cols-12 gap-10 md:gap-16 items-center mt-8 ${reverse ? "" : ""}`}>
          <div className={`md:col-span-7 ${reverse ? "md:order-2" : "md:order-1"}`}>
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
            <h3 className="font-display text-3xl md:text-[2.35rem] leading-[1.15] font-medium mb-6" style={{ color: "#12181B" }}>
              {title}
            </h3>
            <div className="font-body text-[1.05rem] leading-[1.75] space-y-4" style={{ color: "#33393B" }}>
              {children}
            </div>
          </div>
          <div className={`md:col-span-5 ${reverse ? "md:order-1" : "md:order-2"}`}>
            {visual}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

{/* The cards */}
function VisualCard({ children }) {
  return (
    <div
      className="rounded-2xl border p-7 md:p-8"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#add8e6", boxShadow: "0 1px 0 rgba(20,30,25)" }}
    >
      {children}
    </div>
  );
}

/* THE PAGE CONTENTS */
export default function ActuarialAIBlog() {
  return (
    <div className="font-body min-h-screen" style={{ backgroundColor: "#F2F4F0" }}>
      <style>{FONT_IMPORT}</style>

      {/* The hero sub-section */}
      <header
        className="relative overflow-hidden min-h-svh flex flex-col justify-center"
        style={{ backgroundColor: "#0B1120" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 43px, #F2F4F0 43px, #F2F4F0 44px)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-28 pb-14 md:pt-28 md:pb-16">
          <div className="rise-in">
            <h1
              className="font-display font-medium text-[2.6rem] leading-[1.08] md:text-[4rem] md:leading-[1.06] max-w-4xl"
              style={{ color: "#F2F4F0" }}
            >
              The future of actuarial science in the AI era
            </h1>
            <p className="font-display italic text-xl md:text-2xl mt-6 max-w-2xl" style={{ color: "#C9A227" }}>
              Why the profession isn't just surviving. It's leveling up.
            </p>
          </div>
          <div className="rise-in mt-14 md:mt-20" style={{ animationDelay: "150ms" }}>
            <CurveToNetwork />
            <div className="flex justify-between font-mono text-[11px] tracking-wide mt-2" style={{ color: "#6E7A7D" }}>
              <span>the actuarial curve, <br/>since the 18th century</span>
              <span style={{ color: "#3FD0C9" }}>re-imagined,<br/> for the AI era</span>
            </div>
          </div>          
        </div>
      </header>

      {/* The Introduction sub-section */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-16 pb-6">
        <Reveal>
          <p className="font-display text-2xl md:text-[1.7rem] leading-normal" style={{ color: "#12181B" }}>
            Actuarial science has always been the discipline of turning uncertainty
            into a number you can trust. Artificial intelligence is the newest and
            fastest instrument ever handed to this discipline. So far, every
            grounded study has been backing the notion that AI is sharpening an Actuary's
            toolkit rather than replacing the craftsman.
          </p>
        </Reveal>
      </section>

      {/* Section 1 */}
      <Section
        n={1}
        eyebrow="Not a terminator"
        title="AI is the new colleague, not the replacement"
        tone="gold"
        visual={
          <VisualCard>
            <IconBadge Icon={Bot} tone="gold" />
            <p className="font-mono text-xs tracking-wide mt-5 mb-2" style={{ color: "#000000" }}>
              CAS 2025 ANNUAL MEETING
            </p>
            <p className="font-display text-lg leading-snug" style={{ color: "#12181B" }}>
              A profession that advances its own knowledge and builds the guardrails
              other people will trust.
            </p>
          </VisualCard>
        }
      >
        <p>
          At the Casualty Actuarial Society's 2025 Annual Meeting, then-president Dave
          Cummings framed actuaries as a profession that collectively advances its
          knowledge and builds ethical guardrails to navigate change. This matters 
          enormously since the thing being built is AI that employers, regulators and 
          policyholders actually need to trust.
        </p>
        <p>
          This isn't the language of a field bracing for extinction. It's the
          language of one setting the rules of the road. And history backs it up: every
          past wave of "disruptive" technology in this field; hand-cranked
          calculators, mainframes or even spreadsheets, actually expanded demand for actuarial
          judgment and thinking. This has also opened doors into adjacent fields like
          data science along the way.
        </p>
      </Section>

      {/* Section 2 */}
      <Section
        n={2}
        eyebrow="The automation Odds"
        title="Genuine uncertainty, but a reassuring category"
        tone="cyan"
        reverse
        visual={
          <VisualCard>
            <div className="flex items-center gap-3 mb-6">
              <IconBadge Icon={Gauge} tone="cyan" />
              <span className="font-mono text-xs tracking-wide" style={{ color: "#0E7C74" }}>
                ESTIMATED AUTOMATION RISK
              </span>
            </div>
            <RiskGauge />
          </VisualCard>
        }
      >
        <p>
          A 2013 Oxford-Martin study put the odds of actuarial
          automation at roughly one-in-five within a decade or two. A later
          analysis using similar methods pushed that estimate up towards 50%.
          Worth noting is that researchers tied to AI Impacts and the Future of 
          Humanity Institute have floated even larger figures for automation across
          every occupation. However, these are measured in decades, not fiscal quarters.
        </p>
        <p>
          The reassuring part is that those same studies consistently place
          actuarial work in the low-to-moderate risk band, precisely because so
          much of the job depends on creativity, social intelligence and
          contextual judgment. Tasks such as persuading a skeptical CFO, reading a regulator's
          intent, holding emphathetic conversations or even explaining a payout to a grieving family
          are hard things to teach a language model with the nuance they deserve.
        </p>
      </Section>

      {/* Section 3 */}
      <Section
        n={3}
        eyebrow="New dialect required"
        title="The skills arms race is real and it's thrilling"
        tone="gold"
        visual={
          <VisualCard>
            <IconBadge Icon={Code2} tone="gold" />
            <p className="font-mono text-xs tracking-wide mt-5 mb-4" style={{ color: "#000000" }}>
              PRESENT-DAY TOOLKIT
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip>Python</Chip>
              <Chip>Machine Learning</Chip>
              <Chip>Random forests</Chip>
              <Chip>Neural networks</Chip>
              <Chip>SQL</Chip>
              <Chip>BI tools</Chip>
              <Chip>Agentic AI</Chip>
            </div>
          </VisualCard>
        }
      >
        <p>
          Today's actuaries are being asked to speak a new dialect. This includes and
          not limited to: natural language processing, neural networks,  building machine learning models
          and data analysis capabilities. Python fluency is moving fast from a "nice to have" 
          scenario to a table stakes for anyone leading any AI initiative inside an insurer. 
          Explainable AI, techniques like SHAP values that pry open a model's black box, is emerging as the standard for
          keeping pricing and underwriting models transparent enough to survive
          regulatory scrutiny.
        </p>
        <p>
          All said and done, the opacity problem is a real tension. Powerful models
          often out-predict older actuarial methods on raw accuracy but their internal logic
          can be genuinely opaque to the actuaries, regulators and policyholders
          who need to trust the output. Resolving this issue isn't something you can
          outsource to a chatbot; you need actuaries fluent in both the math and
          the regulatory tightrope. Agentic AI is also quitely opening an entirely new
          category of work: autonomous data audits, overnight model-migration
          stress tests and copilots drafting assumption documentation while the
          actuary sleeps. Evidently, automation isn't replacing actuaries but it's
          multiplying what one actuary can oversee.
        </p>
      </Section>

      {/* Section 4 */}
      <Section
        n={4}
        eyebrow="Beyond the insurance sector"
        title="Expanding roles across a widening risk landscape"
        tone="cyan"
        reverse
        visual={
          <div className="grid grid-cols-2 gap-4">
            {[
              [HeartPulse, "Health care"],
              [CloudLightning, "Climate risk"],
              [Lock, "Cybersecurity"],
              [LineChart, "Finance"],
            ].map(([Icon, label], i) => (
              <VisualCard key={i}>
                <IconBadge Icon={Icon} tone="cyan" />
                <p className="font-mono text-xs tracking-wide mt-4" style={{ color: "#0E7C74" }}>
                  {label}
                </p>
              </VisualCard>
            ))}
          </div>
        }
      >
        <p>
          As AI reshapes risk analysis, actuaries are also breaking out of their
          traditional home in life insurance and pensions. Health care, climate
          risk, cybersecurity and finance; just to name a few, are all hungry for people who can
          quantify uncertainty at scale.
        </p>
        <p>
          One especially fascinating frontier is catastrophic modeling for cyber
          risk. This is where AI mines patterns out of messy, unstructured breach data
          (the kind that doesn't fit neatly into a traditional Generalized Linear
          Model) to predict financial shocks before they hit. It's not a
          spreadsheet problem anymore. It's actuarial science meeting
          cybersecurity meeting machine learning. All this happenning in real time.
        </p>
      </Section>

      {/* The Quote pill */}
      <section className="py-4">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <Reveal>
            <div
              className="rounded-2xl p-10 md:p-14 border relative"
              style={{ backgroundColor: "#0B1120", borderColor: "#1E2A44" }}
            >
              <Quote size={30} color="#C9A227" className="mb-6" />
              <p className="font-display text-2xl md:text-[1.85rem] leading-normal" style={{ color: "#F2F4F0" }}>
                Actuaries are the step-down transformers of the AI era. Data scientists can build the reactor while 
                machine learning provides the raw, boundless voltage. But if a business plugs that raw output straight 
                into the wall, it blows the entire grid. The actuary is the one who converts chaotic, high-voltage 
                predictions into a current the business can actually use without burning the house down.
              </p>
              <p className="font-mono text-xs tracking-widest uppercase mt-6" style={{ color: "#3FD0C9" }}>
                Brian Chege — Actuarial Analyst and Data Scientist
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 5 */}
      <Section
        n={5}
        eyebrow="What can't be automated"
        title="The human dimension nobody can automate away"
        tone="gold"
        visual={
          <VisualCard>
            <IconBadge Icon={HeartHandshake} tone="gold" />
            <p className="font-display text-lg leading-snug mt-5" style={{ color: "#12181B" }}>
              Peer review, where one actuary interrogates another's work, becomes
              more critical once AI-generated analysis enters the workflow.
            </p>
            <p className="font-mono text-xs tracking-wide mt-4" style={{ color: "#8A6D14" }}>
              SOA RESEARCH INSTITUTE
            </p>
          </VisualCard>
        }
      >
        <p>
          Research from the Society of Actuaries' Research Institute on actuarial
          mindsets in the AI era makes a pointed observation: actuarial decisions
          affect real people and AI simply cannot interpret those human stakes
          on its own. Empathy and contextual judgment stay part of the job even as
          the tools get faster.
        </p>
        <p>
          One veteran consultant put it simply: no two client situations are ever
          identical. While AI can crunch numbers at superhuman speed, it can't
          replace the judgment, creativity and relationship-building that comes
          from truly understanding people, businesses and context. AI will
          sharpen the profession's tools. It won't replace its expertise.
        </p>
      </Section>

      {/* Section 6 */}
      <Section
        n={6}
        eyebrow="The secret sauce"
        title="Lifelong learning, restlessly applied"
        tone="cyan"
        reverse
        visual={
          <VisualCard>
            <IconBadge Icon={GraduationCap} tone="cyan" />
            <p className="font-mono text-xs tracking-wide mt-5 mb-2" style={{ color: "#0E7C74" }}>
              THE BASE RECIPE STILL HOLDS
            </p>
            <p className="font-display text-lg leading-snug" style={{ color: "#12181B" }}>
              Classical training is the base of the dish. The AI-era skills are
              the garnish that makes it unforgettable.
            </p>
          </VisualCard>
        }
      >
        <p>
          Success in this era isn't only about mastering mortality tables and
          variance calculations - though such skills still matter enormously. It's about
          continuous, almost restless learning. Professional bodies like the SOA
          are actively commissioning research into exactly which programming
          languages, toolkits and cloud technologies actuaries will need next. This is
          because the skill set is moving fast enough that nobody wants to be
          caught flat-footed.
        </p>
      </Section>

      {/* The footer section */}
      <footer className="relative overflow-hidden mt-8" style={{ backgroundColor: "#0B1120" }}>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent, transparent 43px, #F2F4F0 43px, #F2F4F0 44px)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-3xl mx-auto px-6 md:px-10 py-24 md:py-28 text-center">
          <Reveal>
            <Sparkles size={26} color="#C9A227" className="mx-auto mb-8" />
            <h2 className="font-display font-medium text-3xl md:text-4xl leading-tight" style={{ color: "#F2F4F0" }}>
              The profession isn't just surviving.
              <br />
              It's rewriting its own job description.
            </h2>
            <p className="font-body text-base md:text-lg leading-relaxed mt-8" style={{ color: "#AEB8BB" }}>
              From the CAS to the SOA to the industry's biggest consultancies, the
              conclusion converges: AI is a catalyst that broadens actuarial
              impact but not a substitute for actuarial judgment. Translating
              uncertainty into a decision you can trust is and will always be the job.
            </p>
            <div className="mt-12 pt-8 font-mono text-xs tracking-widest uppercase" style={{ color: "#F2F4F0" }}>
              I believe the only real threat to an actuary today isn't artificial intelligence, but an actuary who knows how to use it.
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  );
}