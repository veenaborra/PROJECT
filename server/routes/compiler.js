import express from 'express';
import { runCode, aiReview, getCode } from '../controllers/compilerController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const compilerRouter = express.Router();

compilerRouter.post('/run', authMiddleware, runCode);
compilerRouter.post('/ai-review', authMiddleware, aiReview);
compilerRouter.get('/code', authMiddleware, getCode);

export default compilerRouter;
