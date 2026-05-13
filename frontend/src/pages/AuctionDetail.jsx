import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowLeft, TrendingUp, User, Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '../components/layout/Navbar';
import { fetchAuctionById } from '../lib/mockData';
import { cn } from '../lib/utils';

const FAKE_USERS = ['CryptoKing', 'SneakerHead', 'JaneDoe', 'NeonRider', 'Collector99'];
const CURRENT_USER_ID = "60d5ecb8b392d700153f3b00"; // Represents USERS.SYSTEM

// Custom hook to simulate websockets
const useSimulatedAuction = (initialAuction) => {
  const [auction, setAuction] = useState(initialAuction);
  const [bids, setBids] = useState(
    initialAuction ? [{ id: Date.now(), user: 'System', amount: initialAuction.currentBid, time: new Date().toLocaleTimeString() }] : []
  );
  const [notifications, setNotifications] = useState([]);
  const [isUserHighest, setIsUserHighest] = useState(false);

  // Sync state when initialAuction loads
  useEffect(() => {
    if (initialAuction) {
      setAuction(initialAuction);
      setBids([{ id: Date.now(), user: 'System', amount: initialAuction.currentBid, time: new Date().toLocaleTimeString() }]);
    }
  }, [initialAuction]);

  const addNotification = (text) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (!auction || auction.status !== 'live') return;

    const simulateBid = () => {
      if (Math.random() > 0.6 && !isUserHighest) {
        const randomUser = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
        const increment = Math.floor(Math.random() * 500) + 50;
        
        setAuction(prev => ({
          ...prev,
          currentBid: prev.currentBid + increment,
          highestBidder: randomUser
        }));
        
        setIsUserHighest(false);
        
        const newBidLog = { id: Date.now(), user: randomUser, amount: auction.currentBid + increment, time: new Date().toLocaleTimeString() };
        setBids(prev => [newBidLog, ...prev].slice(0, 10)); // Keep last 10
        
        addNotification(`New bid: $${(auction.currentBid + increment).toLocaleString()} by ${randomUser}`);
      }
      
      const nextDelay = Math.random() * 5000 + 3000;
      timeoutRef.current = setTimeout(simulateBid, nextDelay);
    };

    let timeoutRef = { current: setTimeout(simulateBid, 4000) };
    
    return () => clearTimeout(timeoutRef.current);
  }, [auction, isUserHighest]);

  const placeManualBid = () => {
    if (auction.status !== 'live') return;
    
    const newBid = auction.currentBid + 100; // Step size
    setAuction(prev => ({ ...prev, currentBid: newBid, highestBidder: 'You' }));
    setIsUserHighest(true);
    
    setBids(prev => [{ id: Date.now(), user: 'You (Me)', amount: newBid, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 10));
    addNotification(`You placed a bid of $${newBid.toLocaleString()}!`);
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#ffffff']
    });
  };

  const startAuction = () => {
    setAuction(prev => ({
      ...prev,
      status: 'live',
      endTime: new Date(Date.now() + prev.duration * 1000).toISOString()
    }));
    addNotification("Auction started successfully!");
  };

  return { auction, bids, notifications, isUserHighest, placeManualBid, startAuction };
};

const CountdownPanel = ({ endTime, status }) => {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    if (status !== 'live' && status !== 'pending') return;

    const updateTimer = () => {
      const distance = new Date(endTime).getTime() - new Date().getTime();
      if (distance < 0) return;

      setTimeLeft({
        h: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        m: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        s: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
      });
    };

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime, status]);

  if (status === 'ended') {
    return <div className="text-xl font-bold text-white/50">Auction Ended</div>;
  }

  return (
    <div className="flex gap-4">
      {Object.entries(timeLeft).map(([unit, val]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl glass border border-white/20 flex items-center justify-center neon-glow">
            <span className="text-2xl font-bold text-white tracking-wider">{val}</span>
          </div>
          <span className="text-xs text-white/50 mt-2 uppercase">{unit === 'h' ? 'Hours' : unit === 'm' ? 'Mins' : 'Secs'}</span>
        </div>
      ))}
    </div>
  );
};

