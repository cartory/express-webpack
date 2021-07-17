import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize'

class TipoTransporte extends Model { }

TipoTransporte.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    nombre: DataTypes.STRING
}, {
    sequelize
})

export default TipoTransporte