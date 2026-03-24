export default function AdminLoading() {
  return (
    <div className="admin-surface px-5 py-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-12 w-full max-w-xl rounded-2xl bg-white shadow-sm" />
          <div className="h-12 w-64 rounded-2xl bg-white shadow-sm" />
        </div>

        <div className="h-16 w-80 rounded-2xl bg-white shadow-sm" />

        <div className="grid gap-5 xl:grid-cols-4">
          <div className="h-52 rounded-[1.75rem] bg-white shadow-sm" />
          <div className="h-52 rounded-[1.75rem] bg-white shadow-sm" />
          <div className="h-52 rounded-[1.75rem] bg-white shadow-sm" />
          <div className="h-52 rounded-[1.75rem] bg-white shadow-sm" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <div className="h-[420px] rounded-[1.75rem] bg-white shadow-sm" />
          <div className="space-y-6">
            <div className="h-64 rounded-[1.75rem] bg-white shadow-sm" />
            <div className="h-52 rounded-[1.75rem] bg-white shadow-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
