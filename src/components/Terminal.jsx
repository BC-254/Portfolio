import { useState, useRef, useEffect, useCallback } from "react";
import { BRIAN_CONTEXT, EASTER_EGGS, BOOT_SEQUENCE } from "./brianContext";


// Stream text character by character
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