import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppData } from '../context/ContextProvider';


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
      const {data} = await axios.post(`/api/user/send-otp`,{
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
    <div className='h-screen w-full bg-black flex justify-center items-center'>
        <div  className='w-100 p-5 border border-gray-400 flex flex-col justify-center items-center gap-5 shadow-[7px_7px_0px_0px_#EE964B] '>
          <h1 className='text-3xl text-white font-bold text-center'>Enter Your Email</h1>
          <p className='text-neutral-400 text-center'>Entre email for verification</p>
          <form className='space-y-6' onSubmit={handleClick}>
          <div className='flex flex-col justify-center items-center gap-5'>
          <input ref={inputRef} type='text' name='input' id='input' className='mx-auto border-2 px-4 py-1 text-white' placeholder='Enter you email' value={email} onChange={(e) => setEmail(e.target.value)}/>
          {error && <p className='text-red-500 '>{error}</p>}
          <button className='text-white bg-orange-400 px-5 py-1'>
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='w-5 h-5'/>
                    Sending OTP to your email...
                </div>
              ):(
                <div className='flex items-center justify-center gap-2'>
                    Sending OTP to your email...
                    <ArrowRight className='w-5 h-5'/>
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