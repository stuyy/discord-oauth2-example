const permissions = require('./permissions');

module.exports.getPermissions = function(perm) {
  const permissionMap = new Map();
  for(const [ key, value ] of Object.entries(permissions)) {
    if((perm & value) == value)
      permissionMap.set(key, value);
  }
  return permissionMap;
}