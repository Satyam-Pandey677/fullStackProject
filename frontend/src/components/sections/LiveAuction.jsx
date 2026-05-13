import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, TrendingUp, User, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

const FAKE_USERS = ['Alex99', 'CryptoKing', 'SneakerHead', 'JaneDoe', 'NeonRider'];

const LiveAuction = () => {
  const [currentBid, setCurrentBid] = useState(1450);
  const [highestBidder, setHighestBidder] = useState('System');
  const [bids, setBids] = useState([
    { id: 1, user: 'System', amount: 1450, time: 'Just now' }
  ]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [isUserHighest, setIsUserHighest] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Simulated live bidding from others
  useEffect(() => {
    if (timeLeft === 0) return;

    const simulateBid = () => {
      if (Math.random() > 0.6 && !isUserHighest) {
        const randomUser = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        const newBid = currentBid + Math.floor(Math.random() * 50) + 10;
        
        setCurrentBid(newBid);
        setHighestBidder(randomUser);
        setIsUserHighest(false);
        
        const newBidLog = { id: Date.now(), user: randomUser, amount: newBid, time: 'Just now' };
        setBids(prev => [newBidLog, ...prev].slice(0, 5));
        
        // Add notification
        addNotification(`New bid: $${newBid} by ${randomUser}`);
      }
      
      const nextDelay = Math.random() * 4000 + 2000;
      timeoutRef.current = setTimeout(simulateBid, nextDelay);
    };

    let timeoutRef = { current: setTimeout(simulateBid, 3000) };
    
    return () => clearTimeout(timeoutRef.current);
  }, [currentBid, isUserHighest, timeLeft]);

  const addNotification = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handlePlaceBid = () => {
    if (timeLeft === 0) return;
    
    const newBid = currentBid + 50;
    setCurrentBid(newBid);
    setHighestBidder('You');
    setIsUserHighest(true);
    
    setBids(prev => [{ id: Date.now(), user: 'You', amount: newBid, time: 'Just now' }, ...prev].slice(0, 5));
    addNotification(`You placed a bid of $${newBid}!`);
    
    // Win Celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#ffffff']
    });
  };

  return (
    <section id="live-auction" className="relative py-24 z-20">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Live</span> Auction Terminal
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Experience real-time bidding in our highly responsive, websocket-simulated environment.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">
          
          {/* Main Product Showcase */}
          <div className="lg:col-span-3 glass rounded-3xl p-8 relative overflow-hidden neon-border group">
            <div className="absolute top-0 right-0 p-6 z-10 flex gap-2">
              <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/50">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/80 text-sm font-semibold border border-white/10">
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Simulated 3D Image Placeholder using Framer Motion */}
            <motion.div 
              className="w-full h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl mb-8 flex items-center justify-center border border-white/5 relative"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* Fake product placeholder */}
              <div className="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-6xl font-bold text-white/30">?</span>
              </div>
            </motion.div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Mystery Hypercar Allocation</h3>
              <p className="text-white/60 mb-6">Exclusive rights to purchase the next generation electric hypercar. Only 10 in existence.</p>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-white/50 mb-1 uppercase tracking-wider">Current Highest Bid</p>
                  <motion.p 
                    key={currentBid}
                    initial={{ scale: 1.5, color: '#8b5cf6' }}
                    animate={{ scale: 1, color: '#ffffff' }}
                    className="text-4xl font-bold"
                  >
                    ${currentBid.toLocaleString()}
                  </motion.p>
                </div>
                <button 
                  onClick={handlePlaceBid}
                  disabled={timeLeft === 0}
                  className={cn(
                    "px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden",
                    isUserHighest 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50 cursor-default" 
                      : "bg-primary text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1"
                  )}
                >
                  {isUserHighest ? "Highest Bidder!" : `Bid $${currentBid + 50}`}
                </button>
              </div>
            </div>
          </div>

          {/* Bidding Feed & Activity */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            <div className="glass rounded-3xl p-6 flex-grow flex flex-col">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
                <TrendingUp className="w-5 h-5 text-accent" />
                Live Bid History
              </h4>
              
              <div className="flex-grow space-y-4 overflow-hidden relative">
                <AnimatePresence>
                  {bids.map((bid, i) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, x: 50, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border transition-colors",
                        i === 0 ? "bg-white/10 border-primary/50 neon-glow" : "bg-transparent border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary/50 to-accent/50 flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{bid.user}</p>
                          <p className="text-xs text-white/50">{bid.time}</p>
                        </div>
                      </div>
                      <p className="font-bold text-white">${bid.amount.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* Fade out bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[var(--color-card)] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* User Stats/Status */}
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/60">Your Balance</p>
                <p className="text-sm font-semibold text-accent">$25,000</p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[15%]" />
              </div>
              <p className="text-xs text-white/40 text-center">Funds are secured by smart contracts</p>
            </div>
            
          </div>
        </div>
      </div>

      {/* Floating Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
            >
              <Bell className="w-4 h-4 text-accent" />
              <p className="text-sm font-medium">{note.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LiveAuction;
