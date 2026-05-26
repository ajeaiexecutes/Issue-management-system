import { Router } from 'express';
import { issueController } from '../controllers/issue.controller';
import { validate } from '../middlewares/validate';
import { createIssueSchema, updateIssueSchema, createDiscussionSchema } from '../schemas/issue.schema';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Issue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, CLOSED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: Retrieve a list of issues
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, CLOSED]
 *         description: Filter issues by status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title or description
 *     responses:
 *       200:
 *         description: A list of issues
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Issue'
 */
router.get('/', issueController.getAll);

/**
 * @swagger
 * /issues:
 *   post:
 *     summary: Create a new issue
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Issue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 */
router.post('/', validate(createIssueSchema), issueController.create);

/**
 * @swagger
 * /issues/{id}:
 *   get:
 *     summary: Get an issue by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: The issue with its discussions and AI analysis
 *       404:
 *         description: Issue not found
 */
router.get('/:id', issueController.getById);

/**
 * @swagger
 * /issues/{id}:
 *   patch:
 *     summary: Update an issue status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, CLOSED]
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Issue'
 */
router.patch('/:id', validate(updateIssueSchema), issueController.update);

/**
 * @swagger
 * /issues/{id}/discussions:
 *   post:
 *     summary: Add a discussion to an issue
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               authorName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Discussion added successfully
 */
router.post('/:id/discussions', validate(createDiscussionSchema), issueController.addDiscussion);

/**
 * @swagger
 * /issues/{id}/analyze:
 *   post:
 *     summary: Generate an AI analysis for an issue
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: AI analysis generated successfully
 */
router.post('/:id/analyze', issueController.analyze);

export default router;
