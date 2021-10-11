// Import requirements
const mongoose = require("mongoose")

// Create draft schema
const draftSchema = new mongoose.Schema({
    draftName: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    snippet: {
        type: String
    },
    body: {
        type: String
    },
    lastUpdated: {
        type: String
    },
    author_id: {
        type: String,
        required: true
    }
}, {timestamps: true})


// Create and export draft model
const Draft = mongoose.model("Draft", draftSchema);
module.exports = Draft;