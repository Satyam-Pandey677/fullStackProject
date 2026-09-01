import { useState, useMemo, useEffect } from 'react'
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { PRODUCT_SERVICE } from '../Constent';
import ProfileButton from '../components/ProfileButton';
import { useAppData } from '../context/ContextProvider';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export interface IProduct {
  _id: string;
  name: string;
  description?: string;
  images: Array<{ url: string; id: string }>;
  starting_price: number;
  currentBid: number;
  duration: number;
  endTime: string | Date;
  status: 'pending' | 'live' | 'ended';
  owner: string;
  AuctionWinner:string
  category:{
    _id:string,
    name:string
  };
}


const ProductsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {user} = useAppData()

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const token = Cookies.get("token")
        const response = await fetch(`${PRODUCT_SERVICE}/api/product/all-products?page=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data?.products || [])
        console.log(products)
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

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchValue.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || product.category.name === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchValue, selectedCategory, products])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">Explore Auctions</h1>
            <p className="text-lg text-slate-300">Find amazing items and place your bids</p>
          </div>
          {user && <ProfileButton name={user?.name} email={user?.email} />}
        </div>

        <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>
          </div>

          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-orange-500"></div>
                <p className="text-slate-300">Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 p-6 py-16">
                <svg className="mb-4 h-24 w-24 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mb-2 text-xl font-semibold text-red-200">Error loading products</h3>
                <p className="text-red-300">{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link key={product._id} to={`/${product._id}`}>
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <svg className="mb-4 h-24 w-24 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                <h3 className="mb-2 text-xl font-semibold text-slate-200">No products found</h3>
                <p className="text-slate-400">Try adjusting your search or category filters</p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-slate-400">
                <p>
                  Showing <span className="font-semibold text-white">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold text-white">{products.length}</span> products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage