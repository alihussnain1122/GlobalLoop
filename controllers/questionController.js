import Question from "../models/Questions.js";
import { createNotification } from './notificationController.js';

//Ask question
export const askQuestion= async(req, res)=>{
    const {projectId, question}= req.body;
    try{
        console.log('User from token:', req.user); // Debug log
        const newQuestion= await Question.create({
            project: projectId,
            askedBy: req.user.id, // Changed from req.user._id to req.user.id
            question,
            createdAt: new Date()
        });
        
        // Populate the asker info before sending response
        await newQuestion.populate('askedBy', 'name');
        res.status(201).json(newQuestion);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//Answer a question
export const answerQuestion= async(req, res)=>{
    const {questionId}= req.params;
    const {answer}= req.body;
    try{
        const question= await Question.findById(questionId);
        if(!question){
            return res.status(404).json({message: "Question not found"});
        }
        
        // Initialize answers array if it doesn't exist (for backward compatibility)
        if (!question.answers) {
            question.answers = [];
        }
        
        // Add new answer to the answers array
        const newAnswer = {
            answer: answer,
            answerer: req.user.id,
            answeredAt: new Date()
        };
        
        question.answers.push(newAnswer);
        
        // For backward compatibility, also update the old single answer fields with the latest answer
        question.answer = answer;
        question.answeredBy = req.user.id;
        question.answeredAt = new Date();
        
        await question.save();
        
        // Populate askedBy to get user info for notification
        await question.populate('askedBy', 'name');
        
        // Create notification for the person who asked the question
        await createNotification(
            'question_answered',
            question.askedBy._id,
            'Your Question Was Answered',
            `Your question has been answered by ${req.user.name || 'someone'}`,
            { relatedQuestion: question._id, relatedProject: question.project }
        );
        
        // Populate both old and new answer fields
        await question.populate([
            { path: 'answeredBy', select: 'name' },
            { path: 'answers.answerer', select: 'name' }
        ]);
        
        res.status(200).json(question);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};

//Get questions of project
export const  getProjectQuestions= async(req, res)=>{
    const {projectId}= req.params;
    try{
        const questions= await Question.find({project: projectId})
            .populate('askedBy', 'name')
            .populate('answeredBy', 'name')
            .populate('answers.answerer', 'name')
            .sort({createdAt: -1}); // Sort by newest first
        
        // Transform the data to match frontend expectations
        const transformedQuestions = questions.map(q => ({
            _id: q._id,
            question: q.question,
            answer: q.answer, // Keep for backward compatibility
            answers: q.answers || [], // Ensure answers is always an array
            asker: q.askedBy,
            answerer: q.answeredBy, // Keep for backward compatibility
            createdAt: q.createdAt,
            answeredAt: q.answeredAt // Keep for backward compatibility
        }));
        
        res.json(transformedQuestions);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal Server Error"});
    }
};