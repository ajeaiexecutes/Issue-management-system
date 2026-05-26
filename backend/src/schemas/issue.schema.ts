import { z } from 'zod';

export const createIssueSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().min(1, 'Description is required'),
  }),
});

export const updateIssueSchema = z.object({
  body: z.object({
    status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']).optional(),
  }),
});

export const createDiscussionSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required'),
    authorName: z.string().max(255).optional(),
  }),
});
