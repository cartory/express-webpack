import sequelize from '../config/sequelize'
import { DataTypes, Model } from 'sequelize'

class ConsultaDestino extends Model { }

ConsultaDestino.init({
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
    },
    origen: DataTypes.STRING,
    destino: DataTypes.STRING,
    fechaConsulta: DataTypes.DATE,
}, { sequelize })

export default ConsultaDestino