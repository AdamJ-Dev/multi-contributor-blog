//Import requirements
const { Router } = require("express")
const draftController = require("../controllers/draftController")
const { requireAuth, checkUser } = require("../middleware/authMiddleware")
const multer = require("multer");

// Create router object
const draftRouter = Router()

// Ready the upload middleware
const upload = multer();

// Routes
draftRouter.get("/createblog/:id", requireAuth, draftController.draft_get)

draftRouter.post("/createblog/:id", requireAuth, checkUser, upload.array(), draftController.draft_post)

draftRouter.delete("/drafts/:id", requireAuth, checkUser, draftController.draft_delete)

// Export
module.exports = draftRouter