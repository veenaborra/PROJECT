import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import axios from 'axios';

 const Submit=async(req,res)=>{
    const {code,language,userId,problemId}=req.body;

if (!code || !userId || !problemId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try{
    const problem=await Problem.findById(problemId);
    if(!problem){
        return res.status(404).json({ error: 'Problem not found' });
    }
const testcases=problem.testCases;


const compilerRes=await axios.post('http://localhost:8080/submit',{code,language,testcases});

const {result,filePath,failedTest}=compilerRes.data;
const submission = await Submission.create({
    userId,
    problemId,
    language,
    filePath,
    result,
    failedTestCases:failedTest,
  });

  res.status(201).json({
    success: true,
    message: 'Submission stored',
    result,
    failedTest
  });

  }
  catch (err) {
   if(err.response){
    //compiler error
    console.log(err.response);
    return res.status(500).json({
      error:"Compiler Error",
      details:err.response.data?.details || err.message
    })
   }
   else{
    return res.status(500).json({
      error:"Internal server error"
    })
   }
  }


}


export default Submit;