import * as bcrypt from "bcryptjs";

export function hashPassword(password) {
    return bcrypt.hashSync(password, 8);
}
  
export function checkPassword(password , userPassword) {
    return bcrypt.compareSync(password, userPassword);
}