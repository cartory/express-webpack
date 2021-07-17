import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/sequelize'

class Transporte extends Model { }

Transporte.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    nombre: DataTypes.STRING,
    codigo: DataTypes.STRING,
    info: DataTypes.JSON,
    icono: DataTypes.STRING,
    descripcion: DataTypes.TEXT
}, {
    sequelize,
    tableName: "transporte",
    modelName: "transporte",
    timestamps: false,
    freezeTableName: true,
})

export default Transporte