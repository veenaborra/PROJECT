import User from "../models/userModel.js";
//user
export const readUser=async (req,res)=>{
    const {userId,role}=req.user;
    console.log(req.user);
res.json({role,userId});

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