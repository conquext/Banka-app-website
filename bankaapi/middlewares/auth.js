import jwt from 'jsonwebtoken';
import { config } from 'dotenv';


config();
const secret = process.env.JWT_SECRET;

class Auth {
   static generateToken(user) {
        const jwtToken = jwt.sign({ user }, secret, { expiresIn: 86400 });
        return jwtToken;
    }

   static errorResponse(res, statusCode, error) {
    return res.status(statusCode).send({
      success: 'false',
      status: statusCode,
      error: error
    });
  }

   static successResponse(res, statusCode, success) {
    return res.status(statusCode).send({
      success: 'true',
      status: statusCode,
      message: succes
    });
  }

  static validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  }
}

const auth = new Auth();
export default auth;