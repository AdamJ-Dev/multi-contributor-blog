// Import requirements
const jwt = require("jsonwebtoken")
const User = require("../models/user.js")
const dotenv = require("dotenv")

dotenv.config()

// Middleware to add for auth-requiring pages
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    // Check token exists & is valid
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                // Token invalid
                console.log(err.message)
                res.redirect("/login")
            } else {
                next();
            }
        })
    } else {
        // Token does not exist
        res.redirect("/login")
    }
}

// Middleware to investigate the current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        // Check token is valid
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                // Token invalid
                console.log(err.message)
                res.locals.user = null;
                next();
            } else {
                // Save user information 
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}


module.exports = { requireAuth, checkUser }