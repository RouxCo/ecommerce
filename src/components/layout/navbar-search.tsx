"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/");
    }
    setOpen(false);
    setQuery("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => {
            // Small delay so click on submit still works
            setTimeout(() => setOpen(false), 150);
          }}
          placeholder="Search..."
          className="h-9 w-40 sm:w-56 rounded-md border border-zinc-200 bg-white pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>
    </form>
  );
}
