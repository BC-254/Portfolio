import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Seo from './components/Seo';

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
        window.scrollTo(0, 0);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return null;
}

export default function App() {
  // Skip the splash screen for search-engine crawlers and prerenderers so they index real content
  const isBot = /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebook|twitter|linkedin|headlesschrome|prerender/i.test(navigator.userAgent);
  const [isInitialized, setIsInitialized] = useState(
    () => isBot || sessionStorage.getItem('portfolio-boot-seen') === 'true'
  );

  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <ScrollHandler />
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
                    <Seo
                      title="Brian Chege"
                      description="Actuarial data scientist and full-stack developer building applications across analytics,NLP and web development."
                      image="https://brianchege.com/og/home.png"
                      url="https://brianchege.com"
                      schema={{
                        "@context": "https://schema.org/",
                        "@type": "Person",
                        "name": "Brian Chege",
                        "url": "https://brianchege.com",
                        "jobTitle": "Actuarial Data Scientist & Machine Learning Engineer",
                        "sameAs": [
                          "https://linkedin.com/in/bchege",
                          "https://github.com/BC-254"
                        ]
                      }}
                    />

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