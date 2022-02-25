const productData = require('../data/productData');
const { ResponseDTO } = require('../dtos/response');

const yup = require('yup');

exports.productValidate = yup.object().shape({
    update: yup.boolean().required(),
    id: yup.number().integer().positive(),
    name: yup.string('Name must be string').when('update', {is: false, then: yup.string().required('A name  is required')}),
    qtd: yup.number().integer().when('update', {is: false, then: yup.number().integer().required('A name  is required')}),
    qtd_min: yup.number().integer().when('update', {is: false, then: yup.number().integer().required('A minimum quantity is required')}),
    qtd_max: yup.number().integer().when('update', {is: false, then: yup.number().integer().required('A maximum quantity is required')}),
    company_id: yup.number().integer().when('update', {is: false, then: yup.number().integer().required('A company ID  is required')})
})

exports.getById = async function(id) {
    try{

        const produtc = await productData.getById(id);
    
        if(produtc){
            return new ResponseDTO('Success', 200,'', produtc);
        }
        else{
            return new ResponseDTO('Error', 404, 'Product does not exist')
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.post = async function(product) {
    try{
        let status
        const {name, qtd, qtd_min, qtd_max, company_id}= product
        const valid = await exports.productValidate.validate({
            update: false,
            name: name,
            qtd: qtd,
            qtd_min: qtd_min,
            qtd_max: qtd_max,
            company_id: company_id
          }).catch(function (err) {return err});

        if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
            return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
        }
        else if(qtd_min > qtd_max){
            return new ResponseDTO('Error', 400, 'Invalid amounts')
        }
        const company = await productData.verifyCompany(product.company_id);

        if(company){
            if(qtd > qtd_min && qtd < qtd_max){
                status = '🟢'
            }
            else if(qtd == qtd_min || qtd == qtd_max){
                status = '🟡'
            }
            else if (qtd < qtd_min){
                status = '🔴'
            }
            else{
                status = '🔵'
            }
            const data = await productData.post(name,status,qtd,qtd_min,qtd_max,company_id);
            return new ResponseDTO('Success', 201, 'Successfully registered product.', data);
        }
        else{
            return new ResponseDTO('Error', 404, 'Company does not exist')
        }
        
        
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}
exports.put = async function(id,product) {
    try{
        const beforeProdutc = await productData.getById(id);
        if(beforeProdutc){
            let status
            const {name, qtd, qtd_min, qtd_max, company_id} = product

            const valid = await exports.productValidate.validate({
                update: false,
                name: name,
                qtd: qtd,
                qtd_min: qtd_min,
                qtd_max: qtd_max,
                company_id: company_id
            }).catch(function (err) {return err});

            if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
                return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
            }
            else if(qtd_min >= qtd_max){
                return new ResponseDTO('Error', 400, 'Invalid amounts')
            }
        
            if(qtd > qtd_min && qtd < qtd_max){
                    status = '🟢'
            }
            else if(qtd == qtd_min || qtd == qtd_max){
                    status = '🟡'
            }
            else if (qtd < qtd_min){
                    status = '🔴'
            }
            else{
                    status = '🔵'
            }
            const data = await productData.put(id,name,status,qtd,qtd_min,qtd_max,company_id);
            return new ResponseDTO('Success', 200, 'Successfully update product.', data);  
        }
        else{
            return new ResponseDTO('Error', 404, 'Product does not exist', data); 
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
        
        const product = await productData.getById(id);
        
        if(product){
          await productData.delete(id);
          return new ResponseDTO('Success', 200, 'Successfully deleted product.', product);
        }
        else{
            return new ResponseDTO('Error', 404, 'Error deleting product.', 'product does not exist');
        }
       
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}


exports.lower = async function (id) {
    try{
        const product = await productData.getById(id);

        if(product){
            let status
            const {name, qtd, qtd_min, qtd_max, company_id} = product
            
            const newQtd = qtd - 1

            const valid = await exports.productValidate.validate({
                update: false,
                name: name,
                qtd: newQtd,
                qtd_min: qtd_min,
                qtd_max: qtd_max,
                company_id: company_id
            }).catch(function (err) {return err});

            if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
                return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
            }
            else if(qtd_min >= qtd_max || qtd== 0){
                return new ResponseDTO('Error', 400, 'Invalid amounts')
            }
        
            if(newQtd > qtd_min && newQtd < qtd_max){
                    status = '🟢'
            }
            else if(newQtd == qtd_min || newQtd == qtd_max){
                    status = '🟡'
            }
            else if (newQtd < qtd_min){
                    status = '🔴'
            }
            else{
                    status = '🔵'
            }
            await productData.put(id,name,status,newQtd,qtd_min,qtd_max,company_id);
            return new ResponseDTO('Success', 200, 'Successfully update product.', product);  
        }
        else{
            return new ResponseDTO('Error', 404, 'Product does not exist', data); 
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

exports.add = async function (id) {
    try{
        const product = await productData.getById(id);

        if(product){
            let status
            const {name, qtd, qtd_min, qtd_max, company_id} = product
            
            const newQtd = qtd + 1

            const valid = await exports.productValidate.validate({
                update: false,
                name: name,
                qtd: newQtd,
                qtd_min: qtd_min,
                qtd_max: qtd_max,
                company_id: company_id
            }).catch(function (err) {return err});

            if (valid.name === 'ValidationError' || valid.name === 'TypeError') {
                return new ResponseDTO('Error', 400, 'The data entered is not valid', valid.errors)
            }
            else if(qtd_min >= qtd_max){
                return new ResponseDTO('Error', 400, 'Invalid amounts')
            }
        
            if(newQtd > qtd_min && newQtd < qtd_max){
                    status = '🟢'
            }
            else if(newQtd == qtd_min || newQtd == qtd_max){
                    status = '🟡'
            }
            else if (newQtd < qtd_min){
                    status = '🔴'
            }
            else{
                    status = '🔵'
            }
            await productData.put(id,name,status,newQtd,qtd_min,qtd_max,company_id);
            return new ResponseDTO('Success', 200, 'Successfully update product.', product);  
        }
        else{
            return new ResponseDTO('Error', 404, 'Product does not exist', data); 
        }
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}

