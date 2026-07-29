import axios from "axios";
import { PRODUCT_SERVICE } from "../Constent";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

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

        const {data} = await axios.get(`${PRODUCT_SERVICE}/api/categories`, {
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
    <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
      <h3 className="mb-4 text-lg font-semibold text-white">Categories</h3>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category.name)}
            className={`rounded-full px-6 py-2 font-medium transition-all duration-300 ${
              selectedCategory === category.name
                ? 'bg-linear-to-r from-orange-500 to-amber-400 text-slate-950 shadow-lg'
                : 'bg-slate-800/80 text-slate-300 hover:bg-orange-500/15 hover:text-orange-300'
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