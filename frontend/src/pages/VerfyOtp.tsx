import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const VerfyOtp = () => {

    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate()

    console.log(email)

    if(!email){
        navigate("/sign-in")
    }

    const handleChange = (index:number, value:string) => {
        
    }

  return (
    <div>
        
    </div>
  )
}

export default VerfyOtp