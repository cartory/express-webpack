import { Op } from 'sequelize'

import sequelize from '../config/sequelize'
import { Controller } from '../config/controller'
import { Consulta, ConsultaDestino, zonaUV } from '../config/relationships'

class ConsultaController extends Controller {
    constructor() {
        super(Consulta)
    }

    all = async ({ query }, res) => {
        try {
            return res.status(200).json(await Consulta.findAll({
                limit: 10000,
                where: {
                    fechaConsulta: {
                        [Op.between]: [
                            Number.parseInt(query.init),
                            Number.parseInt(query.end),
                        ],
                    }
                }
            }))
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })
        }
    }
}

class ConsultaDestinoController extends Controller {
    constructor() {
        super(ConsultaDestino)
    }

    all = async ({ query }, res) => {
        let { limit = 10000 } = query

        try {
            let consulta = await ConsultaDestino.findAll({
                limit,
                where: {
                    fechaConsulta: {
                        [Op.between]: [
                            Number.parseInt(query.init),
                            Number.parseInt(query.end),
                        ]
                    }
                }
            })

            return res.status(200).json(consulta)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error })
        }
    }

    byZone = async ({ query }, res) => {
        let { init, end, origenId, destinoId } = query
        try {
            let query = await ConsultaDestino.count({
                where: {
                    fechaConsulta: {
                        [Op.between]: [
                            Number.parseInt(init),
                            Number.parseInt(end),
                        ],
                        [Op.and]: [
                            { origenId },
                            { destinoId },
                        ],
                    }
                }
            })

            return res.status(200).json(query)
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error })
        }
    }

    store = async ({ body }, res) => {
        try {
            let [source, __] = await sequelize.query(zonaUV.ST_Contains(JSON.parse(body.origen)))
            let [destiny, _] = await sequelize.query(zonaUV.ST_Contains(JSON.parse(body.destino)))

            if (source.length < 1 || destiny.length < 1) throw Error('Has not zone UV')

            let consulta = await ConsultaDestino.create({
                fechaConsulta: body.fechaConsulta,
                origen: JSON.stringify(body.origen),
                destino: JSON.stringify(body.destino),
                origenId: Number.parseInt(source[0]['id']),
                destinoId: Number.parseInt(destiny[0]['id']),
            })

            return res.status(200).json(consulta)
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                status: 500,
                message: 'Ups, Something Goes Wrong!!',
            })
        }
    }
}

export default {
    consulta: new ConsultaController(),
    consultaDestino: new ConsultaDestinoController(),
}
