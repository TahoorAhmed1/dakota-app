type AdminLoadingStateProps = {
  label: string;
};

export default function AdminLoadingState({ label }: AdminLoadingStateProps) {
  return (
    <div className="flex min-h-80 items-center justify-center">
      <div className="flex min-w-70 items-center gap-4 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-black/10 border-t-orange-500" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">Loading</p>
          <p className="text-base font-medium text-black">{label}</p>
        </div>
      </div>
    </div>
  );
}