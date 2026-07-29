import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import ProductCard from '../components/ProductCard'
import { PRODUCT_SERVICE } from '../Constent'
import type { IProduct } from './ProductsPage'

const CompletedProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const token = Cookies.get('token')
        const response = await fetch(`${PRODUCT_SERVICE}/api/product/all-products?page=1`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch completed products')
        }

        const data = await response.json()
        setProducts(data?.products || [])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const completedProducts = useMemo(() => {
    return products.filter((product) => product.status === 'ended')
  }, [products])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">Completed Auctions</h1>
            <p className="text-lg text-slate-300">Browse all finished auctions and winners.</p>
          </div>
          <Link to="/products" className="inline-flex items-center rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-orange-500/15 hover:text-orange-200">
            View Active Products
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-orange-500" />
            <p className="text-slate-300">Loading completed products...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-200">Unable to load completed products</h2>
            <p className="mt-2 text-red-300">{error}</p>
          </div>
        ) : completedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedProducts.map((product) => (
              <Link key={product._id} to={`/${product._id}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
            <h3 className="text-xl font-semibold text-white">No completed auctions yet</h3>
            <p className="mt-2 text-slate-400">Finished auctions will appear here once they end.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompletedProductsPage
