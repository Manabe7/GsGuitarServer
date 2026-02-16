blog = require('../model/Blog');


exports.getAllBlogItems = async (req, res) => {
    try {
        const blogData = await blog.find();
        if (!blogData) {
            return res.status(404).json({ message: 'No blog items found' });
        }
        res.status(200).json(blogData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.getBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blogData = await blog.findOne({ _id: id });
        if (!blogData) {
            return res.status(404).json({ message: 'Blog item not found' });
        }
        res.status(200).json(blogData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.addBlogItem = async (req, res) => { 
    const { title, description, image, content } = req.body;
    const date = new Date();
    try {
        const blogData = new blog({ title, description, image, date, content });
        await blogData.save();
        res.status(201).json(blogData);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.deleteBlogItem = async (req, res) => {
    const { itemId } = req.params;
    try {
        const blogData = await blog.findOne({});    
        if (!blogData) {
            return res.status(404).json({ message: 'Blog not found' });
        }   
        blogData.items = blogData.items.filter(item => item._id.toString() !== itemId);
        await blogData.save();
        res.status(200).json(blogData);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateBlogItem = async (req, res) => {
    const { itemId } = req.params;
    const { title, description, image, content } = req.body;
    const date = new Date();
    try {
        const itemToUpdate = await blog.findOne({ _id: itemId });
        if (itemToUpdate) {
            itemToUpdate.title = title || itemToUpdate.title;
            itemToUpdate.description = description || itemToUpdate.description;
            itemToUpdate.image = image || itemToUpdate.image;
            itemToUpdate.date = date || itemToUpdate.date;
            itemToUpdate.content = content || itemToUpdate.content;
            await itemToUpdate.save();
            res.status(200).json(itemToUpdate);
        } else {
            res.status(404).json({ message: 'Item not found in blog' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
