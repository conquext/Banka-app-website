class authorize {
	static authUser(req, res, next){
		if( !req.data.type.user ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
		next();
	}
	static authCashier(req, res, next){
		if( !req.data.type.cashier ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
		next();
	}
	static authAdmin(req, res, next){
		if( !req.data.type.admin ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
		next();
	}
	static authStaff(req, res, next){
		if( !req.data.type.cashier || !req.data.type.admin ){
			return res.status(403).json({
				success: 'false',
				error: 'Unathorized'
			});
		}
		next();
	}
}

authorize = new authorize();
export default authorize;