const AuctionDetail = () => {
  const { id } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAuctionById(id);
        setInitialData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const { auction, bids, notifications, isUserHighest, placeManualBid, startAuction } = useSimulatedAuction(initialData);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin neon-glow" />
      </div>
    );
  }

  if (!auction) return <div className="min-h-screen flex items-center justify-center text-white">Auction not found.</div>;

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-24 pb-20">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        {/* Breadcrumb */}
        <Link to="/auctions" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Auctions
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Left: Product Showcase */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl glass border border-white/10 overflow-hidden group"
            >
              <img 
                src={auction.images[activeImage]} 
                alt={auction.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-6 left-6 z-10">
                <span className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold backdrop-blur-xl border flex items-center gap-2 shadow-2xl",
                  auction.status === 'live' ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                )}>
                  {auction.status === 'live' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                  {auction.status.toUpperCase()}
                </span>
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            {auction.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {auction.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all",
                      activeImage === idx ? "border-primary opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="glass p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-4">Lot Details</h3>
              <p className="text-white/70 leading-relaxed">{auction.description}</p>
              
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-white/50">
                <span>Lot #{auction._id.slice(-6).toUpperCase()}</span>
                <span>Starting Price: ${auction.starting_price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Right: Bidding Terminal */}
          <div className="flex flex-col gap-6">
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-3xl border border-white/10 neon-border relative overflow-hidden"
            >
              {/* Decorative subtle background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{auction.name}</h1>
                <p className="text-white/50 mb-8 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Verified Authentic
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-wider mb-2">Current Bid</p>
                    <motion.p 
                      key={auction.currentBid}
                      initial={{ scale: 1.2, color: '#8b5cf6' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      className="text-5xl font-bold font-mono tracking-tight"
                    >
                      ${auction.currentBid.toLocaleString()}
                    </motion.p>
                    <p className="text-xs text-white/40 mt-2">Highest Bidder: <span className="text-white">{typeof auction.highestBidder === 'string' ? auction.highestBidder : 'Unknown'}</span></p>
                  </div>
                  
                  {auction.status === 'live' && (
                    <div className="h-16 w-px bg-white/10 mx-6" />
                  )}

                  {auction.status === 'live' && auction.owner !== CURRENT_USER_ID && (
                    <button 
                      onClick={placeManualBid}
                      className={cn(
                        "flex-1 py-5 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group",
                        isUserHighest 
                          ? "bg-green-500/20 text-green-400 border border-green-500/50 cursor-default" 
                          : "bg-primary text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-1"
                      )}
                    >
                      <span className="relative z-10">{isUserHighest ? "Winning!" : `Bid $${(auction.currentBid + 100).toLocaleString()}`}</span>
                      {!isUserHighest && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                    </button>
                  )}

                  {auction.status === 'live' && auction.owner === CURRENT_USER_ID && (
                    <div className="flex-1 py-5 rounded-xl font-bold text-sm text-center bg-white/5 text-white/50 border border-white/10 cursor-not-allowed">
                      You are the owner of this auction.
                    </div>
                  )}

                  {auction.status === 'pending' && auction.owner === CURRENT_USER_ID && (
                    <button 
                      onClick={startAuction}
                      className="flex-1 py-5 rounded-xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    >
                      Start Auction Now
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time Remaining
                  </p>
                  <CountdownPanel endTime={auction.endTime} status={auction.status} />
                </div>
              </div>
            </motion.div>

            {/* Live Activity Feed */}
            <div className="glass p-6 rounded-3xl border border-white/10 flex-grow flex flex-col">
              <h4 className="text-lg font-semibold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" /> Live Activity
                </span>
                {auction.status === 'live' && (
                  <span className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Connected
                  </span>
                )}
              </h4>
              
              <div className="flex-grow space-y-3 overflow-hidden relative min-h-[300px]">
                <AnimatePresence initial={false}>
                  {bids.map((bid, i) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: -20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border transition-colors",
                        i === 0 && auction.status === 'live' ? "bg-white/10 border-primary/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "bg-white/5 border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border",
                          bid.user === 'You (Me)' ? "bg-primary/20 border-primary/50 text-primary" : "bg-accent/20 border-accent/50 text-accent"
                        )}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{bid.user}</p>
                          <p className="text-xs text-white/40">{bid.time}</p>
                        </div>
                      </div>
                      <p className="font-mono font-bold text-lg text-white">${bid.amount.toLocaleString()}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[var(--color-background)] to-transparent pointer-events-none" />
              </div>
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
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <Bell className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm font-medium">{note.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AuctionDetail;
