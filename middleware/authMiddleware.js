import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const protect= (req, res, next)=>{
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const token= authHeader.split(' ')[1];
    try{
        const  decode= jwt.verify(token, process.env.JWT_SECRET);
        req.user=decode;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const admin= (req, res, next)=>{
    if(req.user?.role!== 'admin'){
        return res.status(403).json({message: "Admin only"});
    }
    next();
}

export const reviewer= (req, res, next)=>{
    if(req.user?.role!== 'reviewer' && req.user?.role!== 'admin'){
        return res.status(403).json({message: "Reviewer access required"});
    }
    next();
}

export const viewer= (req, res, next)=>{
    if(req.user?.role!== 'viewer' && req.user?.role!== 'admin'){
        return res.status(403).json({message: "Viewer access required"});
    }
    next();
}

export const viewerOrAdmin= (req, res, next)=>{
    if(req.user?.role!== 'viewer' && req.user?.role!== 'admin'){
        return res.status(403).json({message: "Viewer or Admin access required"});
    }
    next();
}

export const reviewerOrAdmin= (req, res, next)=>{
    if(req.user?.role!== 'reviewer' && req.user?.role!== 'admin'){
        return res.status(403).json({message: "Reviewer or Admin access required"});
    }
    next();
}