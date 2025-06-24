import express from "express";
import { createProblem,getAllPracticeProblems,getAllRatedProblems,getSpecificProblem,updateProblem,deleteProblem} from "../controllers/problemController.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";



const problemsRouter=express.Router();

//create a problem
problemsRouter.post('/',authMiddleware,createProblem);
//get all practice problem
 problemsRouter.get('/practiceproblems',authMiddleware,getAllPracticeProblems);
//get all rated problems
 problemsRouter.get('/ratedproblems',authMiddleware,getAllRatedProblems);

//get specific problem
 problemsRouter.get('/:id',authMiddleware,getSpecificProblem);
//update problem
 problemsRouter.patch('/:id',authMiddleware,updateProblem);
// //delete problem
 problemsRouter.delete('/:id',authMiddleware,deleteProblem);


export default problemsRouter;