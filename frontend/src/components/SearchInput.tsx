"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

export function SearchInput({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialSearch);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // To avoid refetching on the very first mount if the query hasn't changed
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
          params.set("search", query);
        } else {
          params.delete("search");
        }
        
        router.push(`/?${params.toString()}`);
      });
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutRef.current);
  }, [query, router, searchParams]);

  return (
    <div className="relative w-full sm:w-64">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isPending ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} />
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search issues..." 
        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-shadow"
      />
    </div>
  );
}
