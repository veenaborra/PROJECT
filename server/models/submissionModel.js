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

    language:{
        type:String,
        enum:['cpp','python'],
        required:true
    },
    filePath:{
        type:String,
        required:true,
    },
    result:{
        type:String,
        default:"Pending",
        enum: ["Pending","Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error","Compiler Error"],
        required: true,
    },
    failedTestCases: [{
        index:Number,
        input:String,
        expected:String,
        actual:String
    }],
    

    
    submittedAt: {
        type: Date,
        default: Date.now,
      },
       executionTime: {
        type: Number,//ms
        default:null
     },
    //   memoryUsed: {
    //     type: Number,//kb
    //     default:"null"
    //   },
    });
    
    
const Submission = mongoose.model("Submission", submissionSchema);
    
export default Submission;

