

exports.get  = async function ( req, res, next ) {
    try{
        return res.render('contact', {login: true});
    }
    catch( err ){
        return res.render('error')
    }
}