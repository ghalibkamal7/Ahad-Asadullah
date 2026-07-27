import { useEffect, useState, useCallback } from 'react'
import { listDocs } from '../firebase/firestore'

/**
 * Fetches a Firestore collection once (or refetches when deps change).
 * constraints is an array built with whereEq / orderByField / limitTo
 * from src/firebase/firestore.js.
 */
export function useCollection(collectionName, constraints = [], deps = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const docs = await listDocs(collectionName, constraints)
      setData(docs)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, ...deps])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
