import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; 
import { AnimatePresence,motion } from 'framer-motion';

// Importing my portfolio components
import NavBar from './components/NavBar';
import SplashScreen from './components/SplashScreen';
import Hero from './components/Hero';
import WhatIBring from './components/WhatIBring';
import Projects from './components/Projects';
import DeepDive from './components/deepDive';
import Terminal from './components/Terminal';
// import Contact from './components/Contact';
// import Terminal from './components/Terminal';
// import Footer from './components/Footer';
// import About from './components/About';

function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    const { scrollTo } = location.state || {};
    if (!scrollTo) return;

    //Small delay for home page to finish rendering before scrolling
    const timer = setTimeout(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
      //Wipe the state  so the browser back button doesn't re-trigger the scroll
      window.history.replaceState({}, '');
    }, 100);

    return () => clearTimeout(timer);
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
      <ScrollToSection />
      <div className="bg-slate-950 text-slate-200 min-h-screen font-sans selection:bg-cyan-500/30 overflow-x-hidden">
        
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

                  <section id="Work" className="py-24 bg-slate-900/50">
                    <Projects />                  
                  </section>

                  <section id="deepDive">
                    <DeepDive />
                  </section>

                  <section id="terminal">
                    <Terminal />
                  </section>

                  {/* <section id="Contact" className="py-24">
                    <Contact />
                    <Terminal />
                  </section>

                  <Footer /> */}
                </main>
              } /> 

              {/* THE ABOUT PAGE ROUTE */}
            </Routes>
          </motion.div>
        )}
       </AnimatePresence>
      </div>
    </Router>
  );
}