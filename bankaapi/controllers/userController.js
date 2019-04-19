import * as config from '../config';
import User from '../models/user';
import UserHelper from '../helpers/userHelper';
import jwt from 'jsonwebtoken';
import { users } from '../db/db';

export default class UserController {
  // Login a user
  static login(req, res) {
    try {
      const { email, password } = req.body;
      const userFound = UserHelper.findUserByEmail(email);
      if (!userFound) {
        return res.status(401).json({
          status: 401,
          success: 'false',
          error: 'Incorrect email or Wrong password',
        });
      }
      if (UserHelper.comparePassword(password, userFound.password)) {
        return res.status(401).json({
          status: 401,
          success: 'false',
          error: 'Incorrect email or Wrong password',
        });
      }
      const jwtToken = jwt.sign({ userFound }, config.secret, { expiresIn: 86400 });
      userFound.token = jwtToken;
      userFound.lastLoggedInAt = new Date();
      userFound.loggedIn = true;

      const loginData = {
        token: userFound.token,
        id: userFound.userId,
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        email: userFound.email,
        type: userFound.type,
      };

      return res.status(200).json({
        status: 200,
        success: 'true',
        message: 'login successful',
        data: loginData,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // register a new user
  static signup(req, res) {
    try {
      const {
        firstName, lastName, email, password, confirmPassword, type,
      } = req.body;
      const registeredUser = UserHelper.findUserByEmail(email);
      if (registeredUser) {
        return res.status(409).json({
          status: 409,
          success: 'false',
          error: 'User already exists',
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          status: 400,
          success: 'false',
          error: 'Passwords must match',
        });
      }
      if (!registeredUser) {
        const newUserId = users[users.length - 1].userId + 1;
        const newUser = new User({
          userId: newUserId, firstName, lastName, email, type,
        });

        const jwtToken = jwt.sign({ user: newUser }, config.secret, { expiresIn: 86400 });
        newUser.token = jwtToken;
        newUser.password = UserHelper.hashPassword(password);
        newUser.logIn();
        users.push(newUser);

        const signupData = {
          token: newUser.getToken(),
          id: newUserId,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          type: newUser.type,
          isAdmin: newUser.isAdmin(),
        };

        return res.status(201).json({
          success: 'true',
          message: 'User is registered successfully',
          data: signupData,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get all users
  static getAllUsers(req, res) {
    try {
      if (users) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'Users retrieved successfully',
          users,
        });
      }
      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'No user found',
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get a specific user
  static getUser(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const result = '';
      const userFound = UserHelper.findUserById(userId);
      if (userFound) {
        return res.status(200).json({
          status: 200,
          success: 'true',
          message: 'User retrieved successfully ',
          user: userFound,
        });
      }

      return res.status(404).json({
        status: 404,
        success: 'false',
        error: 'Not found',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // update a user profile
  static updateUser(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const email = req.query.email || '';
      const userFound = UserHelper.findUserById(userId) || UserHelper.findUserByEmail(email);
      if (!userFound) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'User not found',
        });
      }
      for (const [key, value] of Object.entries(req.body)) {
        user[key] = value;
      }
      return res.status(200).json({
        status: 200,
        success: 'true',
        message: 'User updated successfully',
        data: userFound,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // promote a specific user or staff
  static promoteUser(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const email = req.query.email || '';
      const user = UserHelper.findUserById(userId) || UserHelper.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'User not found',
        });
      }

      const type  = req.body.type || req.query.type || userFound.type || 'user';
      user.type = type;
      if (type && type === 'admin') {
        user.isAdmin = true;
      }
      return res.status(200).json({
        status: 200,
        success: 'true',
        message: 'User promoted successfuly',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }

  // delete a user
  static deleteUser(req, res) {
    try {
      const userId = parseInt(req.params.userId, 10);
      const email = req.body.email || '';
      let userFound = null;
      let userIndex = '';
      users.map((user, index) => {
        if (user.userId === userId || user.email === email) {
          userFound = user;
          userIndex = index;
        }
      });
      if (!userFound) {
        return res.status(404).json({
          status: 404,
          success: 'false',
          error: 'User not found',
        });
      }
      users.splice(userIndex, 1);
      return res.status(200).json({
        status: 200,
        success: 'true',
        message: 'User deleted successfuly',
        DeletedUser: userFound
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: 'false',
        error: 'Something went wrong',
      });
    }
  }
}
