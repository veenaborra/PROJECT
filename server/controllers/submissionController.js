import mongoose from "mongoose";
import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import axios from 'axios';

 export const Submit=async(req,res)=>{
    const {code,language,problemId}=req.body;
    const {userId }= req.user; 
    console.log(userId);

if (!code || !userId || !problemId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try{
    const problem=await Problem.findById(problemId);
    if(!problem){
        return res.status(404).json({ error: 'Problem not found' });
    }
const testcases=problem.testCases;


const compilerRes=await axios.post('http://localhost:8080/submit',{code,language,testcases},{headers: {
  'x-internal-token': process.env.INTERNAL_SECRET,
},
  withCredentials:true,
});

const {result,relativePath,failedTests,executionTime}=compilerRes.data;
console.log('Compiler response:', compilerRes.data);

const submission = await Submission.create({
    userId,
    problemId,
    language,
    filePath:relativePath,
    result,
    failedTestCases:failedTests,
    executionTime
  });

  if (problem.points > 0 && result === 'Accepted') {
    
    const alreadySolved = await Submission.findOne({
      userId,
      problemId,
      result: 'Accepted',
      _id: { $ne: submission._id }
    });
  
    if (!alreadySolved) {

    await User.findByIdAndUpdate(userId, {
        $inc: { rating: problem.points },
      });
     
    }
  }
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


export const Submissions=async(req,res)=>{
try{
  const userId = req.userId;
  console.log(userId);
  const submissions = await Submission.find( {userId})
      .sort({ submittedAt: -1 })
      .populate({
        path: 'problemId',
        select: 'title _id',
      });
      
      const formatted = submissions.map((s) => ({
        _id: s._id,
        language: s.language,
        status: s.result,
        executionTime: s.executionTime,
        createdAt: s.submittedAt,
        problemTitle: s.problemId?.title || 'Unknown',
        problemId: s.problemId?._id || null,
      }));
      console.log(formatted);
      res.json({ submissions: formatted });
}
catch(err){
  console.error('Error fetching submissions:', err);
  res.status(500).json({ error: 'Failed to fetch submissions.' })
}
}

export const specificSubmission=async(req,res)=>{
  try{
    const {id}=req.params;
const submission=await Submission.findById(id);
if(!submission){
  return res.status(404).json({ message: 'submission not found' });
}
res.status(200).json(submission);
}
catch(error){
  console.error("Error in specificSubmission:", error.message);
    res.status(500).json({ message: 'Error fetching submission', error: error.message });
}
}