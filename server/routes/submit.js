import express from 'express';
import {Submit} from '../controllers/submissionController.js';
import { UserSubmissions } from '../controllers/submissionController.js';
import {authMiddleware }from "../Middleware/authMiddleware.js";
import { specificSubmission } from '../controllers/submissionController.js';
import { getAllSubmissions } from '../controllers/submissionController.js';



const submitRouter=express.Router();

submitRouter.post('/submit',authMiddleware,Submit);

submitRouter.get('/submissions',authMiddleware,UserSubmissions)

submitRouter.get('/submissions/:id',authMiddleware,specificSubmission);

submitRouter.get('/allsubmissions', authMiddleware, getAllSubmissions);


export default submitRouter;