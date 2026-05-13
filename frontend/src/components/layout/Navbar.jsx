import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'py-4 glass' : 'py-6 bg-transparent'
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent neon-border">
            <Gavel className="w-5 h-5 text-white transform group-hover:-rotate-12 transition-transform" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            Bid<span className="text-primary text-gradient">IT</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['Auctions', 'Categories', 'How it Works', 'About'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5 text-white/70" />
          </button>
          <button className="px-5 py-2.5 rounded-full font-medium text-sm border border-white/20 hover:border-white/50 transition-colors glass">
            Log In
          </button>
          <button className="px-5 py-2.5 rounded-full font-medium text-sm bg-white text-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Start Bidding
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 glass flex flex-col p-6 gap-4 border-t border-white/10"
        >
          {['Auctions', 'Categories', 'How it Works', 'About'].map((item) => (
            <Link key={item} to={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-lg font-medium text-white/80">
              {item}
            </Link>
          ))}
          <div className="flex flex-col gap-3 mt-4">
            <button className="py-3 rounded-xl font-medium border border-white/20">Log In</button>
            <button className="py-3 rounded-xl font-medium bg-primary text-white">Start Bidding</button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
