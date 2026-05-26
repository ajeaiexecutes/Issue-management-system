import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { issues, discussions, analyses } from '../db/schema';

// Database Models
export type Issue = InferSelectModel<typeof issues>;
export type NewIssue = InferInsertModel<typeof issues>;

export type Discussion = InferSelectModel<typeof discussions>;
export type NewDiscussion = InferInsertModel<typeof discussions>;

export type Analysis = InferSelectModel<typeof analyses>;
export type NewAnalysis = InferInsertModel<typeof analyses>;

// Data Transfer Objects (DTOs) for API Responses
export interface IssueWithDetails extends Issue {
  discussions: Discussion[];
  analysis: Analysis | null;
}
