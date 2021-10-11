// Import requirements
const ImageKeyData = require("../models/imageKeyData")
const fs = require("fs")
const util = require("util")
const { uploadFile, getFileStream, deleteFile } = require("../s3")

// Prepare so images may leave the file system
const unlinkFile = util.promisify(fs.unlink);

// Handle routes

module.exports.image_get = async (req, res, next) => {
        const key = req.params.key
        checkImageExists = await ImageKeyData.findOne({key})
        if (checkImageExists) {
            readStream = getFileStream(key)
            readStream.pipe(res)
        } else {
            // No image was found; pass to 404 page
            next()
        }
}

module.exports.image_post = async (req, res) => {
    const author_id = res.locals.user._id
    const files = req.files
    for (let i=0; i<files.length; i++) {
        let file = files[i]
        const result = await uploadFile(file)
        
        // Remove from file system
        await unlinkFile(file.path)

        /* Remember how to access image (via key) 
        and associate access to user uploading the image */
        const imageKeyData = new ImageKeyData({author_id, name: file.originalname, key: result.Key});
        imageKeyData.save()
        .then(result => res.redirect(`/profile/images/${author_id}`))
        .catch(err => console.log(err))
    }
}

module.exports.image_delete = async (req, res) => {
    const user = res.locals.user
    const author_id = user._id
    const key = req.params.key
    await deleteFile(key)
    await ImageKeyData.deleteOne({key, author_id})
    res.json({user})   
}