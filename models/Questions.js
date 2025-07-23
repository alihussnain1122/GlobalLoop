import mongoose from "mongoose";

const questionSchema= new mongoose.Schema({
    project:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    askedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    question:{
        type: String,
        required: true
    },
    // Keep old fields for backward compatibility
    answer:{
        type: String,
        default: null
    },
    answeredBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    answeredAt:{
        type: Date,
        default: null
    },
    // New multiple answers array
    answers: [{
        answer: {
            type: String,
            required: true
        },
        answerer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        answeredAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {timestamps:true});

const Question= mongoose.model("Question", questionSchema);
export default Question;