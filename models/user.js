// Import requirements
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { isEmail } = require("validator")

// Create user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please enter an email."], 
        unique: true, 
        validate: [isEmail, "Please enter a valid email."]
    },
    author: {
        type: String, 
        required: [true, "Please enter a name."]
    },
    password: {
        type: String,
        required: [true, "Please enter a password."], 
        minlength: [8, "Your password should be at least 8 characters."]
    }
})

// Hash passwords with bcrypt
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// Custom validation for author names
userSchema.path("author").validate(function (value) {
    return (value.search(/^[A-Za-z\-'À-ÖØ-öø-ÿ]+( [A-Za-z\-'À-ÖØ-öø-ÿ]+)*$/) !== -1)
  }, "Please write a real name, e.g. 'Jane Doe'.");

// Static method to log user in
userSchema.statics.login = async function(email, password) {
    if (!email && !password) {
        throw Error("no email nor password")
    } else if (!password) {
        if (isEmail(email)) {
            const user = await this.findOne({email})
            if (user) {
                throw Error("no password")
            } else {
                throw Error("unregistered and no password")
            }
        } else {
            throw Error("not an email and no password")
        }
    } else if (!email) {
        throw Error("no email")
    } else {
        if (isEmail(email)) {
            const user = await this.findOne({email})
            if (user) {
                const auth = await bcrypt.compare(password, user.password)
                if (auth) {
                    return user
                } else {
                    throw Error("wrong password")
                }
            } else {
                throw Error("unregistered")
            } 
        } else {
           throw Error("not an email")
        }
    }
        
}

// Create and export user model
const User = mongoose.model("User", userSchema);
module.exports = User;

