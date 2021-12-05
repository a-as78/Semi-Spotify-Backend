import song from "./controller/SongController";
import playlist from "./controller/PlaylistController";
import auth from "./controller/AuthController";
import user from "./controller/UserController";
import { checkJwt } from './middlewares/checkJwt';
import { saveSong } from './middlewares/saveSong';
import { saveUserImage } from './middlewares/saveUserImage';
import { savePlaylistImage } from './middlewares/savePlaylistImage';
import {Request , Response, NextFunction} from "express";

const noMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next()
} 


export const AppRoutes = [
    {
        path: "/login",
        method: "post",
        action: auth.login,
        middlewares: noMiddleware
    },
    {
        path: "/",
        method: "patch",
        action: auth.changePassword,
        middlewares: checkJwt
    },
    {
        path: "/users",
        method: "get",
        action: user.listAll,
        middlewares: checkJwt
    },
    {
        path: "/users/:id",
        method: "get",
        action: user.getOneById,
        middlewares: checkJwt
    },
    {
        path: "/user/",
        method: "get",
        action: user.getUserByToken,
        middlewares: checkJwt
    },
    {
        path: "/signup",
        method: "post",
        action: user.newUser,
        middlewares: noMiddleware
    },
    {
        path: "/users/:id",
        method: "delete",
        action: user.deleteUser,
        middlewares: noMiddleware
    },
    {
        path: "/users/image/:id",
        method: "get",
        action: user.GetFileByIdAction,
        middlewares: checkJwt
    },
    {
        path: "/users/:id",
        method: "patch",
        action: user.SaveImageAction,
        middlewares: [checkJwt, saveUserImage]
    },
    {
        path: "/songs",
        method: "post",
        action: song.SaveAction,
        middlewares: checkJwt
    },
    {
        path: "/songs/:id",
        method: "patch",
        action: song.SaveFileAction,
        middlewares: [saveSong, checkJwt]
    },
    {
        path: "/songs/file/:id",
        method: "get",
        action: song.GetFileByIdAction,
        // middlewares: checkJwt
        middlewares: noMiddleware
    },
    {
        path: "/songs/image/:id",
        method: "get",
        action: song.GetImageByIdAction,
        middlewares: checkJwt
    },
    {
        path: "/songs/:id",
        method: "delete",
        action: song.DeleteAction,
        middlewares: checkJwt
    },
    {
        path: "/songs/:id",
        method: "get",
        action: song.GetByIdAction,
        middlewares: noMiddleware
    },
    {
        path: "/songs",
        method: "get",
        action: song.GetAllAction,
        middlewares: noMiddleware
    },
    {
        path: "/playlists",
        method: "post",
        action: playlist.SaveAction,
        middlewares: checkJwt
    },
    {
        path: "/playlists/:id",
        method: "patch",
        action: playlist.SaveImageAction,
        middlewares: [checkJwt , savePlaylistImage]
    },
    {
        path: "/playlists/:id",
        method: "delete",
        action: playlist.DeleteAction,
        middlewares: checkJwt
    },
    {
        path: "/playlists/:id",
        method: "get",
        action: playlist.GetByIdAction,
        middlewares: noMiddleware
    },
    {
        path: "/playlists",
        method: "get",
        action: playlist.GetAllAction,
        middlewares: noMiddleware
    },
    {
        path: "/playlists/:id",
        method: "put",
        action: playlist.editPlaylist,
        middlewares: checkJwt
    },
    {
        path: "/playlists/:playlistId",
        method: "patch",
        action: playlist.addOrRemoveSongByID,
        middlewares: checkJwt
    },
    {
        path: "/playlists/image/:id",
        method: "get",
        action: playlist.GetFileByIdAction,
        middlewares: checkJwt
    }
]
