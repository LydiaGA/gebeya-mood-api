const roles = require('../roles');
 
module.exports = function(action, resource) {
 return async (req, res, next) => {
  try {
      console.log(req.userData);
   const permission = roles.can(req.userData.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 