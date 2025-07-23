import mongoose from "mongoose";

const reviewSchema= new mongoose.Schema({
    project:{ // Changed from "Project" to "project" for consistency
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    reviewer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    overallRating:{ // Changed from "overAllRating" to "overallRating" for consistency
        type: Number,
        required: true,
        min:1,
        max:5 // Changed from 10 to 5 to match the frontend 5-star system
    },
    comment: String,
    keyRatings:{ // Changed from "KeyRatings" to "keyRatings" for consistency
        type: Map,
        of: Number,
        default:{}
    },
}, {timestamps: true}); // Added timestamps

const Review= mongoose.model("Review", reviewSchema);
export default Review;
