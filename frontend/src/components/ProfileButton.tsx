import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppData } from '../context/ContextProvider'

interface ProfileButtonProp {
  name: string
  email: string
}

const ProfileButton: React.FC<ProfileButtonProp> = ({ name, email }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAppData()

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (fullName: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500',
    ]
    const index = fullName.charCodeAt(0) % colors.length
    return colors[index]
  }

  const isAdmin = Boolean(user?.isAdmin)

  const menuItems = isAdmin
    ? [
        { label: 'All Users', path: '/all-users' },
        { label: 'Create Product', path: '/create-product' },
      ]
    : [
        { label: 'All Products', path: '/products' },
      ]

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/sign-in')
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg ${getAvatarColor(name)}`}
        title={`${name} - ${email}`}
      >
        {getInitials(name)}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${getAvatarColor(name)}`}>
                {getInitials(name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{name}</p>
                <p className="truncate text-xs text-slate-400">{email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-orange-500/15 hover:text-orange-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileButton