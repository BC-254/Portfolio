import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; 

export default function NavBar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/#skills', isAnchor: true },
    { name: 'Work', path: '/#work', isAnchor: true },
    { name: 'Contact', path: '/#contact', isAnchor: true },
  ];

  return (
    <>
      {/* DESKTOP & MOBILE TOP BAR*/}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* My Brand Initials */}
          <Link to="/" className="text-2xl font-bold tracking-widest text-white group flex items-center">
            B.C<span className="text-cyan-500 animate-pulse ml-1"></span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-8 text-sm font-mono text-slate-400">
            {navLinks.map((link) => (
              <li key={link.name} className="group relative cursor-pointer">
                {isHomePage && link.isAnchor ? (
                  <a href={link.path.replace('/', '')} className="hover:text-cyan-400 transition-colors px-2 py-1 flex items-center">
                    <span className="opacity-0 group-hover:opacity-100 text-cyan-500 mr-1 transition-opacity">[</span>
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 text-cyan-500 ml-1 transition-opacity">]</span>
                  </a>
                ) : (
                  <Link to={link.path} className="hover:text-cyan-400 transition-colors px-2 py-1 flex items-center">
                    <span className="opacity-0 group-hover:opacity-100 text-cyan-500 mr-1 transition-opacity">[</span>
                    {link.name}
                    <span className="opacity-0 group-hover:opacity-100 text-cyan-500 ml-1 transition-opacity">]</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* MOBILE TOGGLE ICON */}
          <button 
            className="md:hidden text-cyan-500 hover:text-cyan-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>

        </div>
      </nav>

      {/* MOBILE FULL-SCREEN OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-cyan-500 hover:text-cyan-300 transition-colors"
              onClick={closeMenu}
            >
              <X size={32} />
            </button>

            {/* Mobile Links */}
            <ul className="flex flex-col space-y-8 text-2xl font-mono text-slate-400 text-center">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isHomePage && link.isAnchor ? (
                    <a href={link.path.replace('/', '')} onClick={closeMenu} className="hover:text-cyan-400 transition-colors flex items-center justify-center">
                      <span className="text-cyan-500 mr-2">[</span>
                      {link.name}
                      <span className="text-cyan-500 ml-2">]</span>
                    </a>
                  ) : (
                    <Link to={link.path} onClick={closeMenu} className="hover:text-cyan-400 transition-colors flex items-center justify-center">
                      <span className="text-cyan-500 mr-2">[</span>
                      {link.name}
                      <span className="text-cyan-500 ml-2">]</span>
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}