// pages/login.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { signInWithGoogle } from '../lib/supabase/client'
import { useAuth } from '../contexts/AuthContext'
import Navbar from '../components/Navbar'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Handle error messages from URL params
  useEffect(() => {
    const { error: urlError } = router.query
    if (urlError) {
      switch (urlError) {
        case 'auth_callback_failed':
          setError('Authentication failed. Please try again.')
          break
        case 'unexpected_error':
          setError('An unexpected error occurred. Please try again.')
          break
        default:
          setError('An error occurred during authentication.')
      }
    }
  }, [router.query])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await signInWithGoogle()
      // The redirect will be handled by the OAuth provider
    } catch (error) {
      console.error('Error signing in:', error)
      setError('Failed to sign in with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      <Navbar />
      {/* Spacer for fixed navbar */}
      <div style={{ height: '60px', width: '100%' }}></div>
      <div className="flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-900/30">
              <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Sign in to your account or create a new one
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            {error && (
              <div className="rounded-md bg-red-900/30 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-[#23272f] rounded-xl shadow-lg p-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-700 rounded-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </span>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </button>
              <div className="text-center mt-4">
                <p className="text-xs text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy.<br />
                  New users will be automatically registered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}