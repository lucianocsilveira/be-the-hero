const connection = require('../database/connection');
const { create } = require('./OngController');
const { offset } = require('../database/connection');

module.exports = {
    async index (request, response){
        const { page = 1 } = request.query;
        /*
         *count retorna um array, count entre colchetes 
         *vai me dá a primeira posição do array
         */
        const [count] = await connection('incidents')
            .count()

        const incidents = await connection('incidents')
            .join('ongs','ongs.id','=','incidents. ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count',count['count(*)'])
        return response.json(incidents);
    },

    async create(request, response){
        //acessa corpo da requisição
        const { title, description, value } = request.body;

        //acessa cabeçalho da requisição
        const ong_id = request.headers.authorization;
        
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id,
        });

        //outra forma de inserir o registro e retornar o id inserido
        /* const result = await connection('incidents').insert({
            title,
            desciption,
            value,
            ong_id,
        })

        const id = result[0]; 
    }*/

    return  response.json({ id });
    },

    async delete(request,response) {
        //acessa parametros da requisição
        const { id } = request.params;
        //acessa cabeçalho da requisição
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
        // where id=id ==> campo id = valor da variável id
        .where('id',id)
        .select('ong_id')
        .first()

        if(incident.ong_id != ong_id){
            //troca o status do response para 401 - Não autorizado
            return response.status(401).json({ error: 'Operation not permited.' });
        }

        await connection('incidents').where('id',id).delete();

        return response.status(204).send();
    }
};