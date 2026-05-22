import { useState, useRef, useEffect, useCallback } from "react";
import { BRIAN_CONTEXT, EASTER_EGGS, BOOT_SEQUENCE, OFFER_LETTER_PROMPT} from "./brianContext";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID  = "service_f5naa8d";   
const EMAILJS_TEMPLATE_ID = "template_2qw3hzt";  
const EMAILJS_PUBLIC_KEY  = "JczN8ZuvvlJQQrqw9";
const BRIAN_EMAIL         = "bchege55200@gmail.com";
 
function HireModal({ onClose, onSent }) {
  const [step, setStep]       = useState("form");   // "form" | "preview" | "sending" | "done" | "error"
  const [fields, setFields]   = useState({
    company: "", role: "", department: "", salary: "",
    benefits: "", duration: "", startDate: "", managerName: "", 
    yourEmail: "",notes: "",
  });
  
  const [letter, setLetter]   = useState("");
  const [errMsg, setErrMsg]   = useState("");
 
  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));
 
  // Generating offer letter with Groq
  const handleGenerate = useCallback(async () => {
    if (!fields.company || !fields.role || !fields.salary || !fields.duration || !fields.yourEmail) {
      setErrMsg("Company, Role, Salary, Duration and Your Email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.yourEmail)) {
      setErrMsg("Please enter a valid email address.");
      return;
    }
    setErrMsg("");
    setStep("generating"); // reuse "sending" label for "generating"
 
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 900,
          temperature: 0.4,
          messages: [{ role: "user", content: OFFER_LETTER_PROMPT(fields) }],
        }),
      });
 
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Groq error");
 
      const text = data?.choices?.[0]?.message?.content || "";
      setLetter(text.trim());
      setStep("preview");
    } catch (err) {
      setErrMsg(`Letter generation failed: ${err.message}`);
      setStep("form");
    }
  }, [fields]);
 
  // Sending the letter via EmailJS
  const handleSend = useCallback(async () => {
    setStep("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_company: fields.company,
          role:         fields.role,
          offer_letter: letter,
          to_email:     BRIAN_EMAIL,
          reply_to:     fields.yourEmail,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStep("done");
      // Notify Terminal so it can print the confirmation line
      onSent(`offer_letter.txt → ${BRIAN_EMAIL}  ✓  awaiting Brian's review`);
    } catch (err) {
      setErrMsg(`Email failed: ${err.message}`);
      setStep("preview");
    }
  }, [fields, letter, onSent]);
 
  // Shared input style — matches terminal's dark palette
  const inputCls =
    "w-full bg-[#0d0d0b] border border-[rgba(200,185,140,0.18)] rounded px-3 py-2 " +
    "text-white text-sm placeholder-[#3a3a34] focus:outline-none " +
    "focus:border-[rgba(200,185,140,0.5)] transition-colors duration-200 font-['DM_Mono',monospace]";
 
  const labelCls = "block text-[0.6rem] tracking-[0.15em] text-[#c8b98c] uppercase mb-1";
 
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal window — styled to match the terminal aesthetic */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl overflow-hidden"
        style={{
          background: "#0d0d0b",
          border: "1px solid rgba(200,185,140,0.18)",
          boxShadow: "0 0 60px rgba(200,185,140,0.06)",
        }}
      >
        {/* Title bar — mirrors Terminal's title bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#161614] border-b border-[rgba(200,185,140,0.12)] shrink-0">
          <div className="flex gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity" aria-label="Close" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
          </div>
          <span className="flex-1 text-center text-[0.65rem] tracking-[0.08em] text-[#898929] font-['DM_Mono',monospace]">
            hire-brian — offer letter generator
          </span>
        </div>
 
        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
 
          {/* ── FORM STEP ── */}
          {(step === "form" || (step === "sending" && letter === "")) && (
            <>
              <p className="text-[#5a5a52] text-xs mb-5 leading-relaxed">
                Fill in the details below. brian-ai will draft a formal offer letter and
                send it to Brian's email awaiting his review.
              </p>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name *</label>
                  <input className={inputCls} placeholder="Acme Corp" value={fields.company} onChange={set("company")} />
                </div>
                <div>
                  <label className={labelCls}>Role / Job Title *</label>
                  <input className={inputCls} placeholder="Senior Data Scientist" value={fields.role} onChange={set("role")} />
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <input className={inputCls} placeholder="Analytics & Risk" value={fields.department} onChange={set("department")} />
                </div>
                <div>
                  <label className={labelCls}>Salary (annual) *</label>
                  <input className={inputCls} placeholder="KES 2,400,000" value={fields.salary} onChange={set("salary")} />
                </div>
                <div>
                  <label className={labelCls}>Contract Duration *</label>
                  <input className={inputCls} placeholder="Permanent / 12 months" value={fields.duration} onChange={set("duration")} />
                </div>
                <div>
                  <label className={labelCls}>Start Date</label>
                  <input className={inputCls} placeholder="1 July 2026" value={fields.startDate} onChange={set("startDate")} />
                </div>
                <div>
                  <label className={labelCls}>Hiring Manager Name</label>
                  <input className={inputCls} placeholder="Jane Doe" value={fields.managerName} onChange={set("managerName")} />
                </div>
                <div>
                  <label className={labelCls}>Key Benefits</label>
                  <input className={inputCls} placeholder="Medical, pension, remote…" value={fields.benefits} onChange={set("benefits")} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Your Email (So Brian can reply) *</label>
                  <input className={inputCls} placeholder="hiring@acmecorp.com" type="email" value={fields.yourEmail} onChange={set("yourEmail")} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Additional Notes</label>
                  <textarea
                    className={`${inputCls} resize-none`}
                    rows={3}
                    placeholder="Anything else to include in the letter…"
                    value={fields.notes}
                    onChange={set("notes")}
                  />
                </div>
              </div>
 
              {errMsg && (
                <p className="mt-3 text-[#ff6b6b] text-xs font-['DM_Mono',monospace]">{errMsg}</p>
              )}
 
              <button
                onClick={handleGenerate}
                disabled={step === "sending"}
                className="mt-5 w-full py-2.5 rounded border border-[rgba(200,185,140,0.3)] text-[#c8b98c] text-sm tracking-widest hover:bg-[rgba(200,185,140,0.06)] transition-colors duration-200 disabled:opacity-40 font-['DM_Mono',monospace]"
              >
                {step === "sending" ? "generating letter…" : "generate offer letter →"}
              </button>
            </>
          )}
 
          {/* ── PREVIEW STEP ── */}
          {step === "preview" && (
            <>
              <p className="text-[#5a5a52] text-xs mb-3 leading-relaxed">
                Review and edit the letter below. Hit Send to Brian to
                dispatch it 
              </p>
 
              <textarea
                className={`${inputCls} resize-y leading-relaxed`}
                rows={14}
                style={{ maxHeight: "340px" }}
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
              />
 
              {errMsg && (
                <p className="mt-2 mb-1 text-[#ff6b6b] text-xs font-['DM_Mono',monospace]">{errMsg}</p>
              )}
 
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep("form"); setLetter(""); }}
                  className="flex-1 py-2.5 rounded border border-[rgba(200,185,140,0.15)] text-[#5a5a52] text-sm hover:text-[#c8b98c] hover:border-[rgba(200,185,140,0.3)] transition-colors duration-200 font-['DM_Mono',monospace]"
                >
                  ← edit details
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 py-2.5 rounded border border-[rgba(200,185,140,0.4)] text-[#c8b98c] text-sm hover:bg-[rgba(200,185,140,0.08)] transition-colors duration-200 font-['DM_Mono',monospace]"
                >
                  send to brian →
                </button>
              </div>
            </>
          )}
 
          {/* ── SENDING STEP (after preview) ── */}
          {step === "sending" && letter !== "" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#c8b98c]"
                    style={{ animation: "dotPulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="text-[#5a5a52] text-xs tracking-widest font-['DM_Mono',monospace]">dispatching offer…</p>
            </div>
          )}
 
          {/* ── DONE STEP ── */}
          {step === "done" && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="text-2xl">✓</div>
              <p className="text-[#a8e6cf] text-sm font-['DM_Mono',monospace]">Offer dispatched.</p>
              <p className="text-[#5a5a52] text-xs leading-relaxed max-w-xs">
                Your offer letter has been sent to Brian's inbox. He'll review it and get back to you
                via the contact details you provided.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded border border-[rgba(200,185,140,0.2)] text-[#c8b98c] text-xs tracking-widest hover:bg-[rgba(200,185,140,0.06)] transition-colors font-['DM_Mono',monospace]"
              >
                close
              </button>
            </div>
          )}
 
        </div>
      </div>
    </div>
  );
}


