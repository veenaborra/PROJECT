import mongoose from "mongoose";
import Problem from "../models/problemModel.js";
import Submission from "../models/submissionModel.js";
import User from "../models/userModel.js";
import axios from 'axios';

const COMPILER_URL = process.env.COMPILER_URL; 

export const Submit = async (req, res) => {
  const { code, language, problemId } = req.body;
  const { userId } = req.user;

  if (!code || !userId || !problemId) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  let result = 'Pending';
  let relativePath = null;
  let failedTests = [];
  let executionTime = null;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    const testcases = problem.testCases;

    // Try compiler execution
    try {
      const compilerRes = await axios.post(
        `${COMPILER_URL}/submit`,
        { code, language, testcases },
        {
          headers: { 'x-internal-token': process.env.INTERNAL_SECRET },
          withCredentials: true,
        }
      );

      result = compilerRes.data.result;
      relativePath = compilerRes.data.relativePath;
      failedTests = compilerRes.data.failedTests;
      executionTime = compilerRes.data.executionTime;
    } catch (err) {
      console.error("Compiler error:", err?.response?.data || err.message);
      result = err?.response?.data?.error || 'Unknown Error';
      executionTime = err?.response?.data?.executionTime || null;
      relativePath=err?.response?.data?.relativePath || null;
      var errorDetails = err?.response?.data?.details || 'No additional details';
    }

 
    const submission = await Submission.create({
      userId,
      problemId,
      language,
      filePath: relativePath,
      result,
      failedTestCases: failedTests,
      executionTime,
    });

  
    if (result === 'Accepted' && problem.points > 0) {
      const alreadySolved = await Submission.findOne({
        userId,
        problemId,
        result: 'Accepted',
        _id: { $ne: submission._id },
      });

      if (!alreadySolved) {
        await User.findByIdAndUpdate(userId, {
          $inc: { rating: problem.points },
        });
      }
    }

    res.status(201).json({
      success: result === 'Accepted',
      message: 'Submission stored',
      result,
      failedTests,

  ...(result !== 'Accepted' && { details: errorDetails })
    });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal Server Error',    details: 'Internal Server Error. Please try again later.'  });
  }
};


export const UserSubmissions=async(req,res)=>{
try{
  const {userId} = req.user;
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

export const getAllSubmissions = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can view all submissions' });
    }

    const submissions = await Submission.find()
    .sort({ submittedAt: -1 }) 
      .populate({
        path: 'userId',
        select: 'username email', 
      })
      .populate({path:'problemId',
        select: 'title'});

    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error.message);
    res.status(500).json({ error: 'Server error while fetching submissions' });
  }
};
//total submissions count

export const getSubmissionCount = async (req, res) => {
  try {
    const count = await Submission.countDocuments();
    console.log(count);
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching submission count:', error).message;
    res.status(500).json({ message: 'Internal server error' });
  }
};