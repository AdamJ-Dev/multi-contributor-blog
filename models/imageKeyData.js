// Import requirements
const mongoose = require("mongoose")

// Create image data schema
const imageKeyDataSchema = new mongoose.Schema({
    author_id: {
        type: String,
        required: true},
    name: {
        type: String,
        required: true},
    key: {
        type: String, 
        required: true}

}, {timestamps: true})


// Create and export image data model
const ImageKeyData = mongoose.model("ImageKeyData", imageKeyDataSchema);
module.exports = ImageKeyData;