// Stream text character by character-Terminal
function useTypewriter(text, speed = 18, active = true) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!active) { setDisplayed(text); return; }
    setDisplayed("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, active]);
  return displayed;
}

// How a single line looks in the terminal
function TermLine({ line }) {
  const isUser   = line.type === "user";
  const isEaster = line.type === "easter";
  const isBoot   = line.type === "boot";
  const isSystem = line.type === "system";
  // Handling the messages
  if (isUser) {
    return (
      <div className="flex gap-2 mb-1">
        <span className="text-[#c8b98c] text-sm shrink-0 select-none">
          brian-ai:~$
        </span>
        <span className="text-white text-sm break-all">
          {line.text}
        </span>
      </div>
    );
  }

  if (isEaster) {
    return (
      <pre className="text-[#a8e6cf] text-xs sm:text-sm whitespace-pre-wrap mb-3 leading-relaxed">
        {line.text}
      </pre>
    );
  }

  if (isBoot || isSystem) {
    return (
      <div className="text-[#5a5a52] text-xs sm:text-sm mb-0.5 leading-relaxed">
        {line.text}
      </div>
    );
  }

  // AI response
  return (
    <StreamedLine text={line.text} done={line.done} />
  );
}

// Streams AI response tokens as they arrive, then shows full text once done
function StreamedLine({ text, done }) {
  const displayed = useTypewriter(text, 12, !done);
  return (
    <div className="mb-3 pl-4 border-l border-[rgba(200,185,140,0.15)]">
      <span className="text-xs text-[#c8b98c] select-none mr-2">
        brian-ai
      </span>
      <span className="text-[#d4cfc4] text-sm leading-relaxed whitespace-pre-wrap">
        {done ? text : displayed}
        {!done && (
          <span className="inline-block w-1.75 h-3.25 bg-[#c8b98c] ml-0.5 align-middle animate-pulse" />
        )}
      </span>
    </div>
  );
}

