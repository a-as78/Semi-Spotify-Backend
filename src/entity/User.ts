import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, Unique} from "typeorm";
import {Playlist} from "./Playlist";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
@Unique(["phoneNumber"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    @IsNotEmpty()
    @Length(11, 11)
    phoneNumber: string;

    @Column()
    @Length(4, 100)
    password: string;

    @Column()
    photo?: string = null;

    @ManyToMany(() => Playlist, playlist => playlist.users)
    @JoinTable()
    playlists: Playlist[];
}