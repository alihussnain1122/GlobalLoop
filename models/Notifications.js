import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['review_added', 'project_added', 'question_answered'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    relatedReview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
    relatedQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
