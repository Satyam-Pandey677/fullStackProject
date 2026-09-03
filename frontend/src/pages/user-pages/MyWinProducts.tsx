import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import ProductCard from '../../components/ProductCard'
import { PRODUCT_SERVICE } from '../../Constent'
import type { IProduct } from '../ProductsPage'

const MyWinProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWonProducts = async () => {
      try {
        const response = await fetch(`${PRODUCT_SERVICE}/api/product/my-win-products`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch won products')
        }

        const data = await response.json()
        setProducts(data?.products || [])
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load won products')
      } finally {
        setLoading(false)
      }
    }

    fetchWonProducts()
  }, [])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Your collection</p>
            <h1 className="text-4xl font-bold text-white">Won Products</h1>
            <p className="mt-2 text-lg text-slate-300">Auctions you won, all in one place.</p>
          </div>
          <Link to="/products" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-orange-500/15 hover:text-orange-200">
            Browse auctions
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-orange-500" />
            <p className="text-slate-300">Loading your wins...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-200">Unable to load your wins</h2>
            <p className="mt-2 text-red-300">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product._id} to={`/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
            <h2 className="text-xl font-semibold text-white">No wins yet</h2>
            <p className="mt-2 text-slate-400">Your won auctions will appear here after they end.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-orange-400">
              Find an auction
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export default MyWinProducts