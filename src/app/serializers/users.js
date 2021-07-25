exports.createUserSerializer = user => ({
  id: user.id,
  first_name: user.firstName,
  last_name: user.lastName,
  email: user.email,
  type: user.type,
  last_login: user.lastLogin,
});
