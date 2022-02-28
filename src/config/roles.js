const allRoles = {
  user: [],
  admin: ['getUsers', 'createUsers', 'updateUsers', 'getUser', 'deleteUser'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
