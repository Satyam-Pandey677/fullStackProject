import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import PhoneContainer from '../components/PhoneContainer'
import Wrapper from '../components/Wrapper'

const LandingPage = () => {

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.16),transparent_24%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] text-slate-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <motion.span
            key={index}
            className="absolute h-2.5 w-2.5 rounded-full bg-white/20 blur-[1px]"
            animate={{
              x: [0, 40, -20, 30, 0],
              y: [0, -30, 25, -10, 0],
              opacity: [0.2, 0.8, 0.4, 0.9, 0.2],
            }}
            transition={{ duration: 8 + index * 0.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ left: `${8 + index * 8}%`, top: `${12 + index * 7}%` }}
          />
        ))}
      </div>

      <Wrapper className="relative z-10">
        <Navbar />

        <main className="pb-20 pt-8 sm:pt-16">
          <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="max-w-2xl"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-sm text-orange-200 backdrop-blur"
              >
                <Sparkles className="h-4 w-4" />
                Premium auction experiences, crafted for modern brands
              </motion.div>

              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Make every auction feel like a{' '}
                <span className="bg-linear-to-r from-orange-300 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                  luxury product launch
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
                Elevate your bidding app with cinematic motion, real-time engagement, and premium interactions that feel effortless from the first tap.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-orange-500/30"
                >
                  Start free <ArrowRight className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur"
                >
                  <Play className="h-4 w-4" /> Watch demo
                </motion.button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Avg. engagement', value: '+84%' },
                  { label: 'Live bids', value: '24/7' },
                  { label: 'Satisfaction', value: '4.9/5' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <PhoneContainer />
          </section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="mt-20 grid gap-6 rounded-4xl border border-white/10 bg-white/8 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.35)] backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-orange-300">Why it feels premium</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Designed to feel effortless, fast, and unforgettable.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Micro-interactions', 'Every button, card, and swipe carries a tactile sense of motion.'],
                ['Performance first', 'Optimized transitions keep the experience smooth and responsive.'],
                ['Elevated storytelling', 'Animated sections guide visitors through the product naturally.'],
                ['Instant trust', 'Glassmorphism layers and polished copy build confidence quickly.'],
              ].map(([title, text]) => (
                <motion.div
                  key={title}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                >
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      </Wrapper>
    </div>
  )
}

export default LandingPage