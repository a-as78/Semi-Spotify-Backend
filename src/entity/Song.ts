import { Playlist } from './Playlist';
import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";

@Entity()
export class Song {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    artistName: string;

    @Column()
    albumName?: string = null;

    @Column()
    releaseDate?: number = null;

    @Column()
    filePath?: string = null;

    @Column()
    photo?: string = null;

    @ManyToMany(() => Playlist, playlist => playlist.songs, {
        cascade: true
    })
    playlists: Playlist[];
}