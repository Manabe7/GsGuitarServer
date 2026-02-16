const BlogComment = require('../model/BlogComment');
const Blog = require('../model/Blog');
const Users = require('../model/User');
const mongoose = require('mongoose');


exports.getCommentsByBlogId = async (req, res) => {
    const { BlogId } = req.params;
    try {
        const blogComments = await BlogComment.findOne({ blogId: BlogId });
        if (!blogComments) {
            blogComments = new BlogComment({
                blogId: BlogId,
                comments: []
            });
            await blogComments.save();
            return res.status(200).json({ blogComments, message: 'No comments found for this blog' });
        }
        res.status(200).json(blogComments.comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.addCommentToBlog = async (req, res) => {
    const { blogId, firstName, email, commentText } = req.body;
    /* const cookies = req.cookies;
        if (!cookies?.jwt) {
            return res.sendStatus(401).json({ user: null}); // Unauthorized
        }
        const refreshToken = cookies.jwt;
    
        // Check if the refresh token is in the database
        const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec(); */
    
    const date = new Date();
    try {
        const blogComments = await BlogComment.findOne({ blogId: blogId });
        if (!blogComments) {
            blogComments = new BlogComment({ blogId: blogId, comments: [] });
        }
        const comment = {
            firstName: firstName,
            email: email,
            commentText: commentText,
            date: date
        };
        blogComments.comments.push(comment);
        await blogComments.save();
        res.status(201).json(blogComments.comments);
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

