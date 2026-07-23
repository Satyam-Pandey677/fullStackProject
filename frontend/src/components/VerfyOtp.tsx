import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useSearchParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAppData } from "../context/ContextProvider";
import { USER_SERVICE } from "../Constent";

const VerfyOtp = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState<number>(60);

  const { isAuth, setUser, setIsAuth } = useAppData();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimer]);

  useEffect(() => {
    // focus first input on mount
    inputRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // allow only digits
    const v = value.replace(/[^0-9]/g, "");
    if (v.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = v;
    setOtp(newOtp);

    if (v && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (key === "Backspace") {
      if (otp[index]) {
        // clear current
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRef.current[index - 1]?.focus();
      }
    } else if (key === "ArrowLeft" && index > 0) {
      inputRef.current[index - 1]?.focus();
    } else if (key === "ArrowRight" && index < 5) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const arr = pasted.split("");
      setOtp(arr);
      // focus last
      inputRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits of the OTP.");
      setMessage("");
      return;
    }

    setError("");
    setMessage("");
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
      setUser(data.user);
      navigate("/products");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Verification failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setMessage("");
    setError("");
    try {
      await axios.post(`${USER_SERVICE}/api/user/resend-otp`, { email });
      setMessage("OTP has been resent. Check your email.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to resend OTP.");
    }
  };

  if (isAuth) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-[#0b0b0b] p-6 rounded-lg shadow-lg border border-orange-400">
        <h1 className="font-bold text-2xl text-center mb-2">Verify OTP</h1>
        <p className="text-sm text-center text-gray-300 mb-4">
          We sent a 6-digit code to your email address
        </p>
        <p className="text-sm text-center text-orange-200 mb-4 break-words">{email}</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center" aria-label="OTP form">
          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={`OTP digit ${index + 1}`}
                className="w-12 h-12 text-center text-xl rounded-md bg-gray-800 border border-gray-700 focus:border-orange-400 focus:outline-none"
                onChange={(e) => handleChange(index, e.target.value)}
                ref={(el: HTMLInputElement | null) => {
                  inputRef.current[index] = el;
                }}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
          {message && <div className="text-green-400 text-sm mb-2">{message}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 rounded-md font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="flex items-center justify-between w-full mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-sm text-gray-300 hover:text-white disabled:opacity-50"
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </button>

            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerfyOtp;
