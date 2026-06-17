import React from 'react'

interface ComponentProps {
  className?:string,
  children: React.ReactNode
}

const Wrapper = ({className, children}:ComponentProps) => {
  return (
    <div className='max-w-5xl mx-auto p-4'>
        {
            children
        }
    </div>
  )
}

export default Wrapper