import DataTypes, { Model } from 'sequelize'
import sequelize from '../config/sequelize'

class Usuario extends Model { }

Usuario.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    nombre: DataTypes.STRING,
    ocupacion: DataTypes.STRING,
    fechaNacimiento: DataTypes.DATE,
    correo: {
        unique: true,
        type: DataTypes.STRING,
    },
    contrasenia: DataTypes.STRING,
    token: DataTypes.TEXT,
}, {
    sequelize
})

export default Usuario