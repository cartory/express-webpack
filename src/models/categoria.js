import DataTypes, { Model } from 'sequelize'
import sequelize from '../config/sequelize'

class Categoria extends Model { }

Categoria.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },

    nombre: DataTypes.STRING,

    foto: DataTypes.STRING,
    public_id: DataTypes.STRING,

    estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize, defaultScope: {
        attributes: {
            include: [
                'createdAt',
                'updatedAt',
                'deletedAt',
            ],
        },
    }
})

export default Categoria