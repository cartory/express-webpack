import { Model, DataType, DataTypes } from 'sequelize'
import sequelize from '../config/sequelize'

class Consulta extends Model { }

Consulta.init({
    id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
    },
    fechaConsulta: DataTypes.DATE,
    latLng: DataTypes.STRING,
    isWeb: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, { sequelize })

export default Consulta