import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';


export interface User  {
    id:string,
    name:string,
    email:string
}

export interface UserContextType{
    user: User | null,
    setUser:React.Dispatch<React.SetStateAction<User|null>>;
    setIsAuth:React.Dispatch<React.SetStateAction<boolean>>,
    loading:boolean,
    isAuth:boolean,
    fetchUser: () => Promise<void>,
    logout : () => Promise<void>,
};

const Context = createContext<UserContextType|undefined>(undefined);

const ContextProvider = ({children}:{children: ReactNode}) => {

    const [user, setUser] = useState<User|null>(null)
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true)

    const fetchUser = async () =>{
        const token = Cookies.get("token");

        console.log(token)
        if(!token){
            setLoading(false)
            return
        }
        
        try {
            const {data} = await axios.get("/api/user/me",{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            console.log(data)
    
            setUser(data.user)
            setIsAuth(true);
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setIsAuth(false)
        }
    }

    const logout = async() => {
        Cookies.remove("token");
        setUser(null);
        setIsAuth(false);
        toast.success("User Logged out")
    }



    useEffect(() => {
        fetchUser();
    },[])
    const value = {
        user, 
        setUser,
        setIsAuth,
        fetchUser,
        loading,
        isAuth,
        logout
    }
  return (
    <Context.Provider value={value}>
        {children}
    </Context.Provider>
  )
}

export default ContextProvider

export const useAppData = ():UserContextType => {
    const context = useContext(Context);
    if(!context){
       throw new Error("useAppData must be used within ContextProvider");
    }
    return context
}   