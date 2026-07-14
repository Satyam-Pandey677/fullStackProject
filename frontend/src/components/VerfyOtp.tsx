import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppData } from "../context/ContextProvider";
import { USER_SERVICE } from "../Constent";
const VerfyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const navigate = useNavigate();
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const { isAuth, setUser, setIsAuth } = useAppData();

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>,
  ) => {
    if (e.key == "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please Enter All Digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(`${USER_SERVICE}/api/user/verify`, {
        email,
        otp: otpString,
      });

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      setOtp(["", "", "", "", "", ""]);
      inputRef.current[0]?.focus();
      setIsAuth(true);

      console.log(data)
      setUser(data.user);
      navigate("/products")
    } catch (error: any) {
      console.log(error.message);
    }finally{
      setLoading(false)
    }
  };

  if (isAuth) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="flex justify-center items-center h-screen w-full bg-black text-white">
      <div className="flex flex-col items-center w-200 p-4 gap-6 border-2 shadow-[7px_7px_0px_0px_#EE964B]">
        <h1 className="font-bold text-2xl">Enter you OTP</h1>
        <p className="text-center">
          OTP sent to you email <br /> {email}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                className="border-2 p-1 w-10"
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(el: HTMLInputElement | null) => {
                  inputRef.current[index] = el;
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <button type="submit" className="w-80 mt-10 py-1 bg-orange-400">{loading ? "Verifying": "Verify"}</button>
        </form>
      </div>
    </div>
  );
};

export default VerfyOtp;
