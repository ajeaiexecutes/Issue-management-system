const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api';

export async function fetchIssues(status?: string, search?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  
  const url = `${API_URL}/issues${params.toString() ? `?${params.toString()}` : ''}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch issues');
  return res.json();
}

export async function fetchIssueById(id: string) {
  const res = await fetch(`${API_URL}/issues/${id}`, { cache: 'no-store' });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch issue');
  }
  return res.json();
}

export async function createIssue(data: { title: string; description: string }) {
  const res = await fetch(`${API_URL}/issues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create issue');
  return res.json();
}

export async function addDiscussion(issueId: string, data: { content: string; authorName: string }) {
  const res = await fetch(`${API_URL}/issues/${issueId}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add discussion');
  return res.json();
}

export async function analyzeIssue(issueId: string) {
  const res = await fetch(`${API_URL}/issues/${issueId}/analyze`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to analyze issue');
  return res.json();
}

export async function updateIssueStatus(issueId: string, status: string) {
  const res = await fetch(`${API_URL}/issues/${issueId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update issue');
  return res.json();
}
