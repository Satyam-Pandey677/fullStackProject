import { Suspense } from 'react'
import VerifyOtp from '../components/VerifyOtp'
import Loading from '../components/Loading'

const VerifyPage = () => {

    console.log("verify page")
  return (
    <Suspense fallback={<Loading/>}>
        <VerifyOtp/>
    </Suspense>
  )
}

export default VerifyPage