import * as express from "express";
const multer = require("multer")

const app = express()
// app.use(bodyParser.urlencoded({extended: true}))

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'songs/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname +req.params.id+'.png')
  }
})

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb){
        if(file.originalname.endsWith('.png')){
            cb(null, true)
        } else {
            cb(new Error('File format does not match'))
        }
    }
})

export const saveSongImage =  upload.single('image')