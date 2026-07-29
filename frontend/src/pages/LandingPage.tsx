import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BellRing, CheckCircle2, Heart, Play, ShieldCheck, Sparkles, TimerReset, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Wrapper from '../components/Wrapper'
import Navbar from '../components/Navbar'

const featureCards = [
  {
    title: 'Live bidding',
    desc: 'Watch demand surge in real time with animated price pulses.',
    icon: TrendingUp,
  },
  {
    title: 'Instant alerts',
    desc: 'Stay in the loop with floating notifications and soft haptics.',
    icon: BellRing,
  },
  {
    title: 'Trusted flows',
    desc: 'Every checkout feels secure, polished, and lightning fast.',
    icon: ShieldCheck,
  },
]

const slides = [
  {
    title: 'Rare watch auction',
    tag: 'Top bid',
    amount: '$12.4k',
    accent: 'from-orange-500 to-amber-400',
  },
  {
    title: 'Designer bag drop',
    tag: 'Trending',
    amount: '$4.8k',
    accent: 'from-fuchsia-500 to-violet-500',
  },
  {
    title: 'Collector vinyl',
    tag: 'New',
    amount: '$1.9k',
    accent: 'from-cyan-500 to-sky-500',
  },
]

const LandingPage = () => {
  const [liked, setLiked] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [timeLeft, setTimeLeft] = useState('12:34')

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 2400)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = new Date()
      setTimeLeft(`${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const currentSlide = useMemo(() => slides[activeSlide], [activeSlide])

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

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative mx-auto flex w-full max-w-xl justify-center"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect()
                const x = (event.clientX - rect.left) / rect.width - 0.5
                const y = (event.clientY - rect.top) / rect.height - 0.5
                setMousePosition({ x, y })
              }}
              onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotateX: mousePosition.y * -6,
                  rotateY: mousePosition.x * 8,
                  rotateZ: mousePosition.x * -2,
                  scale: 1.01,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                className="relative h-155 w-80 rounded-[2.5rem] border border-white/15 bg-slate-950/80 p-3 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
              >
                <div className="absolute inset-x-6 top-3 h-5 rounded-full bg-slate-900/70" />
                <div className="absolute inset-x-[44%] top-5 h-2 w-16 rounded-full bg-slate-700" />
                <div className="h-full overflow-hidden rounded-4xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>9:41</span>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live countdown</p>
                        <p className="mt-1 text-lg font-semibold text-white">Ends in {timeLeft}</p>
                      </div>
                      <div className="rounded-full bg-orange-500/20 p-2 text-orange-300">
                        <TimerReset className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>

                  <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/70 p-3">
                    <div>
                      <p className="text-sm text-slate-400">Welcome back</p>
                      <p className="text-base font-semibold text-white">Luxury bidding</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLiked((prev) => !prev)}
                      className="rounded-full bg-white/10 p-2 text-white"
                    >
                      <Heart className={`h-4 w-4 ${liked ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </motion.button>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/80 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">Now showing</p>
                        <p className="text-lg font-semibold text-white">{currentSlide.title}</p>
                      </div>
                      <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-xs font-medium text-orange-300">
                        {currentSlide.tag}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className={`mt-3 rounded-2xl bg-linear-to-br ${currentSlide.accent} p-4 text-white`}
                      >
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-white/80">Highest bid</p>
                            <p className="mt-1 text-3xl font-semibold">{currentSlide.amount}</p>
                          </div>
                          <motion.button whileTap={{ scale: 0.95 }} className="rounded-full bg-white/20 p-2">
                            <Zap className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="mt-4 space-y-3">
                    {featureCards.map((feature, index) => {
                      const Icon = feature.icon
                      return (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * index }}
                          whileHover={{ y: -2, scale: 1.01 }}
                          className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-orange-500/15 p-2 text-orange-300">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{feature.title}</p>
                              <p className="text-sm text-slate-400">{feature.desc}</p>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3"
                  >
                    <div className="flex items-center gap-2 text-sm text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Secure checkout and instant confirmations</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
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