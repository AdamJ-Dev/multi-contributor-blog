// Import Requirements
const { Router } = require("express")
const imageController = require("../controllers/imageController")
const { requireAuth, checkUser } = require("../middleware/authMiddleware")
const multer = require("multer");

// Create router object
const imageRouter = Router()

// Ready the upload middleware
const uploadImg = multer({ dest: 'uploads/' });

// Routes
imageRouter.get("/images/:key", imageController.image_get)

imageRouter.post("/uploads", requireAuth, checkUser, uploadImg.array("images", 10), imageController.image_post)

imageRouter.delete("/images/:key", requireAuth, checkUser, imageController.image_delete)

// Export
module.exports = imageRouter