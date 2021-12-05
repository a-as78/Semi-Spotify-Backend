
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import validatePhoneNumber from '../utils/validatePhoneNumber'
import { checkPassword , hashPassword} from '../utils/password'

import { User } from "../entity/User";

class AuthController {
  static login = async (req: Request, res: Response) => {
    const { phoneNumber, password } = req.body;

    try{
      validatePhoneNumber(phoneNumber)
    } catch (error) {
      res.status(400).send({ "error": error.message })
    }

    if (!(phoneNumber && password)) {
      res.status(400).send({ "error": "you should provide phone number and password" });
    }
    
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { phoneNumber } });
      console.log(user.password)
    } catch (error) {
      res.status(401).send({ "error": "phone number not found" });
    }
    if (!checkPassword(password, user.password)) {
      console.log("here")
      res.status(401).send({ "error": "invalid password" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1000h" }
    );
    res.send({
      user: user,
      token: token
    });
  };

  static changePassword = async (req: Request, res: Response) => {
    const id = res.locals.jwtPayload.userId;
    console.log("id", id)
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send({"error": "both passwords are required"});
    }
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
      console.log("user" , user)
    } catch (error) {
      res.status(401).send({"error" : error.message});
    }
    if (!checkPassword(oldPassword, user.password)) {
      res.status(403).send({"error" : "incorrect password"});
      return;
    }
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    user.password = hashPassword(user.password);
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;