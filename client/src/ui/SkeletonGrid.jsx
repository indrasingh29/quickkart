export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="animate-pulse rounded-lg bg-white p-3 ring-1 ring-slate-100" key={index}>
          <div className="aspect-square rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
