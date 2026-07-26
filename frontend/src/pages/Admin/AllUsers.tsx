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
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">All Users</h1>
              <p className="text-sm text-slate-500">
                Admin dashboard showing registered users and access roles.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              Signed in as <span className="font-semibold">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl bg-red-50 p-8 text-red-700 shadow-sm">
            <p className="font-semibold">Unable to load users</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-sm">
            <p className="text-lg font-medium">No users found.</p>
            <p className="mt-2 text-sm text-slate-500">Check back after new registrations.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-900">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Admin</th>
                    <th className="px-6 py-4 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {users.map((userItem) => (
                    <tr key={userItem._id}>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {userItem.name}
                      </td>
                      <td className="px-6 py-4">{userItem.email}</td>
                      <td className="px-6 py-4">
                        {userItem.isAdmin ? (
                          <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                            Yes
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'Unknown'}
                      </td>
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