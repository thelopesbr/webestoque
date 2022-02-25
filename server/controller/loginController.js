// criar um error
exports.get = async function (req, res, next) {
  try{
    return res.render('login', {login: true});
  }
  catch{
    return res.redirect('/error')
  }
}