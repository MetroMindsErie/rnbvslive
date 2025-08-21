// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser, getProfile, updateAvatarUrlFromOAuth } from '../lib/supabase/client'
import { useRouter } from 'next/router'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (session?.user) {
          setUser(session.user)
          await loadProfile(session.user.id)
          
          // If user just signed in and doesn't have profile, redirect to profile page
          if (event === 'SIGNED_IN') {
            const userProfile = await getProfile(session.user.id)
            if (!userProfile?.has_profile) {
              router.push('/profile')
            } else {
              router.push('/dashboard')
            }
          }
        } else {
          setUser(null)
          setProfile(null)
          if (event === 'SIGNED_OUT') {
            router.push('/login')
          }
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  useEffect(() => {
    if (user) {
      // Update avatar_url in the database if available from Google OAuth
      updateAvatarUrlFromOAuth()
    }
  }, [user])

  const loadProfile = async (userId) => {
    try {
      const profileData = await getProfile(userId)
      setProfile(profileData)
      return profileData
    } catch (error) {
      console.error('Error loading profile:', error)
      return null
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    loading,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}