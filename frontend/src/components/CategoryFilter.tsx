import axios from "axios";
import { PRODUCT_SERVICE } from "../Constent";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Fashion', 'Home'];

interface category{
  _id:string,
  name:string
}


const CategoryFilter: React.FC<{
  selectedCategory: string
  onCategoryChange: (category: string) => void
}> = ({ selectedCategory, onCategoryChange }) => {

    const [categories, setCategories] = useState<category[]>([])

    const fetchCategories = async() => {

        const token = Cookies.get("token");

        if(!token){
            console.log("Token not available");
            return
        }

        const {data} = await axios.get(`${PRODUCT_SERVICE}/api/product/categories`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        
        setCategories(data.categories);
    }

    useEffect(() => {
        fetchCategories();
    },[])

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category.name)}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              selectedCategory === category.name
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-orange-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter