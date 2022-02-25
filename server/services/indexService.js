const indexData = require('../data/indexData');
const { ResponseDTO } = require('../dtos/response');

exports.get = async function(company_id) {
    try{
        const product = await indexData.get(company_id);
        return new ResponseDTO('Success', 200, '', product)
    }
    catch(err){
        return new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
    }
}
