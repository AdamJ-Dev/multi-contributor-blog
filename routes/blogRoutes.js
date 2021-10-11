//Import requirements
const { Router } = require("express")
const blogController = require("../controllers/blogController")
const { requireAuth, checkUser } = require("../middleware/authMiddleware")
const multer = require("multer");

// Create router object
const blogRouter = Router()

// Ready the upload middleware
const upload = multer();

// Routes
blogRouter.get("/createblog", requireAuth, blogController.createblog_get)

blogRouter.post("/createblog", requireAuth, checkUser, upload.array(), blogController.createblog_post)

blogRouter.get("/blog/:id", blogController.blog_get)

blogRouter.delete("/blog/:id", requireAuth, checkUser, blogController.blog_delete)

// Export
module.exports = blogRouter