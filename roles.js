const AccessControl = require("accesscontrol");
const ac = new AccessControl();

module.exports = (function() {

ac.grant("basic")
  .readOwn("profile")
  .updateAny("profile")
  .readOwn("mood")

ac.grant("admin")
 .readAny("user")
 .readAny("mood")
 .createAny("reason")
 
return ac;
})();