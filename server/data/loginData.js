const database = require('../infra/database');

exports.getUser = async function (login) {
    const user = await database.oneOrNone('SELECT public.user.id, public.user.name, password, company_id FROM public.user inner join company on public.user.company_id = company.id WHERE email = $1 ',[login])
    return user
}
