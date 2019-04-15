import UserHelper from '../helpers/userHelper';

export default class PermissionsMiddleware {
  static authUser(req, res, next) {
    if (req.data.type !== 'user') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authCashier(req, res, next) {
    if (req.data.type !== 'cashier') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authAdmin(req, res, next) {
    if (req.data.type !== 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authStaff(req, res, next) {
    if (req.data.type !== 'cashier' || req.data.type !== 'admin') {
      return res.status(403).json({
        success: 'false',
        error: 'Unathorized',
      });
    }
    next();
  }

  static authAdminOrItsUser(req, res, next) {
    console.log(req.data.id, req.params.id);
    const id = req.data.id === parseInt(req.params.id);
    if (req.data.type !== 'admin') {
      if (parseInt(req.data.id) !== parseInt(req.params.id)) {
        return res.status(403).json({
          success: 'false',
          error: 'Unathorized',
        });
      }
    }
    next();
  }
}
