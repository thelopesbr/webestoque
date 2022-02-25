const userData = require('../data/userData');
const { ResponseDTO } = require('../dtos/response');

const bcrypt = require('bcryptjs');
const yup = require('yup');


exports.userValidate = yup.object().shape({
    update: yup.boolean().required(),
    name: yup.string().when('update', {is: false, then: yup.string().required('Name is required') }),
    password: yup.string().matches(/^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/, 'The password must be between 6 to 20 characters long and contain special characters.').when('update', {is: false, then: yup.string().required('Password is required')}),
    email: yup.string().email('Invalid email').when('update', {is: false, then: yup.string().required('E-mail is required') }),
    company_id: yup.number().integer().positive(),
    delete: yup.boolean('Invalid deleteUser field')
});

exports.getUserByEmail = async function(email, id) {
    const response = await userData.getUserByEmail(email)
    try {
        if (!id && response.length == 0) {
            return new ResponseDTO('Success', 200, '✔️User not found');
        }
        else if(id && response.length == 1 &&  response[0].id == id) {
            return new ResponseDTO('Success', 200, '✔️User not found');
        }   
        else{
            return new ResponseDTO('Error', 409, '❌Email are already in use');
        }
    }
    catch (err) {
        return new ResponseDTO('Error', 500, '❌Error accessing database', err.stack)   
    }
}


exports.getById = async function(id) {
    try{
        const user = await userData.getById(id);

        if(user){
            return new ResponseDTO('Success', 200,'', user);
        }
        else{
            return new ResponseDTO('Error', 404, '❌User does not exist')
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database',err.stack);
    }
}

exports.post = async function(user) {
    try{
       
        const { name, password, email,company_id, deleteUser = true} = user
       
        const valid = await exports.userValidate.validate({
            update: false,
            name: name, 
            password: password,
            email: email, 
            company_id: company_id,
            delete: deleteUser
          }).catch(function (err) {return err});
     
          if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
            return new ResponseDTO('Error', 400, '❌The data entered is not valid', valid.errors)
        }

        const validator = await exports.getUserByEmail(user.email);
        
        if (validator.type == "Error"){
            return validator;
        }
 
        user.deleteUser = valid.delete
        user.password = await bcrypt.hash(user.password, 10)
       
        const data = await userData.postUser(user);
        return new ResponseDTO('Success', 201, '✔️Successfully registered user.', data);
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database',err.stack);
    }
}

exports.put = async function(id, user) {
    try{
        const verifyUser = await userData.verifyUser(id);

        if(verifyUser){
            const { name, password, email, deleteUser = true} = user

            const valid = await exports.userValidate.validate({
                update: true,
                name: name, 
                password: password,
                email: email, 
                company_id: verifyUser.company_id,
                delete: deleteUser
              }).catch(function (err) {return err});

            if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
                return new ResponseDTO('Error', 400, '❌The data entered is not valid', valid.errors)
            }
            const validator = await exports.getUserByEmail(verifyUser.email, id);
            
            if (validator.type == "Error"){
                return validator;
            }
            
            user.name = valid.name ? valid.name : verifyUser.name 
            user.password = valid.password ? await bcrypt.hash(valid.password, 10): verifyUser.password
            user.email = valid.email ? valid.email : verifyUser.email 
           

            await userData.putUser(id,user.name, user.password, user.email);
            return new ResponseDTO('Success', 202, '✔️User updated successfully.', await userData.getById(id))
        }
        else{
            return new ResponseDTO('Error', 404, '❌Error updating user.', 'User does not exist');
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database.',err.stack);
    }

}

exports.delete = async function(id) {
    try{
        if(!id){
            return new ResponseDTO('Error', 400, '❌Error deleting user', 'Did not enter all necessary data.')
        }

        const user = await userData.verifyUser(id);
        
        if(user){
            if(!user.delete){
                return new ResponseDTO('Error', 400, '❌Error deleting user.', 'This user cannot be deleted.');
            }
            await userData.deleteUser(id);
            return new ResponseDTO('Success', 200, '✔️User deleted successfully.')
        }
        else{
            return new ResponseDTO('Error', 404, '❌Error deleting user.', 'User does not exist');
        }
       
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database.',err.stack);
    }
}


