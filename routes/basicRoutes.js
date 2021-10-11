// Import requirements
const { Router } = require("express")
const basicController = require("../controllers/basicController")

// Create router object
const basicRouter = Router()

// Routes
basicRouter.get("/", basicController.home_get)

basicRouter.get("/page/:N", basicController.page_get)

basicRouter.get("/about", basicController.about_get)

basicRouter.use("*", basicController.fourOfour_get)

// Export
module.exports = basicRouter