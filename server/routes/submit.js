import express from 'express';
import {getSubmissionCount, Submit} from '../controllers/submissionController.js';
import { UserSubmissions } from '../controllers/submissionController.js';
import {authMiddleware }from "../Middleware/authMiddleware.js";
import { specificSubmission } from '../controllers/submissionController.js';
import { getAllSubmissions } from '../controllers/submissionController.js';



const submitRouter=express.Router();

submitRouter.post('/submit',authMiddleware,Submit);
submitRouter.get('/count',authMiddleware,getSubmissionCount);

submitRouter.get('/usersubmission',authMiddleware,UserSubmissions)

submitRouter.get('/all', authMiddleware, getAllSubmissions);
submitRouter.get('/:id',authMiddleware,specificSubmission);






export default submitRouter;