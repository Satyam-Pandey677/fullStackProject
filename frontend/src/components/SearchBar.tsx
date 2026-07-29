const SearchBar: React.FC<{
  searchValue: string
  onSearchChange: (value: string) => void
}> = ({ searchValue, onSearchChange }) => {
  return (
    <div className="mb-8 w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border border-white/10 bg-slate-900/70 px-6 py-3 pl-12 text-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.2)] outline-none transition-colors duration-300 placeholder:text-slate-400 focus:border-orange-400"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
}

export default SearchBar