import { useState, useEffect } from 'react';
import type { IProduct } from '../pages/ProductsPage';

interface ProductImage {
  url: string;
  id: string;
  _id?: string;
}

interface ProductCardProps {
  product: IProduct;
}

// Helper function to calculate time left
const calculateTimeLeft = (endTime: string | Date): string => {
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) return 'Ended';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(product.endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.endTime));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [product.endTime]);

  // Get first image from images array
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0].url 
    : 'https://via.placeholder.com/300x300?text=No+Image';

  // Determine status badge color
  const statusColor = {
    'pending': 'bg-yellow-500',
    'live': 'bg-green-500',
    'ended': 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative overflow-hidden h-48 bg-gray-200">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 ${statusColor[product.status]} text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
          {product.status}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Bid Information */}
        <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Bid:</span>
            <span className="text-lg font-bold text-orange-500">
              ${product.currentBid > 0 ? product.currentBid : product.starting_price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Starting Price:</span>
            <span className="text-sm font-semibold text-gray-700">${product.starting_price}</span>
          </div>
        </div>

        {/* Place Bid Button */}
        <button 
          disabled={product.status !== 'live'}
          className={`w-full py-2 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
            product.status === 'live'
              ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {product.status === 'live' ? 'Place Bid' : `Auction ${product.status}`}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;