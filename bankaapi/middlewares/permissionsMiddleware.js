import UserHelper from '../helpers/userHelper';

export default class PermissionsMiddleware {
  static authUser(req, res, next) {
    if (req.data.type !== 'user') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authCashier(req, res, next) {
    if (req.data.type !== 'cashier') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authAdmin(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authStaff(req, res, next) {
    if (req.data.type === 'user') {
      return res.status(403).json({
        status: 403,
        success: 'false',
        error: 'Unauthorized',
      });
    }
    next();
  }

  static authStaffOrItsAccountOwner(req, res, next) {
    const { type, userId } = req.data;
    const accountNumber = req.query.accountNumber || req.body.accountNumber;
    const id = req.query.userId || req.body.userId;
    const email = req.query.email || req.body.email;

    if (type === 'user') {
      if (id) {
        const userFound = UserHelper.findUserById(parseInt(id, 10));
        if (parseInt(userId, 10) !== parseInt(userFound.userId, 10)) {
          return res.status(403).json({
            status: 403,
            success: 'false',
            error: 'Unauthorized',
          });
        }
      }
      if (accountNumber) {
        const userFound = UserHelper.findUserByAccountNumber(parseInt(accountNumber, 10));
        //console.log(userFound);
        //console.log(userFound.userId);
        if (parseInt(userId, 10) !== parseInt(userFound.userId, 10)) {
          return res.status(403).json({
            status: 403,
            success: 'false',
            error: 'Unauthorized',
          });
        }
      }
      if (email) {
        const userFound = UserHelper.findUserByEmail(String(email));
        if (parseInt(userId, 10) !== parseInt(userFound.userId, 10)) {
          return res.status(403).json({
            status: 403,
            success: 'false',
            error: 'Unauthorized',
          });
        }
      }
      if (!id && !accountNumber && !email) {
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  static authStaffOrItsUser(req, res, next) {
    const { type, userId } = req.data;
    if (type === 'user') {
      //const userFound = UserHelper.findUserById(parseInt(id, 10));
      if (parseInt(userId, 10) !== parseInt(req.params.userId, 10)) {
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  static authAdminOrItsUser(req, res, next) {
    if (req.data.type !== 'admin') {
      if (parseInt(req.data.userId) !== parseInt(req.params.userId)) {
        return res.status(403).json({
          status: 403,
          success: 'false',
          error: 'Unauthorized',
        });
      }
    }
    next();
  }

  // static authAdminOrItsAccountOwner(req, res, next) {
  //   const { type, userId } = req.data;
  //   let { accountNumber } = req.query;

  //   if (!req.query.accountNumber) {
  //    accountNumber = UserHelper.findUserById(userId).accountNumber;
  //   }

  //   if (type !== 'admin') {
  //     if (parseInt(userId, 10) !== parseInt(req.query.userId, 10)) {
  //       const userFound = UserHelper.findUserByAccountNumber(accountNumber);
  //       if (parseInt(userId, 10) !== parseInt(userFound.userId, 10)) {
  //         return res.status(403).json({
  //           status: 403,
  //           success: 'false',
  //           error: 'Unauthorized',
  //         });
  //       }
  //     }
  //   }
  //   next();
  // }
}
