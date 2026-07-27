import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Uploads a file to Firebase Storage under a given folder and returns its
 * public download URL. Pass onProgress(percent) to drive a progress bar.
 */
export function uploadFile(folder, file, onProgress) {
  return new Promise((resolve, reject) => {
    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const storageRef = ref(storage, `${folder}/${safeName}`)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress?.(pct)
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        resolve({ url, path: `${folder}/${safeName}` })
      }
    )
  })
}

export async function deleteFile(path) {
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch {
    // File may already be gone — safe to ignore.
  }
}

// Extracts a YouTube video ID from any common URL format.
export function getYouTubeId(url = '') {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
