import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { PRODUCT_SERVICE } from '../Constent'
import { useAppData } from '../context/ContextProvider'
import socket from '../utils/Socket'

interface ProductImage {
  url: string
  id: string
  _id?: string
}

interface IProduct {
  _id: string
  name: string
  description?: string
  images?: ProductImage[]
  starting_price: number
  currentBid: number
  duration: number
  endTime: string | Date
  status: 'pending' | 'live' | 'ended'
  owner?: string | { _id?: string; name?: string; email?: string }
  category?: {
    _id?: string
    name?: string
  }
}

interface IUser {
  id?: string
  _id?: string
  name?: string
  email?: string
  isAdmin?: boolean
}

const calculateTimeLeft = (endTime: string | Date): string => {
  const diff = new Date(endTime).getTime() - new Date().getTime()

  if (diff <= 0) return 'Ended'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m`
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [startingAuction, setStartingAuction] = useState(false)
  const [endingAuction, setEndingAuction] = useState(false)
  const [placingBid, setPlacingBid] = useState(false)

  const [currentPrice, setCurrentPrice] = useState(0)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [bidAmount, setBidAmount] = useState('')

  const [, setTimer] = useState(0);

  const { user } = useAppData()

  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product id provided')
        setLoading(false)
        return
      }

      

      const handleBidPrice = (data:any) => {
        console.log(data)
      }

      socket.on("bidPlaced",handleBidPrice)

      try {
        setLoading(true)
        const token = Cookies.get('token')
        const response = await fetch(`${PRODUCT_SERVICE}/api/product/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load product details')
        }

        const data = await response.json()

        console.log(data)
        setCurrentPrice(data.product.currentBid)
        setProduct(data?.product || null)
        console.log("before join channel")
        socket.emit("joinBid", data.product?._id)
        console.log("after join channel")
        setError(null)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
    
  }, [id])
  
  useEffect(() => {
    if (product) {
      const currentBase = product.currentBid > 0 ? product.currentBid : product.starting_price
      setBidAmount(String(currentBase + 1000))
    }
    
    socket.on("bidPlaced", (bidDeatails) => {
      console.log(bidDeatails.amount)
      setCurrentPrice(bidDeatails.amount)
    })
  }, [product])
  
  useEffect(() => {
    socket.on("countdown", (t) => {
        setTimer(t);
    })
    

  },[])

  const timeLeft = useMemo(() => {
    if (!product) return 'Loading...'
    return calculateTimeLeft(product.endTime)
  }, [product])

  const statusClasses: Record<IProduct['status'], string> = {
    pending: 'bg-amber-500/20 text-amber-300 border border-amber-400/20',
    live: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/20',
    ended: 'bg-red-500/20 text-red-300 border border-red-400/20',
  }

  const imageUrl = product?.images?.[activeImage]?.url || product?.images?.[0]?.url || 'https://via.placeholder.com/800x600?text=No+Image'
  const isAdmin = Boolean((user as IUser | null)?.isAdmin)
  const canBid = Boolean(user) && product?.status === 'live' && !isAdmin
  const baseBid = product ? (product.currentBid > 0 ? product.currentBid : product.starting_price) : 0

  const handleStartAuction = async () => {
    if (!id || !isAdmin) return

    try {
      setStartingAuction(true)
      setActionMessage(null)
      const token = Cookies.get('token')
      const response = await fetch(`${PRODUCT_SERVICE}/api/product/${id}/start-auction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to start auction')
      }

      setProduct((prev) => prev ? { ...prev, status: 'live' } : prev)
      setActionMessage('Auction started successfully.')
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setStartingAuction(false)
    }
  }

  const handleEndAuction = async () => {
    if (!id || !isAdmin) return

    try {
      setEndingAuction(true)
      setActionMessage(null)
      const token = Cookies.get('token')
      const response = await fetch(`${PRODUCT_SERVICE}/api/product/${id}/end-auction`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to end auction')
      }

      setProduct((prev) => prev ? { ...prev, status: 'ended' } : prev)

      socket.on("auctionEnded", (details) => {
        setActionMessage(`Auction ended successfully & Winner is ${details.winner}.`)
      })

    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setEndingAuction(false)
    }
  }

  const handlePlaceBid = async () => {
    if (!id || !product || !user) return

    const parsedAmount = Number(bidAmount)
    if (!parsedAmount || parsedAmount <= baseBid) {
      setActionMessage(`Enter an amount greater than $${baseBid}`)
      return
    }

    try {
      setPlacingBid(true)
      setActionMessage(null)
      const token = Cookies.get('token')
      const response = await fetch(`${PRODUCT_SERVICE}/api/product/${id}/bid`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: parsedAmount }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to place bid')
      }


      setProduct((prev) => prev ? { ...prev, currentBid: parsedAmount } : prev)
      setActionMessage(`Bid of $${parsedAmount} placed successfully.`)
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setPlacingBid(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="mb-6 inline-flex items-center font-medium text-orange-300 transition hover:text-orange-200">
          ← Back to products
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-orange-500" />
            <p className="text-slate-300">Loading product details...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
            <h2 className="text-xl font-semibold text-red-200">Unable to load product</h2>
            <p className="mt-2 text-red-300">{error}</p>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
                <img src={imageUrl} alt={product.name} className="h-105 w-full object-cover" />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-xl border-2 ${activeImage === index ? 'border-orange-400' : 'border-transparent'}`}
                    >
                      <img src={image.url} alt={`${product.name} ${index + 1}`} className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClasses[product.status]}`}>
                  {product.status}
                </span>
                <h1 className="mt-4 text-3xl font-bold text-white">{product.name}</h1>
                <p className="mt-2 text-sm text-slate-400">Category: {product.category?.name || 'Uncategorized'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  <p className="text-sm text-slate-400">Starting Price</p>
                  <p className="mt-1 text-2xl font-semibold text-white">${product.starting_price}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  <p className="text-sm text-slate-400">Current Bid</p>
                  <p className="mt-1 text-2xl font-semibold text-orange-300">${currentPrice}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Auction Time</p>
                    <p className="text-lg font-semibold text-white">{timeLeft}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Ends</p>
                    <p className="text-sm font-medium text-slate-300">{new Date(product.endTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                <h2 className="text-xl font-semibold text-white">Description</h2>
                <p className="mt-3 leading-7 text-slate-300">
                  {product.description || 'No description provided for this product.'}
                </p>
              </div>

              {product.status === 'ended' && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-emerald-300">Auction ended</p>
                  <p className="mt-1 text-sm text-emerald-200">
                    {product.currentBid > 0
                      ? `Winning bid: $${product.currentBid}`
                      : 'No bids were placed.'}
                  </p>
                </div>
              )}

              {isAdmin && product.status === 'pending' && (
                <button
                  onClick={handleStartAuction}
                  disabled={startingAuction}
                  className="w-full rounded-lg bg-linear-to-r from-emerald-500 to-emerald-400 px-4 py-3 text-lg font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {startingAuction ? 'Starting Auction...' : 'Start Auction'}
                </button>
              )}

              {isAdmin && product.status === 'live' && (
                <button
                  onClick={handleEndAuction}
                  disabled={endingAuction}
                  className="w-full rounded-lg bg-linear-to-r from-red-500 to-rose-400 px-4 py-3 text-lg font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {endingAuction ? 'Ending Auction...' : 'End Auction'}
                </button>
              )}

              {actionMessage && (
                <p className={`text-sm ${actionMessage.includes('successfully') ? 'text-emerald-300' : 'text-red-300'}`}>
                  {actionMessage}
                </p>
              )}

              {canBid && (
                <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBidAmount(String(baseBid + 500))}
                      className="rounded-md bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm ring-1 ring-white/10"
                    >
                      +$500
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidAmount(String(baseBid + 1000))}
                      className="rounded-md bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm ring-1 ring-white/10"
                    >
                      +$1000
                    </button>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <input
                      type="number"
                      min={baseBid + 1}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-400 focus:border-orange-400"
                      placeholder="Enter your bid"
                    />
                    <button
                      type="button"
                      onClick={handlePlaceBid}
                      disabled={placingBid}
                      className="rounded-lg bg-linear-to-r from-orange-500 to-amber-400 px-4 py-2 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {placingBid ? 'Placing...' : 'Bid'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductDetails