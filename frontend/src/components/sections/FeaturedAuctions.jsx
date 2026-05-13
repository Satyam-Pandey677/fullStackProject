import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Clock } from 'lucide-react';

const AUCTIONS = [
  {
    id: 1,
    title: "Air Jordan 1 Retro High Dior",
    category: "Sneakers",
    price: 8500,
    time: "02:14:30",
    bids: 42,
    image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80"
  },
  {
    id: 2,
    title: "Rolex Daytona Platinum",
    category: "Luxury Watches",
    price: 125000,
    time: "14:05:12",
    bids: 18,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80"
  },
  {
    id: 3,
    title: "Vintage Porsche 911",
    category: "Cars",
    price: 245000,
    time: "2 days",
    bids: 112,
    image: "https://images.unsplash.com/photo-1503376760367-5332205562d5?w=500&q=80"
  }
];

const TiltCard = ({ item }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[450px] rounded-3xl glass cursor-pointer border border-white/10 group"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="absolute inset-4 rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/20">
          {item.category}
        </div>
        
        {/* Like Button */}
        <button className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-red-500/50 transition-colors border border-white/20">
          <Heart className="w-4 h-4 text-white" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Current Bid</p>
              <p className="text-2xl font-bold text-white">${item.price.toLocaleString()}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm flex items-center justify-end gap-1 text-white/80 mb-1">
                <Clock className="w-3 h-3" /> {item.time}
              </p>
              <p className="text-xs text-white/50">{item.bids} Bids</p>
            </div>
          </div>
          
          <button className="w-full mt-4 py-3 bg-primary/80 backdrop-blur-md hover:bg-primary text-white rounded-xl font-semibold transition-colors border border-white/20">
            Place Bid
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedAuctions = () => {
  return (
    <section id="auctions" className="py-24 relative z-20 bg-black/40">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="text-gradient">Auctions</span>
            </h2>
            <p className="text-white/60 max-w-xl">
              Discover the most sought-after items available right now. Handpicked for our premium collectors.
            </p>
          </div>
          <Link to="/auctions" className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-colors font-medium self-start md:self-auto">
            View All Auctions
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
          {AUCTIONS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              <TiltCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAuctions;
