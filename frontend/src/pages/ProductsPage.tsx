import React, { useState, useMemo, useEffect } from 'react'
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCard from '../components/ProductCard';
import { PRODUCT_SERVICE } from '../Constent';
import ProfileButton from '../components/ProfileButton';
import { useAppData } from '../context/ContextProvider';
import Cookies from 'js-cookie';

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
  category:{
    _id:string,
    name:string
  };
}

// Main Products Page Component
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
        setProducts(data.products || [])
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

  console.log(products)

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
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex justify-between">
          <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Explore Auctions
          </h1>
          <p className="text-gray-600 text-lg">
            Find amazing items and place your bids
          </p>
          </div>
          {user && <ProfileButton name={user?.name} email={user?.email}/>}
        </div>

        {/* Search Bar */}
        <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />

        {/* Filters and Products Container */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 bg-red-50 rounded-lg p-6">
                <svg
                  className="w-24 h-24 text-red-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-red-700 mb-2">
                  Error loading products
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <svg
                  className="w-24 h-24 text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}

            {/* Results Count */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p>
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold">{products.length}</span> products
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