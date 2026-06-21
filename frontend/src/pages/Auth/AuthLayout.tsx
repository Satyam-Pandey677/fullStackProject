import React from 'react'
import { useAppData } from '../../context/ContextProvider'
import { Navigate, Outlet } from 'react-router-dom'
import Loading from '../../components/Loading'

const AuthLayout = () => {

    const {isAuth, loading}  = useAppData()

    console.log(isAuth)


    if(loading) {
        return <Loading/>
    }

  return isAuth? (
            <Outlet/>
        ):(
            <Navigate to="sign-in" replace/>
        )
}

export default AuthLayout