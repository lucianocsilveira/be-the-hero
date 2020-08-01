const { request, response } = require("express");
const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async index(request,response) {
        const ongs = await connection('ongs').select('*')
    
        return response.json(ongs);
    },

    async create(request,response) {
        //acessa o corpo da requisição POST
        const {name, email, whatsapp, city, uf} = request.body;
        //Cria id com 4 bits
        const id = crypto.randomBytes(4).toString('HEX');
        //insere dados da requisição na tabela ongs
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf,
        });
    
        return response.json({ id });
    }
};