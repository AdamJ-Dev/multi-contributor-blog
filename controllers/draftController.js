// Import requirements
const Draft = require("../models/draft")
const { getDateWithTime } = require("../getDate")

// Handle routes

module.exports.draft_post = async (req, res) => {
    const id = req.params.id
    const { draftName, title, snippet, body } = req.body
    const lastUpdated = getDateWithTime(Date())
    const user = res.locals.user
    const author_id = user._id
    try {        
        const draft = await Draft.findByIdAndUpdate(id, {draftName, title, snippet, body, lastUpdated, author_id}, {new: true, useFindAndModify: false})
        res.json({draft})
    } catch (err) {
        console.log(err)
        res.json({error: "There was an error posting your draft."})
    }
}

module.exports.draft_get = async (req, res, next) => {
    const id = req.params.id
    const user = res.locals.user
    try {
        const draft = await Draft.findById(id)
        if (draft) {
            res.render("blogs/createblog", {title: `Create blog | ${draft.draftName}`, draft, user})
        } else {
            // No draft was found; pass to 404 page
            next() 
        }
    } catch(err) {
        console.log(err)
    }
}

module.exports.draft_delete = async (req, res) => {
    const id = req.params.id
    const user = res.locals.user
    try {
        await Draft.findByIdAndDelete(id)
        res.json({user})
    } catch(err) {
        console.log(err)
    }
}