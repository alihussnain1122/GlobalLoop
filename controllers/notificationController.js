import Notification from '../models/Notifications.js';
import User from '../models/Users.js';

// Create notification helper function
export const createNotification = async (type, recipientId, title, message, relatedData = {}) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            type,
            title,
            message,
            ...relatedData
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Create notifications for all users except sender
export const createNotificationForAllUsers = async (type, senderId, title, message, relatedData = {}) => {
    try {
        const users = await User.find({ 
            _id: { $ne: senderId },
            isApproved: true 
        }).select('_id');
        
        const notifications = users.map(user => ({
            recipient: user._id,
            type,
            title,
            message,
            ...relatedData
        }));
        
        await Notification.insertMany(notifications);
    } catch (error) {
        console.error('Error creating notifications for all users:', error);
    }
};

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .populate('relatedProject', 'title')
            .populate('relatedReview', 'comment')
            .populate('relatedQuestion', 'question')
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ 
            recipient: req.user.id, 
            isRead: false 
        });
        res.json({ count });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({ message: 'Failed to fetch unread count' });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Failed to mark notification as read' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
};
