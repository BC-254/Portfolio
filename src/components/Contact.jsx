import React from "react";

export default function ContactAndFooter() {
  return (
    <>
      <style>{`
        /* Continuous slow spin for the outer ring on hover */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Staggered floating animation for mobile/idle state */
        @keyframes levitate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }

        .float-1 { animation: levitate 3s ease-in-out infinite; }
        .float-2 { animation: levitate 3s ease-in-out infinite 0.5s; }
        .float-3 { animation: levitate 3s ease-in-out infinite 1s; }
      `}</style>

      {/* Let's Work Together Section */}
      <section className="relative w-full bg-blue-500/3 py-24 px-6 flex flex-col items-center justify-center z-10">
        
        {/* Subtle background glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-2xl h-64 pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, rgba(9,11,20,0) 70%)",
            filter: "blur(60px)"
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
          
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
            Let's Work Together
          </h2>
          
          <p className="text-[#a1a1aa] text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mb-12">
            I am currently open to data science and actuarial roles. Have a project or a job opportunity? Contact me through:
          </p>

          {/* Contact Buttons Container */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            
            {/* Email Button */}
            <a 
              href="mailto:bchege55200@gmail.com"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#111827] outline-none float-1"
              aria-label="Email Brian"
            >
              {/* Spinning outer ring (visible on hover) */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-[#38bdf8] opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-300"></div>
              {/* Solid inner border */}
              <div className="absolute inset-1 rounded-full border border-slate-700 group-hover:border-transparent transition-colors duration-300 bg-[#161f33] group-hover:bg-[#1a2642] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"></div>
              {/* Icon */}
              <svg className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-[#38bdf8] transition-all duration-500 transform group-hover:rotate-[360deg] group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>

            {/* LinkedIn Button */}
            <a 
              href="https://www.linkedin.com/in/bchege"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#111827] outline-none float-2"
              aria-label="Brian's LinkedIn"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-[#60a5fa] opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-300"></div>
              <div className="absolute inset-1 rounded-full border border-slate-700 group-hover:border-transparent transition-colors duration-300 bg-[#161f33] group-hover:bg-[#1a2642] group-hover:shadow-[0_0_20px_rgba(96,165,250,0.3)]"></div>
              <svg className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-[#60a5fa] transition-all duration-500 transform group-hover:rotate-[360deg] group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* GitHub Button */}
            <a 
              href="https://github.com/BC-254"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-full bg-[#111827] outline-none float-3"
              aria-label="Brian's GitHub"
            >
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-[#c8b98c] opacity-0 group-hover:opacity-100 group-hover:animate-spin-slow transition-opacity duration-300"></div>
              <div className="absolute inset-1 rounded-full border border-slate-700 group-hover:border-transparent transition-colors duration-300 bg-[#161f33] group-hover:bg-[#1a2642] group-hover:shadow-[0_0_20px_rgba(200,185,140,0.3)]"></div>
              <svg className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-[#c8b98c] transition-all duration-500 transform group-hover:rotate-[360deg] group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>

          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-blue-500/3 py-5 px-6 border-t border-[rgba(56,189,248,0.1)]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-[15px] sm:text-sm font-['DM_Mono',monospace] tracking-wide">
            © 2026 Brian Chege.  
          </p> 
          <br></br>
          <p className="text-white text-[15px] sm:text-sm font-mono tracking-wide">
          Good data reveals the past. Great code predicts the future.
          </p>
        </div>
      </footer>
    </>
  );
}