export default function Loader({ label = 'Loading…' }) {
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-royal-200 border-t-royal-500 animate-spin" />
        <p className="text-sm text-ink-400">{label}</p>
      </div>
    </div>
  )
}
