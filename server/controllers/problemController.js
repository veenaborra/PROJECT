import Problem from "../models/problemModel.js";



//create problems
export const createProblem=async(req,res)=>{
    try{
        const {
            title,
            description,
            difficulty,
            tags,
            points,
            testCases,
            inputFormat,
            outputFormat,
            constraints,
            examples
          } = req.body;

    const {userId,role}=req.user;
   
    if (!userId || role !== 'admin') {
        return res.status(403).json({ error: 'Only admins can create problems.' });
      }

      const existing = await Problem.findOne({ title });
      if (existing) {
        return res.status(400).json({ error: 'Problem with this title already exists' });
      }

      const newProblem = new Problem({
        title,
        description,
        difficulty,
        tags,
        points,
        testCases,
        inputFormat,
        outputFormat,
        constraints,
        examples,
        createdBy: userId,
      });
      

    await newProblem.save();
    res.status(201).json({message:"saved problem sucessfully!",
        problem:newProblem
    });
}
catch(error){
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Problem title must be unique.' });
      }

    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
    res.status(500).json({message:'something went wrong ',error:error.message})
}
}

//get all problems
export const getAllProblems=async(req,res)=>{
    try{
        const allProblems=await Problem.find();
        res.status(200).json({problems:allProblems});
    }
    catch(error){
        res.status(500).json({ error: err.message });
    }
}
//get practice problems

export const getAllPracticeProblems=async(req,res)=>{
try{
    const practiceProblems=await Problem.find({points:{$eq:0}});
    res.json({practiceProblems})
}
catch(error){
   res.status(500).json({ error: err.message });
}
}

//get rated problems

export const getAllRatedProblems=async(req,res)=>{
    try{
     const ratedProblems=await Problem.find({points:{$gt:0}});
     res.json({ratedProblems});
    }
    catch{
        res.status(500).json({ error: err.message });
    }
}

//get specific problem

export const getSpecificProblem=async(req,res)=>{
    try{
        const {id}=req.params;
        const problem=await Problem.findById(id);
        if(!problem){
            return res.status(404).json({ message: 'Problem not found' });
        }
        res.json(problem);
    }
    catch(error){
        res.status(500).json({ message: 'Error fetching problem', error: error.message });
    }
}

//update a problem


     
          export const updateProblem = async (req, res) => {
            try {
              const { id } = req.params;
              const { role } = req.user;
              const { title } = req.body;
          
              if (role !== "admin") {
                return res.status(403).json({ error: 'Forbidden: Admins only' });
              }
          
              if (!title) {
                return res.status(400).json({ error: 'Title is required' });
              }
          
              const existing = await Problem.findOne({ title });
          
              if (existing && existing._id.toString() !== id) {
                return res.status(400).json({ error: 'Another problem with this title already exists' });
              }
          
              const updatedProblem = await Problem.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true
              });
          
              res.json({
                message: "Updated successfully",
                updatedproblem: updatedProblem
              });
          
            } catch (error) {
              console.error('Error updating problem:', error); // log full error
              res.status(500).json({ message: 'Error updating problem', error: error.message });
            }
          };
          

//delete a problem

export const deleteProblem=async(req,res)=>{
    try{
        const {id}=req.params;
        const{role}=req.user;
       
            if(role!="admin"){
                return res.status(403).json({ error: 'Forbidden: Admins only' });
            }
            const deletedProblem=await Problem.findByIdAndDelete(id);
            if(!deletedProblem){
                return res.status(400).json({message:"problem not found"});
            }
            res.json({message:"Problem deleted successfully"});
        
        
    }
    catch(error){
        console.log("erorr deleting problem");
        res.status(500).json({message:'Error deleting problem:',error:error.message});
    }
}

// problem count
export const getProblemCount = async (req, res) => {
  try {
    console.log("getProblemCount called");
    const count = await Problem.countDocuments();
    console.log("Count:", count);
    res.status(200).json({ count });
  } catch (error) {
    console.error(' Error in getProblemCount:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
