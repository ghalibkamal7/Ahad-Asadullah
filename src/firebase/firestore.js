import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, limit as fbLimit, serverTimestamp, arrayUnion
} from 'firebase/firestore'
import { db } from './config'

// Every content type in the platform lives in its own Firestore collection.
// No local mock data is used anywhere — this file is the single place
// that talks to Firestore, so admin writes and student reads stay in sync.
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  TEST_SERIES: 'testSeries',
  STUDY_MATERIALS: 'studyMaterials',
  PDFS: 'pdfs',
  VIDEO_LECTURES: 'videoLectures',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  COUPONS: 'coupons',
  NOTIFICATIONS: 'notifications',
  CURRENT_AFFAIRS: 'currentAffairs',
  PREVIOUS_PAPERS: 'previousPapers',
  PRACTICE_SETS: 'practiceSets',
  NOTES: 'notes'
}

export async function listDocs(collectionName, constraints = []) {
  const q = query(collection(db, collectionName), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getDocById(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function createDoc(collectionName, data) {
  const ref = await addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp()
  })
  return ref.id
}

export async function updateDocById(collectionName, id, data) {
  await updateDoc(doc(db, collectionName, id), {
    ...data,
    updatedAt: serverTimestamp()
  })
}

export async function deleteDocById(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id))
}

export const whereEq = (field, value) => where(field, '==', value)
export const orderByField = (field, dir = 'desc') => orderBy(field, dir)
export const limitTo = (n) => fbLimit(n)

// --- Orders & purchases -----------------------------------------------

export async function createOrder(order) {
  const invoiceNumber = `AA-INV-${Date.now().toString().slice(-8)}`
  const id = await createDoc(COLLECTIONS.ORDERS, { ...order, invoiceNumber, status: 'success' })
  return { id, invoiceNumber }
}

export async function addPurchaseToUser(uid, itemId, itemType) {
  const field = itemType === 'course' ? 'purchasedCourses' : itemType === 'testSeries' ? 'purchasedTestSeries' : 'purchasedItems'
  await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
    [field]: arrayUnion(itemId)
  })
}

// --- Coupons -------------------------------------------------------------

export async function validateCoupon(code) {
  const results = await listDocs(COLLECTIONS.COUPONS, [whereEq('code', code.toUpperCase())])
  const coupon = results[0]
  if (!coupon) return { valid: false, message: 'Invalid coupon code' }
  if (!coupon.active) return { valid: false, message: 'This coupon is no longer active' }
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return { valid: false, message: 'This coupon has expired' }
  }
  return { valid: true, coupon }
}
