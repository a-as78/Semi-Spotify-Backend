import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import * as jwt from "jsonwebtoken";

import  { User }  from "../entity/User";
import validatePhoneNumber from "../utils/validatePhoneNumber";
import { hashPassword } from "../utils/password";

interface MulterRequest extends Request {
  file: any;
}

class UserController{
  static listAll = async (req: Request, res: Response) => {
    const userRepository = getRepository(User);
    const users = await userRepository.find({
      select: ["id", "phoneNumber"]
    });
    res.send(users);
  };
  
  static getOneById = async (req: Request, res: Response) => {
    const id = req.params.id;
    console.log(id)
    const userRepository = getRepository(User);
    try {
      const user = await userRepository.findOneOrFail(id, {
        select: ["id", "phoneNumber"]
      });
      res.send(user);
    } catch (error) {
      res.status(404).send({"error": error.message});
    }
  };

  static getUserByToken = async (req: Request, res: Response) => {
    const token = <string>req.headers["authorization"];
    console.log("token" , token)
    let jwtPayload;
    try {
      jwtPayload = <any>jwt.verify(token, process.env.JWT_SECRET);
      const id = jwtPayload.userId;
      const userRepository = getRepository(User);
      try {
        const user = await userRepository.findOneOrFail(id, {
          select: ["email", "firstName", 'id', "lastName", "phoneNumber", "photo"]
        });
        res.send(user);
      } catch (error) {
        res.status(404).send({"error": error.message});
      }
    } catch (error) {
      res.status(401).send({"error": error.message});
      return;
    }
  };

  static newUser = async (req: Request, res: Response) => {
    let { phoneNumber, password } = req.body;
    // let newUser = new User();

    try{
      validatePhoneNumber(phoneNumber)
    } catch (error) {
      res.status(400).send({ "error": error.message })
    }
    req.body.password = hashPassword(password);
    const userRepository = getRepository(User);
    const newUser = userRepository.create([req.body])
    const errors = await validate(newUser);
    console.log(errors)
    if (errors.length > 0) {
      console.log("validation error")
      res.status(400).send(errors);
      return;
    }
    try {
      await userRepository.save(newUser);
    } catch (error) {
      console.log("saving error")
      res.status(409).send({"error": error.message});
      return;
    }
    res.status(201).send({user : newUser});
  };

  static deleteUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (error) {
      res.status(404).send({"error": error.message});
      return;
    }
    userRepository.delete(id);
    res.status(204).send();
  };

    static SaveImageAction = async (request: MulterRequest, response: Response) => {
    const id = request.params.id;
    const userRepository = getRepository(User);
    let user: User;
    const file = request.file
    if (!file) {
        response.status(400).send({"error": 'Please upload a file'});
        response.end();
        return;
    }
    try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        response.status(404).send({"error":error.message});
        return;
      }
      user.photo = file.path;
      userRepository.save(user);
      response.status(204).send();
  }
  
  static GetFileByIdAction = async(request: Request, response: Response) => {
    const id = request.params.id;
    const userRepository = getRepository(User);
    let user: User;
    try {
        user = await userRepository.findOneOrFail(id);
        response.sendFile(user.photo);
      } catch (error) {
        response.status(404).send({"error":error.message});
        return;
      }
    if(user.photo){
        response.sendFile(user.photo);
    } else {
        response.status(404).send(undefined)
    }  }
};

export default UserController;