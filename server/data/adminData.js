const database = require('../infra/database');


exports.verifyUser = async function (id){
    return await database.oneOrNone('SELECT * FROM public.user WHERE id = $1', id)
}

exports.getCompany = async function (id){
    return await database.oneOrNone('SELECT id, name, cnpj FROM COMPANY WHERE id = $1',id);
}

exports.getByCnpj = async function (cnpj){
    return await database.any('SELECT id, cnpj FROM COMPANY WHERE cnpj = $1', cnpj);
}

exports.getCompanies = async function (){
    return await database.any('SELECT id, name, cnpj FROM COMPANY WHERE id > 1');
}

exports.getUser = async function (id) {
    return await database.oneOrNone('SELECT id, name,email, delete FROM public.user WHERE id = $1', id)
}

exports.post = async function (name, cnpj) {
    return await database.one('INSERT INTO public.company (name, cnpj) VALUES ($1, $2) returning  id, name, cnpj ;', [name, cnpj]);
}

exports.put = async function (id, name, cnpj) {
    return await database.none('UPDATE public.company SET name=$2, cnpj=$3 WHERE id = $1;', [id, name,cnpj]);
}

exports.delete = async function (id) {
    return await database.none('DELETE FROM public.company WHERE id=$1;', [id]);
}



