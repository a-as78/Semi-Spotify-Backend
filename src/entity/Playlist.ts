import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import {Song} from "./Song";
import {User} from "./User";

@Entity()
export class Playlist {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column()
    description?: string = null;

    @Column()
    photo?: string = null;

    @Column()
    publishDate?: number = null;

    @Column()
    count_song?: number = 0;

    @ManyToMany(() => User, user => user.playlists,{
        cascade: true
    })
    users: User[]

    @ManyToMany(() => Song, song => song.playlists)
    @JoinTable()
    songs: Song[]
}