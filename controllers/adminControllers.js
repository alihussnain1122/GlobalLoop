import Users from '../models/Users.js';
import Projects from '../models/Projects.js';
import Reviews from '../models/Reviews.js';
import Questions from '../models/Questions.js';
import { createNotificationForAllUsers } from './notificationController.js';

//==================================User Management==================================
//Get all users 
export const getAllUsers= async(req, res)=>{
    try{
        const users= await Users.find();
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
};

//Create new user account
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const newUser = new Users({
      name,
      email,
      password,
      role: role || 'viewer',
      isApproved: role === 'reviewer' ? false : true
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      isApproved: savedUser.isApproved
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      { 
        role,
        isApproved: role === 'reviewer' ? false : true
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete user
export const deleteUser= async(req, res)=>{
    try{
        await Users.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
};
//Approve user
export const approveUser= async(req, res)=>{
    const user= await Users.findByIdAndUpdate(req.params.id,
       { isApproved: true}, {new: true});
       res.json(user);
};


//Delete a review
export const deleteReview = async (req, res) => {
  try {
    await Reviews.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Get all questions of a project
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Questions.find()
      .populate('askedBy', 'name email')
      .populate('answeredBy', 'name email')
      .populate('project', 'title');
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    await Questions.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//==================================Project Management==================================
//Get all projects for admin management
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Create new project
export const createProject = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, keys, image } = req.body;
    
    const newProject = new Projects({
      title,
      description,
      location,
      startDate,
      endDate,
      keys,
      image
    });

    const savedProject = await newProject.save();
    
    // Create notification for all users about new project
    await createNotificationForAllUsers(
      'project_added',
      req.user.id,
      'New Project Added',
      `A new project "${title}" has been added to the platform`,
      { relatedProject: savedProject._id }
    );
    
    res.status(201).json(savedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update existing project
export const updateProject = async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, keys, image } = req.body;
    
    const updatedProject = await Projects.findByIdAndUpdate(
      req.params.id,
      { title, description, location, startDate, endDate, keys, image },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Delete project
export const deleteProject= async(req, res)=>{
    try{
        await Projects.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
};

//==================================Review Management==================================
//Get all reviews of a project
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Reviews.find()
      .populate('reviewer', 'name email')
      .populate('project', 'title');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Update/Edit review (for moderation)
export const updateReview = async (req, res) => {
  try {
    const { content, rating, keyRatings } = req.body;
    
    const updatedReview = await Reviews.findByIdAndUpdate(
      req.params.id,
      { content, rating, keyRatings },
      { new: true }
    ).populate('reviewer', 'name email').populate('project', 'title');

    if (!updatedReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
