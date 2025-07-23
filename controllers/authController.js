import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import bcrypt from 'bcryptjs';
//Register
export const Register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword= await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
};

//Login
export const Login= async (req, res)=>{
    const {email, password}= req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        const matchedPassword= await bcrypt.compare(password, user.password);
        if(!matchedPassword){
            return res.status(400).json({message: "Invalid credentials"});
        }
        if(user.role== "reviewer" && !user.isApproved){
            return res.status(403).json({message: "User not approved"});
        }
        const token= jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.json({token,user});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
}