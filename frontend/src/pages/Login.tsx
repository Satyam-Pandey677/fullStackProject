import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppData } from '../context/ContextProvider';
import { USER_SERVICE } from '../Constent';


const Verify = () => {

  const inputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("")
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {user} = useAppData()

  //for Input auto focus when use visit the page
  useEffect(() => {
    inputRef.current?.focus();
    if(user){
      navigate("/products")
    }
  },[])

  const handleClick=async(e:React.FormEvent<HTMLElement>):Promise<void> => {  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    e.preventDefault()
    setLoading(true)
    if(!emailRegex.test(email)){
      setError("Please enter a valid email")
      console.log(error)
      setLoading(false)
      return;
    }

    try {
      const {data} = await axios.post(`${USER_SERVICE}/api/user/send-otp`,{
        email,
      })
      navigate(`/send-otp?email=${email}`);
      toast.success(data.message)
      setEmail("")
    } catch (error:any) {
      toast.error(error.message)
    }finally{
      setLoading(false)
    }
    setError("")
    navigate(`/send-otp?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className='flex h-screen w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)]'>
      <div className='w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl'>
        <h1 className='text-center text-3xl font-bold text-white'>Enter Your Email</h1>
        <p className='mt-2 text-center text-slate-400'>Enter email for verification</p>
        <form className='mt-6 space-y-6' onSubmit={handleClick}>
          <div className='flex flex-col items-center gap-5'>
            <input ref={inputRef} type='text' name='input' id='input' className='mx-auto w-full rounded-lg border border-white/10 bg-slate-800/80 px-4 py-2 text-white outline-none placeholder:text-slate-400 focus:border-orange-400' placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)} />
            {error && <p className='text-red-400'>{error}</p>}
            <button className='w-full rounded-lg bg-linear-to-r from-orange-500 to-amber-400 px-5 py-2 font-semibold text-slate-950'>
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <Loader2 className='h-5 w-5' />
                  Sending OTP to your email...
                </div>
              ) : (
                <div className='flex items-center justify-center gap-2'>
                  Sending OTP to your email...
                  <ArrowRight className='h-5 w-5' />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Verify