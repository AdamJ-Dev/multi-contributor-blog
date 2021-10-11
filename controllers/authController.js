// Import requirements
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv');

// Get passcode needed to sign up
dotenv.config()
const signUpPasscode = process.env.SIGNUP_PASSCODE;

// Handle errors

// - Handle sign-up errors

const checkPasscodeError = (passcode) => {
    if (passcode == signUpPasscode) {
        return ""
    } else {
        return passcode ? "Incorrect passcode.": "You did not supply a passcode."
    }
}

const checkMatchingPasswordError = (password, confirmPassword) => {
    if (password === confirmPassword) {
        return ""
    } else {
        return "These passwords do not match."
    }
}

const checkDefaultUser = async (email) => {
    /* Note: Validation errors for the author name (e.g. the name includes numbers) will obscure whether
    there *would be* a duplicate error produced by a valid email the user has provided in the same submit. 
    We want to show *all* the errors the user is making when attempting to sign up. So to get around this
    problem we create a temporary 'default valid user', together with the provided email, to check that
    email for duplication. */
    try {
        const user = await User.create({email, author: "Jane Doe", password: "password"})
        await User.findByIdAndDelete(user._id)
        return ""
    } catch(err) {
        return "This email is already registered."
    }
}


const handleSignUpErrors = async (err, email) => {
    let errorInfo = {email: "", author: "", password: "", confirmPassword: "", passcode: ""}

    // Duplicate error
    errorInfo["email"] = await checkDefaultUser(email)

    // Validation errors
    if (err.message.includes("User validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
                errorInfo[properties.path] = properties.message 
            }
        )
    }

    return {errors: errorInfo}
}

// - Handle log-in errors 

const handleLoginErrors = err => {
    let errorInfo = { email: "", password: ""}

    // Cases built from the statics.login method
    switch (err.message) {
        case "no email nor password":
            errorInfo["email"] = "Please supply an email."
            errorInfo["password"] = "And a password."
            break;
        case "no password":
            errorInfo["password"] = "Please supply a password."
            break;
        case "unregistered and no password":
            errorInfo["email"] = "This email is not registered with us."
            errorInfo["password"] = "And you did not supply a password."
            break;
        case "not an email and no password":
            errorInfo["email"] = "Please enter a valid email."
            errorInfo["password"] = "And supply a password."
            break;
        case "no email":
            errorInfo["email"] = "Please supply an email."     
            break;
        case "wrong password":
            errorInfo["password"] = "Password incorrect."
            break;
        case "unregistered":
            errorInfo["email"] = "This email is not registered with us."
            break;
        case "not an email":
            errorInfo["email"] = "Please enter a valid email."
            break;
    }

    return {errors: errorInfo}
}

// Create jwt token
const maxAge=24*60*60 // 1 day
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    })
}


// Handle routes

module.exports.signup_get = (req, res) => {
    user = res.locals.user
    if (user) {
        res.redirect("/")
    } else {
        res.render("auth/signup", {title: "Sign up", user})
    }
}

module.exports.signup_post = async (req, res) => {
    const { email, newAuthor, password, confirmPassword, passcode } = req.body
    const passcodeError = checkPasscodeError(passcode)
    const passwordError = checkMatchingPasswordError(password, confirmPassword)
    if (passcodeError || passwordError) {
        /* Check whether we would produce any errors
         from creating the user anyway */
        try {
            const user = await User.create({ email, author: newAuthor, password })
            /* If we reach this point no errors were thrown 
            so... */
            res.json({errors: {
                email: "",
                author: "",
                password: passwordError,
                confirmPassword: passwordError,
                passcode: passcodeError
            }})
        } catch (err) {
            // Get a report on the error
            const signUpErrors = await handleSignUpErrors(err, email)
            if (!signUpErrors.errors["password"]) {
                /* Only show the matching error if the password
                 was valid in the first place. */
                signUpErrors.errors["password"] = passwordError
                signUpErrors.errors["confirmPassword"] = passwordError
            }  
            signUpErrors.errors["passcode"] = passcodeError
            res.json(signUpErrors)
        }
    } else {
        // Now only errors building the user may stop us
        try {
            const user = await User.create({email, author: newAuthor, password })
            const token = createToken(user._id);
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge*1000})
            res.json({user})
        } catch (err) {
            const signUpErrors = await handleSignUpErrors(err, email)
            res.json(signUpErrors)
        }
    }
}

module.exports.login_get = (req, res) => {
    user = res.locals.user
    if (user) {
        res.redirect("/")
    } else {
        res.render("auth/login", {title: "Log in", user})
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body
    // Check the login is valid
    try {
        const user = await User.login(email, password)
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge*1000})
        res.json({user})
    } catch(err) {
        res.json(handleLoginErrors(err))
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/")
}