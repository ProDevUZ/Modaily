export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#0b1119] px-6 py-8 text-white">
      <div className="mx-auto max-w-[1600px]">
        <div className="animate-pulse space-y-5">
          <div className="h-10 w-52 rounded-full bg-white/10" />
          <div className="h-40 rounded-[2rem] bg-white/5" />
          <div className="grid gap-5 md:grid-cols-3">
            <div className="h-44 rounded-[1.8rem] bg-white/5" />
            <div className="h-44 rounded-[1.8rem] bg-white/5" />
            <div className="h-44 rounded-[1.8rem] bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
