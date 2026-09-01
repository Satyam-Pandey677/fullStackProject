import { useState, useEffect } from 'react';
import type { IProduct } from '../pages/ProductsPage';
import { USER_SERVICE } from '../Constent';
import Cookies from 'js-cookie';


interface ProductCardProps {
  product: IProduct;
}

// Helper function to calculate time left
const calculateTimeLeft = (endTime: string | Date, status: IProduct['status']): string => {
  if (status === 'pending') return 'Pending';
  if (status === 'ended') return 'Ended';

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
  const [, setTimeLeft] = useState(calculateTimeLeft(product.endTime, product.status));
  const [winner, setWinner] = useState<any>({})

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(product.endTime, product.status));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [product.endTime, product.status]);

  useEffect(() => {
    (async() => {

      const token = Cookies.get("token")
      console.log(product)

      if(product.status == "pending" || product.status == "live"){
        return
      }
      const res = await fetch(`${USER_SERVICE}/api/user/profile/${product?.AuctionWinner}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      const data = await res.json()
      setWinner(data.user)
    })()
  },[])

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

  const statusLabel = {
    pending: 'Pending',
    live: 'Live',
    ended: 'Ended'
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.35)] group cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 ${statusColor[product.status]} text-white px-3 py-1 rounded-full text-xs font-semibold capitalize`}>
          {statusLabel[product.status]}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="mb-3 line-clamp-2 text-sm text-slate-400">
            {product.description}
          </p>
        )}

        {/* Bid Information */}

        {
            product.status == "ended" ? (
              <>
                <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Winner:</span>
            <span className="text-lg font-bold text-orange-300">
              {winner?.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Highest bid:</span>
            <span className="text-sm font-semibold text-slate-200">${product.currentBid}</span>
          </div>
        </div>
              </>
            ) : (
              <div className="mb-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Current Bid:</span>
            <span className="text-lg font-bold text-orange-300">
              ${product.currentBid > 0 ? product.currentBid : product.starting_price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Starting Price:</span>
            <span className="text-sm font-semibold text-slate-200">${product.starting_price}</span>
          </div>
        </div>
            )
        }
        

        {/* Place Bid Button */}
        <button 
          disabled={product.status !== 'live'}
          className={`w-full py-2 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 ${
            product.status === 'live'
              ? 'bg-linear-to-r from-orange-500 to-amber-400 text-slate-950 hover:shadow-lg'
              : 'cursor-not-allowed bg-slate-700 text-slate-400'
          }`}
        >
          {product.status === 'live' ? 'Place Bid' : product.status === 'pending' ? 'Auction Pending' : 'Auction Ended'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;