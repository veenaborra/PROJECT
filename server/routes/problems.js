import express from "express";
import { createProblem,getAllPracticeProblems,getAllRatedProblems,getSpecificProblem,updateProblem,deleteProblem,getAllProblems,getProblemCount} from "../controllers/problemController.js";
import { optionalAuth } from "../Middleware/optionalAuth.js";
import {authMiddleware }from "../Middleware/authMiddleware.js";



const problemsRouter=express.Router();

//create a problem
problemsRouter.post('/',authMiddleware,createProblem);
//get all problems
problemsRouter.get('/allproblems',getAllProblems);
//get all practice problem
 problemsRouter.get('/practiceproblems',authMiddleware,getAllPracticeProblems);
//get all rated problems
 problemsRouter.get('/ratedproblems',authMiddleware,getAllRatedProblems);
// get problem count

problemsRouter.get("/count",authMiddleware,getProblemCount);
//get specific problem
 problemsRouter.get('/:id',getSpecificProblem);
//update problem
 problemsRouter.patch('/:id',authMiddleware,updateProblem);
// //delete problem
 problemsRouter.delete('/:id',authMiddleware,deleteProblem);


export default problemsRouter;