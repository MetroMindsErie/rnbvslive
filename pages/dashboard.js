// pages/dashboard.js
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../lib/supabase/client'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.push('/') // Redirect to homepage after sign out
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleEditProfile = () => {
    router.push('/profile')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />
      <div style={{ height: '60px', width: '100%' }}></div>
      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* If not logged in, show guest dashboard */}
        {!user && (
          <div className="bg-[#23272f] rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome, Guest!</h2>
            <p className="text-gray-300 mb-4">
              You are browsing as a guest. To access your account, orders, or personalized features, please&nbsp;
              <a href="/login" className="text-blue-400 underline hover:text-blue-200">sign in</a>.
            </p>
            <p className="text-gray-400">
              You can still browse products, view events, and enjoy the site!
            </p>
          </div>
        )}

        {/* If logged in, show user dashboard */}
        {user && (
          <>
            {/* Welcome section */}
            <div className="mb-8">
              <div className="bg-[#23272f] rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white mb-1">
                        Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
                      </h2>
                      <div className="text-sm text-gray-300">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <button
                      onClick={handleEditProfile}
                      className="btn-secondary px-4 py-2 text-sm"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      {signingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
                {!profile?.has_profile && (
                  <div className="rounded-md bg-yellow-900/20 p-4 mt-6">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-yellow-200 text-sm">
                        Your profile is incomplete. <button onClick={handleEditProfile} className="underline hover:text-yellow-300">Complete it now</button> for the full experience.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User info cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              <div className="bg-[#23272f] rounded-lg shadow p-5">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <div className="ml-5">
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-lg font-medium text-white">{user?.email}</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#23272f] rounded-lg shadow p-5">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="ml-5">
                    <div className="text-sm text-gray-400">Full Name</div>
                    <div className="text-lg font-medium text-white">{profile?.full_name || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#23272f] rounded-lg shadow p-5">
                <div className="flex items-center">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="ml-5">
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-lg font-medium text-white">{profile?.phone_number || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio section */}
            {profile?.bio && (
              <div className="mb-8">
                <div className="bg-[#23272f] rounded-lg shadow px-6 py-5">
                  <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                  <div className="text-gray-300">{profile.bio}</div>
                </div>
              </div>
            )}

            {/* Account info */}
            <div className="mb-8">
              <div className="bg-[#23272f] rounded-lg shadow px-6 py-5">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Profile Status</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.has_profile 
                        ? 'bg-green-700/30 text-green-300' 
                        : 'bg-yellow-700/30 text-yellow-200'
                    }`}>
                      {profile?.has_profile ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Role</span>
                    <span className="text-sm text-white capitalize">
                      {profile?.role || 'member'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Member Since</span>
                    <span className="text-sm text-white">
                      {profile?.created_at 
                        ? new Date(profile.created_at).toLocaleDateString()
                        : 'Unknown'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <div className="bg-[#23272f] rounded-lg shadow px-6 py-5">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <button
                    onClick={handleEditProfile}
                    className="relative block w-full border-2 border-blue-700 border-dashed rounded-lg p-6 text-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-[#1a1a1a] text-white"
                  >
                    <svg className="mx-auto h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-white">
                      Edit Profile
                    </span>
                    <span className="block text-sm text-gray-400">
                      Update your information
                    </span>
                  </button>

                  <div className="relative block w-full border-2 border-gray-700 border-dashed rounded-lg p-6 text-center opacity-50 cursor-not-allowed bg-[#1a1a1a]">
                    <svg className="mx-auto h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-white">
                      Settings
                    </span>
                    <span className="block text-sm text-gray-400">
                      Coming soon
                    </span>
                  </div>

                  <div className="relative block w-full border-2 border-gray-700 border-dashed rounded-lg p-6 text-center opacity-50 cursor-not-allowed bg-[#1a1a1a]">
                    <svg className="mx-auto h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="mt-2 block text-sm font-medium text-white">
                      Analytics
                    </span>
                    <span className="block text-sm text-gray-400">
                      Coming soon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}