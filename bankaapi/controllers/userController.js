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
      const user = UserHelper.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: 'false',
          error: 'Incorrect email',
        });
      }
      if (user.password !== password) {
        return res.status(401).json({
          success: 'false',
          error: 'Wrong password',
        });
      }

      const jwtToken = jwt.sign({ user }, config.secret, { expiresIn: 86400 });

      const data = {
        id: user.id,
        email: user.email,
        type: user.type,
        token: jwtToken,
      };

      return res.status(200).json({
        success: 'true',
        message: 'login successful',
        token: jwtToken,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // register a new user
  static signup(req, res) {
    try {
      const {
        name, email, password, confirmPassword,
      } = req.body;
      const registeredUser = users.some(user => user.email == email);
      if (registeredUser) {
        return res.status(409).json({
          success: 'false',
          error: 'User already exists',
        });
      }
      if (password !== confirmPassword) {
        return res.status(422).json({
          success: 'false',
          error: 'Passwords must match',
        });
      }
      if (!registeredUser) {
        const newId = users[users.length - 1].id + 1;
        const newUser = new User({
          id: newId, name, email, password,
        });

        users.push(newUser);

        const jwtToken = jwt.sign({ user: newUser }, config.secret, { expiresIn: 86400 });

        const data = {
          id: newId,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
          token: jwtToken,
        };

        return res.status(201).json({
          success: 'true',
          message: 'User is registered successfully',
          token: `Bearer ${jwtToken}`,
          user: data,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get all users
  static getAllUsers(req, res) {
    try {
      if (users) {
        return res.status(201).json({
          success: 'true',
          message: 'Users retrieved successfully',
          users,
        });
      }
      return res.status(404).json({
        success: 'false',
        error: 'No user found',
      });
    } catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.',
      });
    }
  }

  // get a specific user
  static getUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const result = '';
      const user = UserHelper.findUserById(id);
      if (user) {
        return res.status(200).json({
          success: 'true',
          message: 'User retrieved successfully ',
          user,
        });
      }

      return res.status(404).json({
        success: 'false',
        message: 'Not found',
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // update a user profile
  static updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const email = req.query.email || '';
      const user = UserHelper.findUserById(id) || UserHelper.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: 'false',
          message: 'User not found',
        });
      }
      for (const [key, value] of Object.entries(req.body)) {
        user[key] = value;
      }
      return res.status(200).json({
        success: 'true',
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // promote a specific user or staff
  static promoteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const email = req.query.email || '';
      const user = UserHelper.findUserById(id) || UserHelper.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: 'false',
          message: 'User not found',
        });
      }

      const type  = req.body.type || req.query.type || userFound.type || 'user';
      user.type = type;
      if (type && type === 'admin') {
        user.isAdmin = true;
      }
      return res.status(200).json({
        success: 'true',
        message: 'User promoted successfuly',
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }

  // delete a user
  static deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const email = req.body.email || '';
      let userFound = null;
      let userIndex = '';
      users.map((user, index) => {
        if (user.id === id || user.email === email) {
          userFound = user;
          userIndex = index;
        }
      });
      if (!userFound) {
        return res.status(404).json({
          success: 'false',
          message: 'User not found',
        });
      }
      users.splice(userIndex, 1);
      return res.status(200).json({
        success: 'true',
        message: 'User deleted successfuly',
        DeletedUser: userFound
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong',
      });
    }
  }
}
