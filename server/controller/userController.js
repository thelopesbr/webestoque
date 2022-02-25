const userService = require('../services/userService');


exports.get = async function (req, res, next) {
    try{
        const token = req.token
        const company_id = req.query.company_id
        const admin = req.query.admin
        return res.render('user_cadastrar', {company_id: company_id, token: token, admin: admin});
       
    }catch{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    }
};

exports.getById = async function (req, res, next) {
    try{
        const admin = req.query.admin
        const _id = req.params.id;
        const response = await userService.getById(_id);
            
        if (response.type === 'Success'){
            const {id, name, email, password, company_id} = response.data;
            
            return res.render('user_cadastrar', {
                    id: id,
                    name: name,
                    email: email,
                    password: password,
                    company_id: company_id,
                    token: req.token,
                    put: true,
            });
        } else{
            if(admin){
                req.flash('token', req.token);
                req.flash('message', response.message)
                return res.redirect('/admin')
            }
            req.flash('token', req.token);
            req.flash('message', response.message)
            return res.redirect('/')
        }

    }catch(err){
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/') 
    }
};


exports.post = async function (req, res, next) {
    const admin = req.query.admin
    const user = {
        name: req.body?.name,
        email: req.body?.email,
        password: req.body?.password,
        company_id: req.body?.company_id,
        put: true,
    };
    const response = await userService.post(user);

    if (response.type === 'Success'){
        req.flash('message', response.message);
        req.flash('token',req.token)
        return res.redirect('/admin');
    } else{
        if(admin){
            req.flash('token', req.token);
            req.flash('message', response.message)
            return res.redirect('/admin')
        }
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/')
    }
};

exports.put = async function (req, res, next) {
    const admin = req.query.admin
    const id = req.params.id;
    const user = {
        name: req.body?.name,
        email: req.body?.email,
        password: req.body?.password,
        put: true,
    };
    const response = await userService.put(id,user);
   
    if (response.type === 'Success'){
        req.flash('message', response.message);
        req.flash('token',req.token)
        return res.redirect('/');
    } else{
        if(admin){
            req.flash('token', req.token);
            req.flash('message', response.message)
            return res.redirect('/admin')
        }
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/')
    }
};

exports.delete = async function (req, res, next) {
   
    const company_id = parseInt(req.query.company_id);
   
    if(company_id){
        const response = await userService.delete(req.params.id);

        if (response.type === 'Success'){
            req.flash('token', company_id);
            return res.redirect('/');
        } else{
            req.flash('token', company_id );
            req.flash('message', response.message);
            return res.redirect('/');
    
        }
    }
    else {
        res.redirect('/login');
    }

};
