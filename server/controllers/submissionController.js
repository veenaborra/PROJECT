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

const {result,filePath,failedTests}=compilerRes.data;
const submission = await Submission.create({
    userId,
    problemId,
    language,
    filePath,
    result,
    failedTestCases:failedTests,
  });

  res.status(201).json({
    success: true,
    message: 'Submission stored',
    result,
    failedTests
  });

  }
  catch (err) {
    if (err.response && err.response.data) {
      const { error, details } = err.response.data;

      return res.status(err.response.status || 500).json({
        error: error || 'Compiler Error',
        details: details || 'Something went wrong during code execution.'
      });
    }
    console.error('Server Error:', err.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: err.message || 'Unknown server error.'
    });

}}


export default Submit;