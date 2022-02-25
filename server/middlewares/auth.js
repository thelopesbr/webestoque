'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/token');
const { ResponseDTO } = require('../dtos/response');

exports.format = (req, res, next) => {
    const token = req.flash('token')[0] || req.query.token || req.body.token
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            const response = new ResponseDTO('Error',401,'❌Token invalid');
            return res.status(response.status).redirect('/login');
        } 
        
        req.token = token
        req.user = {
            "id": decoded.id,
            "company_id": decoded.company_id
        }
        return next()
    })
}

exports.start = (req, res , next) => {
    const token = req.query.token
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            const response = new ResponseDTO('Error',401,'❌Token invalid');
            req.flash('alert',response.message)
            return  res.status(response.status).redirect('/state')
        } 
        req.token = token
        req.auth = 'Authenticated as developer'
        return next()
    })
  
}



