import UserHelper from '../helpers/userHelper';

export default class PermissionsMiddleware {
  static authUser(req, res, next) {
    if (!req.data.type === 'user') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authCashier(req, res, next) {
    if (!req.data.type === 'cashier') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authAdmin(req, res, next) {
    if (!req.data.type === 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authStaff(req, res, next) {
    if (!req.data.type === 'cashier' || !req.data.type === 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authAdminOrIsUser(req, res, next) {
    console.log(req.data, req.params);
    if (req.data.type !== 'admin') {
      const user = UserHelper.findUserById(req.data.id);
      if (user && (user.id !== parseInt(req.params.id, 32))) {
        return res.status(403).json({
          success: 'false',
          error: 'Unathorized',
        });
      }
    }
    next();
  }
}
