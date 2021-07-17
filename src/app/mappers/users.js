exports.createUserMapper = ({ body }) => ({
  type: body.type,
  firstName: body.first_name,
  lastName: body.last_name,
  email: body.email.toLowerCase(),
  password: body.password
});
