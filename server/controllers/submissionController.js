import mongoose from "mongoose";
import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
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


const compilerRes=await axios.post('http://localhost:8080/submit',{code,language,testcases});

const {result,filePath,failedTests,executionTime}=compilerRes.data;
console.log('Compiler response:', compilerRes.data);

const submission = await Submission.create({
    userId,
    problemId,
    language,
    filePath,
    result,
    failedTestCases:failedTests,
    executionTime
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

