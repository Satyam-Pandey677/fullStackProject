import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Filter, ArrowUpDown } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { fetchAuctions } from '../lib/mockData';
import { cn } from '../lib/utils';

// Helper component for countdown
const CountdownTimer = ({ endTime, status }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (status === 'ended') {
      setTimeLeft('Ended');
      return;
    }
    if (status === 'pending') {
      setTimeLeft('Starts Soon');
      return;
    }

    const end = new Date(endTime).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Ended');
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime, status]);

  return <span>{timeLeft}</span>;
};

// Skeleton Card
const SkeletonCard = () => (
  <div className="w-full h-[450px] rounded-3xl glass border border-white/10 relative overflow-hidden">
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    <div className="h-2/3 bg-white/5 rounded-t-3xl" />
    <div className="p-6 space-y-4">
      <div className="h-6 w-3/4 bg-white/10 rounded-md" />
      <div className="h-4 w-1/2 bg-white/10 rounded-md" />
      <div className="flex justify-between items-end pt-4">
        <div className="h-8 w-1/3 bg-white/10 rounded-md" />
        <div className="h-4 w-1/4 bg-white/10 rounded-md" />
      </div>
    </div>
  </div>
);

const AuctionCard = ({ item }) => {
  return (
    <Link to={`/auctions/${item._id}`}>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative w-full h-[450px] rounded-3xl glass cursor-pointer border border-white/10 overflow-hidden transition-colors hover:border-primary/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
        
        <img 
          src={item.images[0]} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border",
            item.status === 'live' ? "bg-red-500/20 text-red-400 border-red-500/50" : 
            item.status === 'ended' ? "bg-white/10 text-white/50 border-white/20" : 
            "bg-blue-500/20 text-blue-400 border-blue-500/50"
          )}>
            {item.status.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end">
          <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-primary transition-colors">{item.name}</h3>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-white/50 mb-1 uppercase tracking-wider">Current Bid</p>
              <p className="text-2xl font-bold text-white">${item.currentBid.toLocaleString()}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm flex items-center justify-end gap-1 text-white/80 mb-1">
                <Clock className="w-4 h-4 text-accent" /> 
                <CountdownTimer endTime={item.endTime} status={item.status} />
              </p>
            </div>
          </div>
          
          <div className="w-full mt-6 py-3 bg-white/5 backdrop-blur-md group-hover:bg-primary text-center text-white rounded-xl font-semibold transition-colors border border-white/10">
            {item.status === 'live' ? 'Join Auction' : 'View Details'}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

const AllAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState('ending_soon');
  
  const observer = useRef();

  const loadAuctions = async (currentPage, isReset = false) => {
    setLoading(true);
    try {
      const response = await fetchAuctions(currentPage, 9, { status: filterStatus }, sort);
      if (isReset) {
        setAuctions(response.data);
      } else {
        setAuctions(prev => [...prev, ...response.data]);
      }
      setHasMore(response.hasMore);
    } catch (error) {
      console.error("Failed to fetch auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadAuctions(1, true);
  }, [filterStatus, sort]);

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const nextPage = prev + 1;
          loadAuctions(nextPage);
          return nextPage;
        });
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, filterStatus, sort]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden pt-24 pb-20">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header & Controls */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-8"
          >
            Explore <span className="text-gradient">Auctions</span>
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border-white/10">
            {/* Status Filters */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              {['all', 'live', 'pending', 'ended'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap",
                    filterStatus === status 
                      ? "bg-primary text-white" 
                      : "bg-white/5 hover:bg-white/10 text-white/70"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <ArrowUpDown className="w-4 h-4 text-white/50" />
              <select 
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-background border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-full md:w-auto appearance-none"
              >
                <option value="ending_soon">Ending Soon</option>
                <option value="highest_bid">Highest Bid</option>
                <option value="newly_added">Newly Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {auctions.map((item, index) => {
              if (auctions.length === index + 1) {
                return (
                  <motion.div 
                    ref={lastElementRef} 
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <AuctionCard item={item} />
                  </motion.div>
                );
              }
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <AuctionCard item={item} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Skeletons while loading */}
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
        
        {!hasMore && !loading && (
          <div className="text-center py-12 text-white/40 font-medium">
            No more auctions to load.
          </div>
        )}

      </div>
    </div>
  );
};

export default AllAuctions;
