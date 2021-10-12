// Import requirements
const mongoose = require("mongoose")

// Create blog schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, "Your blog needs a title."],
        maxlength: [100, "Your title must not exceed 100 characters."],
        unique: true 
    },
    snippet: {
        type: String, 
        required: [true, "Please give a snippet."], 
        maxlength: [120, "Your snippet must not exceed 120 characters."]
    },
    body: {
        type: String,
        required: [true, "Your blog needs a body."]
    },
    author: {
        type: String, 
        required: true
    },
    author_id: {
        type: String, 
        required: true
    }
}, {timestamps: true})

// Create and export blog model
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;