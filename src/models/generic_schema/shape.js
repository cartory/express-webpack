import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Shape extends Model { }

Shape.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    shape_geom: DataTypes.GEOMETRY
}, {
    sequelize
})

export default Shape