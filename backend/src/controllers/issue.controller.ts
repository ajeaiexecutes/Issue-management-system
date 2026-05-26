import { Request, Response } from 'express';
import { issueService } from '../services/issue.service';

export class IssueController {
  async getAll(req: Request, res: Response) {
    try {
      const status = req.query.status as 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | undefined;
      const search = req.query.search as string | undefined;
      const issues = await issueService.getAllIssues(status, search);
      res.json(issues);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const issue = await issueService.getIssueById(req.params.id as string);
      if (!issue) return res.status(404).json({ error: 'Issue not found' });
      res.json(issue);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description } = req.body;
      const issue = await issueService.createIssue(title, description);
      res.status(201).json(issue);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const issue = await issueService.updateIssue(req.params.id as string, status);
      res.json(issue);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async addDiscussion(req: Request, res: Response) {
    try {
      const { content, authorName } = req.body;
      const discussion = await issueService.addDiscussion(req.params.id as string, content, authorName);
      res.status(201).json(discussion);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async analyze(req: Request, res: Response) {
    try {
      const analysis = await issueService.analyzeIssue(req.params.id as string);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      if (error.message === 'Issue not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error', details: error?.message || 'Unknown error' });
    }
  }
}

export const issueController = new IssueController();
