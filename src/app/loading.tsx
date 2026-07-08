export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="size-14 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="text-sm uppercase tracking-[0.3em] text-blue-100">
          Loading Progress.uzb
        </p>
      </div>
    </div>
  );
}
