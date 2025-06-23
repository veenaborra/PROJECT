import mongoose from "mongoose";



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
    },
    "points":{
        type:Number,
    },
    "contestId":{
        type:mongoose.Types.ObjectId,
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
        type:mongoose.Types.ObjectId,
        ref:'User'},
    

},{timestamps:true})