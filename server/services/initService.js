const initData = require('../data/initData');
const { ResponseDTO } = require('../dtos/response');

exports.get = async function() {
    const message = {
        API_Status: "Ok",
        Database_Status: "Not"
    }
    try{
        const user = await initData.get('admin@admin.com');

        if(user?.email == 'admin@admin.com'){
            message.Database_Status = "Ok"
        }
        return new ResponseDTO('Success', 200, '', message)
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database',message);
    }
}

exports.start = async function() {
    try{
        const user = await initData.get('admin@admin.com');
        if(!user){
             await initData.start()
        }
        return new ResponseDTO('Success', 200, '')
    }
    catch(err){
        return new ResponseDTO('Error', 500, '❌Error accessing database',err.stack);
    }
}