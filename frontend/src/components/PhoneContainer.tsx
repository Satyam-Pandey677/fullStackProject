import { AnimatePresence, motion } from 'framer-motion'
import { BellRing, CheckCircle2, Heart, ShieldCheck, TimerReset, TrendingUp, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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

const PhoneContainer = () => {
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
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative mx-auto flex w-full max-w-xl items-center justify-center"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        setMousePosition({ x, y })
      }}
      onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
    >
      <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -right-12 bottom-6 h-52 w-52 rounded-full bg-sky-500/15 blur-3xl" />

      <div className="relative rounded-[2.8rem] border border-white/10 bg-slate-900/45 p-2 shadow-[0_40px_120px_rgba(15,23,42,0.7)] backdrop-blur-xl">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotateX: mousePosition.y * -6,
            rotateY: mousePosition.x * 8,
            rotateZ: mousePosition.x * -2,
            scale: 1.01,
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 16 }}
          className="relative h-136 w-80 overflow-hidden rounded-[2.4rem] border border-white/15 bg-slate-950/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <div className="absolute inset-x-6 top-3 h-5 rounded-full bg-slate-900/70" />
          <div className="absolute inset-x-[44%] top-5 h-2 w-16 rounded-full bg-slate-700" />
          <div className="h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-4">
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
      </div>
    </motion.div>
  )
}

export default PhoneContainer
