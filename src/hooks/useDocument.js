import { useEffect, useState, useCallback } from 'react'
import { getDocById } from '../firebase/firestore'

export function useDocument(collectionName, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const doc = await getDocById(collectionName, id)
      setData(doc)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [collectionName, id])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
