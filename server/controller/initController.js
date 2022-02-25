const initService = require('../services/initService');

exports.get  = async function ( req, res, next ) {

    const response = await initService.get();
    
    const alert = req.flash('alert')[0]

    if (response.type === 'Success'){
        return res.render('state', {message: response.data})
    } else{
        return  res.render('state', {message: response.data, alert: alert})
    }
}

exports.start  = async function ( req, res, next ) {

    const response = await initService.start();
    if (response.type === 'Success'){
        return res.redirect('/state')
    } else{
        req.flash('alert', 'Need to create the tables first, use "yarn migrate up" command in terminal.')
        return  res.redirect('/state')
    }
}