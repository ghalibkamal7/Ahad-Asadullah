import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await refreshProfile(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function refreshProfile(uid) {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      setProfile(snap.exists() ? snap.data() : null)
    } catch {
      setProfile(null)
    }
  }

  function blankProfile(name, email) {
    return {
      name,
      email,
      role: 'student',
      phone: '',
      createdAt: serverTimestamp(),
      purchasedCourses: [],
      purchasedTestSeries: [],
      purchasedItems: []
    }
  }

  async function signup(name, email, password) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    const newProfile = blankProfile(name, email)
    await setDoc(doc(db, 'users', cred.user.uid), newProfile)
    setProfile(newProfile)
    return cred.user
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    const cred = await signInWithPopup(auth, googleProvider)
    const ref = doc(db, 'users', cred.user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      const newProfile = blankProfile(cred.user.displayName, cred.user.email)
      await setDoc(ref, newProfile)
      setProfile(newProfile)
    } else {
      setProfile(snap.data())
    }
    return cred.user
  }

  function logout() {
    return signOut(auth)
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, signup, login, loginWithGoogle, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
