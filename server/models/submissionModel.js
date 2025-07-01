import mongoose, { Mongoose} from "mongoose";


const submissionSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    problemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Problem",
        required:true

    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        enum:[cpp,python],
    },
    status:{
        type:String,
        enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"],
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
      },
      executionTime: {
        type: Number,ms
      },
      memoryUsed: {
        type: Number,kb
      },
    });
    
const Submission = mongoose.model("Submission", submissionSchema);
    
export default Submission;

