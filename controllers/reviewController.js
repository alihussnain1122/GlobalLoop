import Project from '../models/Projects.js';
import Reviews from '../models/Reviews.js';
import { createNotificationForAllUsers } from './notificationController.js';

// Submit a new review
export const submitReview= async (req, res)=>{
    const { projectId, overallRating, comment, keyRatings}= req.body;

    try{
        const review= new Reviews({
            project: projectId,
            reviewer: req.user.id, // Changed from req.user._id to req.user.id
            overallRating, // Fixed typo from overAllRating
            comment,
            keyRatings
        });
        
        await review.save();
        
        // Populate the reviewer info
        await review.populate('reviewer', 'name');
        
        // Recalculate average rating for the project
        const reviews= await Reviews.find({ project: projectId });
        const avg= reviews.reduce((sum, r)=>sum + r.overallRating, 0) / reviews.length;
        const project = await Project.findByIdAndUpdate(projectId, {overallRating: avg}, {new: true});
        
        // Create notification for all users
        await createNotificationForAllUsers(
            'review_added',
            req.user.id,
            'New Review Added',
            `A new review has been added to "${project.title}"`,
            { relatedProject: projectId, relatedReview: review._id }
        );
        
        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            review: review
        });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: error.message
        });
    }
};

//Get all reviews for a project
export const getReviews= async (req, res)=>{
    try {
        const reviews= await Reviews.find({project: req.params.projectId})
            .populate('reviewer', 'name')
            .sort({createdAt: -1}); // Sort by newest first
        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get reviews',
            error: error.message
        });
    }
};