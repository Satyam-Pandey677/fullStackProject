import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'

type Category = { _id: string; name: string }
type Image = { url?: string; public_id?: string }

type Product = {
  _id: string
  name: string
  description?: string
  images?: Image[]
  category?: Category
  owner?: string
  starting_price?: number
  currentBid?: number
  status?: string
  duration?: number
  createdAt?: string
  endTime?: string
}

const formatCurrency = (n?: number) =>
  typeof n === 'number' ? n.toLocaleString(undefined, { style: 'currency', currency: 'USD' }) : '-'

const timeRemaining = (end?: string) => {
  if (!end) return 'N/A'
  const diff = new Date(end).getTime() - Date.now()
  if (diff <= 0) return 'Ended'
  const s = Math.floor(diff / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const days = Math.floor(h / 24)
  const hh = h % 24
  const mm = m % 60
  return `${days ? days + 'd ' : ''}${hh}h ${mm}m`
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const stateProduct = (location.state as any)?.product as Product | undefined

  const [product, setProduct] = useState<Product | null>(stateProduct ?? null)
  const [loading, setLoading] = useState<boolean>(!stateProduct)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product || !id) return
    setLoading(true)
    const token = Cookies.get("token")

    fetch(`/api/product/${id}`,{
        headers:{
        "Authorization": `Bearer ${token}`,
        }
    })
      .then(async (res) => {
        const text = await res.text()
        const ct = res.headers.get('content-type') || ''
        if (!res.ok) {
          // include server response (HTML or text) in error for debugging
          throw new Error(text || res.statusText)
        }
        if (ct.includes('application/json')) {
          try {
            return JSON.parse(text)
          } catch (e) {
            throw new Error('Invalid JSON from server')
          }
        }
        // received HTML (likely index.html) or plain text
        throw new Error('Expected JSON but received non-JSON response: ' + (text ? text.slice(0,200) : ''))
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message || 'Failed to load product'))
      .finally(() => setLoading(false))
  }, [id, product])

  console.log(product)

  if (loading) return <div>Loading product…</div>
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>
  if (!product) return <div>No product data available.</div>

  const img = product.images && product.images.length ? product.images[0].url : undefined

  return (
    <div style={{ maxWidth: 980, margin: '24px auto', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24 }}>
      <div>
        <div style={{ border: '1px solid #e6e6e6', borderRadius: 8, padding: 12 }}>
          <img
            src={img || '/placeholder.png'}
            alt={product.name}
            style={{ width: '100%', height: 420, objectFit: 'cover', borderRadius: 6 }}
          />
        </div>

        <h2 style={{ marginTop: 12 }}>{product.name}</h2>
        <div style={{ color: '#666', marginBottom: 12 }}>{product.category?.name || 'Uncategorized'}</div>
        <p style={{ lineHeight: 1.6 }}>{product.description}</p>
      </div>

      <aside style={{ border: '1px solid #eee', padding: 16, borderRadius: 8 }}>
        <div style={{ marginBottom: 12 }}>
          <strong>Starting price:</strong>
          <div>{formatCurrency(product.starting_price)}</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Current bid:</strong>
          <div>{formatCurrency(product.currentBid ?? 0)}</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Status:</strong>
          <div>{product.status || 'pending'}</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <strong>Ends in:</strong>
          <div>{timeRemaining(product.endTime)}</div>
        </div>

        <div style={{ marginTop: 18 }}>
          <button style={{ width: '100%', padding: '10px 12px', background: '#0b76ef', color: '#fff', border: 'none', borderRadius: 6 }} disabled={product.status !== 'active'}>
            Place Bid
          </button>
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          <div>Owner: {product.owner ? product.owner.slice(0, 8) : '—'}</div>
        </div>
      </aside>
    </div>
  )
}

export default ProductDetails