// The thinking animation
function Thinking() {
  return (
    <div className="mb-3 pl-4 border-l border-[rgba(200,185,140,0.15)] flex items-center gap-2">
      <span className="font-['DM_Mono',monospace] text-xs text-[#c8b98c] select-none">
        brian-ai
      </span>
      <span className="font-['DM_Mono',monospace] text-[#5a5a52] text-sm">
        thinking
      </span>
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-[#c8b98c]"
            style={{
              animation: "dotPulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}

// The Main Terminal 
export default function Terminal() {
  const [lines,      setLines]      = useState([]);
  const [input,      setInput]      = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [booted,     setBooted]     = useState(false);
  const [history,    setHistory]    = useState([]);
  const [histIdx,    setHistIdx]    = useState(-1);
  const [sectionVisible, setSectionVisible] = useState(false);
  const[showHireModal, setShowHireModal] = useState(false);
  const outputRef  = useRef(null);
  const inputRef   = useRef(null);
  const sectionRef = useRef(null);
  const bootedRef  = useRef(false);

  // Autoscroll to bottom on new lines
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, isThinking]);

  // Terminal Starts boot when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !bootedRef.current) {
          bootedRef.current = true;
          setSectionVisible(true);
          runBootSequence();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // The Boot sequence of the lines
  const runBootSequence = useCallback(() => {
    BOOT_SEQUENCE.forEach(({ text, delay }) => {
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { id: Date.now() + delay, type: "boot", text },
        ]);
      }, delay);
    });
    setTimeout(() => setBooted(true), BOOT_SEQUENCE[BOOT_SEQUENCE.length - 1].delay + 400);
  }, []);


  // Groq API call 
  const callGroq = useCallback(async (userInput) => {
    setIsThinking(true);
    const aiId = Date.now();

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
         },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role:"system",
                    content: BRIAN_CONTEXT
                },
                { role:"user",
                  content: userInput
                }
            ],
            temperature:0.7,
            max_tokens: 400,
        }),
    }
);
            
           
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "API error");
      }
      // Extracting the text from Groqs response structure
      const text =
        data?.choices?.[0]?.message?.content ||
        "I didn't catch that. Try rephrasing?";

      setIsThinking(false);
      setLines((prev) => [
        ...prev,
        { id: aiId, type: "ai", text: text.trim(), done: false },
      ]);
     
      // Waiting time based on text length
      const duration = Math.min(text.length * 12 + 200, 6000);
      setTimeout(() => {
        setLines((prev) =>
          prev.map((l) => (l.id === aiId ? { ...l, done: true } : l))
        );
      }, duration);
    } catch (err) {
      setIsThinking(false);
      setLines((prev) => [
        ...prev,
        {
          id: aiId,
          type: "system",
          text: `Error: ${err.message}. Check your VITE_GROQ_API_KEY`,
        },
      ]);
    }
  }, []);

  // Handle submit 
  const handleSubmit = useCallback(async () => {
    const raw = input.trim();
    if (!raw || isThinking) return;

    const normalized = raw.toLowerCase().trim();
    setInput("");
    setHistIdx(-1);
    setHistory((prev) => [raw, ...prev.slice(0, 49)]);

    // Always show user line
    setLines((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: raw },
    ]);

    // Easter egg intercept 
    const easterKey = Object.keys(EASTER_EGGS).find((k) => normalized === k);

    if (easterKey) {
      const response = EASTER_EGGS[easterKey];
      if (response === "__CLEAR__") {
        setTimeout(() => setLines([]), 100);
        return;
      }
    if (response === "__TRIGGER_HIRE_BRIAN__") {
        setTimeout(() => {
            setLines((prev) => [
                ...prev,
                { id: Date.now(), 
                  type: "system", 
                  text: "Opening offer letter form... (Fill in the details to send Brian an offer)",
                 },
            ]);
            setShowHireModal(true);
        }, 150);
        return;
        }
    
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { id: Date.now(), type: "easter", text: response },
        ]);
      }, 150);
      return;
    }

    // Gemini call to fetch an answer
    await callGroq(raw);
  }, [input, isThinking, callGroq]);

  const handleOfferSent = useCallback((confirmationLine) => {
    setShowHireModal(false);
    setLines((prev) => [
        ...prev,
        { id: Date.now(), 
          type: "easter", 
          text: confirmationLine },
    ]);
  }, []);

  // Keyboard handling 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
      return;
    }
    // Arrow up/down for history
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] || "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : history[next]);
    }
  };

  // Click anywhere in terminal to start input 
  const focusInput = () => inputRef.current?.focus();

  return (
    <>
      <style>{`
        @keyframes dotPulse {  
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-2px); }
        }
          
        @keyframes termReveal {  
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .term-revealed {
          animation: termReveal 0.8s cubic-bezier(0.16,1,0.3,1) both;
        }
        /* Custom scrollbar for terminal output */
        .term-output::-webkit-scrollbar       { width: 4px; }
        .term-output::-webkit-scrollbar-track { background: transparent; }
        .term-output::-webkit-scrollbar-thumb { background: rgba(200,185,140,0.2); border-radius: 2px; }
        .term-output::-webkit-scrollbar-thumb:hover { background: rgba(200,185,140,0.4); }
      `}</style>

      {showHireModal && (
        <HireModal
           onClose={() => setShowHireModal(false)}
           onSent={handleOfferSent}
           />
      )}

      {/* The terminal section */}
      <section
        ref={sectionRef}
        className="relative w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-[#0d046d51] overflow-hidden"
        aria-label="Interactive portfolio terminal"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(200,185,140,0.04) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Section header */}
          <div
            className="mb-10 text-center"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transform: sectionVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease, transform 0.8s ease",
            }}
          >
            <p className=" text-[0.65rem] tracking-[0.2em] text-[#c8b98c] uppercase mb-3">
              Ask anything
            </p>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
              Talk to: brian-ai
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed mx-auto">
              An AI trained on Brian's skills, projects and actuarial/data science knowledge. Type your questions or use sample commands given below.
            </p>
          </div>

          {/* The terminal window design */}
          <div
            className={sectionVisible ? "term-revealed" : "opacity-0"}
            style={{ animationDelay: "200ms" }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#161614] border border-[rgba(200,185,140,0.12)] rounded-t-xl">
              {/* Traffic lights */}
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
              </div>
              {/* Title */}
              <span className="flex-1 text-center font-['DM_Mono',monospace] text-[0.65rem] text-[#898929] tracking-[0.08em]">
                brian-ai: portfolio terminal
              </span>
              {/* Clear button */}
              <button
                onClick={() => setLines([])}
                className="text-[0.6rem] text-[#5a5a52] hover:text-[#c8b98c] transition-colors duration-200 tracking-wider"
                aria-label="Clear terminal"
              >
                clear
              </button>
            </div>

            {/* Output area */}
            <div
              ref={outputRef}
              className="term-output h-80 sm:h-96 overflow-y-auto bg-[#0d0d0b] border-x border-[rgba(200,185,140,0.12)] p-4 sm:p-5 cursor-text"
              onClick={focusInput}
              role="log"
              aria-live="polite"
              aria-label="Terminal output"
            >
              {lines.map((line) => (
                <TermLine key={line.id} line={line} />
              ))}
              {isThinking && <Thinking />}

              {/* Empty state hint */}
              {lines.length === 0 && !isThinking && (
                <div className="h-full flex items-center justify-center">
                  <span className=" text-[#3a3a34] text-xs tracking-widest">
                    Experience, skills, projects, ask them all...
                  </span>
                </div>
              )}
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 bg-[#0d0d0b] border border-[rgba(200,185,140,0.12)] rounded-b-xl border-t-[rgba(200,185,140,0.06)]">
              {/* Prompt prefix */}
              <span
                className="text-[#c8b98c] text-sm shrink-0 select-none"
                aria-hidden="true"
              >
                brian-ai: $
              </span>

              {/* Text input */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={booted ? "Ask me anything..." : "Initialising..."}
                disabled={!booted || isThinking}
                className="flex-1 bg-transparent font-['DM_Mono',monospace] text-white text-sm outline-none placeholder-[#3a3a34] disabled:opacity-40 caret-[#c8b98c] min-w-0"
                aria-label="Terminal input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              {/* Submit button only visible on mobile */}
              <button
                onClick={handleSubmit}
                disabled={!booted || isThinking || !input.trim()}
                className="sm:hidden shrink-0 w-8 h-8 rounded border border-[rgba(200,185,140,0.2)] bg-[rgba(200,185,140,0.06)] text-[#c8b98c] flex items-center justify-center disabled:opacity-30 transition-opacity"
                aria-label="Send"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Hint row */}
          <div
            className="mt-4 flex flex-wrap justify-center gap-2"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transition: "opacity 1s ease 1s",
            }}
          >
            {["hire brian", "Hot take 1", "Hot take 2", "help"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  setInput(cmd);
                  setTimeout(() => {
                    setInput(cmd);
                    inputRef.current?.focus();
                  }, 50);
                }}
                className="text-[0.6rem] tracking-widest px-3 py-1.5 border border-[rgba(200,185,140,0.15)] rounded-sm text-[#6b6860] hover:text-[#c8b98c] hover:border-[rgba(200,185,140,0.35)] transition-all duration-200 bg-transparent"
              >
                {cmd}
              </button>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}