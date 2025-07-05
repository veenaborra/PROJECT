import express from 'express';
import Submit from '../controllers/submissionController.js';


const submitRouter=express.Router();

submitRouter.post('/submit',Submit);



export default submitRouter;