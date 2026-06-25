import React, { useState, useMemo } from 'react'
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

// Sample product data
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    name: 'Vintage Camera',
    category: 'Electronics',
    price: 150,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop',
    currentBid: 120,
    bids: 5,
    timeLeft: '2h 30m'
  },
  {
    id: 2,
    name: 'Leather Wallet',
    category: 'Accessories',
    price: 45,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop',
    currentBid: 38,
    bids: 3,
    timeLeft: '5h 15m'
  },
  {
    id: 3,
    name: 'Smartwatch',
    category: 'Electronics',
    price: 200,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    currentBid: 185,
    bids: 8,
    timeLeft: '1h 45m'
  },
  {
    id: 4,
    name: 'Sunglasses',
    category: 'Accessories',
    price: 80,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
    currentBid: 70,
    bids: 4,
    timeLeft: '3h 20m'
  },
  {
    id: 5,
    name: 'Headphones',
    category: 'Electronics',
    price: 120,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    currentBid: 110,
    bids: 6,
    timeLeft: '4h 10m'
  },
  {
    id: 6,
    name: 'Designer Belt',
    category: 'Accessories',
    price: 60,
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=500&fit=crop',
    currentBid: 50,
    bids: 2,
    timeLeft: '6h 00m'
  },
];



// Search Bar Component


// Category Component


// Product Card Component
const ProductCard: React.FC<{
  product: (typeof SAMPLE_PRODUCTS)[0]
}> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.category}
        </div>
        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {product.timeLeft}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Bid Information */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Bid:</span>
            <span className="text-lg font-bold text-orange-500">${product.currentBid}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Starting Price:</span>
            <span className="text-sm font-semibold text-gray-700">${product.price}</span>
          </div>
        </div>

        {/* Bid Count */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          <span className="font-semibold">{product.bids} bids</span>
        </div>

        {/* Place Bid Button */}
        <button className="w-full py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          Place Bid
        </button>
      </div>
    </div>
  )
}

// Main Products Page Component
const ProductsPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchValue.toLowerCase())
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchValue, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Explore Auctions
          </h1>
          <p className="text-gray-600 text-lg">
            Find amazing items and place your bids
          </p>
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
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
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
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center text-gray-600">
                <p>
                  Showing <span className="font-semibold">{filteredProducts.length}</span> of{' '}
                  <span className="font-semibold">{SAMPLE_PRODUCTS.length}</span> products
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