// Import requirements
const { Router } = require("express")
const profileController = require("../controllers/profileController")
const { requireAuth } = require("../middleware/authMiddleware")

// Create router object
const profileRouter = Router()

// Routes
profileRouter.get("/profile/:id", profileController.profile_get)

profileRouter.get("/profile/blogs/:id", requireAuth, profileController.profileblogs_get)

profileRouter.get("/profile/images/:id", requireAuth, profileController.profileimages_get)

profileRouter.get("/profile/drafts/:id", requireAuth, profileController.profiledrafts_get)

// Export
module.exports = profileRouter