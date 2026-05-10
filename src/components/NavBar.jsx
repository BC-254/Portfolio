import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; 

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/', isAnchor: true},
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/#Skills', isAnchor: true },
    { name: 'Work', path: '/#Work', isAnchor: true },
    { name: 'Contact', path: '/#contact', isAnchor: true },
  ];
  
  // Single handler for all anchor links from any page
  const handleAnchorClick = (e, link) => {
    e.preventDefault();
    closeMenu();
    
    //Home link scrolls to top, others scroll to their section
    const sectionId = link.path === '/' ? null : link.path.replace('/#', '');
    if (isHomePage){
      if(!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      //Navigate to home and pass the target section
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Shared link renderer keeps desktop and mobile markup dry
  const renderLink = (link, isMobile = false) => {
    const bracketBase  = isMobile
      ? 'text-cyan-500'
      : 'text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity';

      const inner = (
        <>
        <span className={`${bracketBase} mr-1`}>[</span>
        {link.name}
        <span className={`${bracketBase} ml-1`}>]</span>
        </>
      );

      const cls = 'hover:text-cyan-400 transition-colors px-2 py-1 flex items-center';

      if (link.isAnchor) {
        return (
          <a href={link.path} onClick={(e) => handleAnchorClick(e, link)} className={cls}>
            {inner}
          </a>
        );
      }
      return (
        <Link to={link.path} onClick={closeMenu} className={cls}>
          {inner}
        </Link>
      );
    };
        
  
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
                {renderLink(link)}
              </li>
            ))}
          </ul>


          {/* MOBILE TOGGLE ICON */}
          <button 
            className="md:hidden text-cyan-500 hover:text-cyan-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
        >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
              aria-label = "Close menu"
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
                  {renderLink(link, true)}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}