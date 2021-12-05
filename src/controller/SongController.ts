import {Request, Response} from "express";
import {getManager} from "typeorm";
import {Song} from "../entity/Song";
import * as mm from 'music-metadata';
const fs = require('fs');
import * as util from 'util';

interface MulterRequest extends Request {
   file: any;
}
class SongController{
    static SaveAction = async (request: Request, response: Response) => {
        const songRepository = getManager().getRepository(Song);
        const newSong = songRepository.create([request.body]);
        await songRepository.save(newSong);
        response.send(newSong);
    }
    static SaveFileAction = async (request: MulterRequest, response: Response) => {
        const id = request.params.id;
        const songRepository = getManager().getRepository(Song);
        let song: Song;
        const file = request.file
        const {common} = await mm.parseFile(file.path);
        const cover = mm.selectCover(common.picture);
        console.log("cover",cover)
        if (!file) {
            response.status(400).send({"error": 'Please upload a file'});
            response.end();
            return;
        }
        try {
            song = await songRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
          fs.writeFile(`./songs/image${id}.jpg`, cover.data, function(err) {
              console.log(err) 
            });
          song.filePath = `http://localhost:3000/song${id}.mp3`;
          song.photo = `http://localhost:3000/image${id}.jpg`;
          songRepository.save(song);
          response.status(204).send();
    }
    static DeleteAction = async (request: Request, response: Response) => {
        const id = request.params.id;
        const songRepository = getManager().getRepository(Song);
        let song: Song;
        try {
            song = await songRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
          songRepository.delete(id);
          response.status(204).send();
    }
    
    static GetAllAction = async (request: Request, response: Response) => {
        const songRepository = getManager().getRepository(Song);
        const songs = await songRepository.find();
        response.send(songs);
    }
    
    static GetByIdAction = async (request: Request, response: Response) => {
        const songRepository = getManager().getRepository(Song);
        const song = await songRepository.findOne(request.params.id);
        if (!song) {
            response.status(404).send({"error": "Song not found"});
            response.end();
            return;
        }
        response.send(song);
    }
    static GetFileByIdAction = async (request: Request, response: Response) => {
        const id = request.params.id;
        const songRepository = getManager().getRepository(Song);
        let song: Song;
        try {
            song = await songRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
        if(song.filePath){
            response.sendFile(song.filePath, {root: './'});
        } else {
            response.status(404).send(undefined)
        }
    }
    static GetImageByIdAction = async (request: Request, response: Response) => {
        const id = request.params.id;
        const songRepository = getManager().getRepository(Song);
        let song: Song;
        try {
            song = await songRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
        if(song.photo){
            console.log("song photo",song.photo)
            response.sendFile(song.photo , { root: 'songs' });
        } else {
            response.status(404).send(undefined)
        }
    }
}

export default SongController;