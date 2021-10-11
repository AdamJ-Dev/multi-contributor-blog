// Import requirements
const { Router } = require("express")
const authController = require("../controllers/authController")

// Create router object
const authRouter = Router()

// Routes
authRouter.get("/signup", authController.signup_get)

authRouter.post("/signup", authController.signup_post)

authRouter.get("/login", authController.login_get)

authRouter.post("/login", authController.login_post)

authRouter.get("/logout", authController.logout_get)

// Export
module.exports = authRouter