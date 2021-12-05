import { Song } from './../entity/Song';
import { Playlist } from '../entity/Playlist';
import {Request, Response} from "express";
import {getManager} from "typeorm";
import { validate } from "class-validator";

interface MulterRequest extends Request {
    file: any;
 }

class PlaylistController{
    static SaveAction = async (request: Request, response: Response) => {
        const playlistRepository = getManager().getRepository(Playlist);
        const songRepository = getManager().getRepository(Song)
        let songs = []
        let song: Song
        request.body.count_song = 0;
        await PlaylistController.addSongs(request, songRepository, song, songs);
        request.body.songs = songs
        const newPlaylist = playlistRepository.create(request.body);
        try{
            await playlistRepository.save(newPlaylist);
        }catch(error){
            response.status(409).send({"error": error.message})
        }
        response.send(newPlaylist);
    }
    
    static addSongs = async ({body}, songRepository, song, songs) => {
        if(body.songs){
            for(let id of body.songs){
                song = await songRepository.findOne(id)
                songs.push(song)
                body.count_song++;
            }
        }
    }
    
    static DeleteAction = async (request: Request, response: Response) => {
        const id = request.params.id;
        const playlistRepository = getManager().getRepository(Playlist);
        let playlist: Playlist;
        try {
            playlist = await playlistRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":"User not found"});
            return;
          }
          playlistRepository.delete(id);
          response.status(204).send();
    }
    
    static GetAllAction = async (request: Request, response: Response) => {
        const playlistRepository = getManager().getRepository(Playlist);
        const playlists = await playlistRepository.find();
        console.log(playlists)
        response.send(playlists);
    }
    
    static GetByIdAction = async (request: Request, response: Response) => {
        const playlistRepository = getManager().getRepository(Playlist);
        const playlist = await playlistRepository.findOne(request.params.id , {relations: ['songs']});
        if (!playlist) {
            response.status(404).send({"error":"playlist not found"});
            response.end();
            return;
        }
        response.send(playlist);
    }
    
    static editPlaylist = async (req: Request, res: Response) => {
        const id = req.params.id;
        const playlistRepository = getManager().getRepository(Playlist);
        let playlist;
        try {
            playlist = await playlistRepository.findOne(id,{relations: ['songs']});
        } catch (error) {
          res.status(404).send({"error": error.message});
          return;
        }
        if (!playlist) {
            res.status(404).send({"error": "Playlist not found"});
            res.end();
            return;
        }
        const { name, description, duration, photo, count_song } = req.body;
        await playlistRepository.save(playlist);
        playlist.name = name
        playlist.description = description
        playlist.duration = duration
        playlist.photo = photo
        playlist.count_song = count_song
        const errors = await validate(playlist);
        if (errors.length > 0) {
          res.status(400).send(errors);
          return;
        }
        try {
          await playlistRepository.save(playlist);
        } catch (error) {
          res.status(409).send({"error": error.message});
          return;
        }
        res.send(playlist);
    };
    
    static addOrRemoveSongByID = async (request: Request, response: Response) => {
        const playlistRepository = getManager().getRepository(Playlist);
        const songRepository = getManager().getRepository(Song);
        let playlist = await playlistRepository.findOne(request.params.playlistId,{relations: ['songs']} );
        if(request.body.songs.connect){
            const song = await songRepository.findOne(request.body.songs.connect.id);
            if (!playlist || !song) {
                response.status(404).send({"error": "invalid song or playlist"});
                response.end();
                return;
            }
            playlist.songs.push(song);
            playlist.count_song++;
        } else if(request.body.songs.disconnect){
            const song = await songRepository.findOne(request.body.songs.disconnect.id);
            if (!playlist || !song) {
                response.status(404).send({"error": "invalid song or playlist"});
                response.end();
                return;
            }
            let index = -1;
            for(var i = 0, len = playlist.songs.length; i < len; i++) {
                if (playlist.songs[i].id === song.id) {
                    index = i;
                    break;
                }
            }
            if(index>=0){
                playlist.songs.splice(index,1)
                playlist.count_song--;
            }
        } else {
            response.status(400).send({"error": "Invalid Request"})
        }
        await playlistRepository.save(playlist);
        response.send(playlist);
    }
    static SaveImageAction = async (request: MulterRequest, response: Response) => {
        const id = request.params.id;
        const playlistRepository = getManager().getRepository(Playlist);
        let playlist: Playlist;
        const file = request.file
        if (!file) {
            response.status(400).send({"error": 'Please upload a file'});
            response.end();
            return;
        }
        try {
            playlist = await playlistRepository.findOneOrFail(id);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
          playlist.photo = file.path;
          playlistRepository.save(playlist);
          response.status(204).send();
    }
    
    static GetFileByIdAction = async (request: Request, response: Response) => {
        const id = request.params.id;
        const playlistRepository = getManager().getRepository(Playlist);
        let playlist: Playlist;
        try {
            playlist = await playlistRepository.findOneOrFail(id);
            response.sendFile(playlist.photo);
          } catch (error) {
            response.status(404).send({"error":error.message});
            return;
          }
        if(playlist.photo){
            response.sendFile(playlist.photo);
        } else {
            response.status(404).send(undefined)
        }
    }
}

export default PlaylistController;

