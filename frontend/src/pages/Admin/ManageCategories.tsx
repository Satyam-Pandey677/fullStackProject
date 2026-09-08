import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Trash2, Plus, FolderOpen } from 'lucide-react'
import { PRODUCT_SERVICE } from '../../Constent'

interface Category {
  _id: string
  name: string
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${PRODUCT_SERVICE}/api/categories`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to load categories.')
      }

      setCategories(data?.categories || [])
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to load categories.',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleCreateCategory = async () => {
    const trimmedName = newCategory.trim()
    if (!trimmedName) {
      setMessage({ type: 'error', text: 'Please enter a category name.' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch(`${PRODUCT_SERVICE}/api/categories/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: trimmedName }),
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to create category.')
      }

      setNewCategory('')
      await fetchCategories()
      setMessage({
        type: 'success',
        text: data?.message || 'Category created successfully.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to create category.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setDeletingId(categoryId)
    setMessage(null)

    try {
      const response = await fetch(`${PRODUCT_SERVICE}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(data?.message || 'Unable to delete category.')
      }

      await fetchCategories()
      setMessage({
        type: 'success',
        text: data?.message || 'Category deleted successfully.',
      })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to delete category.',
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Admin tools</p>
              <h1 className="text-3xl font-semibold text-white">Manage categories</h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-200">
              <FolderOpen size={16} />
              {categories.length} categories
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${message.type === 'success'
            ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
            : 'border-red-400/20 bg-red-500/10 text-red-200'}`}>
            {message.text}
          </div>
        )}

        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Create a new category</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              placeholder="Enter category name"
              className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-400"
            />
            <button
              type="button"
              onClick={handleCreateCategory}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={16} />
              {submitting ? 'Creating...' : 'Add category'}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 shadow-sm">
          <div className="border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Existing categories</h2>
          </div>

          {loading ? (
            <div className="px-6 py-10 text-center text-slate-400">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400">No categories found yet.</div>
          ) : (
            <div className="divide-y divide-white/10">
              {categories.map((category) => (
                <div key={category._id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="font-medium text-white">{category.name}</p>
                    <p className="text-xs text-slate-400">ID: {category._id}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(category._id)}
                    disabled={deletingId === category._id}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    {deletingId === category._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageCategories
