import { useEffect, useMemo, useState } from 'react'
import { data, Link, useParams } from 'react-router-dom'
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

  const timeLeft = useMemo(() => {
    if (!product) return 'Loading...'
    return calculateTimeLeft(product.endTime)
  }, [product])

  const statusClasses: Record<IProduct['status'], string> = {
    pending: 'bg-yellow-500 text-white',
    live: 'bg-green-600 text-white',
    ended: 'bg-red-500 text-white',
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
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6">
          ← Back to products
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700">Unable to load product</h2>
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <img src={imageUrl} alt={product.name} className="h-[420px] w-full object-cover" />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id || index}
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-lg border-2 ${activeImage === index ? 'border-orange-500' : 'border-transparent'}`}
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
                <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Category: {product.category?.name || 'Uncategorized'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Starting Price</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">${product.starting_price}</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-gray-500">Current Bid</p>
                  <p className="mt-1 text-2xl font-semibold text-orange-600">${currentPrice}</p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Auction Time</p>
                    <p className="text-lg font-semibold text-gray-900">{timeLeft}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ends</p>
                    <p className="text-sm font-medium text-gray-700">{new Date(product.endTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                <p className="mt-3 text-gray-600 leading-7">
                  {product.description || 'No description provided for this product.'}
                </p>
              </div>

              {product.status === 'ended' && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
                  <p className="text-sm font-semibold text-green-700">Auction ended</p>
                  <p className="mt-1 text-sm text-green-600">
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
                  className="w-full rounded-lg bg-green-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                >
                  {startingAuction ? 'Starting Auction...' : 'Start Auction'}
                </button>
              )}

              {isAdmin && product.status === 'live' && (
                <button
                  onClick={handleEndAuction}
                  disabled={endingAuction}
                  className="w-full rounded-lg bg-red-600 px-4 py-3 text-lg font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                >
                  {endingAuction ? 'Ending Auction...' : 'End Auction'}
                </button>
              )}

              {actionMessage && (
                <p className={`text-sm ${actionMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                  {actionMessage}
                </p>
              )}

              {canBid && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setBidAmount(String(baseBid + 500))}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200"
                    >
                      +$500
                    </button>
                    <button
                      type="button"
                      onClick={() => setBidAmount(String(baseBid + 1000))}
                      className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200"
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
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 outline-none focus:border-orange-500"
                      placeholder="Enter your bid"
                    />
                    <button
                      type="button"
                      onClick={handlePlaceBid}
                      disabled={placingBid}
                      className="rounded-lg bg-orange-500 px-4 py-2 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
                    >
                      {placingBid ? 'Placing...' : 'Bid'}
                    </button>
                  </div>
                </div>
              )}

              <button
                disabled={product.status !== 'live'}
                className={`w-full rounded-lg px-4 py-3 text-lg font-semibold transition ${product.status === 'live' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'cursor-not-allowed bg-gray-300 text-gray-600'}`}
              >
                {product.status === 'live' ? 'Place Bid' : `Auction ${product.status}`}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ProductDetails