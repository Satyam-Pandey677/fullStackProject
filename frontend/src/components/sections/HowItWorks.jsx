import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserPlus, Gavel, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    icon: UserPlus,
    title: "Create Account",
    desc: "Sign up securely in seconds. Verify your identity to join high-stakes auctions."
  },
  {
    icon: Gavel,
    title: "Join Live Auctions",
    desc: "Browse premium collections and enter real-time bidding rooms with other collectors."
  },
  {
    icon: Trophy,
    title: "Win & Claim",
    desc: "Outbid the competition. Secure payment and worldwide insured delivery included."
  }
];

const HowItWorks = () => {
  const containerRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate the connecting line
      gsap.fromTo(lineRef.current, 
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true
          }
        }
      );

      // Animate the steps
      gsap.utils.toArray('.step-item').forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="py-32 relative z-20">
      <div className="container mx-auto px-6" ref={containerRef}>
        
        <div className="text-center mb-24">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Three simple steps to start acquiring the world's most exclusive items.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 origin-top hidden md:block" />
          <div 
            ref={lineRef} 
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent -translate-x-1/2 origin-top hidden md:block shadow-[0_0_15px_rgba(139,92,246,0.5)]" 
          />

          <div className="space-y-12 md:space-y-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 === 0;
              
              return (
                <div key={i} className={`step-item relative flex flex-col md:flex-row items-center justify-between ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  
                  {/* Content */}
                  <div className={`md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} text-center mb-8 md:mb-0`}>
                    <div className="glass p-8 rounded-3xl border border-white/10 hover:border-primary/50 transition-colors duration-500 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <h3 className="text-2xl font-bold mb-3 relative z-10">{step.title}</h3>
                      <p className="text-white/60 relative z-10">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="md:w-2/12 flex justify-center absolute left-1/2 -translate-x-1/2 md:relative md:translate-x-0 top-0 md:top-auto z-10 hidden md:flex">
                    <div className="w-16 h-16 rounded-full glass border-2 border-primary flex items-center justify-center relative neon-glow bg-background">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Empty space for layout balance */}
                  <div className="md:w-5/12 hidden md:block" />
                  
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
