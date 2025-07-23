import dns from 'dns';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
dotenv.config();
dns.setServers(['8.8.8.8', '8.8.4.4']);


const app= express();
app.use(cors({
    origin: 'https://global-loop.vercel.app',
    credentials: true
}));
app.use(express.json());
//Routes
app.use('/api/users', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);


const PORT= process.env.PORT;
app.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀Server is running on port ${PORT}`);
});