import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    keys: [String],
    overallRating: {
        type: Number,
        default: 0
    },
    image:{
        type: String,
        default: null
    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

export default Project;