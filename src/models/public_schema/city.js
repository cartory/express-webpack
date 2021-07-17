import DataTypes,{  Model } from 'sequelize'
import sequelize from '../../config/sequelize'
import Country from './country'


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
    city_available:  DataTypes.BOOLEAN,
    city_geom: DataTypes.GEOMETRY
}, {
    sequelize,
    
})

export default City