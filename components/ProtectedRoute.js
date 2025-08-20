// components/ProtectedRoute.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, requireProfile = false }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Still loading, don't redirect

    if (!user) {
      // Not authenticated, redirect to login
      router.push('/login')
      return
    }

    if (requireProfile && profile && !profile.has_profile) {
      // Profile required but not complete, redirect to profile page
      router.push('/profile')
      return
    }
  }, [user, profile, loading, router, requireProfile])

  // Show loading spinner while checking authentication
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading spinner if profile is required but not yet loaded
  if (requireProfile && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show loading spinner if profile is required but not complete
  if (requireProfile && profile && !profile.has_profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return children
}

// Usage examples:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>
//
// <ProtectedRoute requireProfile={true}>
//   <AdminPanel />
// </ProtectedRoute>