const database = require('../infra/database');

exports.getUser = async function (company_id) {
    const allUser = await database.query('SELECT  id, name, number, email, user_type, delete  FROM public.user where company_id=$1 order by name asc', [company_id])
    return allUser
}

exports.getUserById = async function (id) {
    const user =  await database.oneOrNone('SELECT id, name, number, email, company_id, user_type FROM public.user where id=$1 order by id asc', [id])
    return user
}

exports.verify = async function (id) {
    const user =  await database.oneOrNone('SELECT * FROM public.user where id=$1 order by id asc', [id])
    return user
}

exports.getUserByEmailOrNumber = async function (email, number) {
    const user = await database.manyOrNone('SELECT id, name, number, email FROM public.user WHERE (email = $1 OR number = $2)',[email,number])
    return user
}

exports.getCompanyIdByUserId = async function (id) {
    const companyId = await database.oneOrNone('SELECT company_id FROM public.user where id=$1', [id])
    return companyId
}

exports.postUser = async function (user) {
    const { name, password, number, email, alt_email, user_type, company_id, deleteUser = true} = user
    return await database.one('INSERT INTO public.user (name, password, number, email, alt_email, user_type, company_id, delete) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;', [name, password, number, email, alt_email,user_type, company_id, deleteUser])
}

exports.putUser = async function (user, id) {
    const editedUser = await database.none('UPDATE public.user SET name=$1, password=$2, number=$3, email=$4, alt_email=$5, user_type=$6, company_id=$7 WHERE id = $8;', [user.name, user.password, user.number, user.email, user.alt_email, user.user_type, user.company_id, id])
    return editedUser
}

exports.deleteUser = async function (id) {
    const deletedUser = await database.none('DELETE FROM public.user WHERE id=$1;', [id])
    return deletedUser
}

exports.getCompanyById = async function (id) {
    const company = await database.oneOrNone('SELECT * FROM public.company where id=$1',[id])
    return company
}
exports.master = async function (){
    const  company = await database.oneOrNone('SELECT id, name, cnpj, url FROM COMPANY WHERE id = 1');
    return company
}
exports.getLinkAndSublink = async function (id) {
    return database.task(t => {
        return t.map('SELECT * FROM public.link where company_id=$1', [id], link => {
            return t.batch([
                t.any('SELECT * FROM public.sublink where link_id=$1', link.id),
            ])
                .then(data => {
                    link.sublink = data[0];
                    return link;
                });
        }).then(t.batch);
    });
}
