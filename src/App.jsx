import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // IMPORT ROUTER
import { AnimatePresence,motion } from 'framer-motion';

// Importing all components
import NavBar from './components/NavBar';
import SplashScreen from './components/SplashScreen';
import Hero from './components/Hero';
// import SkillsPrism from './components/SkillsPrism';
// import Toolkit from './components/Toolkit';
// import Projects from './components/Projects';
// import SheriaLens from './components/SheriaLens';
// import RiskDashboard from './components/RiskDashboard';
// import Contact from './components/Contact';
// import Terminal from './components/Terminal';
// import Footer from './components/Footer';
// import About from './components/About';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  return (
    <Router>
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
                  
                  {/* <section id="Skills" className="py-24 space-y-32">
                    <SkillsPrism />
                    <Toolkit />
                  </section>

                  <section id="Work" className="py-24 bg-slate-900/50">
                    <Projects />
                    <SheriaLens />
                    <RiskDashboard />
                  </section>

                  <section id="Contact" className="py-24">
                    <Contact />
                    <Terminal />
                  </section>

                  <Footer /> */}
                </main>
              } />

              {/* THE ABOUT PAGE ROUTE
              <Route path="/about" element={<About />} /> */}
            </Routes>
          </motion.div>
        )}
       </AnimatePresence>
      </div>
    </Router>
  );
}