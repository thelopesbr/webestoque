
exports.get = async function (req, res, next) {
  try{
    return res.render('login', {login: true});
  }
  catch(err){
        req.flash('token', req.token);
        req.flash('message', '❌',err)
        return res.redirect('/login');
  }
}