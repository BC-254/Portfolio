import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import { AnimatePresence,motion } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

// Importing my portfolio components
import NavBar from './components/NavBar';
import SplashScreen from './components/SplashScreen';
import Hero from './components/Hero';
import WhatIBring from './components/WhatIBring';
import Projects from './components/Projects';
import DeepDive from './components/deepDive';
import Terminal from './components/Terminal';
import Contact from './components/Contact';
import About from './components/About';
import Sherialens from './components/sherialens';
import Actuarial from './components/Actuarial';

// Dealing with links navigations
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const { scrollTo } = location.state || {};
    
    if (scrollTo) {
      // To a specific section
      const timer = setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, '');
      }, 100);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        window.scrollTo(0,0);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
}

export default function App() {
  // Prevent the splash screen from showing on every page reload
  const [isInitialized, setIsInitialized] = useState(
    () => sessionStorage.getItem('portfolio-boot-seen') === 'true'
  );

  return (
    <Router>
      <ScrollHandler/>
      <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden">
        <Analytics />
        {/* 1. The Curtain Reveal */}
        <AnimatePresence mode="wait">
            {!isInitialized ? (
                <SplashScreen key="splash" onInitialize={() => setIsInitialized(true)} />
            ) : (
                <motion.div
                    key="main"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
            
          {/* 2. The Main Portfolio UI */}
          
            <NavBar />             
            <Routes>
              {/* Main Portfolio Page */}
              <Route path="/" element={
                <main>
                  <div id="Home"><Hero /></div>
                  
                  <section id="Skills">
                    <WhatIBring />                    
                  </section> 

                  <section id="Work">
                    <Projects />                  
                  </section>

                  <section id="deepDive">
                    <DeepDive />
                  </section>

                  <section id="terminal">
                    <Terminal />
                  </section>

                  <section id="Contact">
                    <Contact />
                  </section>
                  
                </main>
              } /> 

              {/* EXTERNAL PAGE ROUTES */}
              <Route path="/about" element={<About />} />
              <Route path="/sherialens" element={<Sherialens />} />
              <Route path="/actuarial" element={<Actuarial />} />
            </Routes>
          </motion.div>
        )}
       </AnimatePresence>
      </div>
    </Router>
  );
}