// Import requirements
const Blog = require("../models/blog");
const { getDate } = require("../getDate")


// Handle routes

module.exports.home_get = (req, res) => {
    res.redirect("/page/1")
}

module.exports.page_get = async (req, res, next) => {
    const user = res.locals.user
    let allBlogs = Array.from(await Blog.find()) 
    allBlogs.reverse()
    const numBlogs = allBlogs.length
    const pageNumber = parseInt(req.params.N)
    const startIndex = 5*(pageNumber - 1)
    if (pageNumber && (pageNumber > 0) && ((startIndex === 0) || (numBlogs >= (startIndex + 1)))) { 
        /*  a valid number was supplied; and the page
            has to be non-empty unless its the first
        */
        const endIndex = 5*(pageNumber)
        const visibleBlogs = allBlogs.slice(startIndex, endIndex)
        let navigationStatus;
        if (startIndex === 0 && (numBlogs <= endIndex)) {
            navigationStatus = "lone"
        }  else if (startIndex === 0) {
            navigationStatus = "first"
        } else if (numBlogs <= endIndex) {
            navigationStatus = "last"
        } else {
            navigationStatus = "middling"
        }
        res.render("basic/index", {title: "Home", blogs: visibleBlogs, navigationStatus, pageNumber, getDate, user})       
    } else {
        // Send to 404 page
        next()
    }
}

module.exports.about_get = (req, res) => {
    const user = res.locals.user
    res.render("basic/about", {title: "About", user})
}

module.exports.fourOfour_get = (req, res) => {
    res.render("basic/404", {title: "Page not found"})
}