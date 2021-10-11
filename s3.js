// Import requirements
const S3 = require("aws-sdk/clients/s3")
const fs = require("fs")
const dotenv = require("dotenv")


// Identify and authenticate bucket
dotenv.config()
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// Create s3 object
const s3 = new S3({
    region, 
    accessKeyId,
    secretAccessKey
})

// Call to upload images to the bucket
function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName, 
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}

exports.uploadFile = uploadFile

// Call to retrieve images from the bucket
function getFileStream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

exports.getFileStream = getFileStream

// Call to delete images from the bucket
function deleteFile(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams, function(err, data) {
    if (err) console.log(err, err.stack);  
    else console.log("Deleted image");                
  });
}

exports.deleteFile = deleteFile