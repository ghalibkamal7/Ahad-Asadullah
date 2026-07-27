import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, UploadCloud } from 'lucide-react'
import { useCollection } from '../../hooks/useCollection'
import { createDoc, updateDocById, deleteDocById, orderByField } from '../../firebase/firestore'
import { uploadFile, deleteFile } from '../../firebase/storage'
import EmptyState from '../EmptyState'

/**
 * fields: [{ name, label, type: 'text'|'number'|'textarea'|'select'|'checkbox'|'file'|'url',
 *            options?: string[], accept?: string, required?: boolean }]
 * columns: [{ key, label, render?: (row) => node }]  — what the table shows
 */
export default function ResourceManager({ collectionName, resourceLabel, fields, columns, emptyIcon }) {
  const { data, loading, refetch } = useCollection(collectionName, [orderByField('createdAt')])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    const blank = {}
    fields.forEach((f) => { blank[f.name] = f.type === 'checkbox' ? false : '' })
    setForm(blank)
    setEditing(null)
    setOpen(true)
  }

  function openEdit(row) {
    setForm(row)
    setEditing(row)
    setOpen(true)
  }

  async function handleFileChange(field, file) {
    if (!file) return
    setUploading(true)
    try {
      const { url, path } = await uploadFile(collectionName, file, () => {})
      setForm((f) => ({ ...f, [field.name]: url, [`${field.name}_path`]: path }))
      toast.success('File uploaded')
    } catch (err) {
      toast.error('Upload failed — check Firebase Storage rules')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updateDocById(collectionName, editing.id, form)
        toast.success(`${resourceLabel} updated`)
      } else {
        await createDoc(collectionName, form)
        toast.success(`${resourceLabel} added`)
      }
      setOpen(false)
      refetch()
    } catch (err) {
      toast.error('Could not save — check your Firestore rules and required fields')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Delete "${row.title || row.name}"? This cannot be undone.`)) return
    try {
      await deleteDocById(collectionName, row.id)
      fields.filter((f) => f.type === 'file').forEach((f) => row[`${f.name}_path`] && deleteFile(row[`${f.name}_path`]))
      toast.success(`${resourceLabel} deleted`)
      refetch()
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-white/10">
        <h3 className="font-semibold text-sm">Manage {resourceLabel}s</h3>
        <button className="btn-primary !px-4 !py-2 text-sm" onClick={openCreate}>
          <Plus size={15} /> Add {resourceLabel}
        </button>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-10 rounded-lg bg-ink-100 dark:bg-white/5 animate-pulse" />)}</div>
      ) : data.length === 0 ? (
        <div className="p-2"><EmptyState icon={emptyIcon} title={`No ${resourceLabel.toLowerCase()}s yet`} text={`Click "Add ${resourceLabel}" to create the first one.`} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-400 text-xs uppercase border-b border-ink-100 dark:border-white/10">
                {columns.map((c) => <th key={c.key} className="p-4 font-medium whitespace-nowrap">{c.label}</th>)}
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} className="border-b last:border-0 border-ink-100 dark:border-white/10">
                  {columns.map((c) => (
                    <td key={c.key} className="p-4 whitespace-nowrap">{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                  ))}
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(row)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-royal-50 dark:hover:bg-white/10 text-royal-600 dark:text-jade-400">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(row)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-red-50 dark:hover:bg-white/10 text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] bg-ink-950/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-ink-100 dark:border-white/10 sticky top-0 glass-strong z-10">
                <h4 className="font-semibold text-sm">{editing ? `Edit ${resourceLabel}` : `Add ${resourceLabel}`}</h4>
                <button onClick={() => setOpen(false)} className="w-8 h-8 grid place-items-center rounded-lg hover:bg-white/60 dark:hover:bg-white/10">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {fields.map((f) => (
                  <div key={f.name}>
                    {f.type !== 'checkbox' && <label className="text-sm font-medium mb-1.5 block">{f.label}</label>}

                    {f.type === 'textarea' && (
                      <textarea
                        value={form[f.name] || ''}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        rows={3}
                        required={f.required}
                        className="input resize-none"
                      />
                    )}

                    {f.type === 'select' && (
                      <select
                        value={form[f.name] || ''}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        required={f.required}
                        className="input"
                      >
                        <option value="">Select…</option>
                        {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}

                    {f.type === 'checkbox' && (
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={!!form[f.name]}
                          onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                          className="w-4 h-4 rounded accent-royal-500"
                        />
                        {f.label}
                      </label>
                    )}

                    {f.type === 'file' && (
                      <div>
                        <label className="flex items-center gap-2 justify-center border-2 border-dashed border-ink-200 dark:border-white/15 rounded-xl py-4 cursor-pointer hover:border-royal-400 transition-colors">
                          <UploadCloud size={16} className="text-ink-400" />
                          <span className="text-xs text-ink-400">{uploading ? 'Uploading…' : form[f.name] ? 'Replace file' : `Upload ${f.label.toLowerCase()}`}</span>
                          <input type="file" accept={f.accept} className="hidden" onChange={(e) => handleFileChange(f, e.target.files[0])} />
                        </label>
                        {form[f.name] && <p className="text-xs text-jade-600 dark:text-jade-400 mt-1.5 truncate">✓ File attached</p>}
                      </div>
                    )}

                    {['text', 'number', 'url', 'date'].includes(f.type) && (
                      <input
                        type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                        value={form[f.name] ?? ''}
                        onChange={(e) => setForm({ ...form, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                        required={f.required}
                        placeholder={f.placeholder}
                        className="input"
                      />
                    )}
                  </div>
                ))}

                <button disabled={saving || uploading} className="btn-primary w-full">
                  {saving ? 'Saving…' : editing ? 'Save Changes' : `Add ${resourceLabel}`}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
