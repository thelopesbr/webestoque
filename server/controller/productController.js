const productService = require('../services/productService');


exports.get = async function (req, res, next) {
    try{
        const company_id = req.user.company_id
        const token = req.token

        return res.render('product_cadastrar', {company_id: company_id, token: token});
    }catch{
        return  res.render('error'); 
    }
};

exports.getById = async function (req, res, next) {
    try{
        const _id = req.params.id;
        const product = await productService.getById(_id);
        
        if (product.type === 'Success'){
            const {id, name, status, qtd, qtd_min, qtd_max, company_id} = product.data;
        
            return res.render('product_cadastrar', {
                id: id,
                name: name,
                status: status, 
                qtd: qtd,
                qtd_min: qtd_min, 
                qtd_max: qtd_max, 
                company_id: company_id,
                token: req.token,
                put: true,
        });
        } else{
            req.flash('token', 1);
            req.flash('message', 'Product does not exist');
            return res.redirect('/');
        }
       
    }catch{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/')
    }
};


exports.post = async function (req, res, next) {

    const product = {
        name: req.body?.name,
        qtd: parseInt(req.body.qtd) || 1,
        qtd_min: parseInt(req.body?.qtd_min),
        qtd_max: parseInt(req.body?.qtd_max),
        company_id: parseInt(req.body?.company_id)
    };
    
    const response = await productService.post(product);

    if (response.type === 'Success'){
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    }
};

exports.put = async function (req, res, next) {
    const id = req.params.id;
    const product = {
        name: req.body?.name,
        qtd: parseInt(req.body.qtd) || 1,
        qtd_min: parseInt(req.body?.qtd_min),
        qtd_max: parseInt(req.body?.qtd_max),
        company_id: parseInt(req.body?.company_id)
    };

    const response = await productService.put(id,product);

    if (response.type === 'Success'){
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    }
};

exports.delete = async function (req, res, next) {

    const response = await productService.delete(req.params.id);
    
    
    if (response.type === 'Success'){
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message);
        return res.redirect('/');
    }

};


exports.lower = async function (req, res, next) {
    const id = req.params.id;

    const response = await productService.lower(id);
    
    if (response.type === 'Success'){
        req.flash('token', req.token);
        return res.redirect('/');
    } else{
        req.flash('token', req.token);
        req.flash('message', response.message)
        return res.redirect('/');
    }
};

exports.add = async function (req, res, next) {
    const id = req.params.id;

    const response = await productService.add(id);

    if (response.type === 'Success'){
        req.flash('token', req.token);
        return res.redirect('/');
    } else{
       req.flash('token', req.token);
       req.flash('message', response.message)
       return res.redirect('/');
    }
};

