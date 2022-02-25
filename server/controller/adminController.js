const adminService = require('../services/adminService');
const { ResponseDTO } = require('../dtos/response');

exports.get = async function (req, res, next) {

    const token = req.token
    const user = req.user
    const message = req.flash('message');
   
    const response = await adminService.get();

    const company = response.data

    company.forEach(e => {
        e.token = token
    });

    if (response.type === 'Success'){
        return  res.render('admin', {company: company, user_id: user.id,message: message, token: token})
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/admin');
    }
};

exports.put = async function (req, res, next) {
    const id = req.params.id;

    const company = {
        name: req.body?.name,
        cnpj: req.body?.cnpj
    };
    
    const response = await adminService.put(id,company);

    if (response.type === 'Success'){
        req.flash('token', req.token)
        return res.redirect('/admin');
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/admin');
    }
};


exports.getById = async function (req, res, next) {
    try{
        const _id = req.params.id;
        
        const response = await adminService.getById(_id);

        if (response.type === 'Success'){
            const {id, name,cnpj} = response.data;
            return res.render('company_cadastrar', {
                id: id,
                name: name,
                cnpj: cnpj,
                put: true,
                token: req.token
        });
        } else{
            req.flash('token', req.token);
            req.flash('message', 'Company does not exist');
            return res.redirect('/admin');
        }
       
    }catch(err){
        const response = new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/admin');
    }
};

exports.getCompany = async function (req, res, next) {
   
    const token = req.token
    const message = req.flash('message');
    try{
        return res.render('company_cadastrar', {token: token});
        
    }catch{
        new ResponseDTO('Error', 500, 'Error accessing database',err.stack);
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/admin');
    }
}


exports.post = async function (req, res, next) {

    const company = {
        name: req.body?.name,
        cnpj: req.body?.cnpj
    };
    
    const response = await adminService.post(company);

    if (response.type === 'Success'){
        req.flash('token', req.token)
        return res.redirect('/admin');
    } else{
        req.flash('token', req.token)
        req.flash('message', response.message)
        return res.redirect('/admin');

    }
};


exports.delete = async function (req, res, next) {

    const response = await adminService.delete(req.params.id);
    const logout = req.query.logout
    
    if (response.type === 'Success'){
        if(logout){
            res.redirect('/login')
        }
        else{
            req.flash('token', req.token)
            return res.redirect('/admin');
        }
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/admin');
 
    }

};

