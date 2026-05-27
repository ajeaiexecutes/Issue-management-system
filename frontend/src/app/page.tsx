import { fetchIssues } from "@/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CircleDot, Clock, CheckCircle2 } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";

const statusConfig = {
  OPEN: { icon: CircleDot, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  IN_PROGRESS: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  CLOSED: { icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{ status?: string, search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams.status;
  const currentSearch = resolvedParams.search;
  

  
  const issues = await fetchIssues(currentStatus, currentSearch);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Issues Dashboard</h1>
        <p className="text-slate-500">Manage and track your tasks and discussions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          <Link href={`/?${new URLSearchParams({ ...(currentSearch ? { search: currentSearch } : {}) }).toString()}`} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!currentStatus ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            All Issues
          </Link>
          <Link href={`/?${new URLSearchParams({ status: 'OPEN', ...(currentSearch ? { search: currentSearch } : {}) }).toString()}`} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Open
          </Link>
          <Link href={`/?${new URLSearchParams({ status: 'IN_PROGRESS', ...(currentSearch ? { search: currentSearch } : {}) }).toString()}`} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            In Progress
          </Link>
          <Link href={`/?${new URLSearchParams({ status: 'CLOSED', ...(currentSearch ? { search: currentSearch } : {}) }).toString()}`} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentStatus === 'CLOSED' ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            Closed
          </Link>
        </div>

        <SearchInput initialSearch={currentSearch || ""} />
      </div>

      <div className="grid gap-4">
        {issues.map((issue: any) => {
          const StatusIcon = statusConfig[issue.status as keyof typeof statusConfig].icon;
          const statusStyle = statusConfig[issue.status as keyof typeof statusConfig];

          return (
            <Link 
              key={issue.id} 
              href={`/issues/${issue.id}`}
              className="group block"
            >
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex items-start gap-4">
                <div className={`mt-1 p-1.5 rounded-full border ${statusStyle.bg}`}>
                  <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-slate-500 line-clamp-1 text-sm">{issue.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 font-medium">
                    <span className="flex items-center gap-1">
                      Opened {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </span>
                    <span>•</span>
                    <span className="uppercase tracking-wider font-bold">{issue.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {issues.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-500">No issues found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
