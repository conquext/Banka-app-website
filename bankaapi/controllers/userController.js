import { db } from '../db/db';
import User from '../models/user'
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

const secret = process.env.JWT_SECRET;

const { users } = db;

class UserController {
  //Login a user
  static login(req, res){
    try{
      const { email, password } = req.body;
      const registeredUser = () => {
        for(let i = 0; i < users.length; i++){
          if(users[i].email == email){
            return users[i];
          }
          return false;
        }
      }
      if (!registeredUser) {
        return res.status(401).json({
            success: 'false',
            error: 'Incorrect email',
        });
      }
      if (registeredUser.password != password) {
        return res.status(401).json({
          success: 'false',
          error: 'Wrong password',
        });
      }
      
      const jwtToken = jwt.sign({ user: registeredUser }, secret, { expiresIn: 86400 });

      const data = {
        id: registeredUser.id,
        email: registeredUser.email,
        type: registeredUser.type,
        token: jwtToken
      };
      
      return res.status(200).json({
        success: 'true',
        message: "login successful",
        token: jwtToken,
        data: data
      });
    }
    catch (error) { 
      return res.status(500).json({
      success: 'false',
      message: 'Something went wrong',
      token: `Bearer ${jwtToken}`
      });
    }
  }

 //register a new user
  static signup(req, res){
    try{
      const { name, email, password, confirm_password } = req.body;
      const registeredUser = users.some(user => user.email == email);
      if (registeredUser) {
        return res.status(409).json({
          success: 'false',
          error: 'User already exists'
        });
      }
      if (password !== confirm_password){
        return res.status(422).json({
          success: 'false',
          error: 'Passwords must match'
        })
      }
      if (!registeredUser) {
        const newId = users[users.length - 1].id + 1;
        const newUser = new User(newId, name, email, password);

        users.push(newUser);

        const jwtToken = jwt.sign({ user: newUser }, secret, { expiresIn: 86400 });

        const data = {
          id: newId,
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
          token: jwtToken
        };

        return res.status(201).json({
          success: 'true',
          message: 'User is registered successfully',
          token: `Bearer ${jwtToken}`,
          user: data
        });
      }
    }
    catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.'
      });
    };
  }
  //get all users
  static getAllUsers(req, res){
    try{
      if (users) {
          return res.status(201).json({
              success: 'true',
              message: 'Users retrieved successfully',
              Users: [...users]
              });
        }
        return res.status(404).json({
            success: 'false',
            error: 'No user found',
            });    
    }
    catch (error) {
      res.status(500).json({
        success: 'false',
        error: 'Something went wrong. Try again.'
      });
    }
  }
  //get a specific user
  static getUser(req, res) {
    try{
        const id = parseInt(req.params.id);
        let result = '';
        for(var i = 0; i < users.length; i++){
            if (id === user[i].id) {
                result = user[i];
                return res.status(201).json({
                  success: 'true',
                  message: 'User retrieved successfully ',
                  User: result
                });
            }
            else {
                return res.status(404).json({
                  success: 'false',
                  message: 'Not found',
                });
            }
        }
    }
    catch (error) {
      return res.status(500).json({
        success: 'false',
        message: 'Something went wrong'
      });
    }
  }
  //update a user profile
  static updateUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const {email} = req.body || '';
      let userFound = '';
      users.map((user) => {
          if (user.id === id || user.email === email) {
              userFound = user;
          }
      });
      if (!userFound) {
          return res.status(404).json({
            success: 'false',
            message: 'User not found'
          });
      }
      for (const [key, value] of Object.keys(req.body)) {
        userFound.key = value;
      }
      return res.status(200).json({
          success: 'true',
          message: 'User updated successfully',
          user: userFound
      });
    }
    catch (error) {
      return res.status(500).json({
          success: 'false',
          message: 'Something went wrong'
      });
    }
  }
  //promote a specific user or staff
  static promoteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const {email} = req.body || '';
      let userFound;
      let userIndex;
      users.map((user, index) => {
          if (user.id === id || account.email === email) {
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
      
      const {type} = req.body;
      userFound.type = type;
      if(type === 'admin'){
        userFound.isAdmin = true;
      }
      return res.status(200).json({
          success: 'true',
          message: 'User promoted successfuly',
          user: userFound
      });
    }
    catch (error) {
      return res.status(500).json({
          success: 'false',
          message: 'Something went wrong'
      });
    }
  }
  //delete a user
  static deleteUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const {email} = req.body || '';
      let userFound;
      let userIndex;
      users.map((user, index) => {
          if (user.id === id || account.email === email) {
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
      });
    }
    catch (error) {
      return res.status(500).json({
          success: 'false',
          message: 'Something went wrong'
      });
    }
  }

}


userController = new UserController;
export default userController;