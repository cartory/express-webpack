import DataTypes, { Model } from 'sequelize'
import sequelize from '../../config/sequelize'

class Poi extends Model { }

Poi.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true,
    },
    poi_name: DataTypes.TEXT,
    poi_original_name: DataTypes.TEXT,
    poi_lon: DataTypes.DOUBLE,
    poi_lat: DataTypes.DOUBLE,
    poi_phone_number: DataTypes.STRING,
    poi_website: DataTypes.TEXT,
    poi_description: DataTypes.TEXT,
    poi_direction: DataTypes.TEXT

}, {
    sequelize
})

export default Poi