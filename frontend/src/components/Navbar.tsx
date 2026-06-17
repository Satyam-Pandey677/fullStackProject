import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const links= [
    {
        name:"Home",
        link:"home"
    },{
        name:"About",
        link:"about"
    },{
        name :"Guide",
        link:"guide"
    }
]

const Navbar = () => {

    const navigate = useNavigate()


   const handleClick = () => {
        navigate("/sign-in")
   }

  return (
    <div className='flex w-full justify-between'>
        <h1 className='text-2xl font-bold '>Bid<span className='text-orange-400'>IT</span></h1>
        <div className='flex gap-4 items-center'>
            {
                links.map((link, index) => (
                    <Link key={index} to={`/#${link.link}`} className='decoration-0 font-[12px] hover:text-neutral-600'>
                        {link.name}
                    </Link>
                ))
            }

            <button
             onClick={handleClick}
             className='border px-4 py-2 rounded-full hover:bg-orange-400'
            >
                Get Start
            </button>
        </div>
    </div>
  )
}

export default Navbar