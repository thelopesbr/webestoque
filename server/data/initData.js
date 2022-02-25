const database = require('../infra/database');
const bcrypt = require('bcryptjs');

exports.get = async function(email){
    const user = await database.oneOrNone('SELECT public.user.id, public.user.name,email, password, company_id FROM public.user WHERE email = $1 ',email);
    return user
}

exports.start = async function(){
    const senha = await bcrypt.hash('@admin', 10);
    await database.none('INSERT INTO public.company (name, cnpj) VALUES ($1, $2);', ['Web Estoque', '11223344558']);
    await database.one('INSERT INTO public.user (name, password, email, delete, company_id) VALUES ($1, $2, $3, $4, $5) returning *;', ['Admin',senha,'admin@admin.com',false,1])
}