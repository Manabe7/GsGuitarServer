const BlogComment = require('../model/BlogComment');
const Blog = require('../model/Blog');
const Users = require('../model/User');
const mongoose = require('mongoose');


exports.getCommentsByBlogId = async (req, res) => {
    const { BlogId } = req.params;
    try {
        const blogComments = await BlogComment.findOne({ blogId: BlogId });
        if (!blogComments || blogComments === null) {
            const newBlogComments = {
                blogId: BlogId,
                comments: []
            }
            const result = await BlogComment.create(newBlogComments);
            await result.save();
            console.log('New blog comments created:', result);
            return res.status(200).json({ result }); // Return the newly created blog comments
        }
        res.status(200).json(blogComments.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.addCommentToBlog = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;

    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(403).json({ user: null }); // Forbidden
    }
    try {
        const { blogId, commentText } = req.body;
        const date = new Date();
        const blogComments = await BlogComment.findOne({ blogId: blogId });
        if (!blogComments || blogComments === null) {
            const newBlogComments = {
                blogId: BlogId,
                comments: []
            }
            await BlogComment.create(newBlogComments);
        }
        const comment = {
            firstName: foundUser.firstName,
            email: foundUser.email,
            image: foundUser.image,
            commentText: commentText,
            date: date,
            isEditing: false
        };
        blogComments.comments.push(comment);
        await blogComments.save();
        res.status(200).json(blogComments.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteCommentFromBlog = async (req, res) => {
    const { BlogId, commentId } = req.params;
    try {
        const blogComments = await BlogComment.findOne({ blogId: BlogId });
        if (!blogComments) {
            return res.status(404).json({ message: 'Blog comments not found' });
        }
        blogComments.comments = blogComments.comments.filter(comment => comment._id.toString() !== commentId);
        await blogComments.save();
        res.status(200).json(blogComments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateCommentInBlog = async (req, res) => {
    const { BlogId, commentId } = req.params;
    const { commentText } = req.body;
    try {
        const blogComments = await BlogComment.findOne({ blogId: BlogId });
        if (!blogComments) {
            return res.status(404).json({ message: 'Blog comments not found' });
        }
        console.log(blogComments.comments);
        const comment = blogComments.comments.find(c => c._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        comment.commentText = commentText;
        await blogComments.save();
        res.status(200).json(blogComments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

