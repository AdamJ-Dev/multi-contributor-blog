// Import requirements
const Blog = require("../models/blog");
const Draft = require("../models/draft")
const { getDate, getDateWithTime } = require("../getDate")

// Handle blog-creation errors
const handleNewBlogErrors = err => {
    let errorInfo = { title: "", snippet: "", body: ""}

    // Duplicate error
    if (err.code === 11000) {
        errorInfo["title"] = "A blog with this title already exists."
    }

    // Validation errors
    if (err.message.includes("Blog validation failed")) {
            Object.values(err.errors).forEach(({properties}) => {
                errorInfo[properties.path] = properties.message
        })
    }
    return {errors: errorInfo}
}

// Handle routes

module.exports.createblog_get = async (req, res) => {
    const user = res.locals.user
    try {
        // Create blank draft
        const draft = await Draft.create({
            draftName: "Untitled Draft",
             title: "", 
             snippet: "",
             body: "",
             lastUpdated: getDateWithTime(Date()),
             author_id: user._id 
            })
        res.redirect(`/createblog/${draft._id}`)
    } catch(err) {
        console.log(err)
    }
}

module.exports.createblog_post = (req, res) => {
    const user = res.locals.user
    const author_id = user._id
    const author = user.author
    const { title, snippet, body } = req.body
    // The draft graduates to a blog...
    const blog = new Blog({title, snippet, body, author, author_id});
    blog.save()
    .then(result => res.json({user}))
    .catch(err => res.json(handleNewBlogErrors(err)))
}

module.exports.blog_get = async (req, res, next) => {
    const user = res.locals.user
    const blogs = Array.from(await Blog.find());
    // Find the matching blog
    for (let i = 0; i < blogs.length; i++) {
        let blog = blogs[i]
        if (blog._id == req.params.id) {
            
            // Format the MongoDB 'createdAt' date
            date =  getDate(blog.createdAt)

            res.render("blogs/viewblog", {title: blog.title, body: blog.body, blogAuthor: blog.author, blogAuthorId: blog.author_id, date, user})
        }
    } 
    // If no blog was found pass to 404 page
    next()
}

module.exports.blog_delete = async (req, res) => {
    const user = res.locals.user
    const blogId = req.params.id
    await Blog.deleteOne({_id: blogId})
    res.json({user})
}

