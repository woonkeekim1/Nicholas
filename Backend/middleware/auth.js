const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	if(!req.headers.authorization){
		return res.status(404).json({
			error:{
				message: "Not Authorized"
			}
		})
	}else{
		const token = req.headers.authorization.split(" ")[1];
		if(!token ){
			return res.status(404).json({
				error:{
					message: "Not Authorized"
				}
			})
		}else{
			const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
			req.userInfo = decoded;
		}
	}
	next()
}