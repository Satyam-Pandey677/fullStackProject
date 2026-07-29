import { Suspense } from 'react'
import VerfyOtp from '../components/VerfyOtp'
import Loading from '../components/Loading'

const VerifyPage = () => {

    console.log("verify page")
  return (
    <Suspense fallback={<Loading/>}>
        <VerfyOtp/>
    </Suspense>
  )
}

export default VerifyPage