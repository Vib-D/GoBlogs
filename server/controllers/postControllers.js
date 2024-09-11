const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')
const { timeStamp } = require('console')


// ----- create post
// POST:api/posts
// Protected
const createPost = async (req, res, next) => {
    try {
        const { title, category, description, bookAuthor, thumbnail } = req.body;
        if (!title || !category || !description || !bookAuthor) {
            return next(new HttpError('Please fill all the fields', 422));
        }

        const newPost = await Post.create({ title, category, bookAuthor, description, thumbnail, creator: req.user.id });
        if (!newPost) {
            return next(new HttpError('Post could not be created', 422));
        }

        // Find user and increase post count
        const currentUser = await User.findById(req.user.id);
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

        res.status(201).json(newPost);
    } catch (error) {
        return next(new HttpError(error));
    }
}





// ----- get all post
// GET : api/posts
// Unprotected
const getPosts = async (req, res, next) => {
    try {
        // Retrieve posts sorted by `updatedAt` in descending order
        const posts = await Post.find().sort({ updatedAt: -1 });

        // Check if no posts are found
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        // Return the posts
        res.status(200).json(posts);
    } catch (error) {
        // Log error for debugging purposes
        console.error("Error fetching posts:", error);

        // Return a general error message
        return next(new HttpError("Failed to fetch posts", 500));
    }
};




// ----- get single post
// GET : api/posts/:id
// unprotected
const getPost = async (req,res,next) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        if(!post){
            return next(new HttpError("Page not found", 422))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
} 




// ----- get posts by category
// GET : api/posts/categories/:category
// Unprotected
const getCatPosts = async (req,res,next) => {
    try {
        const {category} = req.params
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
} 





// ----- get posts by author
// GET : api/posts/users/:id
// unprotected
const getUserPosts = async (req,res,next) => {
    try {
        const {id} = req.params
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
} 






// ----- edit post
// PATCH : api/posts/:id
// protected
const editPost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const { title, category, bookAuthor, description, thumbnail } = req.body;

        // Get old post from db
        const oldPost = await Post.findById(postId);
        if (req.user.id === oldPost.creator) {
            return next(new HttpError("You are not the creator of this post", 403));
        }

        if (!title || !bookAuthor || !category || !description) {
            return next(new HttpError("Fill in all the details", 422));
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, { title, category, description, bookAuthor, thumbnail }, { new: true });
        if (!updatedPost) {
            return next(new HttpError("Post not updated", 400));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error));
    }
}

 





// ----- delete post
// DELETE : api/posts/:id
// protected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return next(new HttpError("Post unavailable", 400));
        }

        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        if (req.user.id === post.creator) {
            return next(new HttpError("You are not the creator of this post", 403));
        }

        await Post.findByIdAndDelete(postId);

        // Update user's post count
        const currentUser = await User.findById(req.user.id);
        if (currentUser) {
            const userPostCount = currentUser.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
        }

        res.status(200).json(`Post ${postId} is deleted successfully`);
    } catch (error) {
        return next(new HttpError(error));
    }
};



module.exports = { createPost, getPost, getPosts, editPost, deletePost, getCatPosts, getUserPosts }