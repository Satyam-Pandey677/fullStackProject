import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Verify = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("")
  const [error, setError] = useState("");
  const navigate = useNavigate()

  //for Input auto focus when use visit the page
  useEffect(() => {
    inputRef.current?.focus();
  },[])

  const handleClick=() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
      setError("Please enter a valid email")
      console.log(error)
      return;
    }

    setError("")
    navigate(`/send-otp?email=${encodeURIComponent(email)}`)
    
  }

  return (
    <div className='h-screen w-full bg-black flex justify-center items-center'>
        <div  className='w-100 p-5 border border-gray-400 flex flex-col justify-center items-center gap-5 shadow-[7px_7px_0px_0px_#EE964B] '>
          <h1 className='text-3xl text-white font-bold text-center'>Enter Your Email</h1>
          <p className='text-neutral-400 text-center'>Entre email for verification</p>
          <input ref={inputRef} type='text' name='input' id='input' className='mx-auto border-2 px-4 py-1 text-white' placeholder='Enter you email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          {error && <p className='text-red-500 '>{error}</p>}
          <button className='text-white bg-orange-400 px-18 py-1 font-bold' onClick={handleClick}>
              Send OTP
          </button>
        </div>
    </div>    
  )
}

export default Verify