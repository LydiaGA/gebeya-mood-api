const jwt = require('jsonwebtoken');
const config = require('../config');
const UserDal = require('../dal/user');

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, config.JWT_KEY);

      UserDal.getOne({_id : decoded.userId}, function(err, user){
        if(err){
          next(err);
        }
        decoded.role = user.role;
        req.userData = decoded;
  
        next();
      });
      
    } catch (e){
      return res.status(401).json({
        message: 'Auth Failed'
      });
    }
};