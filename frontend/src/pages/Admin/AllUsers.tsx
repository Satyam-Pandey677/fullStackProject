import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { USER_SERVICE } from '../../Constent'
import { useAppData } from '../../context/ContextProvider'
import Loading from '../../components/Loading'

interface IUser {
  _id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt?: string
}

const AllUsers = () => {
  const { user } = useAppData()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = Cookies.get('token')
        const response = await fetch(`${USER_SERVICE}/api/user/All-users`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const json = await response.json().catch(() => null)
          const message = json?.message || 'Failed to load users.'
          throw new Error(message)
        }

        const data = await response.json()
        setUsers(data.users || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load users.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_25%),linear-gradient(135deg,#050816_0%,#0f172a_45%,#020617_100%)] py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-white">All Users</h1>
              <p className="text-sm text-slate-400">Admin dashboard showing registered users and access roles.</p>
            </div>
            <div className="rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-8 text-red-200 shadow-sm">
            <p className="font-semibold">Unable to load users</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-300 shadow-sm">
            <p className="text-lg font-medium text-white">No users found.</p>
            <p className="mt-2 text-sm text-slate-400">Check back after new registrations.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-white">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Admin</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-slate-900/80">
                  {users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td className="px-6 py-4 font-medium text-white">{userItem.name}</td>
                      <td className="px-6 py-4">{userItem.email}</td>
                      <td className="px-6 py-4">
                        {userItem.isAdmin ? (
                          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">Yes</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400">{userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AllUsers