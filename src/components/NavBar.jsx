import React, {useState, useEffect} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Code2, Briefcase, Mail} from 'lucide-react'; 

export default function NavBar({topOffset=0}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Preventing page scroll on mobile once menu is open
  useEffect(() => {
  if (isMobileMenuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  return () => { document.body.style.overflow = ''; };
}, [isMobileMenuOpen]);

  // Helper to close the mobile menu when a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: 'Home', path: '/', isAnchor: true},
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/#Skills', isAnchor: true },
    { name: 'Work', path: '/#Work', isAnchor: true },
    { name: 'Contact', path: '/#Contact', isAnchor: true },
  ];
  
  // Single handler for all anchor links from any page
  const handleAnchorClick = (e, link) => {
    e.preventDefault();
    closeMenu();
    
    // Home link scrolls to top, others scroll to their section
    const sectionId = link.path === '/' ? null : link.path.replace('/#', '');
    if (isHomePage){
      if(!sectionId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home and pass the target section
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  // Shared link renderer keeps desktop and mobile markup dry
  const renderLink = (link, isMobile = false) => {
    const bracketBase  = isMobile
      ? 'hidden'
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
  
  const navIcons = {
    Home: Home,
    About: User,
    Skills: Code2,
    Work: Briefcase,
    Contact: Mail,
  };
   
  return (
    <>
      {/* DESKTOP & MOBILE TOP BAR*/}
      <nav className={`fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/20`} style={{ top: topOffset ?? 0 }}>
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

      {/* MOBILE MENU DESIGN*/}
       <AnimatePresence>
         {isMobileMenuOpen && (
           <>
            {/* The menu background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={closeMenu}
            />

            {/* Sliding Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-60 w-1/2 bg-slate-950 border-l border-cyan-500/70 flex flex-col md:hidden"
            >
            {/* Menu Header and Close Button */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-t border-cyan-500/70">
                <span className="font-mono text-xs tracking-[0.18em] text-slate-400 uppercase">Navigation</span>
                <button
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="w-8 h-8 rounded-full border border-cyan-500/30 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X size={14} />
                </button>
              </div>

              {/* The links */}
              <nav className="flex flex-col gap-1 p-4 flex-1">
                {navLinks.map((link, i) => {
                  const Icon = navIcons[link.name];
                  const isActive = link.path === location.pathname;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 + 0.2 }}
                    >
                      {link.isAnchor ? (
                        <a                        
                          href={link.path}
                          onClick={(e) => handleAnchorClick(e, link)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all ${
                            isActive
                              ? 'bg-cyan-500/10 border border-cyan-500/25 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {Icon && <Icon size={15} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />}
                          <span>{link.name}</span>                          
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={closeMenu}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all ${
                            isActive
                              ? 'bg-cyan-500/10 border border-cyan-500/25 text-white'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {Icon && <Icon size={15} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />}
                          <span>{link.name}</span>                          
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
              </nav>

              {/* Footer status */}
              <div className="px-5 py-4 border-t border-cyan-500/40 flex flex-col items-center">
                <p className="font-mono text-[0.6rem] tracking-[0.15em] text-slate-600 uppercase mb-2 text-center">Availability</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[0.7rem] text-slate-500">Open to work</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}