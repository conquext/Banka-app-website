import jwt from 'jsonwebtoken';
import * as config from '../config';
import { users } from '../db/db';


export default class AuthMiddleware {
  // static generateToken(user) {
  //   const jwtToken = jwt.sign({ user }, secret, { expiresIn: 86400 });
  //   return jwtToken;
  // }

  static errorResponse(res, statusCode, error) {
    return res.status(statusCode).send({
      success: 'false',
      status: statusCode,
      error: error[0],
    });
  }

  static successResponse(res, statusCode, success) {
    return res.status(statusCode).send({
      success: 'true',
      status: statusCode,
      message: success,
    });
  }

  static validationError(errors) {
    const err = errors.map(error => error.msg);
    return err;
  }

  static authenticateUser(req, res, next) {
    const currentToken = req.headers.authorization;
    if (!currentToken) {
      return res.status(401).json({
        success: 'false',
        error: 'Unathorized. Token not found',
      });
    }

    // let userFound = ''; 
    // users.map((user) => {
    //   if (currentToken === user.token) {
    //     userFound === user; 
    //   }
    // });

    const decoded = jwt.decode(req.headers.authorization, { secret: config.secret });
    if (!decoded) {
      return res.status(401).json({
        success: 'false',
        error: 'Unathorized. Token invalid. Please login',
      });
    }
    req.data = {
      type: decoded.user.type,
      id: decoded.user.id,
    };
    next();
  }
}
