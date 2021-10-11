// Import requirements
const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const { checkUser } = require("./middleware/authMiddleware")
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const favicon = require("serve-favicon")
const authRouter = require("./routes/authRoutes")
const blogRouter = require("./routes/blogRoutes")
const imageRouter = require("./routes/imageRoutes")
const profileRouter = require("./routes/profileRoutes")
const draftRouter = require("./routes/draftRoutes")
const basicRouter = require("./routes/basicRoutes")

// Create the app
const app = express()

// Initialise MongoDB
dotenv.config();
const dbURI = process.env.MONGO_URI
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => {const server = app.listen(3000);
console.log("We're online boys")})
.catch(err => console.log(err))

// Set view engine
app.set("view engine", "ejs")

// Instruct where to look for assets
app.use(express.static("public"))
app.use(favicon(__dirname + '/public/favicon.ico'));

// Ready some interpretive middleware
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

// Access user information
app.get("*", checkUser)

// Add routers 
app.use(authRouter)
app.use(blogRouter)
app.use(imageRouter)
app.use(profileRouter)
app.use(draftRouter)
app.use(basicRouter)