import { checkJwt } from './middlewares/checkJwt';
import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response, NextFunction} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import{ AppRoutes} from "./routes";
import "reflect-metadata";
import * as helmet from "helmet";
import * as cors from "cors";

// app.use(bodyParser.urlencoded({extended: true}))


// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests

interface MulterRequest extends Request {
    file: any;
 }
createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(helmet());

    // register all application routes

    app.use(express.static("songs"))


    AppRoutes.forEach(route => {
        app[route.method](route.path, route.middlewares, (request: MulterRequest, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    })
    // AppRoutes.forEach(route => {
    //     if(route.auth){
    //         app[route.method](route.path, [checkJwt] , (request: Request, response: Response, next: Function) => {
    //             route.action(request, response)
    //                 .then(() => next)
    //                 .catch(err => next(err));
    //         });
    //     } else {
    //         app[route.method](route.path, (request: Request, response: Response, next: Function) => {
    //             route.action(request, response)
    //                 .then(() => next)
    //                 .catch(err => next(err));
    //         });
    //     }
    // });

    // run app
    app.listen(3000);

    console.log("Express application is up and running on port 3000");

}).catch(error => console.log("TypeORM connection error: ", error));
