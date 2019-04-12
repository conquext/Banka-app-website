import db from '../db';
import { User, Cashier, Admin } from '../models'



const { account } = db;

class userAuth = () => {
  //Login a user
  const createAccount = (req, res) => {
    try{
      const { email, password } = req.body;
      const registeredUser = () => {
        for(let i = 0; i < users.length; i++){
          if(users[i].email == email){
            return users[i];
          }
          return null;
        }
      }
      if (!registeredUser) {
        return res.status(404).json({
                                      status: 404,
                                      error: 'User does not exist',
                                    });
      }
      if (registeredUser.password != password) {
        return res.status(401).json({
          status: 401,
          error: 'Wrong password',
        });
      }
      const data = {
        id: registeredUser.id,
        email: registeredUser.email,
        type: registeredUser.type
      };
      const jwtToken = jwt.sign({ user: data }, secret, { expiresIn: 86400 });
      return res.status(200).json({
        status: 200,
        message: "login successful"
        token: `Bearer ${jwtToken}`,
        data: data
      });
    }
    catch (error) { 
      return res.status(500).json({
      status: 500,
      message: 'Something went wrong'
      });
    }
  }

//register a new user
  const signup = (req, res) => {
    try{
      const { name, email, password } = req.body;
      const registeredUser = users.some(user => user.email == email);
      if (registeredUser) {
        return res.status(409).json({
          status: 409,
          error: 'User already exists'
        });
      }
      if (!registeredUser) {
        const newId = users[users.length - 1].id + 1;
        const newUser = new User(newId, name, email, password, type: 'user')
        users.push(newUser);
        const data = {
          id: '',
          name: newUser.name,
          email: newUser.email,
          type: newUser.type,
        }
        const jwtToken = jwt.sign({ user: data }, secret, { expiresIn: 86400 });
        return res.status(201).json({
          status: 201,
          message: 'User is registered successfully',
          token: `Bearer ${jwtToken}`,
          user: data
        });
      }
    };
    catch (error) {
      res.status(500).json({
        status: 500,
        error: 'Something went wrong. Try again.'
      });
    };
  }
}

export default userAuth;
