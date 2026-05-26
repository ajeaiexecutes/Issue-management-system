"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDiscussion, analyzeIssue, updateIssueStatus } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { Sparkles, Loader2, UserCircle2, MessageSquare, ShieldAlert } from "lucide-react";

export default function IssueDetailClient({ initialIssue }: { initialIssue: any }) {
  const router = useRouter();
  const [issue, setIssue] = useState(initialIssue);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleStatusChange = async (newStatus: string) => {
    try {
      const updated = await updateIssueStatus(issue.id, newStatus);
      setIssue({ ...issue, status: updated.status });
      router.refresh();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const discussion = await addDiscussion(issue.id, { content: newComment, authorName: authorName || "Anonymous User" });
      setIssue({
        ...issue,
        discussions: [...issue.discussions, discussion],
      });
      setNewComment("");
      setAuthorName("");
      router.refresh();
    } catch (error) {
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const analysis = await analyzeIssue(issue.id);
      setIssue({ ...issue, analysis });
      router.refresh();
    } catch (error) {
      alert("Failed to generate AI insights");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{issue.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              issue.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
              issue.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {issue.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">{issue.description}</p>
          <div className="text-xs text-slate-400 pt-2 font-medium">
            Opened {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={issue.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm font-medium border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Discussions) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <h3>Discussions</h3>
          </div>

          <div className="space-y-4">
            {issue.discussions.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
                No discussions yet. Start the conversation!
              </div>
            ) : (
              issue.discussions.map((d: any) => (
                <div key={d.id} className="flex gap-4">
                  <div className="mt-1">
                    <UserCircle2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-slate-900">{d.authorName}</span>
                      <span className="text-xs text-slate-400 font-medium">
                        {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm">{d.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <form onSubmit={handleAddComment} className="space-y-4">
              <input 
                type="text" 
                placeholder="Your Name (Optional)" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <textarea 
                required
                rows={3}
                placeholder="Write a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Comment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Area (Gemini AI Insights) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-indigo-100/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-indigo-900">AI Insights</h3>
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={analyzing}
                className="p-1.5 hover:bg-indigo-100 rounded-md transition-colors text-indigo-600 disabled:opacity-50"
                title="Regenerate Analysis"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="p-5">
              {!issue.analysis && !analyzing && (
                <div className="text-center py-6">
                  <ShieldAlert className="w-8 h-8 text-indigo-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 mb-4">No analysis has been generated for this issue yet.</p>
                  <button 
                    onClick={handleAnalyze}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2"
                  >
                    Generate Analysis
                  </button>
                </div>
              )}
              
              {analyzing && (
                <div className="text-center py-8 space-y-3">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto" />
                  <p className="text-xs text-indigo-600 font-medium">Gemini is analyzing the context...</p>
                </div>
              )}

              {issue.analysis && !analyzing && (
                <div className="space-y-5 animate-in fade-in duration-500">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-white/50 p-3 rounded-lg border border-indigo-50">
                      {issue.analysis.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Actions</h4>
                    <ul className="space-y-2">
                      {issue.analysis.insights.map((insight: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-slate-700 bg-white p-2.5 rounded-lg border border-indigo-50/50 shadow-sm">
                          <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-[10px] text-slate-400 font-medium text-right pt-2 border-t border-indigo-50">
                    Last analyzed: {formatDistanceToNow(new Date(issue.analysis.createdAt), { addSuffix: true })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
