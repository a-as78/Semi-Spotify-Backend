import * as express from "express";
import * as bodyParser from "body-parser";
import {Request , Response, NextFunction} from "express";
const multer = require("multer")

const app = express()
app.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'songs/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname +req.params.id+'.mp3')
  }
})

var upload = multer({
    storage: storage,
    fileFilter(req, file, cb){
        if(file.originalname.endsWith('.mp3')){
            cb(null, true)
        } else {
            cb(new Error('File format does not match'))
        }
    }
})

export const saveSong = upload.single('song')