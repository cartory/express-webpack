import DataTypes, { Model } from 'sequelize'
import sequelize from '../config/sequelize'

class Tarifa extends Model { }

Tarifa.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    tipo: DataTypes.STRING,
    horario: DataTypes.STRING,
    precio: DataTypes.FLOAT,
}, {
    sequelize
})

export default Tarifa