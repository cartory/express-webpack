import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class City extends Model { }

City.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    city_name: DataTypes.TEXT,
    city_original_name: DataTypes.TEXT,
    city_available: DataTypes.BOOLEAN,
    city_geom: DataTypes.GEOMETRY
}, {
    sequelize,
})

export default City