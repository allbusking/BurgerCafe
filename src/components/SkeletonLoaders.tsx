export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#1A1A1A] border border-white/5 overflow-hidden">
      {/* Image skeleton */}
      <div className="h-48 md:h-56 bg-white/5 animate-shimmer" />
      
      {/* Content skeleton */}
      <div className="p-4 md:p-5 space-y-3">
        {/* Badge skeleton */}
        <div className="h-5 w-20 bg-white/5 rounded-full animate-shimmer" />
        
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 bg-white/5 rounded animate-shimmer" />
          <div className="h-4 w-full bg-white/5 rounded animate-shimmer" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-1 pt-2">
          <div className="h-3 w-full bg-white/5 rounded animate-shimmer" />
          <div className="h-3 w-5/6 bg-white/5 rounded animate-shimmer" />
        </div>
        
        {/* Rating skeleton */}
        <div className="h-4 w-32 bg-white/5 rounded animate-shimmer pt-2" />
        
        {/* Footer skeleton */}
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-20 bg-white/5 rounded-full animate-shimmer" />
          <div className="h-8 w-8 bg-white/5 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function MenuPageSkeleton() {
  const skeletons = Array.from({ length: 12 });
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header skeleton */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-16 md:h-20 w-3/4 bg-white/5 rounded-xl animate-shimmer mb-4" />
          <div className="h-8 md:h-12 w-1/2 bg-white/5 rounded-xl animate-shimmer" />
        </div>
      </section>

      {/* Filters skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-24 bg-white/5 rounded-full animate-shimmer flex-shrink-0" />
          ))}
        </div>
      </section>

      {/* Products grid skeleton */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletons.map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function CartPageSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex-1 pt-32 md:pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="h-14 md:h-20 w-1/2 bg-white/5 rounded-xl animate-shimmer mb-8" />
          
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items skeleton */}
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-[#1A1A1A] border border-white/5">
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-white/5 animate-shimmer" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-20 bg-white/5 rounded animate-shimmer" />
                    <div className="h-5 w-1/2 bg-white/5 rounded animate-shimmer" />
                    <div className="h-4 w-1/4 bg-white/5 rounded animate-shimmer" />
                    <div className="h-8 w-24 bg-white/5 rounded-full animate-shimmer mt-auto" />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary skeleton */}
            <div className="sticky top-28 rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 space-y-5">
              <div className="h-8 w-40 bg-white/5 rounded animate-shimmer" />
              <div className="h-12 w-full bg-white/5 rounded-full animate-shimmer" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-white/5 rounded animate-shimmer" />
                    <div className="h-4 w-16 bg-white/5 rounded animate-shimmer" />
                  </div>
                ))}
              </div>
              <div className="h-16 w-full bg-white/5 rounded-full animate-shimmer pt-4" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
