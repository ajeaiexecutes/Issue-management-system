import { db } from '../db';
import { issues, discussions, analyses } from '../db/schema';
import { eq, desc, ilike, or, and } from 'drizzle-orm';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Issue, IssueWithDetails, Discussion, Analysis } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class IssueService {
  async getAllIssues(status?: 'OPEN' | 'IN_PROGRESS' | 'CLOSED', search?: string): Promise<Issue[]> {
    const conditions = [];
    if (status) conditions.push(eq(issues.status, status));
    if (search) conditions.push(or(ilike(issues.title, `%${search}%`), ilike(issues.description, `%${search}%`)));
    
    if (conditions.length > 0) {
      return await db.select().from(issues).where(and(...conditions)).orderBy(desc(issues.createdAt));
    }
    return await db.select().from(issues).orderBy(desc(issues.createdAt));
  }

  async getIssueById(id: string): Promise<IssueWithDetails | null> {
    const issueRecords = await db.select().from(issues).where(eq(issues.id, id));
    if (issueRecords.length === 0) return null;

    const issueDiscussions = await db.select().from(discussions).where(eq(discussions.issueId, id)).orderBy(discussions.createdAt);
    const issueAnalysis = await db.select().from(analyses).where(eq(analyses.issueId, id));

    return {
      ...issueRecords[0],
      discussions: issueDiscussions,
      analysis: issueAnalysis[0] || null,
    };
  }

  async createIssue(title: string, description: string): Promise<Issue> {
    const newIssue = await db.insert(issues).values({ title, description }).returning();
    return newIssue[0];
  }

  async updateIssue(id: string, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED'): Promise<Issue> {
    const updatedIssue = await db.update(issues).set({ status, updatedAt: new Date() }).where(eq(issues.id, id)).returning();
    return updatedIssue[0];
  }

  async addDiscussion(id: string, content: string, authorName?: string): Promise<Discussion> {
    const newDiscussion = await db.insert(discussions).values({ issueId: id, content, authorName }).returning();
    return newDiscussion[0];
  }

  async analyzeIssue(id: string): Promise<Analysis> {
    const issueRecords = await db.select().from(issues).where(eq(issues.id, id));
    if (issueRecords.length === 0) throw new Error('Issue not found');
    const issue = issueRecords[0];

    const issueDiscussions = await db.select().from(discussions).where(eq(discussions.issueId, id)).orderBy(discussions.createdAt);
    const discussionContext = issueDiscussions.map(d => `${d.authorName || 'User'}: ${d.content}`).join('\n');

    const prompt = `
    Analyze the following issue and its discussion thread. Provide a brief summary of the core problem, the current consensus from the discussion, and 2-3 suggested next steps.
    Return your response as a JSON object with the following structure:
    {
      "summary": "String summarizing the issue",
      "insights": ["String array of action items/insights"]
    }

    Issue Title: ${issue.title}
    Issue Description: ${issue.description}
    Discussions:
    ${discussionContext || 'No discussions yet.'}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    
    let textResult = result.response.text();
    textResult = textResult.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    
    const parsedAnalysis = JSON.parse(textResult);

    const existingAnalysis = await db.select().from(analyses).where(eq(analyses.issueId, id));
    
    if (existingAnalysis.length > 0) {
      const updated = await db.update(analyses)
        .set({ summary: parsedAnalysis.summary, insights: parsedAnalysis.insights, createdAt: new Date() })
        .where(eq(analyses.issueId, id))
        .returning();
      return updated[0];
    } else {
      const inserted = await db.insert(analyses)
        .values({ issueId: id, summary: parsedAnalysis.summary, insights: parsedAnalysis.insights })
        .returning();
      return inserted[0];
    }
  }
}

export const issueService = new IssueService();
