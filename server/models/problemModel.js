import mongoose, { mongo } from "mongoose";



const problemSchema=new mongoose.Schema({
    "title":{
        type:String,
        unique:true,
        required:true,
    },
    "description":{
        type:String,
        required:true,
       
    },
    "difficulty":{
        type:String,
        required:true,
        enum: {
            values: ['Easy', 'Medium', 'Hard'],
            message: '{VALUE} is not a valid difficulty level',
          },
    },
    "tags":{
        type:[String],
        default:[]
    },
    "points":{
        type:Number,
        default:0
    },
    "contestId":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Contest'

    },
    "testCases":[{
       
    "input":{
        type:String,
      required:true},
    "expectedOutput":{
        type:String,
        required:true
    }
  
    }],
    "createdBy": {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'},
    

},{timestamps:true})
const Problem=mongoose.model('Problem',problemSchema);
export default Problem;