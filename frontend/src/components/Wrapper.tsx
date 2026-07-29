import React from 'react'

interface ComponentProps {
  className?:string,
  children: React.ReactNode
}

const Wrapper = ({className, children}:ComponentProps) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8 ${className || ''}`}>
        {
            children
        }
    </div>
  )
}

export default Wrapper