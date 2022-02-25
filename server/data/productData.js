const database = require('../infra/database');

exports.verifyCompany = async function (id){
    return await database.oneOrNone('SELECT * FROM COMPANY WHERE id = $1', id);
}

exports.post = async function (name,status,qtd,qtd_min,qtd_max,company_id) {
    return await database.one('INSERT INTO public.product (name,status,qtd,qtd_min,qtd_max,company_id) VALUES ($1, $2, $3, $4,$5, $6) returning  id ;', [name,status,qtd,qtd_min,qtd_max,company_id]);
}

exports.put = async function (id,name,status,qtd,qtd_min,qtd_max,company_id) {
    return await database.none('UPDATE public.product SET name=$2,status=$3,qtd=$4,qtd_min=$5,qtd_max=$6,company_id=$7 WHERE id=$1', [id,name,status,qtd,qtd_min,qtd_max,company_id]);
}

exports.getById = async function (id) {
    return await database.one('SELECT * FROM PRODUCT WHERE id = $1;',id)
}

exports.delete = async function (id) {
    return await database.none('DELETE FROM public.product WHERE id=$1;', [id]);
}

/*
exports.getByCnpj = async function (cnpj){
    const  company = await database.any('SELECT id, cnpj FROM COMPANY WHERE cnpj = $1', cnpj);
    return company
}

exports.get = async function () {
    const companies = await database.any('SELECT id, name, cnpj, url FROM COMPANY WHERE id > 1;');
    return companies
}

exports.getById = async function (id) {
    const company = await database.any('SELECT id, name, cnpj, url FROM COMPANY WHERE id = $1;', id);
    return company
}



exports.put = async function (id, name, cnpj, key, url) {
    const editCompany = await database.none('UPDATE public.company SET name=$2, cnpj=$3, key=$4, url=$5 WHERE id = $1;', [id, name,cnpj,key,url]);
    return editCompany
}



exports.getFiles = async function (company_id){
    const [links, sublinks] = await database.multi('SELECT rpage_key FROM public.link WHERE simple = true AND company_id = $1; SELECT rpage_key FROM public.sublink WHERE company_id =$1',company_id);
    const data = links.concat(sublinks);
    const response = []
    data.forEach(item => {
        const file = {
            Key: 'rpages/'+ item.rpage_key
        }
        response.push(file)
    } )
    return response
}


*/