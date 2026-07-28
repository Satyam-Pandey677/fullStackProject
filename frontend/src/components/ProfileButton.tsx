import React, { useState } from 'react'

interface ProfileButtonProp{
  name: string,
  email: string
}

const ProfileButton: React.FC<ProfileButtonProp> = ({ name, email }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  // Get user initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate a consistent avatar color based on name
  const getAvatarColor = (fullName: string) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-teal-500'
    ]
    const index = fullName.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className='relative'>
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          font-semibold text-white text-sm transition-all duration-300
          cursor-pointer hover:scale-110 hover:shadow-lg
          ${getAvatarColor(name)} shadow-md
        `}
        title={`${name} - ${email}`}
      >
        {getInitials(name)}
      </button>

      {/* Hover Tooltip */}
      {isHovered && (
        <div className='
          absolute top-12 -left-12 w-56 bg-white rounded-lg shadow-lg
          border border-gray-200 p-4 z-50 animate-fade-in
          transition-all duration-200
        '>

          
          {/* Arrow pointer */}
          <div className='
            absolute -top-1 left-15 w-4 h-4 bg-white
            border-l border-t border-gray-200 rotate-45
          ' />

          {/* Profile Info */}
          <div className='relative'>
            <div className='flex items-center gap-3 mb-3'>
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center
                font-bold text-white text-lg
                ${getAvatarColor(name)}
              `}>
                {getInitials(name)}
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-gray-800 text-sm truncate'>
                  {name}
                </p>
                <p className='text-gray-500 text-xs truncate'>
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style tsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        :global(.animate-fade-in) {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ProfileButton