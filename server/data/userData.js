const database = require('../infra/database');

exports.verifyUser = async function (id){
    return await database.oneOrNone('SELECT * FROM public.user WHERE id = $1', id)
}

exports.getUserByEmail = async function (email) {
    return await database.any('SELECT id FROM public.user WHERE email = $1',email)
}

exports.getUser = async function () {
    return await database.any('SELECT id, name,email, delete FROM public.user WHERE company_id = 1')
}

exports.getById = async function (id){
    return await database.oneOrNone('SELECT id, name,email, delete FROM public.user WHERE id = $1', id)
}

exports.postUser = async function (user) {
    const { name, password, email, company_id, deleteUser = false} = user
    return await database.one('INSERT INTO public.user (name, password, email,  company_id, delete) VALUES ($1, $2, $3, $4, $5) returning id, name, password, email,  company_id, delete', [name, password, email,  company_id, deleteUser])
}

exports.putUser = async function (id, name, password, email) {
    return await database.none('UPDATE public.user SET name=$1, password=$2,email=$3 WHERE id = $4;', [name, password, email, id])
}

exports.deleteUser = async function (id) {
    return await database.none('DELETE FROM public.user WHERE id=$1;', [id])
    
}