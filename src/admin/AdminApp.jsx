import { Routes, Route } from 'react-router-dom'
import { useAuth } from './useAuth.js'
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'

export default function AdminApp() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
        Loading...
      </div>
    )
  }

  if (!session) {
    return <Login />
  }

  return (
    <Routes>
      <Route path="*" element={<Dashboard />} />
    </Routes>
  )
}
