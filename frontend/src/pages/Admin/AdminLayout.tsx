
import { useAppData } from '../../context/ContextProvider'
import Loading from '../../components/Loading'
import { Navigate, Outlet } from 'react-router-dom'

const AdminLayout = () => {

    const {user, loading} = useAppData()

    if(loading){
      return <Loading/>
    }

  return user?.isAdmin ? (
    <Outlet/>
  ):(
    <Navigate to="/" replace/>
  )
}

export default AdminLayout