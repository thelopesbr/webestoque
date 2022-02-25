
const adminData = require('../data/adminData');

const yup = require('yup');
const { ResponseDTO } = require('../dtos/response');


exports.companyValidate = yup.object().shape({
    update: yup.boolean().required(),
    id: yup.number().integer().positive(),
    name: yup.string('Name must be string').when('update', {is: false, then: yup.string().required('A name  is required')}),
    cnpj: yup.string('Cnpj must be string').length(14,'Cnpj must contain 14 digits').when('update', {is: false, then: yup.string().required('A cpnj is required')}),
});

exports.verifyByCnpj = async function (cnpj, id){
    const response =  await adminData.getByCnpj(cnpj);
    try {
        if (!id && response.length == 0) {
            return new ResponseDTO('Success', 200, 'Company not found');
        }
        else if(id && response.length == 1 &&  response[0].id == id) {
            return new ResponseDTO('Success', 200, 'Company  not found');
        }   
        else{
            return new ResponseDTO('Error', 409, 'Cnpj is in use');
        }
    }
    catch (err) {
        return new ResponseDTO('Error', 500, 'Error accessing database', err.stack)   
    }
}

exports.get = async function() {
    try{
        const company = await adminData.getCompanies();
        return new ResponseDTO('Success', 200, '', company)
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.getById = async function(id) {
    try{
        const company = await adminData.getCompany(id);   
        return new ResponseDTO('Success', 200, '', company)
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}



exports.getUser = async function() {
    try{
        const users = await adminData.getUser()
        return new ResponseDTO('Success', 200, '', users)
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.post = async function(company) {
    try{
        const valid = await exports.companyValidate.validate({
            update: false,
            name: company.name,
            cnpj: company.cnpj,
          }).catch(function (err) {return err});
       
        if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
            return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
        }

        const validation = await exports.verifyByCnpj(company.cnpj);
        
        if(validation.type == 'Success'){
            const data = await adminData.post(company.name,company.cnpj,company.key, company.url);
            return new ResponseDTO('Success', 201, 'Successfully registered company.', data);
        } else{
            return new ResponseDTO('Error', 409, 'CNPJ is in use') 
        }
        
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.put = async function(id, company) {
    try{
        if(!company.name && !company.cnpj){
            return new ResponseDTO('Error', 400, 'The data entered is not valid', 'You did not enter any data to be updated')
        }

        const validation = await adminData.getCompany(id);
       
        if(validation){
            const valid = await exports.companyValidate.validate({
                update: true,
                id: id,
                name: company.name,
                cnpj: company.cnpj,
              }).catch(function (err) {return err});
            
            if (valid.name === "ValidationError") {
                return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
            }

            if(valid.cnpj){
                const validationCnpj = await exports.verifyByCnpj(valid.cnpj, id);
                if(!validationCnpj){
                    return new ResponseDTO('Error', 409, 'CNPJ is in use');
                }
            }
            
            company.name = valid.name ? valid.name : validation.name 
            company.cnpj = valid.cnpj ? valid.cnpj : validation.cnpj 
            await adminData.put(id,company.name,company.cnpj);
            return new ResponseDTO('Success', 200, 'Company updated successfully.', await adminData.getCompany(id))
        }
        else{
            return new ResponseDTO('Error', 404, 'company does not exist');
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.delete = async function(id) {
    try{
        if(!id){
            return new ResponseDTO('Error', 400, 'Error deleting company.', 'Did not inform all the necessary data.')
        }
        
        const company = await adminData.getCompany(id);
        if(company){
          await adminData.delete(id);
          return new ResponseDTO('Success', 200, 'Successfully deleted company.');
        }
        else{
            return new ResponseDTO('Error', 404, 'Error deleting company.', 'company does not exist');
        }
       
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}