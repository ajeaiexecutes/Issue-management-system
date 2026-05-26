"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIssue } from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewIssuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      await createIssue({ title, description });
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-bold text-slate-900">Create New Issue</h1>
          <p className="text-sm text-slate-500 mt-1">Provide the details of the problem or task.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700">Issue Title</label>
            <input 
              id="title"
              name="title"
              type="text" 
              required
              placeholder="e.g. Navigation bar is broken on mobile"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea 
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Provide a detailed description..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
