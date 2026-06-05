import { useState, useRef, useEffect, useCallback } from "react";
import { BRIAN_CONTEXT, EASTER_EGGS, BOOT_SEQUENCE, OFFER_LETTER_PROMPT} from "./brianContext";
import emailjs from "@emailjs/browser";

// EmailJS Configuration
const EMAILJS_SERVICE_ID  = "service_f5naa8d";   
const EMAILJS_TEMPLATE_ID = "template_2qw3hzt";  
const EMAILJS_PUBLIC_KEY  = "JczN8ZuvvlJQQrqw9";
const BRIAN_EMAIL         = "bchege55200@gmail.com";
 
// The preview step for editing the generated letter
function PreviewStep({ letter, setLetter, errMsg, handleSend, onBack }) {
  const [editing, setEditing] = useState(false);
  // Input styling for the textarea and the preview box
  const inputCls =
    "w-full border border-[rgba(56,189,248,0.2)] rounded px-3 py-2 " +
    "text-white text-sm focus:outline-none focus:border-[rgba(56,189,248,0.6)] transition-colors duration-200";
  return (
    <>
      {/* The top instruction text */}
      <p className="text-[#eeeeea] text-xs mb-3 leading-relaxed">
        {editing
          ? "Edit the letter below, then send when ready."
          : "Review the generated letter. Edit or send it to Brian."}
      </p>

      {editing ? (
        <textarea
          autoFocus
          className={`${inputCls} resize-y leading-relaxed`}
          rows={14}
          style={{ maxHeight: "340px" }}
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
        />
      ) : (
        <div
          className="w-full border border-[rgba(56,189,248,0.2)] rounded px-3 py-2 text-[#d4cfc4] text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto"
          style={{ maxHeight: "340px", minHeight: "160px" }}
        >
          {letter}
        </div>
      )}
      {/* Incase of an error message */}
      {errMsg && (
        <p className="mt-2 mb-1 text-[#ff6b6b] text-xs font-['DM_Mono',monospace]">{errMsg}</p>
      )}
      
      {/* The action buttons */}
      <div className="flex gap-3 mt-4">
        {/* When not editing */}
        {!editing ? (
          <>
            <button
              onClick={onBack}
              className="px-4 py-2.5 rounded border border-[rgba(56,189,248,0.25)] text-[#7dcfed] text-sm hover:bg-[rgba(56,189,248,0.05)] transition-colors duration-200 font-['DM_Mono',monospace]"
            >
              Back to form
            </button>
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-2.5 rounded border border-[rgba(56,189,248,0.25)] text-[#7dcfed] text-sm hover:bg-[rgba(56,189,248,0.05)] transition-colors duration-200 font-['DM_Mono',monospace]"
            >
              Edit letter
            </button>
            <button
              onClick={handleSend}
              className="flex-1 py-2.5 rounded border border-[rgba(56,189,248,0.25)] text-[#7dcfed] text-sm hover:bg-[rgba(56,189,248,0.05)] transition-colors duration-200 font-['DM_Mono',monospace]"
            >
              Send to Brian
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-2.5 rounded border border-[rgba(56,189,248,0.25)] text-[#7dcfed] text-sm hover:bg-[rgba(56,189,248,0.05)] transition-colors duration-200 font-['DM_Mono',monospace]"
            >
              Back to preview
            </button>
            <button
              onClick={handleSend}
              className="flex-1 py-2.5 rounded border border-[rgba(56,189,248,0.25)] text-[#7dcfed] text-sm hover:bg-[rgba(56,189,248,0.05)] transition-colors duration-200 font-['DM_Mono',monospace]"
            >
              Send to Brian
            </button>
          </>
        )}
      </div>
    </>
  );
}

//The terminal modal for hiring me
function HireModal({ onClose, onSent }) {
  const [step, setStep]       = useState("form");   //Monitoring each step from form filling, preview.. e,t,c
  const [fields, setFields]   = useState({
    company: "", role: "", department: "", salary: "",
    benefits: "", duration: "", startDate: "", managerName: "", 
    yourEmail: "",notes: "",
  });
  //Storing the generated letter and any error messages
  const [letter, setLetter]   = useState("");
  const [errMsg, setErrMsg]   = useState("");
  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Helper to update form fields
  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));
 
  // Generating offer letter with Groq
  const handleGenerate = useCallback(async () => {
    if (!fields.company || !fields.role || !fields.salary || !fields.duration || !fields.yourEmail) { // Required fields validation
      setErrMsg("Company, Role, Salary, Duration and Your Email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.yourEmail)) {  //Checking if valid email with @ and domain
      setErrMsg("Please enter a valid email address.");
      return;
    }
    // Clear previous errors and start generation if all validations pass
    setErrMsg("");
    setStep("generating");
    
    // Making the API call to Groq to generate the letter
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
          temperature: 0.4, // Ensuring a more formal and consistent output
          messages: [{ role: "user", content: OFFER_LETTER_PROMPT(fields) }],
        }),
      });
      // Extracting the generated letter from Groq response
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error?.message || "Groq error"); // Handling API errors
      //Optional chaining  to access the generated letter content
      const text = data?.choices?.[0]?.message?.content || "";
      setLetter(text.trim()); // Removing extra whitespace at the beginning or the end
      setStep("preview"); // Move to preview so user can review the letter before sending
    // Catching any errors during the generation process and showing an error message
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
      onSent(`Your offer letter has been sent successfully. He will review it and get back to you at ${fields.yourEmail}.`);
    // Incase the email fails to send, catch the error and show the message
    } catch (err) {
      setErrMsg(`Email failed: ${err.message}`);
      setStep("preview"); // Returns the user to the preview step to retry sending
    }
  }, [fields, letter, onSent]);
 
  // The  offer letter generator input fields design
  const inputCls =
    "w-full border border-[rgba(56,189,248,0.2)] rounded px-3 py-2 " +
    "text-white text-sm focus:outline-none " +
    "focus:border-[rgba(56,189,248,0.6)] transition-colors duration-200";
 
  const labelCls = "block text-[0.6rem] tracking-[0.15em] text-white uppercase mb-1";
 
  return (
    // Blur overlay background when modal is open
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.85)", backdropFilter: "blur(6px)" }}
      // Allow clicking outside the modal to close it
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* The modal-box window Design */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-xl overflow-hidden"
        style={{
          background: "#0d0d0b",
          border: "2px solid rgba(173,216,230,0.6)",
          boxShadow: "0 0 60px rgba(56,189,248,0.1)", //background glow
        }}
      >
        {/* The modal-box Title bar */}
        <div className="relative flex items-center px-4 py-3 bg-[#161614] border-b border-[rgba(173,216,230,0.4)] shrink-0">
          <div className="flex gap-1.5 z-10">
            {/* Close button in the red dot */}
            <button onClick={onClose} className="w-4 h-3 rounded-full bg-[#FF5F57] hover:opacity-80 transition-opacity flex items-center justify-center" 
            aria-label="Close"
            >
              <span className="text-[#4d0000] text-[15px] font-bold leading-none">x</span>
            </button>
            {/* The yellow and green dots*/}
            <div className="w-4 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-4 h-3 rounded-full bg-[#28CA42]" />
          </div>
          {/* The modal title bar */}
          <span className="absolute left-1/2 -translate-x-1/2 w-full text-center text-[0.7rem] font-bold tracking-[0.08em] text-[rgba(255,215,0,1.0)] pointer-events-none">
            Offer Letter Generator
          </span>
        </div>
 
        {/* The modal body section */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6"> {/* Vertical scroll if content exceeds max height */}
 
          {/* Form Filling Step */}
          {(step === "form" || (step === "sending" && letter === "")) && (
            <>
              <p className="text-gray-400 text-xs mb-5 leading-relaxed">
                Fill in the details below. brian-ai will then draft a formal offer letter. Kindly review and edit it before sending it.
              </p>
              {/* 1 column in mobile, 2 columns in larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Company Name *</label>
                  <input className={inputCls} placeholder="Company/Client Name" value={fields.company} onChange={set("company")} />
                </div>
                <div>
                  <label className={labelCls}>Role / Job Title *</label>
                  <input className={inputCls} placeholder="Enter Role/Position" value={fields.role} onChange={set("role")} />
                </div>
                <div>
                  <label className={labelCls}>Department</label>
                  <input className={inputCls} placeholder="Department Name" value={fields.department} onChange={set("department")} />
                </div>
                <div>
                  <label className={labelCls}>Salary (monthly) *</label>
                  <input className={inputCls} placeholder="Amount in KES/USD" value={fields.salary} onChange={set("salary")} />
                </div>
                <div>
                  <label className={labelCls}>Contract Duration *</label>
                  <input className={inputCls} placeholder="Permanent/Contract" value={fields.duration} onChange={set("duration")} />
                </div>
                <div>
                  <label className={labelCls}>Start Date</label>
                  <input className={inputCls} placeholder="Start Date" value={fields.startDate} onChange={set("startDate")} />
                </div>
                <div>
                  <label className={labelCls}>Hiring Manager Name</label>
                  <input className={inputCls} placeholder="Your name" value={fields.managerName} onChange={set("managerName")} />
                </div>
                <div>
                  <label className={labelCls}>Key Benefits</label>
                  <input className={inputCls} placeholder="Medical, pension, remote…" value={fields.benefits} onChange={set("benefits")} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Your Email (So Brian can reply) *</label>
                  <input className={inputCls} placeholder="Your email address" type="email" value={fields.yourEmail} onChange={set("yourEmail")} />
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
              {/* Required fields error message */}
              {errMsg && (
                <p className="mt-3 text-[#ff6b6b] text-xs font-['DM_Mono',monospace]">{errMsg}</p>
              )}
              {/* The Generate Letter button */}
              <button
                onClick={handleGenerate}
                disabled={step === "sending"}
                className="mt-5 w-full py-2.5 rounded border border-[rgba(173,216,230,1.0)] text-[#f9be0a] text-sm tracking-widest hover:bg-[rgba(200,185,140,0.06)] transition-colors duration-200 disabled:opacity-40 font-['DM_Mono',monospace]"
              >
                {step === "sending" ? "Generating letter…" : "Generate Offer letter →"}
              </button>
            </>
          )}
 
          {/* Previewing the generated letter */}
          {step === "preview" && (
            <PreviewStep
              letter={letter}
              setLetter={setLetter}
              errMsg={errMsg}
              handleSend={handleSend}
              onBack={() => { setStep("form"); setLetter(""); }}
            />
          )}
 
          {/* The sending step and animation */}
          {step === "sending" && letter !== "" && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="flex gap-2">
                {/* Animated dots for the loading screen*/}
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#38bdf8]"
                    style={{ animation: "dotPulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="text-[#5a5a52] text-xs tracking-widest font-['DM_Mono',monospace]">Sending offer letter…</p>
            </div>
          )}
 
          {/* The done step */}
          {step === "done" && (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="text-2xl">✓</div>
              <p className="text-[#a8e6cf] text-sm font-['DM_Mono',monospace]">Offer Letter Sent</p>
              <p className="text-[#5a5a52] text-xs leading-relaxed max-w-xs">
                Your offer letter has been sent to Brian's inbox. He'll review it and get back to you
                via the contact details you provided.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 rounded border border-[rgba(56,189,248,0.2)] text-[#7dcfed] text-xs tracking-widest hover:bg-[rgba(200,185,140,0.06)] transition-colors font-['DM_Mono',monospace]"
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

// THE MAIN TERMINAL COMPONENT
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

// User type messages
function TermLine({ line }) {
  const isUser   = line.type === "user";
  const isEaster = line.type === "easter";
  const isBoot   = line.type === "boot";
  const isSystem = line.type === "system";
  // Handling user messages
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
  // Handling easter egg responses
  if (isEaster) {
    return (
      <pre className="text-[#a8e6cf] text-xs sm:text-sm whitespace-pre-wrap mb-3 leading-relaxed">
        {line.text}
      </pre>
    );
  }
  // Boot and system messages
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

// The Terminal window
// Memory states
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

  // The Boot animation of the lines
  const runBootSequence = useCallback(() => {
    BOOT_SEQUENCE.forEach(({ text, delay }, i) => {
      setTimeout(() => {
        setLines((prev) => [
          ...prev,
          { id: `boot-${i}`, type: "boot", text },
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
            temperature:0.4,
            max_tokens: 400,
        }),
    }
);
      // Handling the AI reply to JSON file 
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "API error");
      }
      // Extracting the text from Groqs response structure
      const text =
        data?.choices?.[0]?.message?.content ||
        "I didn't catch that. Try rephrasing?";
      // Updating the state with the new AI response line and removing the thinking animation
      setIsThinking(false);
      setLines((prev) => [
        ...prev,
        { id: aiId, type: "ai", text: text.trim(), done: false },
      ]);
     
      // Waiting time to stop blinking cursor and show the full text
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
          text: `Error: ${err.message}. I am currently unavailable due to high traffic`,
        },
      ]);
    }
  }, []);

  // Sending the user input
  const handleSubmit = useCallback(async (directCommand) => {
    // The buttons to send directly instead of pressing enter again
    const textToProcess = typeof directCommand === "string" ? directCommand : input;
    const raw = textToProcess.trim();
    if (!raw || isThinking) return;
    // Normalizing text to lowercase
    const normalized = raw.toLowerCase().trim();
    setInput("");
    setHistIdx(-1);
    // Saving history to allow use of up and down arrow keys like a terminal
    setHistory((prev) => [raw, ...prev.slice(0, 49)]);

    // Always show user line
    setLines((prev) => [
      ...prev,
      { id: Date.now(), type: "user", text: raw },
    ]);

    // Easter egg intercept f before going to AI 
    const easterKey = Object.keys(EASTER_EGGS).find((k) => normalized === k.toLowerCase());

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
      
    if (response.startsWith("__GROQ__")) {
      const prompt = response.slice("__GROQ__".length).trim();
      await callGroq(prompt);
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

    // If not an easter egg, send to Groq for AI response
    await callGroq(raw);
  }, [input, isThinking, callGroq]);

  // When offer letter is sent, close the modal and print the confirmation line in the terminal
  const handleOfferSent = useCallback((confirmationLine) => {
    setShowHireModal(false);
    setLines((prev) => [
        ...prev,
        { id: Date.now(), 
          type: "easter", 
          text: confirmationLine },
    ]);
  }, []);

  // Keyboard controls
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
        /* Bouncing dots animation */
        @keyframes dotPulse {  
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50%       { opacity: 1;   transform: translateY(-2px); }
        }
         
        /* Terminal reveal animation */
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
        .term-output::-webkit-scrollbar-thumb { background: rgba(200,185,140,0.5); border-radius: 2px; }
        .term-output::-webkit-scrollbar-thumb:hover { background: rgba(200,185,140,0.8); }
      `}</style>

      {showHireModal && (
        <HireModal
           onClose={() => setShowHireModal(false)}
           onSent={handleOfferSent}
           />
      )}

      {/* The terminal section design */}
      <section
        ref={sectionRef}
        className="relative w-full px-4 sm:px-6 lg:px-8 pt-8 pb-10 bg-[#0d046d3c] overflow-hidden"
        aria-label="Interactive portfolio terminal"
      >
        {/* The glow at the sides of the terminal */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl h-[60vh] sm:h-125 pointer-events-none"
          style={{
            background: "rgba(56,189,248,0.30)",
            filter: "blur(100px)"
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
              An AI trained on Brian's skills, projects plus his actuarial and data science knowledge. Type your questions or use sample commands given below.
            </p>
          </div>

          {/* The terminal window design */}
          <div
            className={sectionVisible ? "term-revealed" : "opacity-0"}
            style={{ animationDelay: "200ms" }}
          >
            {/* Title bar */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#161614] border border-[rgba(173,216,230,0.4)] rounded-t-xl">
              {/* Traffic lights */}
              <div className="flex gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
              </div>
              {/* Title */}
              <span className="flex-1 text-center font-['DM_Mono',monospace] text-[0.65rem] text-[#898929] tracking-[0.08em]">
                brian-ai: portfolio assistant
              </span>
              {/* Clear button */}
              <button
                onClick={() => setLines([])}
                className="text-[0.6rem] text-[#c8b98c] tracking-wider"
                aria-label="Clear terminal"
              >
                clear
              </button>
            </div>

            {/* Output area */}
            <div
              ref={outputRef}
              className="term-output h-80 sm:h-96 overflow-y-auto bg-[#0d0d0b] border border-[rgba(173,216,230,0.4)] p-4 sm:p-5 cursor-text"
              onClick={focusInput}
              role="log"
              aria-live="polite"
              aria-label="Terminal output"
            >
              {/* Determining the type of user message*/}
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
            <div className="flex items-center gap-2 px-4 sm:px-5 py-3.5 bg-[#0d0d0b] border border-[rgba(173,216,230,0.4)] rounded-b-xl border-t-[rgba(173,216,230,0.4)]">
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
                placeholder={booted ? "Type here..." : "Initialising..."}
                disabled={!booted || isThinking}
                className="flex-1 bg-transparent font-['DM_Mono',monospace] text-white text-sm outline-none placeholder-[#3a3a34] disabled:opacity-40 caret-[#c8b98c] min-w-0"
                aria-label="Terminal input"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

            {/* The Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!booted || isThinking || !input.trim()}
              className="shrink-0 w-8 h-8 rounded border border-[#b29a14d7] bg-[rgba(56,189,248,0.2)] flex items-center justify-center disabled:opacity-30 transition-all duration-200 active:scale-45"
              aria-label="Send"
            >
              <svg
                className="rotate-45"
                width="15" height="15"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                d="M22 2L11 13"
                stroke="#ffda6b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
              />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="#ffff00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </button>
            </div>
          </div>
          

          {/* Sample commands */}
          <div
            className="mt-4 flex flex-wrap justify-center gap-2"
            style={{
              opacity: sectionVisible ? 1 : 0,
              transition: "opacity 1s ease 1s",
            }}
          >
            {["Who am I?", "Tech Stack","Hire Brian", "Help"].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleSubmit(cmd)}        
                className="text-[0.6rem] tracking-widest px-3 py-1.5 border border-[rgba(140,200,140,0.15)] rounded-sm text-[#c8b98c]  hover:border-[rgba(200,185,140,0.35)] transition-all duration-200 bg-transparent"
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
