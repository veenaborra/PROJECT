import User from "../models/userModel.js";
import Submission from "../models/submissionModel.js";
import mongoose from "mongoose";
import dayjs from "dayjs";

//user
export const readUser=async(req,res)=>{
  if(!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }

    const {userId,role}=req.user;
    const user=await User.findById(userId);
    if(!user){
        return res.status(404).json({ message: 'User not found' });
    }
    const email=user.email;
    const username=user.username;

    console.log(req.user);
res.json({role,userId,email,username});

}

//updating user info
export const updateUser=async(req,res)=>{
    try{
        const {id}=req.params;

       const updates=req.body;

        const updatedUser=await User.findByIdAndUpdate(id,updates,{
            new:true,
            runValidators:true,
        });

        if(!updatedUser){
            return  res.status(404).json({message:"user not found"})
        }
        res.json({message:"User updated successfully",
            user:updatedUser});
        }
        catch(error){
            res.status(500).json({ message: 'Server error', error: error.message });
        }

}

//deleting account

export const deleteUser=async(req,res)=>{
try{ 
    const {id}=req.params;

    const deletedUser=await User.findByIdAndDelete(id);
    if(!deletedUser){
        return  res.status(404).json({message:"user not found"})
    }
    res.json({ message: 'User deleted successfully' });

}
catch(error){
    res.status(500).json({ message: 'Server error', error: error.message });
}
}

//user stats




export const getUserStats = async (req, res) => {
  try {
    const {userId} = req.user;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const rating = user.rating || 0;
   // Total unique problems attempted
const attemptedProblemIds = await Submission.distinct("problemId", {
    userId,
  });
  
  // Total unique problems solved (at least one Accepted submission)
  const solvedProblemIds = await Submission.distinct("problemId", {
    userId,
    result: "Accepted",
  });
  
  const attemptedCount = attemptedProblemIds.length;
  const solvedCount = solvedProblemIds.length;
  
  // Accuracy based on unique problems
  const accuracy = attemptedCount === 0 ? 0 : Math.round((solvedCount / attemptedCount) * 100);
  

    // Streak Calculation
    const streak = await calculateStreak(userId);

    res.json({
      solvedCount,
      attempts: attemptedCount,
      rating,
      streakCount: streak,
      accuracy,
      tier: getUserTier(rating),
    });
  } catch (err) {
    console.error("Error fetching user stats:", err.message);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// helper function
const calculateStreak = async (userId) => {
  const submissions = await Submission.find({ userId })
    .sort({ submittedAt: -1 })
    .select("submittedAt");

  const uniqueDays = new Set();

  submissions.forEach((s) => {
    const date = dayjs(s.submittedAt).format("YYYY-MM-DD");
    uniqueDays.add(date);
  });

  const today = dayjs();
  let streak = 0;

  for (let i = 0; i < 100; i++) {
    const checkDay = today.subtract(i, "day").format("YYYY-MM-DD");
    if (uniqueDays.has(checkDay)) streak++;
    else break;
  }

  return streak;
};

function getUserTier(rating) {
    if (rating >= 2000) return "Legend";
    if (rating >= 1700) return "Ruby";
    if (rating >= 1400) return "Diamond";
    if (rating >= 1000) return "Platinum";
    if (rating >= 700) return "Gold";
    if (rating >= 400) return "Silver";
    if (rating >= 200) return "Bronze";
    return "Newbie";
  }
  