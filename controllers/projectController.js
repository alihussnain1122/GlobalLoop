import Project from "../models/Projects.js";

//create new project
export const createProject = async(req,res)=>{
    try{
        const project= await Project.create(req.body);
        res.status(201).json(project);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error creating project"});
    }
};
//Get all projects
export const getAllProjects= async(req, res)=>{
    try{
        const projects= await Project.find();
        res.status(200).json(projects);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error fetching projects"});
    }
};
//Get project by ID
export const getProjectById= async(req,res)=>{
    try{
        const project= await Project.findById(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});    
        }
        res.status(200).json(project);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error fetching project"});
    }
};
//Update project by ID
export const updateProjectById = async(req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id   , req.body, { new: true });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error updating project"});
    }
};
//Delete project by ID
export const deleteProjectById= async(req, res)=>{
    try{
        const project= await Project.findByIdAndDelete(req.params.id);
        if(!project){
            return res.status(404).json({message: "Project not found"});
        }
        res.status(204).json();
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Error deleting project"});
    }
};