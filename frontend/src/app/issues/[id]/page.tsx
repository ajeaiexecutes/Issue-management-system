import { fetchIssueById } from "@/lib/api";
import { notFound } from "next/navigation";
import IssueDetailClient from "@/features/IssueDetailClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function IssueDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const issue = await fetchIssueById(resolvedParams.id);

  if (!issue) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
      
      <IssueDetailClient initialIssue={issue} />
    </div>
  );
}
