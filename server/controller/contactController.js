

exports.get  = async function ( req, res, next ) {
    try{
        return res.render('contact', {login: true});
    }
    catch( err ){
        req.flash('message', '❌It was not possible to send the email')
        return res.redirect('/login');
    }
}