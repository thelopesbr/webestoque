const indexService = require('../services/indexService');
const loginService = require('../services/loginService');

exports.get  = async function ( req, res, next ) {
  const token = req.token
  const user = req.user

  if(!token || !user)res.redirect('/login');

  const message = req.flash('message');

  const response = await indexService.get(user.company_id);

  const  product  = response.data
  product.forEach(e => {
    e.token = token
  });

  const { id, company_id} = user

  if (response.type === 'Success') {
    return res.render('home', {product: product, company_id: company_id, user: id,  message: message, token: token })
  } else{
    return res.redirect('/error', response);
  }
}
exports.post = async function (req, res, next) {
    const { login, password } = req.body
  
    const acess = await loginService.post(login, password);
    
    if (acess.type === 'Success'){
      const { token, user} = acess.data;

      req.flash('token', token);
      
      if (user.company_id == 1) {
        res.redirect('/admin')
      }
      else{
        return res.redirect('/');
      }
    } else{
      return res.redirect('/login');
    }
}

