const database = require('../infra/database');

exports.get = async function (company_id) {
    return await database.query('SELECT * FROM public.product where company_id=$1 order by name asc', [company_id])
}