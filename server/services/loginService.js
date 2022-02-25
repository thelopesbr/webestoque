const loginData = require('../data/loginData');
const yup = require('yup');
const config = require('../../config/token');

const { ResponseDTO } = require('../dtos/response')
const { sign } = require('jsonwebtoken');
const { compare } = require('bcryptjs')


exports.loginValidate = yup.object().shape({
  email: yup.string(),
  login: yup.string().required().when('email', {
    is: (login) => login.includes('@'),
    then: yup.string().email('invalid email or number'),
    otherwise: yup.string().length(11, 'invalid email or number')
  }),
  password: yup.string().matches(/^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/, 'The password must be between 6 to 20 characters long and contain special characters.')

});

exports.post = async function(login,password) {
  try{
    const valid = await exports.loginValidate.validate({
      email: login,
      login: login,
      password:password
    }).catch(function (err) {return err});

    if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
      return new ResponseDTO('Error', 400, '❌The data entered is not valid', valid.errors)
  }
    const user = await loginData.getUser(login);
   
    if(!user){
      return new ResponseDTO('Error', 404, '❌User does not exist. check credentials.')
    }
    
    const passwordMatches = await compare(password, user.password)

    if(!passwordMatches){
      return new ResponseDTO('Error', 401, '❌Credentials are invalid.')
    }
    
    delete user.password
    
    const { id, company_id } = user;

    const token = sign(
      { id, company_id }, 
      config.secret, 
      { expiresIn: '1d' }
      );
    
    return new ResponseDTO('Success', 202, '✔️Login successfully', {user, token})
  } 

  catch(err){
    return new ResponseDTO('Error', 500, '❌Error accessing database.', err.stack)
  }
}
