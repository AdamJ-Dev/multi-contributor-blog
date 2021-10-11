// Import requirements
const Blog = require("../models/blog");
const ImageKeyData = require("../models/imageKeyData")
const Draft = require("../models/draft")
const User = require("../models/user")
const { getDate } = require("../getDate")

// Handle routes

module.exports.profile_get = async (req, res, next) => {
    const requestedId = req.params.id
    try {
        const requestedUser = await User.findById(requestedId)
        if (requestedUser) {
            const user = res.locals.user
            if (user) {
                const id = user._id
                if (id == requestedId) {
                    res.redirect(`/profile/blogs/${id}`)
                    return;
                }
            } 
            let blogs = await Blog.find({author_id: requestedId})
            blogs.reverse()
            const author = requestedUser.author

            // Ready a complex class list for each blog
            
            res.render("profile/voyeur", {title: author, author, blogs, getDate, user})
            
        } else {
            // Requested user does not exist: pass to 404 page
            next(); 
        }
    } catch(err) {
        next();
    }
}

module.exports.profileblogs_get = async (req, res, next) => {
    const user = res.locals.user
    let myBlogs = await Blog.find({author_id: user._id})
    myBlogs.reverse()
    res.render("profile/profileBlogs", {title: "Profile", myBlogs, getDate, user, active: "/blogs"})
}

module.exports.profileimages_get = async (req, res, next) => {
    const user = res.locals.user
    const myImages = await ImageKeyData.find({author_id: user._id})
    res.render("profile/profileImages", {title: "Profile", myImages,  getDate, user,  active: "/images"})
}

module.exports.profiledrafts_get = async (req, res, next) => {
    const user = res.locals.user
    let myDrafts = await Draft.find({author_id: user._id})
    myDrafts.reverse()
    res.render("profile/profileDrafts", {title: "Profile", myDrafts, user, active: "/drafts"})
}