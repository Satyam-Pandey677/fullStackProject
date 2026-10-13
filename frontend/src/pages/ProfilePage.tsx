import { Link } from 'react-router-dom'
import { useAppData } from '../context/ContextProvider'

const ProfilePage = () => {
  const { user } = useAppData()

  if (!user) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 bg-slate-900/80 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <h1 className="text-2xl font-bold text-white">Profile unavailable</h1>
          <p className="mt-3 text-slate-300">Please sign in to view your profile.</p>
          <Link
            to="/sign-in"
            className="mt-6 inline-flex rounded-full bg-linear-to-r from-orange-500 to-amber-400 px-5 py-2 font-semibold text-slate-950 transition hover:scale-[1.01]"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    )
  }

  const initials = user.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const avatarColor = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'][
    user.name.charCodeAt(0) % 7
  ]

  const menuItems = user.isAdmin
    ? [
        { label: 'All Users', path: '/all-users' },
        { label: 'Create Product', path: '/create-product' },
        { label: 'Manage Categories', path: '/manage-categories' },
      ]
    : [
        { label: 'Browse Auctions', path: '/products' },
        { label: 'My Wins', path: '/my-win-products' },
      ]

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Account</p>
            <h1 className="mt-2 text-4xl font-bold text-white">Profile</h1>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-orange-500/15 hover:text-orange-200"
          >
            Back to products
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ${avatarColor}`}>
                {initials}
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Welcome</p>
                <h2 className="mt-2 text-3xl font-bold text-white">{user.name}</h2>
                <p className="mt-1 text-slate-300">{user.email}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Account role</p>
                <p className="mt-2 text-lg font-semibold text-orange-300">{user.isAdmin ? 'Admin' : 'User'}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold text-emerald-300">Active</p>
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <h3 className="text-xl font-semibold text-white">Quick actions</h3>
            <div className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-orange-500/40 hover:text-orange-200"
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ProfilePage
