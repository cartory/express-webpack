import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize'

class Ruta extends Model { }

Ruta.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    name: DataTypes.STRING,
    geom: DataTypes.GEOMETRY
}, {
    sequelize,
    tableName: "ruta",
    modelName: 'ruta',
    freezeTableName: true,
    timestamps: false,
})

export default Ruta;