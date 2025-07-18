import express from 'express';
import {Submit} from '../controllers/submissionController.js';
import { Submissions } from '../controllers/submissionController.js';
import {authMiddleware }from "../Middleware/authMiddleware.js";
import { specificSubmission } from '../controllers/submissionController.js';



const submitRouter=express.Router();

submitRouter.post('/submit',authMiddleware,Submit);

submitRouter.get('/submissions',authMiddleware,Submissions)

submitRouter.get('/submissions/:id',authMiddleware,specificSubmission);



export default submitRouter;