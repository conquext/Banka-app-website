import UserHelper from '../helpers/userHelper';


export default class PermissionsMiddleware {
  static authUser(req, res, next) {
    if (req.data.type !== 'user') {
      return res.status(403).json({
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authCashier(req, res, next) {
    if (req.data.type !== 'cashier') {
      return res.status(403).json({
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authAdmin(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authStaff(req, res, next) {
    if (req.data.type !== 'admin') {
      if (req.data.type !== ('cashier')){
        return res.status(403).json({
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }      
    next();
  }

  static authStaffOrItsAccountOwner(req, res, next) {
    const { type, userId} = req.data;
    let {accountNumber} = req.query;

    if ( type !== 'admin') {
      if (type !== ('cashier')) {
        if (req.query.accountNumber) {
          const userFound = UserHelper.findUserByAccountNumber(accountNumber);
          if(parseInt(userId, 10) !== parseInt(userFound.userId, 10)){
            return res.status(403).json({
              success: 'false',
              error: 'Unauthorized',
            });
        }
      }
      if(!req.query.accountNumber){
        return res.status(403).json({
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
  }
  next();
}

  static authAdminOrItsUser(req, res, next) {
    if (req.data.type !== 'admin') {
      if (parseInt(req.data.userId) !== parseInt(req.params.userId)) {
        return res.status(403).json({
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  static authAdminOrItsAccountOwner(req, res, next) {
    const { type, userId} = req.data;
    let {accountNumber} = req.query;
    
    if(!req.query.accountNumber){
      accountNumber = UserHelper.findUserById(userId).accountNumber;
    }

    if (type !== 'admin') {
      if (parseInt(userId, 10) !== parseInt(req.query.userId, 10)){
        const userFound = UserHelper.findUserByAccountNumber(accountNumber);
          if(parseInt(userId, 10) !== parseInt(userFound.userId, 10)){
            return res.status(403).json({
              success: 'false',
              error: 'Unauthorized',
            });
          }
        }
    }
    next();
  }
}
